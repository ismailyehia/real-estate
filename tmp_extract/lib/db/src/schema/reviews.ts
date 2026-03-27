import { pgTable, serial, integer, text, timestamp, unique } from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { propertiesTable } from "./properties";

export const reviewsTable = pgTable("reviews", {
  id: serial("id").primaryKey(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  propertyId: integer("property_id").notNull().references(() => propertiesTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => [unique().on(t.userId, t.propertyId)]);

export type Review = typeof reviewsTable.$inferSelect;
