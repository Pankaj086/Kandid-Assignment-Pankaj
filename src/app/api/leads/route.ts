import { db } from "@/db/db";
import { leads } from "@/db/schema/leads";
import { campaigns } from "@/db/schema/campaigns";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await db
    .select({
      id: leads.id,
      name: leads.name,
      email: leads.email,
      company: leads.company,
      status: leads.status,
      lastContactDate: leads.lastContactDate,
      campaignName: campaigns.name,
    })
    .from(leads)
    .leftJoin(campaigns, eq(leads.campaignId, campaigns.id));

  return NextResponse.json(data);
}
