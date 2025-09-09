import { db } from "@/db/db";
import { campaigns } from "@/db/schema/campaigns";
import { leads } from "@/db/schema/leads";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const campaignId = Number(params.id);

  const campaign = await db.query.campaigns.findFirst({
    where: eq(campaigns.id, campaignId),
  });

  const campaignLeads = await db
    .select()
    .from(leads)
    .where(eq(leads.campaignId, campaignId));

  return NextResponse.json({ ...campaign, leads: campaignLeads });
}
