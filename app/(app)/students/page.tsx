"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users, BookOpen, TrendingUp, Award, ChevronRight, Search,
  Filter, CheckCircle2, Clock, GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCurrentUser, getUserProgress } from "@/lib/storage";
import { DEMO_USERS, DEMO_COURSES, DEMO_QUIZZES } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function StudentsPage() {
  const router = useRouter();
  const [user] = useState(getCurrentUser());
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    if (!user) { router.replace("/login"); return; }
    if (user.role === "student") router.replace("/dashboard");
  }, [user, router]);

  if (!user || user.role === "student") return null;

  const students = DEMO_USERS.filter((u) => u.role === "student");

  const studentData = students.map((s) => {
    const prog = getUserProgress(s.id);
    const allAttempts = prog.courses.flatMap((c) => c.quizAttempts);
    const avgScore = allAttempts.length > 0
      ? Math.round(allAttempts.reduce((sum, a) => sum + a.score, 0) / allAttempts.length)
      : null;
    const totalLessons = prog.courses.reduce((sum, c) => sum + c.completedLessons.length, 0);
    const completedCourses = prog.courses.filter((c) => c.completed).length;
    const totalTime = prog.courses.reduce((sum, c) => sum + c.timeSpent, 0);
    return {
      ...s,
      avgScore,
      totalLessons,
      completedCourses,
      enrolledCount: prog.courses.length,
      totalTime,
      courses: prog.courses,
    };
  });

  const filtered = studentData
    .filter((s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "score") return (b.avgScore ?? 0) - (a.avgScore ?? 0);
      if (sortBy === "lessons") return b.totalLessons - a.totalLessons;
      if (sortBy === "enrolled") return b.enrolledCount - a.enrolledCount;
      return 0;
    });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Student Management</h1>
        <p className="text-muted-foreground mt-1">Monitor learner progress and engagement across all courses.</p>
      </div>


      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-44">
            <Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Sort by Name</SelectItem>
            <SelectItem value="score">Sort by Avg Score</SelectItem>
            <SelectItem value="lessons">Sort by Lessons</SelectItem>
            <SelectItem value="enrolled">Sort by Enrolled</SelectItem>
          </SelectContent>
        </Select>
      </div>


      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Students", value: students.length, icon: <Users className="h-4 w-4" /> },
          { label: "Avg Enrollments", value: (studentData.reduce((s, d) => s + d.enrolledCount, 0) / students.length).toFixed(1), icon: <BookOpen className="h-4 w-4" /> },
          { label: "Avg Quiz Score", value: (() => {
            const scores = studentData.filter((s) => s.avgScore !== null).map((s) => s.avgScore as number);
            return scores.length > 0 ? `${Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)}%` : "—";
          })(), icon: <Award className="h-4 w-4" /> },
          { label: "Active Today", value: studentData.filter((s) => {
            const latest = s.courses.sort((a, b) =>
              new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime()
            )[0];
            if (!latest) return false;
            const today = new Date().toDateString();
            return new Date(latest.lastAccessedAt).toDateString() === today;
          }).length, icon: <TrendingUp className="h-4 w-4" /> },
        ].map(({ label, value, icon }) => (
          <div key={label} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">{icon}<span className="text-xs">{label}</span></div>
            <p className="text-xl font-bold text-foreground">{value}</p>
          </div>
        ))}
      </div>


      <div className="grid gap-4">
        {filtered.map((student) => {
          const enrolledCourseDetails = DEMO_COURSES.filter((c) =>
            student.courses.some((ec) => ec.courseId === c.id)
          );
          return (
            <div key={student.id} className="rounded-xl border border-border bg-card p-6">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">

                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                    {student.avatar}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground">{student.name}</h3>
                    <p className="text-xs text-muted-foreground">Matric: {student.email}</p>
                    <p className="text-xs text-muted-foreground">{student.department} · {student.gender}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Joined {new Date(student.joinedAt).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>


                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 shrink-0">
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground">{student.enrolledCount}</p>
                    <p className="text-xs text-muted-foreground">Enrolled</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground">{student.totalLessons}</p>
                    <p className="text-xs text-muted-foreground">Lessons</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground">{student.completedCourses}</p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                  <div className="text-center">
                    <p className={cn(
                      "text-lg font-bold",
                      student.avgScore !== null && student.avgScore >= 70 ? "text-green-600" :
                      student.avgScore !== null ? "text-amber-600" : "text-muted-foreground"
                    )}>
                      {student.avgScore !== null ? `${student.avgScore}%` : "—"}
                    </p>
                    <p className="text-xs text-muted-foreground">Avg Score</p>
                  </div>
                </div>
              </div>


              {enrolledCourseDetails.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border space-y-3">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Course Progress</p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {enrolledCourseDetails.map((course) => {
                      const cp = student.courses.find((c) => c.courseId === course.id);
                      if (!cp) return null;
                      const pct = Math.round((cp.completedLessons.length / course.totalLessons) * 100);
                      return (
                        <div key={course.id} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <p className="text-xs text-foreground font-medium truncate max-w-[140px]">{course.title}</p>
                            <div className="flex items-center gap-1.5">
                              {cp.completed && <CheckCircle2 className="h-3 w-3 text-green-500" />}
                              <span className="text-xs text-muted-foreground">{pct}%</span>
                            </div>
                          </div>
                          <Progress value={pct} className="h-1.5" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Users className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No students found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
