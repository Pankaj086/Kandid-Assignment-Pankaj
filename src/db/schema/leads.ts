import { pgTable, serial, varchar, timestamp, integer, index } from "drizzle-orm/pg-core";
import { campaigns } from "./campaigns";

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),   // Lead Name / Contact
  email: varchar("email", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }),
  campaignId: integer("campaign_id").references(() => campaigns.id).notNull(),
  status: varchar("status", { length: 50 }).default("Pending"), // Pending, Contacted, Responded, Converted
  lastContactDate: timestamp("last_contact_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  campaignIdx: index("leads_campaign_id_idx").on(table.campaignId),
  statusIdx: index("leads_status_idx").on(table.status),
  emailIdx: index("leads_email_idx").on(table.email),
  companyIdx: index("leads_company_idx").on(table.company),
  lastContactIdx: index("leads_last_contact_date_idx").on(table.lastContactDate),
  campaignStatusIdx: index("leads_campaign_status_idx").on(table.campaignId, table.status),
}));
