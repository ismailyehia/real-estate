import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { propertiesTable, usersTable, favoritesTable, reviewsTable } from "@workspace/db/schema";
import { eq, and, gte, lte, ilike, or, desc, asc, sql, inArray } from "drizzle-orm";
import { requireAuth, requireRole, optionalAuth, type AuthRequest } from "../middlewares/auth.js";
import { CreatePropertyBody } from "@workspace/api-zod";

const router: IRouter = Router();

function formatProperty(p: any, agent: any, avgRating: number | null, reviewCount: number, isFavorited: boolean) {
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    price: parseFloat(p.price),
    city: p.city,
    address: p.address,
    type: p.type,
    status: p.status,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    area: p.area ? parseFloat(p.area) : null,
    images: Array.isArray(p.images) ? p.images : [],
    latitude: p.latitude ? parseFloat(p.latitude) : null,
    longitude: p.longitude ? parseFloat(p.longitude) : null,
    viewCount: p.viewCount,
    isFeatured: p.isFeatured,
    agentId: p.agentId,
    agent: {
      id: agent.id,
      name: agent.name,
      email: agent.email,
      role: agent.role,
      phone: agent.phone,
      avatar: agent.avatar,
      createdAt: agent.createdAt,
    },
    averageRating: avgRating,
    reviewCount,
    isFavorited,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

router.get("/", optionalAuth, async (req: AuthRequest, res) => {
  try {
    const {
      search,
      city,
      type,
      status,
      minPrice,
      maxPrice,
      minBedrooms,
      sortBy,
      page = "1",
      limit = "12",
    } = req.query as Record<string, string>;

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 12));
    const offset = (pageNum - 1) * limitNum;

    const conditions = [];

    if (search) {
      conditions.push(
        or(
          ilike(propertiesTable.title, `%${search}%`),
          ilike(propertiesTable.description, `%${search}%`),
          ilike(propertiesTable.city, `%${search}%`),
          ilike(propertiesTable.address, `%${search}%`)
        )
      );
    }

    if (city) conditions.push(ilike(propertiesTable.city, `%${city}%`));
    if (type) conditions.push(eq(propertiesTable.type, type as any));
    if (status) conditions.push(eq(propertiesTable.status, status as any));
    if (minPrice) conditions.push(gte(propertiesTable.price, minPrice));
    if (maxPrice) conditions.push(lte(propertiesTable.price, maxPrice));
    if (minBedrooms) conditions.push(gte(propertiesTable.bedrooms, parseInt(minBedrooms)));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    let orderBy;
    switch (sortBy) {
      case "price_asc": orderBy = asc(propertiesTable.price); break;
      case "price_desc": orderBy = desc(propertiesTable.price); break;
      case "oldest": orderBy = asc(propertiesTable.createdAt); break;
      default: orderBy = desc(propertiesTable.createdAt);
    }

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(propertiesTable)
      .where(whereClause);

    const rows = await db
      .select()
      .from(propertiesTable)
      .where(whereClause)
      .orderBy(orderBy)
      .limit(limitNum)
      .offset(offset);

    if (rows.length === 0) {
      res.json({ properties: [], total: count, page: pageNum, limit: limitNum, totalPages: Math.ceil(count / limitNum) });
      return;
    }

    const agentIds = [...new Set(rows.map(r => r.agentId))];
    const agents = await db.select().from(usersTable).where(inArray(usersTable.id, agentIds));
    const agentMap = Object.fromEntries(agents.map(a => [a.id, a]));

    const propertyIds = rows.map(r => r.id);

    const reviewStats = await db
      .select({
        propertyId: reviewsTable.propertyId,
        avgRating: sql<number>`avg(${reviewsTable.rating})::float`,
        count: sql<number>`count(*)::int`,
      })
      .from(reviewsTable)
      .where(inArray(reviewsTable.propertyId, propertyIds))
      .groupBy(reviewsTable.propertyId);

    const reviewMap = Object.fromEntries(reviewStats.map(r => [r.propertyId, r]));

    let favoritedIds = new Set<number>();
    if (req.userId) {
      const favs = await db
        .select({ propertyId: favoritesTable.propertyId })
        .from(favoritesTable)
        .where(and(eq(favoritesTable.userId, req.userId), inArray(favoritesTable.propertyId, propertyIds)));
      favoritedIds = new Set(favs.map(f => f.propertyId));
    }

    const properties = rows.map(p => {
      const agent = agentMap[p.agentId];
      const rs = reviewMap[p.id];
      return formatProperty(p, agent, rs?.avgRating ?? null, rs?.count ?? 0, favoritedIds.has(p.id));
    });

    res.json({ properties, total: count, page: pageNum, limit: limitNum, totalPages: Math.ceil(count / limitNum) });
  } catch (err) {
    req.log.error({ err }, "List properties failed");
    res.status(500).json({ error: "Internal error", message: "Failed to list properties" });
  }
});

