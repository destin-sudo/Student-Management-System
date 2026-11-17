"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { initializeDemoData, getCurrentUser } from "@/lib/storage";
import { TopNav } from "@/components/top-nav";
import type { User } from "@/lib/data";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    initializeDemoData();
    const current = getCurrentUser();
    if (!current) {
      router.replace("/login");
    } else {
      setUser(current);
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <TopNav user={user} currentPath={pathname} />
      <main className="mx-auto max-w-screen-xl px-4 py-8">
        {children}
      </main>
    </div>
  );
}
