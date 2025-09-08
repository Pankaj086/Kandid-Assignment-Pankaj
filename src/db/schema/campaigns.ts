import { pgTable, serial, varchar, timestamp, index } from "drizzle-orm/pg-core";

export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).default("Draft"), // Draft, Active, Paused, Completed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  statusIdx: index("campaigns_status_idx").on(table.status),
  createdAtIdx: index("campaigns_created_at_idx").on(table.createdAt),
}));
