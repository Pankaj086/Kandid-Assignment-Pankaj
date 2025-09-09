import { db } from "@/db/db";
import { leads } from "@/db/schema/leads";
import { campaigns } from "@/db/schema/campaigns";
import { interactions } from "@/db/schema/interactions";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const leadId = Number(params.id);

  const lead = await db
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
    .leftJoin(campaigns, eq(leads.campaignId, campaigns.id))
    .where(eq(leads.id, leadId));

  const history = await db
    .select()
    .from(interactions)
    .where(eq(interactions.leadId, leadId));

  return NextResponse.json({ ...lead[0], interactions: history });
}
