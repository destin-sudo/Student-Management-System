import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/server/database";
import { getSessionUser } from "@/lib/server/auth";

export const runtime = "nodejs";

interface CourseRecord {
  course_id: string;
  course_code: string;
  title: string;
  description: string;
  category: string;
  level: string;
  instructor_id: string;
  instructor_name: string;
}

export async function GET(request: NextRequest) {
  if (!getSessionUser(request)) {
    return NextResponse.json({ error: "Sign in to view courses." }, { status: 401 });
  }

  const database = getDatabase();
  const courses = database.prepare(`
    SELECT courses.course_id, courses.course_code, courses.title, courses.description,
      courses.category, courses.level, courses.instructor_id, users.full_name AS instructor_name
    FROM courses
    JOIN users ON users.user_id = courses.instructor_id
    ORDER BY courses.course_code
  `).all() as unknown as CourseRecord[];

  const getModules = database.prepare("SELECT module_id, title, sort_order FROM modules WHERE course_id = ? ORDER BY sort_order");
  const getLessons = database.prepare("SELECT lesson_id, title, content, content_type, duration_minutes, sort_order FROM lessons WHERE module_id = ? ORDER BY sort_order");
  const result = courses.map((course) => ({
    id: course.course_id,
    code: course.course_code,
    title: course.title,
    description: course.description,
    category: course.category,
    level: course.level,
    instructor: course.instructor_name,
    modules: (getModules.all(course.course_id) as Array<{ module_id: string; title: string; sort_order: number }>).map((module) => ({
      id: module.module_id,
      title: module.title,
      order: module.sort_order,
      lessons: getLessons.all(module.module_id),
    })),
  }));

  return NextResponse.json({ courses: result, total: result.length });
}
