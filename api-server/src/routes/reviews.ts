import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { reviewsTable, usersTable } from "@workspace/db/schema";
import { eq, inArray, desc } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/auth.js";
import { CreateReviewBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/:propertyId", async (req, res) => {
  try {
    const propertyId = parseInt(req.params.propertyId);
    const reviews = await db.select().from(reviewsTable)
      .where(eq(reviewsTable.propertyId, propertyId))
      .orderBy(desc(reviewsTable.createdAt));

    if (reviews.length === 0) {
      res.json([]);
      return;
    }

    const userIds = [...new Set(reviews.map(r => r.userId))];
    const users = await db.select().from(usersTable).where(inArray(usersTable.id, userIds));
    const userMap = Object.fromEntries(users.map(u => [u.id, u]));

    const result = reviews.map(r => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      userId: r.userId,
      propertyId: r.propertyId,
      user: {
        id: userMap[r.userId]?.id,
        name: userMap[r.userId]?.name,
        email: userMap[r.userId]?.email,
        role: userMap[r.userId]?.role,
        phone: userMap[r.userId]?.phone,
        avatar: userMap[r.userId]?.avatar,
        createdAt: userMap[r.userId]?.createdAt,
      },
      createdAt: r.createdAt,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Internal error", message: "Failed to get reviews" });
  }
});

router.post("/:propertyId", requireAuth, async (req: AuthRequest, res) => {
  const parsed = CreateReviewBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation error", message: parsed.error.message });
    return;
  }

  try {
    const propertyId = parseInt(req.params.propertyId);
    const { rating, comment } = parsed.data;

    const [review] = await db.insert(reviewsTable).values({
      rating,
      comment: comment ?? null,
      userId: req.userId!,
      propertyId,
    }).returning();

    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);

    res.status(201).json({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      userId: review.userId,
      propertyId: review.propertyId,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
      createdAt: review.createdAt,
    });
  } catch (err) {
    req.log.error({ err }, "Create review failed");
    res.status(500).json({ error: "Internal error", message: "Failed to create review" });
  }
});

export default router;
