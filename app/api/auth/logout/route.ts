import { NextRequest, NextResponse } from "next/server";
import { deleteSession, SESSION_COOKIE } from "@/lib/server/auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  deleteSession(request);
  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
