import dotenv from "dotenv";
dotenv.config();
console.log("database3", process.env.PGDATABASE);

import { db } from "@/db/db";
import { campaigns } from "@/db/schema/campaigns";
import { leads } from "@/db/schema/leads";
import { interactions } from "@/db/schema/interactions";
import { faker } from "@faker-js/faker";


async function seed() {
  console.log("Starting seed...");
    // console.log("database", process.env.DATABASE_URL);
  // 1. Insert 20 campaigns
  const campaignData = Array.from({ length: 20 }).map((_, i) => ({
    name: `Campaign ${i + 1}`,
    status: faker.helpers.arrayElement(["Draft", "Active", "Paused", "Completed"]),
  }));

  const insertedCampaigns = await db.insert(campaigns).values(campaignData).returning();

  // 2. Insert 200 leads across campaigns
  const leadData = Array.from({ length: 200 }).map(() => {
    const campaign = faker.helpers.arrayElement(insertedCampaigns);
    return {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      company: faker.company.name(),
      campaignId: campaign.id,
      status: faker.helpers.arrayElement(["Pending", "Contacted", "Responded", "Converted"]),
      lastContactDate: faker.date.recent({ days: 30 }),
    };
  });

  const insertedLeads = await db.insert(leads).values(leadData).returning();

  // 3. Insert interactions for each lead (1–3 random interactions)
  const interactionData = insertedLeads.flatMap((lead) =>
    Array.from({ length: faker.number.int({ min: 1, max: 3 }) }).map(() => ({
      leadId: lead.id,
      type: faker.helpers.arrayElement(["Email Sent", "Call", "Reply", "Note Added"]),
      timestamp: faker.date.recent({ days: 30 }),
      notes: faker.lorem.sentence(),
    }))
  );

  await db.insert(interactions).values(interactionData);

  console.log("Seed completed successfully!");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

