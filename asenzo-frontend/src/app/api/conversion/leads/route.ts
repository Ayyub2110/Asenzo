import { NextResponse } from "next/server";
import { getLeads, saveLead } from "@/lib/db/conversion";

export async function GET() {
  const leads = getLeads();
  return NextResponse.json(leads);
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    saveLead(payload);
    return NextResponse.json({ success: true, lead: payload });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
  }
}
