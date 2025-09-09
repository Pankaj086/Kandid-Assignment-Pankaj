import { db } from "@/db/db";
import { interactions } from "@/db/schema/interactions";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { leadId: string } }
) {
  const leadId = Number(params.leadId);

  const history = await db
    .select()
    .from(interactions)
    .where(eq(interactions.leadId, leadId));

  return NextResponse.json(history);
}
