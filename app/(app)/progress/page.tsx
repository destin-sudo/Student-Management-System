"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpen, Trophy, Clock, TrendingUp, CheckCircle2, Target,
  ChevronRight, BarChart3, Star, Award, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StatCard } from "@/components/stat-card";
import {
  getCurrentUser, getUserProgress, getAdaptiveRecommendations,
  type AdaptiveRecommendation,
} from "@/lib/storage";
import { DEMO_COURSES, DEMO_QUIZZES } from "@/lib/data";
import { cn } from "@/lib/utils";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from "recharts";

const recTypeStyles: Record<AdaptiveRecommendation["type"], { badge: string }> = {
  review: { badge: "bg-amber-100 text-amber-700 border-amber-200" },
  continue: { badge: "bg-blue-100 text-blue-700 border-blue-200" },
  advance: { badge: "bg-green-100 text-green-700 border-green-200" },
  challenge: { badge: "bg-violet-100 text-violet-700 border-violet-200" },
};

export default function ProgressPage() {
  const router = useRouter();
  const [user] = useState(getCurrentUser());

  useEffect(() => {
    if (!user) router.replace("/login");
  }, [user, router]);

  if (!user) return null;

  const userProgress = getUserProgress(user.id);
  const enrolledCourses = userProgress.courses;
  const recommendations = getAdaptiveRecommendations(user.id);

  const allAttempts = enrolledCourses.flatMap((c) => c.quizAttempts);
  const avgScore = allAttempts.length > 0
    ? Math.round(allAttempts.reduce((s, a) => s + a.score, 0) / allAttempts.length)
    : 0;
  const totalLessons = enrolledCourses.reduce((s, c) => s + c.completedLessons.length, 0);
  const totalTime = enrolledCourses.reduce((s, c) => s + c.timeSpent, 0);
  const completedCourses = enrolledCourses.filter((c) => c.completed).length;


  const quizChartData = allAttempts.map((a, i) => ({
    name: `Quiz ${i + 1}`,
    score: a.score,
    pass: DEMO_QUIZZES.find((q) => q.id === a.quizId)?.passingScore ?? 70,
  }));


  const courseChartData = DEMO_COURSES.filter((c) =>
    enrolledCourses.some((e) => e.courseId === c.id)
  ).map((c) => {
    const prog = enrolledCourses.find((e) => e.courseId === c.id);
    const pct = prog ? Math.round((prog.completedLessons.length / c.totalLessons) * 100) : 0;
    return {
      name: c.title.length > 20 ? c.title.slice(0, 18) + "..." : c.title,
      progress: pct,
    };
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Progress</h1>
        <p className="text-muted-foreground mt-1">Track your learning journey and adaptive recommendations.</p>
      </div>


      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Courses Enrolled" value={enrolledCourses.length} icon={<BookOpen className="h-5 w-5" />} />
        <StatCard label="Courses Completed" value={completedCourses} icon={<CheckCircle2 className="h-5 w-5" />} />
        <StatCard label="Lessons Done" value={totalLessons} icon={<Target className="h-5 w-5" />} />
        <StatCard label="Avg Quiz Score" value={avgScore > 0 ? `${avgScore}%` : "N/A"} icon={<Trophy className="h-5 w-5" />} accent />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">

          <section className="rounded-xl border border-border bg-card p-6 space-y-5">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Course Progress</h2>
            </div>

            {enrolledCourses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-40" />
                No courses enrolled yet.{" "}
                <Link href="/courses" className="text-primary underline">Browse courses</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {DEMO_COURSES.filter((c) => enrolledCourses.some((e) => e.courseId === c.id)).map((course) => {
                  const prog = enrolledCourses.find((e) => e.courseId === course.id);
                  if (!prog) return null;
                  const pct = Math.round((prog.completedLessons.length / course.totalLessons) * 100);
                  const courseAttempts = prog.quizAttempts;
                  const courseAvg = courseAttempts.length > 0
                    ? Math.round(courseAttempts.reduce((s, a) => s + a.score, 0) / courseAttempts.length)
                    : null;

                  const levelColour = {
                    Beginner: "bg-green-100 text-green-700 border-green-200",
                    Intermediate: "bg-blue-100 text-blue-700 border-blue-200",
                    Advanced: "bg-orange-100 text-orange-700 border-orange-200",
                    "300 Level": "bg-violet-100 text-violet-700 border-violet-200",
                  }[course.level];

                  return (
                    <div key={course.id} className="space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Link href={`/courses/${course.id}`} className="font-medium text-sm hover:text-primary transition-colors">
                              {course.title}
                            </Link>
                            {prog.completed && (
                              <Badge className="bg-green-100 text-green-700 border-green-200 border text-xs">Completed</Badge>
                            )}
                            <Badge className={cn("border text-xs", levelColour)}>{course.level}</Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                            <span>{prog.completedLessons.length}/{course.totalLessons} lessons</span>
                            <span>{prog.timeSpent}m spent</span>
                            {courseAvg !== null && (
                              <span className={cn("font-medium", courseAvg >= 70 ? "text-green-600" : "text-amber-600")}>
                                Avg score: {courseAvg}%
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-lg font-bold text-foreground">{pct}%</span>
                        </div>
                      </div>
                      <Progress value={pct} className="h-2" />
                      <div className="flex justify-between items-center">
                        <div className="flex gap-1">
                          {courseAttempts.map((a, i) => (
                            <div
                              key={i}
                              title={`Quiz attempt: ${a.score}%`}
                              className={cn(
                                "h-2 w-6 rounded-full",
                                a.score >= 90 ? "bg-green-500" :
                                a.score >= 70 ? "bg-blue-500" :
                                a.score >= 50 ? "bg-amber-500" : "bg-red-400"
                              )}
                            />
                          ))}
                        </div>
                        <Link href={`/courses/${course.id}`} className="text-xs text-primary hover:underline">
                          {pct === 100 ? "Review" : "Continue"}
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>


          {quizChartData.length > 0 && (
            <section className="rounded-xl border border-border bg-card p-6 space-y-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h2 className="font-semibold">Quiz Score History</h2>
              </div>
              <ChartContainer
                config={{
                  score: { label: "Score", color: "var(--primary)" },
                  pass: { label: "Pass Mark", color: "var(--accent)" },
                }}
                className="h-48"
              >
                <LineChart data={quizChartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={2} dot={{ fill: "var(--primary)", r: 4 }} />
                  <Line type="monotone" dataKey="pass" stroke="var(--accent)" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ChartContainer>
            </section>
          )}


          {allAttempts.length > 0 && (
            <section className="rounded-xl border border-border bg-card p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                <h2 className="font-semibold">Quiz Attempt History</h2>
              </div>
              <div className="divide-y divide-border">
                {allAttempts.map((attempt, i) => {
                  const quiz = DEMO_QUIZZES.find((q) => q.id === attempt.quizId);
                  const course = DEMO_COURSES.find((c) =>
                    enrolledCourses.some((ec) => ec.courseId === c.id && ec.quizAttempts.includes(attempt))
                  );
                  const passed = attempt.score >= (quiz?.passingScore ?? 70);
                  return (
                    <div key={i} className="flex items-center justify-between py-3 gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {quiz?.title ?? "Quiz"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(attempt.completedAt).toLocaleDateString("en-GB", {
                            day: "numeric", month: "short", year: "numeric",
                            hour: "2-digit", minute: "2-digit"
                          })}
                          {" · "}{attempt.correctAnswers}/{attempt.totalQuestions} correct
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs text-muted-foreground">
                          {Math.floor(attempt.timeTaken / 60)}m {attempt.timeTaken % 60}s
                        </span>
                        <Badge className={cn(
                          "border text-xs font-bold",
                          passed ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200"
                        )}>
                          {attempt.score}%
                        </Badge>
                        <span className={cn("text-xs font-medium", passed ? "text-green-600" : "text-destructive")}>
                          {passed ? "Passed" : "Failed"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>


        <div className="space-y-6">

          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm">Adaptive Recommendations</h3>
            </div>
            {recommendations.length === 0 ? (
              <p className="text-xs text-muted-foreground">No recommendations yet. Start a course to get personalised suggestions.</p>
            ) : (
              <div className="space-y-3">
                {recommendations.map((rec, i) => (
                  <div key={i} className="space-y-1.5">
                    <Badge className={cn("text-xs border", recTypeStyles[rec.type].badge)}>
                      {rec.type.charAt(0).toUpperCase() + rec.type.slice(1)}
                    </Badge>
                    <p className="text-sm font-medium text-foreground">{rec.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{rec.description}</p>
                    {rec.courseId && (
                      <Button asChild size="sm" variant="ghost" className="text-primary h-7 px-2 text-xs w-full justify-start">
                        <Link href={`/courses/${rec.courseId}`}>
                          Go to course <ChevronRight className="h-3 w-3 ml-1" />
                        </Link>
                      </Button>
                    )}
                    {i < recommendations.length - 1 && <Separator className="mt-2" />}
                  </div>
                ))}
              </div>
            )}
          </div>


          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-500" />
              <h3 className="font-semibold text-sm">Learning Stats</h3>
            </div>
            <div className="space-y-3 text-sm">
              {[
                { label: "Total Study Time", value: `${Math.floor(totalTime / 60)}h ${totalTime % 60}m` },
                { label: "Quizzes Attempted", value: allAttempts.length },
                { label: "Quizzes Passed", value: allAttempts.filter((a) => {
                  const q = DEMO_QUIZZES.find((q) => q.id === a.quizId);
                  return a.score >= (q?.passingScore ?? 70);
                }).length },
                { label: "Best Score", value: allAttempts.length > 0 ? `${Math.max(...allAttempts.map((a) => a.score))}%` : "—" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
