import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db/conversion";

export async function GET() {
  const db = readDB();
  return NextResponse.json(db.calls);
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const db = readDB();
    const existing = db.calls.findIndex(c => c.id === payload.id);
    if (existing >= 0) db.calls[existing] = { ...db.calls[existing], ...payload };
    else db.calls.push({ ...payload, id: payload.id || `c_${Date.now()}` });
    
    writeDB(db);
    return NextResponse.json({ success: true, call: payload });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save call" }, { status: 500 });
  }
}
