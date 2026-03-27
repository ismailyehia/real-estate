import { mysqlTable, int, text, timestamp, boolean } from "drizzle-orm/mysql-core";
import { usersTable } from "./users";
import { propertiesTable } from "./properties";

export const messagesTable = mysqlTable("messages", {
  id: int("id").primaryKey().autoincrement(),
  content: text("content").notNull(),
  senderId: int("sender_id").notNull().references(() => usersTable.id),
  receiverId: int("receiver_id").notNull().references(() => usersTable.id),
  propertyId: int("property_id").references(() => propertiesTable.id),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Message = typeof messagesTable.$inferSelect;
