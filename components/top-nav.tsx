"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Brain, GraduationCap, LayoutDashboard, LogOut, Settings, Users, BarChart3, Menu, X, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { logoutUser } from "@/lib/storage";
import type { User } from "@/lib/data";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  roles: string[];
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" />, roles: ["student", "instructor", "admin"] },
  { href: "/courses", label: "Courses", icon: <BookOpen className="h-4 w-4" />, roles: ["student", "instructor", "admin"] },
  { href: "/progress", label: "My Progress", icon: <GraduationCap className="h-4 w-4" />, roles: ["student"] },
  { href: "/adaptive", label: "Adaptive Tech", icon: <Brain className="h-4 w-4" />, roles: ["student", "instructor", "admin"] },
  { href: "/analytics", label: "Analytics", icon: <BarChart3 className="h-4 w-4" />, roles: ["instructor", "admin"] },
  { href: "/students", label: "Students", icon: <Users className="h-4 w-4" />, roles: ["instructor", "admin"] },
  { href: "/admin", label: "Admin Panel", icon: <Settings className="h-4 w-4" />, roles: ["admin"] },
];

interface TopNavProps {
  user: User;
  currentPath?: string;
}

export function TopNav({ user, currentPath = "" }: TopNavProps) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const visibleItems = NAV_ITEMS.filter((item) => item.roles.includes(user.role));

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => undefined);
    logoutUser();
    router.push("/login");
  };

  const roleColour =
    user.role === "admin"
      ? "bg-destructive text-destructive-foreground"
      : user.role === "instructor"
      ? "bg-accent text-accent-foreground"
      : "bg-primary text-primary-foreground";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-sidebar text-sidebar-foreground shadow-md">
      <div className="mx-auto max-w-screen-xl px-4">
        <div className="flex h-16 items-center justify-between gap-4">

          <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <GraduationCap className="h-5 w-5 text-accent-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight text-sidebar-foreground">
              Level<span className="text-accent">Up</span>
            </span>
          </Link>


          <nav className="hidden md:flex items-center gap-1">
            {visibleItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  currentPath.startsWith(item.href)
                    ? "bg-sidebar-accent text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>


          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent hidden md:flex">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
            </Button>


            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 hover:bg-sidebar-accent px-2 h-9">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-accent text-accent-foreground text-xs font-bold">
                      {user.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-sm font-medium text-sidebar-foreground truncate max-w-[120px]">
                    {user.name}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold">{user.name}</span>
                    <span className="text-xs text-muted-foreground font-normal">{user.email}</span>
                    <Badge className={cn("w-fit text-xs capitalize mt-1", roleColour)}>
                      {user.role}
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <Settings className="mr-2 h-4 w-4" />
                    Profile & Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>


            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-sidebar-foreground hover:bg-sidebar-accent"
              aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>


      {mobileOpen && (
        <div className="md:hidden border-t border-sidebar-border bg-sidebar px-4 pb-4 pt-2">
          <nav className="flex flex-col gap-1">
            {visibleItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  currentPath.startsWith(item.href)
                    ? "bg-sidebar-accent text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
