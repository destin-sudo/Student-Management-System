"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen, Clock, TrendingUp, Trophy, Zap, ChevronRight,
  Target, CheckCircle2, BarChart3, Flame
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/stat-card";
import { CourseCard } from "@/components/course-card";
import {
  getCurrentUser, getUserProgress, getAdaptiveRecommendations,
  enrollInCourse, type AdaptiveRecommendation,
} from "@/lib/storage";
import { DEMO_COURSES, type CourseProgress } from "@/lib/data";
import { cn } from "@/lib/utils";

const recTypeStyles: Record<AdaptiveRecommendation["type"], { badge: string; icon: React.ReactNode }> = {
  review: { badge: "bg-amber-100 text-amber-700 border-amber-200", icon: <BookOpen className="h-3.5 w-3.5" /> },
  continue: { badge: "bg-blue-100 text-blue-700 border-blue-200", icon: <ChevronRight className="h-3.5 w-3.5" /> },
  advance: { badge: "bg-green-100 text-green-700 border-green-200", icon: <TrendingUp className="h-3.5 w-3.5" /> },
  challenge: { badge: "bg-purple-100 text-purple-700 border-purple-200", icon: <Zap className="h-3.5 w-3.5" /> },
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(getCurrentUser());
  const [userProgress, setUserProgress] = useState(user ? getUserProgress(user.id) : null);
  const [recommendations, setRecommendations] = useState<AdaptiveRecommendation[]>([]);

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) { router.replace("/login"); return; }
    setUser(u);
    const prog = getUserProgress(u.id);
    setUserProgress(prog);
    setRecommendations(getAdaptiveRecommendations(u.id));
  }, [router]);

  if (!user) return null;

  const enrolledCourses = userProgress?.courses ?? [];
  const completedCourses = enrolledCourses.filter((c) => c.completed);
  const inProgressCourses = enrolledCourses.filter((c) => !c.completed && c.completedLessons.length > 0);
  const totalLessonsCompleted = enrolledCourses.reduce((sum, c) => sum + c.completedLessons.length, 0);
  const totalTimeSpent = enrolledCourses.reduce((sum, c) => sum + c.timeSpent, 0);
  const allAttempts = enrolledCourses.flatMap((c) => c.quizAttempts);
  const avgScore = allAttempts.length > 0
    ? Math.round(allAttempts.reduce((s, a) => s + a.score, 0) / allAttempts.length)
    : 0;

  const getCourseProgress = (courseId: string): CourseProgress | null =>
    enrolledCourses.find((c) => c.courseId === courseId) ?? null;

  const enrolledCourseDetails = DEMO_COURSES.filter((c) =>
    enrolledCourses.some((ec) => ec.courseId === c.id)
  );

  const handleEnroll = (courseId: string) => {
    if (!user) return;
    enrollInCourse(user.id, courseId);
    const prog = getUserProgress(user.id);
    setUserProgress(prog);
    setRecommendations(getAdaptiveRecommendations(user.id));
    router.push(`/courses/${courseId}`);
  };

  const greetingTime = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-8">

      <div className="rounded-2xl bg-sidebar text-sidebar-foreground p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-sidebar-foreground/70 text-sm mb-1">{greetingTime()},</p>
          <h1 className="text-2xl md:text-3xl font-bold text-balance">{user.name}</h1>
          <p className="text-sidebar-foreground/70 mt-2 text-sm">
            {user.role === "student"
              ? `You have ${enrolledCourses.length} course${enrolledCourses.length !== 1 ? "s" : ""} enrolled. Keep up the great work!`
              : user.role === "instructor"
              ? "Welcome back to your instructor dashboard."
              : "System overview — all operations normal."}
          </p>
        </div>
        {user.role === "student" && (
          <div className="flex items-center gap-3">
            <div className="text-center px-4 py-3 rounded-xl bg-sidebar-accent">
              <p className="text-2xl font-bold text-accent">{avgScore > 0 ? `${avgScore}%` : "—"}</p>
              <p className="text-xs text-sidebar-foreground/70 mt-0.5">Avg Score</p>
            </div>
            <div className="text-center px-4 py-3 rounded-xl bg-sidebar-accent">
              <p className="text-2xl font-bold text-sidebar-foreground">{completedCourses.length}</p>
              <p className="text-xs text-sidebar-foreground/70 mt-0.5">Completed</p>
            </div>
          </div>
        )}
        {user.role !== "student" && (
          <Button asChild variant="outline" className="border-sidebar-border bg-sidebar-accent text-sidebar-foreground hover:bg-sidebar-accent/80 shrink-0">
            <Link href={user.role === "admin" ? "/admin" : "/analytics"}>
              View Dashboard
            </Link>
          </Button>
        )}
      </div>


      {user.role === "student" && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Enrolled Courses"
            value={enrolledCourses.length}
            icon={<BookOpen className="h-5 w-5" />}
          />
          <StatCard
            label="Lessons Completed"
            value={totalLessonsCompleted}
            icon={<CheckCircle2 className="h-5 w-5" />}
          />
          <StatCard
            label="Time Invested"
            value={`${Math.round(totalTimeSpent / 60)}h ${totalTimeSpent % 60}m`}
            icon={<Clock className="h-5 w-5" />}
          />
          <StatCard
            label="Quizzes Taken"
            value={allAttempts.length}
            icon={<Trophy className="h-5 w-5" />}
            accent
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2 min-w-0 space-y-8">

          {recommendations.length > 0 && (
            <section>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 shrink-0 text-primary" />
                  <h2 className="text-lg font-semibold">Adaptive Recommendations</h2>
                </div>
                <Badge variant="outline" className="text-xs">Personalised for you</Badge>
              </div>
              <div className="space-y-3">
                {recommendations.map((rec, i) => {
                  const style = recTypeStyles[rec.type];
                  return (
                    <div key={i} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 hover:border-primary/30 transition-colors">
                      <div className="mt-0.5">
                        <Badge className={cn("text-xs border gap-1", style.badge)}>
                          {style.icon}
                          {rec.type.charAt(0).toUpperCase() + rec.type.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{rec.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{rec.description}</p>
                      </div>
                      {rec.courseId && (
                        <Button asChild size="sm" variant="ghost" className="shrink-0 text-primary hover:text-primary">
                          <Link href={`/courses/${rec.courseId}`}>
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}


          {user.role === "student" && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">My Courses</h2>
                </div>
                <Button asChild variant="ghost" size="sm" className="text-primary">
                  <Link href="/courses">Browse all <ChevronRight className="h-3 w-3 ml-1" /></Link>
                </Button>
              </div>

              {enrolledCourseDetails.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-border p-8 text-center">
                  <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm font-medium text-foreground">No courses yet</p>
                  <p className="text-xs text-muted-foreground mt-1 mb-4">Browse our catalogue and start learning today</p>
                  <Button asChild size="sm">
                    <Link href="/courses">Explore Courses</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {enrolledCourseDetails.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      progress={getCourseProgress(course.id)}
                      enrolled
                    />
                  ))}
                </div>
              )}
            </section>
          )}


          {user.role !== "student" && (
            <section>
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { href: "/analytics", label: "View Analytics", desc: "Check platform-wide stats", icon: <BarChart3 className="h-5 w-5" /> },
                  { href: "/students", label: "Manage Students", desc: "View learner progress", icon: <TrendingUp className="h-5 w-5" /> },
                  { href: "/courses", label: "Course Catalogue", desc: "Browse all courses", icon: <BookOpen className="h-5 w-5" /> },
                  ...(user.role === "admin" ? [{ href: "/admin", label: "Admin Panel", desc: "System configuration", icon: <Target className="h-5 w-5" /> }] : []),
                ].map((action, i) => (
                  <Link key={i} href={action.href}
                    className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 hover:border-primary/40 hover:shadow-sm transition-all"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                      {action.icon}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{action.label}</p>
                      <p className="text-xs text-muted-foreground">{action.desc}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>


        <div className="space-y-6">

          {user.role === "student" && inProgressCourses.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Flame className="h-4 w-4 text-orange-500" />
                <h3 className="font-semibold text-sm">Continue Learning</h3>
              </div>
              <div className="space-y-4">
                {inProgressCourses.slice(0, 3).map((cp) => {
                  const course = DEMO_COURSES.find((c) => c.id === cp.courseId);
                  if (!course) return null;
                  const pct = Math.round((cp.completedLessons.length / course.totalLessons) * 100);
                  return (
                    <Link key={cp.courseId} href={`/courses/${cp.courseId}`} className="block group">
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary text-xs font-bold">
                          {pct}%
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                            {course.title}
                          </p>
                          <div className="mt-1.5">
                            <Progress value={pct} className="h-1" />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {cp.completedLessons.length}/{course.totalLessons} lessons
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}


          {user.role === "student" && allAttempts.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="h-4 w-4 text-amber-500" />
                <h3 className="font-semibold text-sm">Recent Quiz Scores</h3>
              </div>
              <div className="space-y-3">
                {allAttempts.slice(-4).reverse().map((attempt, i) => {
                  const scoreColour = attempt.score >= 70 ? "text-green-600" : attempt.score >= 50 ? "text-amber-600" : "text-destructive";
                  return (
                    <div key={i} className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-foreground">Quiz Attempt</p>
                        <p className="text-[11px] text-muted-foreground">
                          {new Date(attempt.completedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                        </p>
                      </div>
                      <span className={cn("text-sm font-bold", scoreColour)}>
                        {attempt.score}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}


          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm">Suggested Courses</h3>
            </div>
            <div className="space-y-3">
              {DEMO_COURSES.filter((c) =>
                !enrolledCourses.some((ec) => ec.courseId === c.id)
              ).slice(0, 3).map((course) => (
                <div key={course.id} className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{course.title}</p>
                    <p className="text-[11px] text-muted-foreground">{course.level} · {course.totalLessons} lessons</p>
                  </div>
                  {user.role === "student" && (
                    <Button size="sm" variant="ghost" className="text-xs h-6 px-2 text-primary" onClick={() => handleEnroll(course.id)}>
                      Enroll
                    </Button>
                  )}
                </div>
              ))}
              {DEMO_COURSES.every((c) => enrolledCourses.some((ec) => ec.courseId === c.id)) && (
                <p className="text-xs text-muted-foreground text-center py-2">You're enrolled in all available courses!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
