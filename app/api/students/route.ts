import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/server/database";
import { getSessionUser } from "@/lib/server/auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const user = getSessionUser(request);
  if (!user) return NextResponse.json({ error: "Sign in to view students." }, { status: 401 });
  if (user.role !== "instructor" && user.role !== "admin") {
    return NextResponse.json({ error: "Instructor access is required." }, { status: 403 });
  }

  const students = getDatabase().prepare(`
    SELECT user_id AS id, matric_number AS matricNumber, full_name AS name,
      department, gender, year_level AS yearLevel
    FROM users
    WHERE role = 'student'
    ORDER BY full_name
  `).all();

  return NextResponse.json({ students, total: students.length });
}
