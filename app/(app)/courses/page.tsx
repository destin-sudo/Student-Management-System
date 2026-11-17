"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Search, Filter, BookOpen, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CourseCard } from "@/components/course-card";
import { getCurrentUser, getUserProgress, enrollInCourse } from "@/lib/storage";
import { DEMO_COURSES, type Course } from "@/lib/data";
import { cn } from "@/lib/utils";

const LEVELS = ["All", "300 Level"] as const;
const CATEGORIES = ["All", "Data Structures", "Operating Systems", "Innovation", "Data Management", "Networking", "Software Engineering", "Data Science", "General Studies", "Web Development", "Database"] as const;

type CatalogRecord = { id: string; code: string; title: string; description: string; category: string; level: string; instructor: string; };
type CatalogResponse = { courses: CatalogRecord[]; total: number };
const fetcher = async (url: string): Promise<CatalogResponse> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Unable to load courses from the SQL API.");
  return response.json();
};

export default function CoursesPage() {
  const router = useRouter();
  const [user] = useState(getCurrentUser());
  const [userProgress, setUserProgress] = useState(user ? getUserProgress(user.id) : null);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState<string>("All");
  const [category, setCategory] = useState<string>("All");

  useEffect(() => {
    if (!user) { router.replace("/login"); return; }
    setUserProgress(getUserProgress(user.id));
  }, [user, router]);

  const { data: catalogData } = useSWR("/api/courses", fetcher);
  const courses: Course[] = catalogData
    ? catalogData.courses.flatMap((record) => {
        const template = DEMO_COURSES.find((course) => course.id === record.id);
        return template ? [{
          ...template,
          title: `${record.code} · ${record.title}`,
          description: record.description,
          shortDescription: record.description,
          category: record.category,
          instructor: record.instructor,
          level: "300 Level",
        }] : [];
      })
    : DEMO_COURSES;

  const filtered = courses.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchLevel = level === "All" || c.level === level;
    const matchCat = category === "All" || c.category === category;
    return matchSearch && matchLevel && matchCat;
  });

  const getCourseProgress = (courseId: string) =>
    userProgress?.courses.find((c) => c.courseId === courseId) ?? null;

  const isEnrolled = (courseId: string) =>
    !!userProgress?.courses.find((c) => c.courseId === courseId);

  const handleEnroll = (courseId: string) => {
    if (!user) return;
    enrollInCourse(user.id, courseId);
    setUserProgress(getUserProgress(user.id));
    router.push(`/courses/${courseId}`);
  };

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold text-foreground">Course Catalogue</h1>
        <p className="text-muted-foreground mt-1">
          Browse {courses.length} courses across the 300-level curriculum
        </p>
      </div>


      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, topic, or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Level:</span>
          </div>
          {LEVELS.map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium border transition-colors",
                level === l
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-foreground border-border hover:border-primary/50"
              )}
            >
              {l}
            </button>
          ))}
          <div className="w-px h-4 bg-border mx-1" />
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">Category:</span>
          </div>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium border transition-colors",
                category === c
                  ? "bg-accent text-accent-foreground border-accent"
                  : "bg-background text-foreground border-border hover:border-accent/50"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>


      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <span>{filtered.length} course{filtered.length !== 1 ? "s" : ""} found</span>
        {user?.role === "student" && (
          <>
            <span>·</span>
            <span>{userProgress?.courses.length ?? 0} enrolled</span>
          </>
        )}
      </div>


      {filtered.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-border p-12 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium text-foreground">No courses found</p>
          <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => { setSearch(""); setLevel("All"); setCategory("All"); }}>
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              progress={getCourseProgress(course.id)}
              enrolled={isEnrolled(course.id)}
              onEnroll={user?.role === "student" ? handleEnroll : undefined}
            />
          ))}
        </div>
      )}


      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
          Platform Highlights
        </h2>
        <div className="grid sm:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">{DEMO_COURSES.reduce((s, c) => s + c.enrolledCount, 0).toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Total enrollments</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">
              {(DEMO_COURSES.reduce((s, c) => s + c.rating, 0) / DEMO_COURSES.length).toFixed(1)}
            </p>
            <p className="text-sm text-muted-foreground">Average rating</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">
              {DEMO_COURSES.reduce((s, c) => s + c.totalLessons, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Total lessons</p>
          </div>
        </div>
      </div>
    </div>
  );
}
