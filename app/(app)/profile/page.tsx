"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User, Mail, BookOpen, Calendar, Award, Clock, Edit3, Save, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { StatCard } from "@/components/stat-card";
import { getCurrentUser, getUserProgress } from "@/lib/storage";
import { DEMO_COURSES, DEMO_QUIZZES } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(getCurrentUser());
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (!user) { router.replace("/login"); return; }
    setName(user.name);
    setBio(user.bio ?? "");
  }, [user?.id]);

  if (!user) return null;

  const progress = getUserProgress(user.id);
  const allAttempts = progress.courses.flatMap((c) => c.quizAttempts);
  const avgScore = allAttempts.length > 0
    ? Math.round(allAttempts.reduce((s, a) => s + a.score, 0) / allAttempts.length)
    : 0;
  const totalLessons = progress.courses.reduce((s, c) => s + c.completedLessons.length, 0);
  const totalTime = progress.courses.reduce((s, c) => s + c.timeSpent, 0);
  const completedCourses = progress.courses.filter((c) => c.completed).length;

  const handleSave = () => {

    if (typeof window !== "undefined") {
      const updated = { ...user, name: name.trim() || user.name, bio: bio.trim() };
      localStorage.setItem("lms_current_user", JSON.stringify(updated));
      setUser(updated);
    }
    setEditing(false);
  };

  const roleColour = {
    student: "bg-green-100 text-green-700 border-green-200",
    instructor: "bg-blue-100 text-blue-700 border-blue-200",
    admin: "bg-red-100 text-red-700 border-red-200",
  }[user.role];

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
        <p className="text-muted-foreground mt-1">View and update your account information.</p>
      </div>


      <div className="rounded-xl border border-border bg-card p-4 space-y-6 sm:p-6">
        <div className="flex flex-wrap items-start gap-4 sm:flex-nowrap sm:gap-5">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary text-2xl font-bold">
            {user.avatar}
          </div>
          <div className="min-w-0 flex-1 space-y-3">
            {editing ? (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="name" className="text-xs">Display Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="max-w-xs"
                    placeholder="Your full name"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="bio" className="text-xs">Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={3}
                    className="resize-none max-w-md"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} size="sm" className="gap-2">
                    <Save className="h-3.5 w-3.5" /> Save Changes
                  </Button>
                  <Button onClick={() => setEditing(false)} variant="outline" size="sm" className="gap-2">
                    <X className="h-3.5 w-3.5" /> Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
                  <Badge className={cn("text-xs border capitalize", roleColour)}>{user.role}</Badge>
                </div>
                <p className="break-words text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                  <Mail className="h-3.5 w-3.5" />
                  {user.email}
                </p>
                {user.bio && (
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{user.bio}</p>
                )}
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-2">
                  <Calendar className="h-3 w-3" />
                  Member since {new Date(user.joinedAt).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
                </p>
              </div>
            )}
          </div>
          {!editing && (
            <Button onClick={() => setEditing(true)} variant="outline" size="sm" className="gap-2 shrink-0 sm:ml-auto">
              <Edit3 className="h-3.5 w-3.5" />
              Edit
            </Button>
          )}
        </div>
      </div>


      {user.role === "student" && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="Courses Enrolled" value={progress.courses.length} icon={<BookOpen className="h-5 w-5" />} />
            <StatCard label="Completed" value={completedCourses} icon={<Award className="h-5 w-5" />} />
            <StatCard label="Lessons Done" value={totalLessons} icon={<User className="h-5 w-5" />} />
            <StatCard label="Avg Quiz Score" value={avgScore > 0 ? `${avgScore}%` : "—"} icon={<Clock className="h-5 w-5" />} accent />
          </div>


          {progress.courses.length > 0 && (
            <section className="rounded-xl border border-border bg-card p-6 space-y-4">
              <h2 className="font-semibold">My Courses</h2>
              <div className="divide-y divide-border">
                {DEMO_COURSES.filter((c) =>
                  progress.courses.some((ec) => ec.courseId === c.id)
                ).map((course) => {
                  const cp = progress.courses.find((ec) => ec.courseId === course.id);
                  if (!cp) return null;
                  const pct = Math.round((cp.completedLessons.length / course.totalLessons) * 100);
                  const quizAttempts = cp.quizAttempts;
                  const avgCourseScore = quizAttempts.length > 0
                    ? Math.round(quizAttempts.reduce((s, a) => s + a.score, 0) / quizAttempts.length)
                    : null;

                  return (
                    <div key={course.id} className="py-4 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-medium text-sm text-foreground">{course.title}</h3>
                            {cp.completed && (
                              <Badge className="bg-green-100 text-green-700 border-green-200 border text-xs">Completed</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {course.level} · {course.category}
                            {avgCourseScore !== null && (
                              <span className={cn("ml-2 font-medium", avgCourseScore >= 70 ? "text-green-600" : "text-amber-600")}>
                                · Quiz avg: {avgCourseScore}%
                              </span>
                            )}
                          </p>
                        </div>
                        <span className="text-sm font-bold text-foreground shrink-0">{pct}%</span>
                      </div>
                      <Progress value={pct} className="h-2" />
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>{cp.completedLessons.length}/{course.totalLessons} lessons · {cp.timeSpent}m</span>
                        <span>
                          Enrolled {new Date(cp.enrolledAt).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}


          {allAttempts.length > 0 && (
            <section className="rounded-xl border border-border bg-card p-6 space-y-4">
              <h2 className="font-semibold">Quiz History</h2>
              <div className="divide-y divide-border">
                {allAttempts.map((attempt, i) => {
                  const quiz = DEMO_QUIZZES.find((q) => q.id === attempt.quizId);
                  const passed = attempt.score >= (quiz?.passingScore ?? 70);
                  return (
                    <div key={i} className="flex items-center justify-between py-3 gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{quiz?.title ?? "Quiz"}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(attempt.completedAt).toLocaleDateString("en-GB", {
                            day: "numeric", month: "short", year: "numeric"
                          })}
                          {" · "}{attempt.correctAnswers}/{attempt.totalQuestions} correct
                          {" · "}{Math.floor(attempt.timeTaken / 60)}m {attempt.timeTaken % 60}s
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge className={cn(
                          "border text-xs",
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
        </>
      )}
    </div>
  );
}
