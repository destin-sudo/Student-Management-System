"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Users, BookOpen, Award, Settings, Shield, Database,
  TrendingUp, RefreshCw, CheckCircle2, Activity, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StatCard } from "@/components/stat-card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { getCurrentUser, getSystemAnalytics } from "@/lib/storage";
import { DEMO_USERS, DEMO_COURSES, DEMO_QUIZZES } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function AdminPage() {
  const router = useRouter();
  const [user] = useState(getCurrentUser());
  const [adaptiveEnabled, setAdaptiveEnabled] = useState(true);
  const [adaptiveQuiz, setAdaptiveQuiz] = useState(true);
  const [adaptiveContent, setAdaptiveContent] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [resetMsg, setResetMsg] = useState("");

  useEffect(() => {
    if (!user) { router.replace("/login"); return; }
    if (user.role !== "admin") router.replace("/dashboard");
  }, [user, router]);

  if (!user || user.role !== "admin") return null;

  const analytics = getSystemAnalytics();
  const instructors = DEMO_USERS.filter((u) => u.role === "instructor");
  const students = DEMO_USERS.filter((u) => u.role === "student");

  const handleResetDemo = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("lms_user_progress");
      localStorage.removeItem("lms_initialized");
      setResetMsg("Demo data reset. Please refresh the page.");
      setTimeout(() => setResetMsg(""), 4000);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-muted-foreground mt-1">System configuration, user management, and adaptive engine controls.</p>
        </div>
        <Badge variant="outline" className="gap-1.5 text-xs">
          <Shield className="h-3 w-3" /> Admin
        </Badge>
      </div>


      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Students" value={analytics.totalStudents} icon={<Users className="h-5 w-5" />} />
        <StatCard label="Courses" value={DEMO_COURSES.length} icon={<BookOpen className="h-5 w-5" />} />
        <StatCard label="Quizzes" value={DEMO_QUIZZES.length} icon={<Award className="h-5 w-5" />} />
        <StatCard label="Enrollments" value={analytics.totalEnrollments} icon={<TrendingUp className="h-5 w-5" />} accent />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">

          <section className="rounded-xl border border-border bg-card p-6 space-y-5">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Adaptive Learning Engine</h2>
              <Badge className="bg-green-100 text-green-700 border-green-200 border text-xs ml-auto">Active</Badge>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The adaptive engine analyses student quiz performance, lesson completion rates, and time-on-task to generate personalised recommendations. Configure the modules below.
            </p>
            <Separator />
            <div className="space-y-4">
              {[
                {
                  label: "Adaptive Engine",
                  desc: "Enable the overall adaptive learning system",
                  value: adaptiveEnabled,
                  set: setAdaptiveEnabled,
                  id: "adaptive-main",
                },
                {
                  label: "Adaptive Quiz Difficulty",
                  desc: "Adjust question difficulty based on learner performance history",
                  value: adaptiveQuiz,
                  set: setAdaptiveQuiz,
                  id: "adaptive-quiz",
                },
                {
                  label: "Adaptive Content Recommendations",
                  desc: "Suggest courses and lessons based on individual learning gaps",
                  value: adaptiveContent,
                  set: setAdaptiveContent,
                  id: "adaptive-content",
                },
                {
                  label: "Learner Notifications",
                  desc: "Send recommendations and progress updates to students",
                  value: notifications,
                  set: setNotifications,
                  id: "notifications",
                },
              ].map((setting) => (
                <div key={setting.id} className="flex items-center justify-between gap-4">
                  <div>
                    <Label htmlFor={setting.id} className="font-medium text-sm cursor-pointer">{setting.label}</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">{setting.desc}</p>
                  </div>
                  <Switch
                    id={setting.id}
                    checked={setting.value}
                    onCheckedChange={setting.set}
                  />
                </div>
              ))}
            </div>
          </section>


          <section className="rounded-xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Registered Users</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-3 text-muted-foreground font-medium text-xs">User</th>
                    <th className="pb-3 text-muted-foreground font-medium text-xs">Email</th>
                    <th className="pb-3 text-muted-foreground font-medium text-xs text-center">Role</th>
                    <th className="pb-3 text-muted-foreground font-medium text-xs">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {DEMO_USERS.map((u) => (
                    <tr key={u.id} className="hover:bg-muted/40 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                            {u.avatar}
                          </div>
                          <span className="font-medium text-foreground">{u.name}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground text-xs">{u.email}</td>
                      <td className="py-3 pr-4 text-center">
                        <Badge className={cn(
                          "text-xs border capitalize",
                          u.role === "admin" ? "bg-red-100 text-red-700 border-red-200" :
                          u.role === "instructor" ? "bg-blue-100 text-blue-700 border-blue-200" :
                          "bg-green-100 text-green-700 border-green-200"
                        )}>
                          {u.role}
                        </Badge>
                      </td>
                      <td className="py-3 text-xs text-muted-foreground">
                        {new Date(u.joinedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>


          <section className="rounded-xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Course Catalogue</h2>
            </div>
            <div className="divide-y divide-border">
              {DEMO_COURSES.map((c) => {
                const instructor = DEMO_USERS.find((u) => u.id === c.instructorId);
                const levelColour = {
                  Beginner: "bg-green-100 text-green-700 border-green-200",
                  Intermediate: "bg-blue-100 text-blue-700 border-blue-200",
                  Advanced: "bg-orange-100 text-orange-700 border-orange-200",
                  "300 Level": "bg-violet-100 text-violet-700 border-violet-200",
                }[c.level];
                return (
                  <div key={c.id} className="flex items-center gap-4 py-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm text-foreground">{c.title}</span>
                        <Badge className={cn("text-xs border", levelColour)}>{c.level}</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {c.category} · {c.modules.length} modules · {c.totalLessons} lessons · by {instructor?.name ?? "Unknown"}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-foreground">{c.enrolledCount}</p>
                      <p className="text-xs text-muted-foreground">enrolled</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>


        <div className="space-y-6">

          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm">System Status</h3>
            </div>
            <div className="space-y-2">
              {[
                { label: "LMS Platform", status: "Operational" },
                { label: "Adaptive Engine", status: adaptiveEnabled ? "Active" : "Disabled" },
                { label: "Database", status: "LocalStorage" },
                { label: "Authentication", status: "Demo Mode" },
                { label: "Quiz Engine", status: "Operational" },
              ].map(({ label, status }) => (
                <div key={label} className="flex items-center justify-between py-1">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <div className="flex items-center gap-1.5">
                    <div className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      status === "Operational" || status === "Active" || status === "LocalStorage" || status === "Demo Mode" ? "bg-green-500" : "bg-amber-400"
                    )} />
                    <span className="text-xs font-medium text-foreground">{status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>


          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm">Demo Credentials</h3>
            </div>
            <div className="space-y-2 text-xs">
              {DEMO_USERS.map((demoUser) => (
                <div key={demoUser.id} className="rounded-lg bg-muted p-2.5">
                  <div className="font-medium text-foreground">{demoUser.role === "instructor" ? "Instructor" : "Student"} · {demoUser.name}</div>
                  <div className="text-muted-foreground">{demoUser.email}</div>
                  <div className="text-muted-foreground">Password: demo$$123</div>
                </div>
              ))}
            </div>
          </div>


          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm">System Actions</h3>
            </div>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2 justify-start text-xs"
                onClick={handleResetDemo}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Reset Demo Progress Data
              </Button>
              {resetMsg && (
                <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  {resetMsg}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
