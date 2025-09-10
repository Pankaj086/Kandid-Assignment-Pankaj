import { db } from "@/db/db";
import { campaigns } from "@/db/schema/campaigns";
import { leads } from "@/db/schema/leads";
import { eq, sql, ilike, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  const status = searchParams.get('status');

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

  // Build where conditions
  const conditions = [];
  
  if (search) {
    conditions.push(ilike(campaigns.name, `%${search}%`));
  }
  
  if (status && status !== 'All') {
    conditions.push(eq(campaigns.status, status));
  }

  const data = conditions.length > 0 
    ? await baseQuery.where(and(...conditions)).groupBy(campaigns.id)
    : await baseQuery.groupBy(campaigns.id);

  return NextResponse.json(data);
}
