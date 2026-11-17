"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { initializeDemoData, getCurrentUser } from "@/lib/storage";

export default function HomePage() {
  const router = useRouter();
  const redirected = useRef(false);

  useEffect(() => {
    if (redirected.current) return;
    redirected.current = true;
    initializeDemoData();
    const user = getCurrentUser();
    if (user) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
        <p className="text-sm text-muted-foreground">Loading LevelUp...</p>
      </div>
    </div>
  );
}
