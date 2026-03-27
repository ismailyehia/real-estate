import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { usersTable, propertiesTable, reviewsTable, favoritesTable } from "@workspace/db/schema";
import { eq, sql, desc, inArray } from "drizzle-orm";
import { requireAuth, requireRole, type AuthRequest } from "../middlewares/auth.js";
import { UpdateUserRoleBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/stats", requireAuth, requireRole("admin"), async (req: AuthRequest, res) => {
  try {
    const [{ totalProperties }] = await db.select({ totalProperties: sql<number>`count(*)::int` }).from(propertiesTable);
    const [{ totalUsers }] = await db.select({ totalUsers: sql<number>`count(*)::int` }).from(usersTable).where(eq(usersTable.role, "user"));
    const [{ totalAgents }] = await db.select({ totalAgents: sql<number>`count(*)::int` }).from(usersTable).where(eq(usersTable.role, "agent"));
    const [{ totalViews }] = await db.select({ totalViews: sql<number>`coalesce(sum(${propertiesTable.viewCount}), 0)::int` }).from(propertiesTable);
    const [{ forSale }] = await db.select({ forSale: sql<number>`count(*)::int` }).from(propertiesTable).where(eq(propertiesTable.status, "for_sale"));
    const [{ forRent }] = await db.select({ forRent: sql<number>`count(*)::int` }).from(propertiesTable).where(eq(propertiesTable.status, "for_rent"));

    const recentProps = await db.select().from(propertiesTable).orderBy(desc(propertiesTable.createdAt)).limit(5);

    const agentIds = [...new Set(recentProps.map(p => p.agentId))];
    const agents = agentIds.length > 0 ? await db.select().from(usersTable).where(inArray(usersTable.id, agentIds)) : [];
    const agentMap = Object.fromEntries(agents.map(a => [a.id, a]));

    const recentProperties = recentProps.map(p => {
      const agent = agentMap[p.agentId];
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
        agent: agent ? { id: agent.id, name: agent.name, email: agent.email, role: agent.role, phone: agent.phone, avatar: agent.avatar, createdAt: agent.createdAt } : null,
        averageRating: null,
        reviewCount: 0,
        isFavorited: false,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      };
    });

    res.json({ totalProperties, totalUsers, totalAgents, totalViews, forSale, forRent, recentProperties });
  } catch (err) {
    req.log.error({ err }, "Get admin stats failed");
    res.status(500).json({ error: "Internal error", message: "Failed to get stats" });
  }
});

router.get("/users", requireAuth, requireRole("admin"), async (req: AuthRequest, res) => {
  try {
    const users = await db.select().from(usersTable).orderBy(desc(usersTable.createdAt));
    res.json(users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      phone: u.phone,
      avatar: u.avatar,
      createdAt: u.createdAt,
    })));
  } catch (err) {
    req.log.error({ err }, "Get admin users failed");
    res.status(500).json({ error: "Internal error", message: "Failed to get users" });
  }
});

router.put("/users/:id", requireAuth, requireRole("admin"), async (req: AuthRequest, res) => {
  const parsed = UpdateUserRoleBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation error", message: parsed.error.message });
    return;
  }

  try {
    const id = parseInt(req.params.id);
    const [user] = await db.update(usersTable).set({ role: parsed.data.role as any }).where(eq(usersTable.id, id)).returning();
    if (!user) {
      res.status(404).json({ error: "Not found", message: "User not found" });
      return;
    }
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, avatar: user.avatar, createdAt: user.createdAt });
  } catch (err) {
    req.log.error({ err }, "Update user role failed");
    res.status(500).json({ error: "Internal error", message: "Failed to update user role" });
  }
});

router.delete("/users/:id", requireAuth, requireRole("admin"), async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(usersTable).where(eq(usersTable.id, id));
    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    req.log.error({ err }, "Delete user failed");
    res.status(500).json({ error: "Internal error", message: "Failed to delete user" });
  }
});

export default router;
