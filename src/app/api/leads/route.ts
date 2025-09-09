import { db } from "@/db/db";
import { leads } from "@/db/schema/leads";
import { campaigns } from "@/db/schema/campaigns";
import { eq, and, or, sql, gt } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get("q") ?? "";
    const status = url.searchParams.get("status") ?? "";
    const campaignId = url.searchParams.get("campaignId");
    const cursor = url.searchParams.get("cursor");
    const limit = parseInt(url.searchParams.get("limit") ?? "25");

    // Build where clauses dynamically
    const filters: any[] = [];
    if (status) filters.push(eq(leads.status, status));
    if (campaignId) filters.push(eq(leads.campaignId, Number(campaignId)));

    // Add cursor-based pagination
    if (cursor) {
      filters.push(gt(leads.id, parseInt(cursor)));
    }

    // Add search functionality using ILIKE for case-insensitive search
    if (q) {
      const searchTerm = `%${q}%`;
      filters.push(
        or(
          sql`${leads.name} ILIKE ${searchTerm}`,
          sql`${leads.email} ILIKE ${searchTerm}`,
          sql`${leads.company} ILIKE ${searchTerm}`
        )
      );
    }

    const data = await db
      .select({
        id: leads.id,
        name: leads.name,
        email: leads.email,
        company: leads.company,
        status: leads.status,
        lastContactDate: leads.lastContactDate,
        campaignId: leads.campaignId,
        campaignName: campaigns.name,
        createdAt: leads.createdAt,
        updatedAt: leads.updatedAt,
      })
      .from(leads)
      .leftJoin(campaigns, eq(leads.campaignId, campaigns.id))
      .where(filters.length > 0 ? and(...filters) : undefined)
      .orderBy(leads.id)
      .limit(limit + 1); // Fetch one extra to determine if there's a next page

    // Check if there's a next page
    const hasNextPage = data.length > limit;
    const results = hasNextPage ? data.slice(0, limit) : data;
    const nextCursor = hasNextPage ? results[results.length - 1].id : null;

    return NextResponse.json({ 
      success: true, 
      data: results,
      nextCursor,
      hasNextPage,
      count: results.length 
    });
  } catch (err) {
    console.error("GET /api/leads error:", err);
    return NextResponse.json({ 
      success: false, 
      error: "Internal server error" 
    }, { status: 500 });
  }
}
