import { pgTable, text, serial, timestamp, pgEnum, numeric, integer, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const propertyTypeEnum = pgEnum("property_type", ["apartment", "villa", "studio", "land"]);
export const propertyStatusEnum = pgEnum("property_status", ["for_sale", "for_rent"]);

export const propertiesTable = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  city: text("city").notNull(),
  address: text("address").notNull(),
  type: propertyTypeEnum("type").notNull(),
  status: propertyStatusEnum("status").notNull(),
  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  area: numeric("area", { precision: 10, scale: 2 }),
  images: json("images").$type<string[]>().notNull().default([]),
  latitude: numeric("latitude", { precision: 10, scale: 7 }),
  longitude: numeric("longitude", { precision: 10, scale: 7 }),
  viewCount: integer("view_count").notNull().default(0),
  isFeatured: boolean("is_featured").notNull().default(false),
  agentId: integer("agent_id").notNull().references(() => usersTable.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertPropertySchema = createInsertSchema(propertiesTable).omit({ id: true, viewCount: true, createdAt: true, updatedAt: true });
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof propertiesTable.$inferSelect;
