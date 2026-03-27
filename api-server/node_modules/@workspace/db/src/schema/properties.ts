import { mysqlTable, varchar, int, timestamp, mysqlEnum, decimal, boolean, json, text } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const propertiesTable = mysqlTable("properties", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  address: varchar("address", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["apartment", "villa", "studio", "land"]).notNull(),
  status: mysqlEnum("status", ["for_sale", "for_rent"]).notNull(),
  bedrooms: int("bedrooms"),
  bathrooms: int("bathrooms"),
  area: decimal("area", { precision: 10, scale: 2 }),
  images: json("images").$type<string[]>().notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  viewCount: int("view_count").notNull().default(0),
  isFeatured: boolean("is_featured").notNull().default(false),
  agentId: int("agent_id").notNull().references(() => usersTable.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertPropertySchema = createInsertSchema(propertiesTable).omit({ id: true, viewCount: true, createdAt: true, updatedAt: true });
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof propertiesTable.$inferSelect;
