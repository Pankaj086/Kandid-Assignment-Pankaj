import { db } from "@/db/db";
import { campaigns } from "@/db/schema/campaigns";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const statuses = await db
      .select({
        status: campaigns.status,
      })
      .from(campaigns)
      .groupBy(campaigns.status);

    const statusList = statuses.map(s => s.status).filter(Boolean);
    
    return NextResponse.json(statusList);
  } catch (error) {
    console.error('Error fetching campaign statuses:', error);
    return NextResponse.json(['Draft', 'Active', 'Paused', 'Completed'], { status: 500 });
  }
}
