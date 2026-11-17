"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users, BookOpen, TrendingUp, Award, BarChart3, CheckCircle2,
  Clock, ChevronRight, GraduationCap, Activity
} from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getCurrentUser, getSystemAnalytics, getUserProgress } from "@/lib/storage";
import { DEMO_USERS, DEMO_COURSES, DEMO_QUIZZES } from "@/lib/data";
import { cn } from "@/lib/utils";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const CHART_COLOURS = ["var(--primary)", "var(--accent)", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function AnalyticsPage() {
  const router = useRouter();
  const [user] = useState(getCurrentUser());

  useEffect(() => {
    if (!user) { router.replace("/login"); return; }
    if (user.role === "student") router.replace("/dashboard");
  }, [user, router]);

  if (!user || user.role === "student") return null;

  const analytics = getSystemAnalytics();
  const students = DEMO_USERS.filter((u) => u.role === "student");


  const studentData = students.map((s) => {
    const prog = getUserProgress(s.id);
    const allAttempts = prog.courses.flatMap((c) => c.quizAttempts);
    const avgScore = allAttempts.length > 0
      ? Math.round(allAttempts.reduce((sum, a) => sum + a.score, 0) / allAttempts.length)
      : null;
    const totalLessons = prog.courses.reduce((sum, c) => sum + c.completedLessons.length, 0);
    return { ...s, avgScore, totalLessons, enrolledCount: prog.courses.length };
  });


  const courseBarData = analytics.courseStats.map((c) => ({
    name: c.title.length > 16 ? c.title.slice(0, 14) + "…" : c.title,
    enrolled: c.enrolledCount,
    completed: c.completedCount,
  }));


  const levelCounts = DEMO_COURSES.reduce((acc, c) => {
    acc[c.level] = (acc[c.level] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const pieData = Object.entries(levelCounts).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-foreground">Analytics & Reporting</h1>
          <p className="text-muted-foreground mt-1">Platform-wide learning insights and performance metrics.</p>
        </div>
        <Badge variant="outline" className="text-xs gap-1.5">
          <Activity className="h-3 w-3" /> Live Data
        </Badge>
      </div>


      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Students" value={analytics.totalStudents} icon={<Users className="h-5 w-5" />} />
        <StatCard label="Total Enrollments" value={analytics.totalEnrollments} icon={<BookOpen className="h-5 w-5" />} />
        <StatCard label="Completions" value={analytics.totalCompleted} icon={<CheckCircle2 className="h-5 w-5" />} />
        <StatCard
          label="Avg Quiz Score"
          value={analytics.avgScore > 0 ? `${Math.round(analytics.avgScore)}%` : "—"}
          icon={<Award className="h-5 w-5" />}
          accent
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 min-w-0 space-y-8">

          <section className="w-full min-w-0 overflow-hidden rounded-xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 shrink-0 text-primary" />
              <h2 className="min-w-0 font-semibold">Enrollment vs Completion by Course</h2>
            </div>
            {courseBarData.length > 0 ? (
              <ChartContainer
                config={{
                  enrolled: { label: "Enrolled", color: "var(--primary)" },
                  completed: { label: "Completed", color: "var(--accent)" },
                }}
                className="h-52 w-full min-w-0"
              >
                <BarChart data={courseBarData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="enrolled" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="completed" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No enrollment data yet.</p>
            )}
          </section>


          <section className="rounded-xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Course Performance</h2>
            </div>
            <div className="w-full min-w-0 max-w-full overflow-x-auto">
              <table className="min-w-[560px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-3 text-muted-foreground font-medium text-xs">Course</th>
                    <th className="pb-3 text-muted-foreground font-medium text-xs text-center">Enrolled</th>
                    <th className="pb-3 text-muted-foreground font-medium text-xs text-center">Completed</th>
                    <th className="pb-3 text-muted-foreground font-medium text-xs text-center">Completion</th>
                    <th className="pb-3 text-muted-foreground font-medium text-xs text-center">Avg Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {analytics.courseStats.map((stat) => {
                    const rate = stat.enrolledCount > 0
                      ? Math.round((stat.completedCount / stat.enrolledCount) * 100)
                      : 0;
                    const course = DEMO_COURSES.find((c) => c.id === stat.courseId);
                    return (
                      <tr key={stat.courseId} className="hover:bg-muted/40 transition-colors">
                        <td className="py-3 pr-4">
                          <div className="font-medium text-foreground text-xs">{stat.title}</div>
                          {course && (
                            <div className="text-muted-foreground text-xs">{course.level} · {course.category}</div>
                          )}
                        </td>
                        <td className="py-3 text-center font-medium">{stat.enrolledCount}</td>
                        <td className="py-3 text-center">{stat.completedCount}</td>
                        <td className="py-3 text-center">
                          <div className="flex items-center gap-2">
                            <Progress value={rate} className="h-1.5 flex-1" />
                            <span className="text-xs font-medium text-muted-foreground w-8">{rate}%</span>
                          </div>
                        </td>
                        <td className="py-3 text-center">
                          <span className={cn(
                            "text-xs font-bold",
                            stat.avgScore >= 70 ? "text-green-600" :
                            stat.avgScore >= 50 ? "text-amber-600" :
                            stat.avgScore > 0 ? "text-destructive" : "text-muted-foreground"
                          )}>
                            {stat.avgScore > 0 ? `${Math.round(stat.avgScore)}%` : "—"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>


          <section className="rounded-xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                <h2 className="font-semibold">Student Performance</h2>
              </div>
              <Link href="/students" className="text-xs text-primary hover:underline flex items-center gap-1">
                View all <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="divide-y divide-border">
              {studentData.sort((a, b) => (b.avgScore ?? 0) - (a.avgScore ?? 0)).map((student, i) => (
                <div key={student.id} className="flex items-center gap-3 py-3">
                  <div className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                    i === 0 ? "bg-amber-100 text-amber-700" :
                    i === 1 ? "bg-slate-100 text-slate-700" :
                    i === 2 ? "bg-orange-100 text-orange-700" :
                    "bg-muted text-muted-foreground"
                  )}>
                    {i + 1}
                  </div>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                    {student.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{student.name}</p>
                    <p className="text-xs text-muted-foreground">{student.enrolledCount} courses · {student.totalLessons} lessons</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={cn(
                      "text-sm font-bold",
                      student.avgScore !== null && student.avgScore >= 70 ? "text-green-600" :
                      student.avgScore !== null ? "text-amber-600" : "text-muted-foreground"
                    )}>
                      {student.avgScore !== null ? `${student.avgScore}%` : "—"}
                    </p>
                    <p className="text-xs text-muted-foreground">avg score</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>


        <div className="min-w-0 space-y-6">

          <div className="min-w-0 rounded-xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm">Overall Completion Rate</h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 shrink-0">
                <svg viewBox="0 0 36 36" className="h-20 w-20 rotate-[-90deg]">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--border)" strokeWidth="2.5" />
                  <circle
                    cx="18" cy="18" r="15.9" fill="none"
                    stroke="var(--primary)" strokeWidth="2.5"
                    strokeDasharray={`${analytics.completionRate} ${100 - analytics.completionRate}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold">{Math.round(analytics.completionRate)}%</span>
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{analytics.totalCompleted}</p>
                <p className="text-xs text-muted-foreground">of {analytics.totalEnrollments} enrollments completed</p>
              </div>
            </div>
          </div>


          <div className="w-full min-w-0 overflow-hidden rounded-xl border border-border bg-card p-5 space-y-4">
            <h3 className="font-semibold text-sm">Courses by Level</h3>
            <ChartContainer
              config={{
                "300 Level": { label: "300 Level", color: CHART_COLOURS[0] },
                Beginner: { label: "Beginner", color: CHART_COLOURS[0] },
                Intermediate: { label: "Intermediate", color: CHART_COLOURS[1] },
                Advanced: { label: "Advanced", color: CHART_COLOURS[2] },
              }}
              className="h-36 w-full min-w-0"
            >
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={55} dataKey="value" paddingAngle={3}>
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={CHART_COLOURS[index % CHART_COLOURS.length]} />
                  ))}
                </Pie>
                <Legend iconSize={8} iconType="circle" formatter={(v) => <span style={{ fontSize: 11 }}>{v}</span>} />
                <Tooltip formatter={(v, n) => [`${v} courses`, n]} />
              </PieChart>
            </ChartContainer>
          </div>


          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <h3 className="font-semibold text-sm">Platform Summary</h3>
            {[
              { label: "Total Courses", value: DEMO_COURSES.length },
              { label: "Total Quizzes", value: DEMO_QUIZZES.length },
              { label: "Total Students", value: analytics.totalStudents },
              { label: "Active Instructors", value: DEMO_USERS.filter((u) => u.role === "instructor").length },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-semibold">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
