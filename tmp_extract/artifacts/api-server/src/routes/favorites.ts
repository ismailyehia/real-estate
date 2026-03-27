import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { favoritesTable, propertiesTable, usersTable, reviewsTable } from "@workspace/db/schema";
import { eq, and, inArray, sql } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/auth.js";

const router: IRouter = Router();

router.get("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const favs = await db.select().from(favoritesTable).where(eq(favoritesTable.userId, req.userId!));
    if (favs.length === 0) {
      res.json([]);
      return;
    }

    const propertyIds = favs.map(f => f.propertyId);
    const properties = await db.select().from(propertiesTable).where(inArray(propertiesTable.id, propertyIds));

    const agentIds = [...new Set(properties.map(p => p.agentId))];
    const agents = await db.select().from(usersTable).where(inArray(usersTable.id, agentIds));
    const agentMap = Object.fromEntries(agents.map(a => [a.id, a]));

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

    const result = properties.map(p => {
      const agent = agentMap[p.agentId];
      const rs = reviewMap[p.id];
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
        agent: { id: agent.id, name: agent.name, email: agent.email, role: agent.role, phone: agent.phone, avatar: agent.avatar, createdAt: agent.createdAt },
        averageRating: rs?.avgRating ?? null,
        reviewCount: rs?.count ?? 0,
        isFavorited: true,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      };
    });

    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Get favorites failed");
    res.status(500).json({ error: "Internal error", message: "Failed to get favorites" });
  }
});

router.post("/:propertyId", requireAuth, async (req: AuthRequest, res) => {
  try {
    const propertyId = parseInt(req.params.propertyId);
    const [existing] = await db.select().from(favoritesTable)
      .where(and(eq(favoritesTable.userId, req.userId!), eq(favoritesTable.propertyId, propertyId))).limit(1);

    if (!existing) {
      await db.insert(favoritesTable).values({ userId: req.userId!, propertyId });
    }
    res.status(201).json({ success: true, message: "Added to favorites" });
  } catch (err) {
    req.log.error({ err }, "Add favorite failed");
    res.status(500).json({ error: "Internal error", message: "Failed to add favorite" });
  }
});

router.delete("/:propertyId", requireAuth, async (req: AuthRequest, res) => {
  try {
    const propertyId = parseInt(req.params.propertyId);
    await db.delete(favoritesTable)
      .where(and(eq(favoritesTable.userId, req.userId!), eq(favoritesTable.propertyId, propertyId)));
    res.json({ success: true, message: "Removed from favorites" });
  } catch (err) {
    req.log.error({ err }, "Remove favorite failed");
    res.status(500).json({ error: "Internal error", message: "Failed to remove favorite" });
  }
});

export default router;
