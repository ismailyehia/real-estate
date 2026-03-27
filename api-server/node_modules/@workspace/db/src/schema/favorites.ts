import { mysqlTable, int, timestamp, unique } from "drizzle-orm/mysql-core";
import { usersTable } from "./users";
import { propertiesTable } from "./properties";

export const favoritesTable = mysqlTable("favorites", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  propertyId: int("property_id").notNull().references(() => propertiesTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => [unique().on(t.userId, t.propertyId)]);

export type Favorite = typeof favoritesTable.$inferSelect;
