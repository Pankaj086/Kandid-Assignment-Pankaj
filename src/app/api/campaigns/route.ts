import { db } from "@/db/db";
import { campaigns } from "@/db/schema/campaigns";
import { leads } from "@/db/schema/leads";
import { eq, sql, ilike } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');

  const baseQuery = db
    .select({
      id: campaigns.id,
      name: campaigns.name,
      status: campaigns.status,
      createdAt: campaigns.createdAt,
      totalLeads: sql<number>`COUNT(${leads.id})`,
      successfulLeads: sql<number>`SUM(CASE WHEN ${leads.status} = 'Converted' THEN 1 ELSE 0 END)`,
      responseRate: sql<number>`
        (SUM(CASE WHEN ${leads.status} IN ('Responded', 'Converted') THEN 1 ELSE 0 END)::float / 
         NULLIF(COUNT(${leads.id}), 0)) * 100
      `,
    })
    .from(campaigns)
    .leftJoin(leads, eq(leads.campaignId, campaigns.id));

  const data = search 
    ? await baseQuery.where(ilike(campaigns.name, `%${search}%`)).groupBy(campaigns.id)
    : await baseQuery.groupBy(campaigns.id);

  return NextResponse.json(data);
}