router.get("/featured", optionalAuth, async (req: AuthRequest, res) => {
  try {
    const rows = await db
      .select()
      .from(propertiesTable)
      .where(eq(propertiesTable.isFeatured, true))
      .orderBy(desc(propertiesTable.createdAt))
      .limit(6);

    if (rows.length === 0) {
      const fallback = await db.select().from(propertiesTable).orderBy(desc(propertiesTable.createdAt)).limit(6);
      rows.push(...fallback);
    }

    const agentIds = [...new Set(rows.map(r => r.agentId))];
    const agents = await db.select().from(usersTable).where(inArray(usersTable.id, agentIds));
    const agentMap = Object.fromEntries(agents.map(a => [a.id, a]));

    const propertyIds = rows.map(r => r.id);
    const reviewStats = await db
      .select({
        propertyId: reviewsTable.propertyId,
        avgRating: sql<number>`avg(${reviewsTable.rating})::float`,
        count: sql<number>`count(*)::int`,
      })
      .from(reviewsTable)
      .where(inArray(reviewsTable.propertyId, propertyIds))
      .groupBy(reviewsTable.propertyId);
    const reviewMap = Object.fromEntries(reviewStats.map(r => [r.propertyId, r]));

    let favoritedIds = new Set<number>();
    if (req.userId) {
      const favs = await db
        .select({ propertyId: favoritesTable.propertyId })
        .from(favoritesTable)
        .where(and(eq(favoritesTable.userId, req.userId), inArray(favoritesTable.propertyId, propertyIds)));
      favoritedIds = new Set(favs.map(f => f.propertyId));
    }

    const properties = rows.map(p => {
      const agent = agentMap[p.agentId];
      const rs = reviewMap[p.id];
      return formatProperty(p, agent, rs?.avgRating ?? null, rs?.count ?? 0, favoritedIds.has(p.id));
    });

    res.json(properties);
  } catch (err) {
    req.log.error({ err }, "Get featured failed");
    res.status(500).json({ error: "Internal error", message: "Failed to get featured properties" });
  }
});

router.get("/:id", optionalAuth, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const [property] = await db.select().from(propertiesTable).where(eq(propertiesTable.id, id)).limit(1);
    if (!property) {
      res.status(404).json({ error: "Not found", message: "Property not found" });
      return;
    }

    await db.update(propertiesTable).set({ viewCount: sql`${propertiesTable.viewCount} + 1` }).where(eq(propertiesTable.id, id));

    const [agent] = await db.select().from(usersTable).where(eq(usersTable.id, property.agentId)).limit(1);

    const reviews = await db
      .select()
      .from(reviewsTable)
      .where(eq(reviewsTable.propertyId, id))
      .orderBy(desc(reviewsTable.createdAt));

    const reviewUserIds = [...new Set(reviews.map(r => r.userId))];
    let reviewUsers: any[] = [];
    if (reviewUserIds.length > 0) {
      reviewUsers = await db.select().from(usersTable).where(inArray(usersTable.id, reviewUserIds));
    }
    const reviewUserMap = Object.fromEntries(reviewUsers.map(u => [u.id, u]));

    const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : null;

    let isFavorited = false;
    if (req.userId) {
      const [fav] = await db.select().from(favoritesTable)
        .where(and(eq(favoritesTable.userId, req.userId), eq(favoritesTable.propertyId, id))).limit(1);
      isFavorited = !!fav;
    }

    const formattedReviews = reviews.map(r => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      userId: r.userId,
      propertyId: r.propertyId,
      user: {
        id: reviewUserMap[r.userId]?.id,
        name: reviewUserMap[r.userId]?.name,
        email: reviewUserMap[r.userId]?.email,
        role: reviewUserMap[r.userId]?.role,
        phone: reviewUserMap[r.userId]?.phone,
        avatar: reviewUserMap[r.userId]?.avatar,
        createdAt: reviewUserMap[r.userId]?.createdAt,
      },
      createdAt: r.createdAt,
    }));

    res.json({
      ...formatProperty(property, agent, avgRating, reviews.length, isFavorited),
      reviews: formattedReviews,
    });
  } catch (err) {
    req.log.error({ err }, "Get property failed");
    res.status(500).json({ error: "Internal error", message: "Failed to get property" });
  }
});

