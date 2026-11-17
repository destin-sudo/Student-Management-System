"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, initializeDemoData } from "@/lib/storage";
import type { User } from "@/lib/data";

export function useAuth(required?: boolean) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    initializeDemoData();
    const current = getCurrentUser();
    setUser(current);
    setLoading(false);

    if (required && !current) {
      router.replace("/login");
    }
  }, [required, router]);

  const refresh = () => {
    const current = getCurrentUser();
    setUser(current);
  };

  return { user, loading, refresh };
}
