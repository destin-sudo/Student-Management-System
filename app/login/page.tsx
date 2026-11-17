"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Eye, EyeOff, GraduationCap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setCurrentUser, getCurrentUser, initializeDemoData } from "@/lib/storage";
import type { User } from "@/lib/data";
import { cn } from "@/lib/utils";

const DEMO_ACCOUNTS = [
  { name: "Destiny Ayegba", username: "RUN/CMP/24/17176", role: "Student" },
  { name: "Ayanbiyi Abiodun", username: "Run/cmp/24/17174", role: "Student" },
  { name: "Inioluwa Ayandare", username: "run/cmp/24/17175", role: "Student" },
  { name: "Adeshola Emiloju", username: "run/cmp/24/17189", role: "Student" },
  { name: "Kolawole Balogun", username: "run/cmp/24/17178", role: "Student" },
  { name: "Miss Oluwaseun Amore", username: "instructor", role: "Instructor" },
];

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initializeDemoData();
    if (getCurrentUser()) router.replace("/dashboard");
  }, [router]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: username, password }),
      });
      const result = await response.json() as { user?: Omit<User, "password">; error?: string };
      if (!response.ok || !result.user) throw new Error(result.error ?? "Sign-in failed. Check your details and try again.");
      setCurrentUser({ ...result.user, password: "" });
      router.push("/dashboard");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to sign in right now.");
    } finally {
      setLoading(false);
    }
  };

  const selectAccount = (account: (typeof DEMO_ACCOUNTS)[number]) => {
    setUsername(account.username);
    setPassword("demo$$123");
    setError("");
  };

  return (
    <main className="min-h-screen bg-background lg:grid lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden min-h-screen flex-col justify-between overflow-hidden bg-sidebar p-12 text-sidebar-foreground lg:flex">
        <div className="absolute inset-0 bg-gradient-to-br from-sidebar via-sidebar to-sidebar-accent" />
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-accent text-accent-foreground"><GraduationCap /></div>
            <div><p className="text-xl font-bold">LevelUp</p><p className="text-xs text-sidebar-foreground/60">Adaptive Learning Portal</p></div>
          </div>
          <div className="mt-24 max-w-lg">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">300 level · 2025/26</p>
            <h1 className="mt-5 text-5xl font-bold leading-tight">Your semester, made personal.</h1>
            <p className="mt-5 max-w-md text-base leading-7 text-sidebar-foreground/70">A focused learning space for Computer Science and Information Technology students, with course materials, progress tracking, and adaptive practice.</p>
          </div>
          <div className="mt-12 grid max-w-lg grid-cols-2 gap-3">
            {[
              { icon: <BookOpen />, title: "11 course units", detail: "Core 300-level modules" },
              { icon: <Users />, title: "6 demo accounts", detail: "Five students and instructor" },
            ].map((item) => <div key={item.title} className="rounded-2xl border border-sidebar-border bg-sidebar/50 p-4"><div className="text-accent">{item.icon}</div><p className="mt-3 text-sm font-semibold">{item.title}</p><p className="mt-1 text-xs text-sidebar-foreground/60">{item.detail}</p></div>)}
          </div>
        </div>
        <p className="relative z-10 text-xs text-sidebar-foreground/50">Academic demo · Student data and learning activity are sample data</p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-xl">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-2"><div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"><GraduationCap /></div><span className="text-xl font-bold">LevelUp</span></div>
            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-primary">300-level learning portal</p>
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
            <p className="mt-2 text-sm text-muted-foreground">Sign in with your matric number or choose a demo account.</p>
          </div>

          <div className="mt-7">
            <div className="mb-3 flex items-center justify-between"><p className="text-sm font-semibold">Demo credentials</p><span className="text-xs text-muted-foreground">Password: demo$$123</span></div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {DEMO_ACCOUNTS.map((account) => (
                <button key={account.username} type="button" onClick={() => selectAccount(account)} className={cn("rounded-xl border p-3 text-left transition-colors hover:border-primary/60 hover:bg-primary/5", username.toLowerCase() === account.username.toLowerCase() ? "border-primary bg-primary/5" : "border-border bg-card")}>
                  <span className="block text-[10px] font-semibold uppercase tracking-wide text-primary">{account.role}</span>
                  <span className="mt-1 block text-sm font-semibold leading-5">{account.name}</span>
                  <span className="mt-1 block break-all text-[10px] leading-4 text-muted-foreground">{account.username}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleLogin} className="mt-7 flex flex-col gap-4">
            <div className="flex flex-col gap-2"><Label htmlFor="username">Matric number or username</Label><Input id="username" type="text" placeholder="RUN/CMP/24/17176" value={username} onChange={(event) => setUsername(event.target.value)} required autoComplete="username" /></div>
            <div className="flex flex-col gap-2"><Label htmlFor="password">Password</Label><div className="relative"><Input id="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" className="pr-11" /><button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></div></div>
            {error && <p role="alert" className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
            <Button type="submit" className="mt-1 w-full" disabled={loading}>{loading ? "Signing in…" : "Sign in to your workspace"}</Button>
          </form>
          <p className="mt-5 text-center text-xs text-muted-foreground">Demo mode · All course and learner activity is sample data.</p>
        </div>
      </section>
    </main>
  );
}
