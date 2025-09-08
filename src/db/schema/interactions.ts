import { pgTable, serial, integer, varchar, timestamp, text, index } from "drizzle-orm/pg-core";
import { leads } from "./leads";

export const interactions = pgTable("interactions", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").references(() => leads.id).notNull(),
  type: varchar("type", { length: 50 }).notNull(),  // e.g. "Email Sent", "Call", "Reply"
  timestamp: timestamp("timestamp").defaultNow(),
  notes: text("notes"), // optional
}, (table) => ({
  leadIdx: index("interactions_lead_id_idx").on(table.leadId),
  timestampIdx: index("interactions_timestamp_idx").on(table.timestamp),
  leadTimestampIdx: index("interactions_lead_timestamp_idx").on(table.leadId, table.timestamp),
}));
