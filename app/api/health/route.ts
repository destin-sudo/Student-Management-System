import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/server/database";

export const runtime = "nodejs";

export async function GET() {
  try {
    getDatabase().prepare("SELECT 1").get();
    return NextResponse.json({ status: "ok", database: "sqlite" });
  } catch {
    return NextResponse.json({ status: "unavailable" }, { status: 503 });
  }
}
