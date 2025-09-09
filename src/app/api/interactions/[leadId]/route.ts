import { db } from "@/db/db";
import { interactions } from "@/db/schema/interactions";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ leadId: string }> }
) {
  const { leadId } = await params;
  const leadIdNum = Number(leadId);

  const history = await db
    .select()
    .from(interactions)
    .where(eq(interactions.leadId, leadIdNum));

  return NextResponse.json(history);
}
