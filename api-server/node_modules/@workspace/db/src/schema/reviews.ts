import { mysqlTable, int, text, timestamp, unique } from "drizzle-orm/mysql-core";
import { usersTable } from "./users";
import { propertiesTable } from "./properties";

export const reviewsTable = mysqlTable("reviews", {
  id: int("id").primaryKey().autoincrement(),
  rating: int("rating").notNull(),
  comment: text("comment"),
  userId: int("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  propertyId: int("property_id").notNull().references(() => propertiesTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => [unique().on(t.userId, t.propertyId)]);

export type Review = typeof reviewsTable.$inferSelect;
