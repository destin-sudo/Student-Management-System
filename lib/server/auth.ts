import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { getDatabase } from "@/lib/server/database";

export const SESSION_COOKIE = "lms_session";
export const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: "student" | "instructor" | "admin";
  avatar: string;
  enrolledCourses: string[];
  joinedAt: string;
  department: string | null;
  gender: string | null;
  matricNumber: string | null;
}

interface UserRecord {
  user_id: string;
  identifier: string;
  matric_number: string | null;
  full_name: string;
  department: string | null;
  gender: string | null;
  role: AuthenticatedUser["role"];
  password_salt: string;
  password_hash: string;
  created_at: string;
}

function toAuthenticatedUser(record: Omit<UserRecord, "password_salt" | "password_hash">): AuthenticatedUser {
  const database = getDatabase();
  const enrollments = database.prepare("SELECT course_id FROM enrollments WHERE user_id = ? AND status = 'active'").all(record.user_id) as Array<{ course_id: string }>;
  return {
    id: record.user_id,
    name: record.full_name,
    email: record.identifier,
    role: record.role,
    avatar: record.full_name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase(),
    enrolledCourses: enrollments.map((enrollment) => enrollment.course_id),
    joinedAt: record.created_at,
    department: record.department,
    gender: record.gender,
    matricNumber: record.matric_number,
  };
}

export function authenticateIdentifier(identifier: string, password: string) {
  const database = getDatabase();
  const user = database.prepare("SELECT * FROM users WHERE identifier = ? COLLATE NOCASE").get(identifier.trim()) as UserRecord | undefined;
  if (!user) return null;
  const suppliedHash = scryptSync(password, user.password_salt, 64);
  const expectedHash = Buffer.from(user.password_hash, "hex");
  if (suppliedHash.length !== expectedHash.length || !timingSafeEqual(suppliedHash, expectedHash)) return null;
  const { password_hash: _passwordHash, password_salt: _passwordSalt, ...publicRecord } = user;
  return toAuthenticatedUser(publicRecord);
}

export function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS;
  getDatabase().prepare("INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)").run(tokenHash, userId, expiresAt);
  return token;
}

export function getSessionUser(request: NextRequest): AuthenticatedUser | null {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const record = getDatabase().prepare(`
    SELECT users.user_id, users.identifier, users.matric_number, users.full_name,
      users.department, users.gender, users.role, users.created_at
    FROM sessions
    JOIN users ON users.user_id = sessions.user_id
    WHERE sessions.token_hash = ? AND sessions.expires_at > ?
  `).get(tokenHash, Math.floor(Date.now() / 1000)) as Omit<UserRecord, "password_salt" | "password_hash"> | undefined;
  return record ? toAuthenticatedUser(record) : null;
}

export function deleteSession(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return;
  const tokenHash = createHash("sha256").update(token).digest("hex");
  getDatabase().prepare("DELETE FROM sessions WHERE token_hash = ?").run(tokenHash);
}
