import { NextRequest, NextResponse } from "next/server";
import { authenticateIdentifier, createSession, SESSION_COOKIE, SESSION_DURATION_SECONDS } from "@/lib/server/auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Matric number and password are required." }, { status: 400 });
  }

  const credentials = body as Record<string, unknown>;
  const identifier = typeof credentials.identifier === "string" ? credentials.identifier : "";
  const password = typeof credentials.password === "string" ? credentials.password : "";
  if (!identifier.trim() || !password || password.length > 256) {
    return NextResponse.json({ error: "Matric number and password are required." }, { status: 400 });
  }

  const user = authenticateIdentifier(identifier, password);
  if (!user) {
    return NextResponse.json({ error: "Invalid matric number or password." }, { status: 401 });
  }

  const token = createSession(user.id);
  const response = NextResponse.json({ user });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
  return response;
}
