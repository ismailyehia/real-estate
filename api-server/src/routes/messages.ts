import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { messagesTable, usersTable } from "@workspace/db/schema";
import { or, eq, inArray } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/auth.js";
import { SendMessageBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const messages = await db.select().from(messagesTable)
      .where(or(eq(messagesTable.senderId, req.userId!), eq(messagesTable.receiverId, req.userId!)));

    if (messages.length === 0) {
      res.json([]);
      return;
    }

    const userIds = [...new Set([...messages.map(m => m.senderId), ...messages.map(m => m.receiverId)])];
    const users = await db.select().from(usersTable).where(inArray(usersTable.id, userIds));
    const userMap = Object.fromEntries(users.map(u => [u.id, u]));

    const result = messages.map(m => ({
      id: m.id,
      content: m.content,
      senderId: m.senderId,
      receiverId: m.receiverId,
      propertyId: m.propertyId,
      sender: { id: userMap[m.senderId]?.id, name: userMap[m.senderId]?.name, email: userMap[m.senderId]?.email, role: userMap[m.senderId]?.role, phone: userMap[m.senderId]?.phone, avatar: userMap[m.senderId]?.avatar, createdAt: userMap[m.senderId]?.createdAt },
      receiver: { id: userMap[m.receiverId]?.id, name: userMap[m.receiverId]?.name, email: userMap[m.receiverId]?.email, role: userMap[m.receiverId]?.role, phone: userMap[m.receiverId]?.phone, avatar: userMap[m.receiverId]?.avatar, createdAt: userMap[m.receiverId]?.createdAt },
      isRead: m.isRead,
      createdAt: m.createdAt,
    }));

    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Get messages failed");
    res.status(500).json({ error: "Internal error", message: "Failed to get messages" });
  }
});

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  const parsed = SendMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation error", message: parsed.error.message });
    return;
  }

  try {
    const { content, receiverId, propertyId } = parsed.data;
    const [message] = await db.insert(messagesTable).values({
      content,
      senderId: req.userId!,
      receiverId,
      propertyId: propertyId ?? null,
    }).returning();

    const userIds = [message.senderId, message.receiverId];
    const users = await db.select().from(usersTable).where(inArray(usersTable.id, userIds));
    const userMap = Object.fromEntries(users.map(u => [u.id, u]));

    res.status(201).json({
      id: message.id,
      content: message.content,
      senderId: message.senderId,
      receiverId: message.receiverId,
      propertyId: message.propertyId,
      sender: { id: userMap[message.senderId]?.id, name: userMap[message.senderId]?.name, email: userMap[message.senderId]?.email, role: userMap[message.senderId]?.role, phone: userMap[message.senderId]?.phone, avatar: userMap[message.senderId]?.avatar, createdAt: userMap[message.senderId]?.createdAt },
      receiver: { id: userMap[message.receiverId]?.id, name: userMap[message.receiverId]?.name, email: userMap[message.receiverId]?.email, role: userMap[message.receiverId]?.role, phone: userMap[message.receiverId]?.phone, avatar: userMap[message.receiverId]?.avatar, createdAt: userMap[message.receiverId]?.createdAt },
      isRead: message.isRead,
      createdAt: message.createdAt,
    });
  } catch (err) {
    req.log.error({ err }, "Send message failed");
    res.status(500).json({ error: "Internal error", message: "Failed to send message" });
  }
});

export default router;
