import { NextResponse } from "next/server";
import { getOpportunities, saveOpportunity } from "@/lib/db/conversion";

export async function GET() {
  const opps = getOpportunities();
  return NextResponse.json(opps);
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    saveOpportunity(payload);
    return NextResponse.json({ success: true, opportunity: payload });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save opportunity" }, { status: 500 });
  }
}