router.post("/", requireAuth, requireRole("agent", "admin"), async (req: AuthRequest, res) => {
  const parsed = CreatePropertyBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation error", message: parsed.error.message });
    return;
  }

  try {
    const data = parsed.data;
    const [property] = await db.insert(propertiesTable).values({
      title: data.title,
      description: data.description,
      price: data.price.toString(),
      city: data.city,
      address: data.address,
      type: data.type as any,
      status: data.status as any,
      bedrooms: data.bedrooms ?? null,
      bathrooms: data.bathrooms ?? null,
      area: data.area ? data.area.toString() : null,
      images: data.images ?? [],
      latitude: data.latitude ? data.latitude.toString() : null,
      longitude: data.longitude ? data.longitude.toString() : null,
      isFeatured: data.isFeatured ?? false,
      agentId: req.userId!,
    }).returning();

    const [agent] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
    res.status(201).json(formatProperty(property, agent, null, 0, false));
  } catch (err) {
    req.log.error({ err }, "Create property failed");
    res.status(500).json({ error: "Internal error", message: "Failed to create property" });
  }
});

router.put("/:id", requireAuth, async (req: AuthRequest, res) => {
  const parsed = CreatePropertyBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation error", message: parsed.error.message });
    return;
  }

  try {
    const id = parseInt(req.params.id);
    const [existing] = await db.select().from(propertiesTable).where(eq(propertiesTable.id, id)).limit(1);
    if (!existing) {
      res.status(404).json({ error: "Not found", message: "Property not found" });
      return;
    }

    if (req.userRole !== "admin" && existing.agentId !== req.userId) {
      res.status(403).json({ error: "Forbidden", message: "You can only edit your own properties" });
      return;
    }

    const data = parsed.data;
    const [property] = await db.update(propertiesTable).set({
      title: data.title,
      description: data.description,
      price: data.price.toString(),
      city: data.city,
      address: data.address,
      type: data.type as any,
      status: data.status as any,
      bedrooms: data.bedrooms ?? null,
      bathrooms: data.bathrooms ?? null,
      area: data.area ? data.area.toString() : null,
      images: data.images ?? [],
      latitude: data.latitude ? data.latitude.toString() : null,
      longitude: data.longitude ? data.longitude.toString() : null,
      isFeatured: data.isFeatured ?? false,
      updatedAt: new Date(),
    }).where(eq(propertiesTable.id, id)).returning();

    const [agent] = await db.select().from(usersTable).where(eq(usersTable.id, property.agentId)).limit(1);
    res.json(formatProperty(property, agent, null, 0, false));
  } catch (err) {
    req.log.error({ err }, "Update property failed");
    res.status(500).json({ error: "Internal error", message: "Failed to update property" });
  }
});

router.delete("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const [existing] = await db.select().from(propertiesTable).where(eq(propertiesTable.id, id)).limit(1);
    if (!existing) {
      res.status(404).json({ error: "Not found", message: "Property not found" });
      return;
    }

    if (req.userRole !== "admin" && existing.agentId !== req.userId) {
      res.status(403).json({ error: "Forbidden", message: "You can only delete your own properties" });
      return;
    }

    await db.delete(propertiesTable).where(eq(propertiesTable.id, id));
    res.json({ success: true, message: "Property deleted successfully" });
  } catch (err) {
    req.log.error({ err }, "Delete property failed");
    res.status(500).json({ error: "Internal error", message: "Failed to delete property" });
  }
});

router.get("/:id/similar", optionalAuth, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const [property] = await db.select().from(propertiesTable).where(eq(propertiesTable.id, id)).limit(1);
    if (!property) {
      res.json([]);
      return;
    }

    const similar = await db.select().from(propertiesTable)
      .where(and(
        eq(propertiesTable.type, property.type),
        sql`${propertiesTable.id} != ${id}`
      ))
      .orderBy(desc(propertiesTable.createdAt))
      .limit(4);

    const agentIds = [...new Set(similar.map(r => r.agentId))];
    const agents = agentIds.length > 0 ? await db.select().from(usersTable).where(inArray(usersTable.id, agentIds)) : [];
    const agentMap = Object.fromEntries(agents.map(a => [a.id, a]));

    const properties = similar.map(p => formatProperty(p, agentMap[p.agentId], null, 0, false));
    res.json(properties);
  } catch (err) {
    req.log.error({ err }, "Get similar failed");
    res.status(500).json({ error: "Internal error", message: "Failed to get similar properties" });
  }
});

export default router;
