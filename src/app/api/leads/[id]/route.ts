import { db } from "@/db/db";
import { leads } from "@/db/schema/leads";
import { campaigns } from "@/db/schema/campaigns";
import { interactions } from "@/db/schema/interactions";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id?: string }> }
) {
  try {
    const { id: rawId } = await params;
    if (!rawId) {
      return NextResponse.json({ error: "Missing id param" }, { status: 400 });
    }

    const leadId = Number(rawId);
    if (Number.isNaN(leadId)) {
      return NextResponse.json({ error: "Invalid id param" }, { status: 400 });
    }

    const leadRows = await db
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

    if (!leadRows || leadRows.length === 0) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const history = await db
      .select()
      .from(interactions)
      .where(eq(interactions.leadId, leadId))

    return NextResponse.json({ ...leadRows[0], interactions: history });
  } catch (err) {
    console.error("GET /api/leads/[id] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
