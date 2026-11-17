import Link from "next/link";
import { BookOpen, Clock, Star, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { Course } from "@/lib/data";
import type { CourseProgress } from "@/lib/data";
import { cn } from "@/lib/utils";

const levelColours = {
  Beginner: "bg-green-100 text-green-700 border-green-200",
  Intermediate: "bg-blue-100 text-blue-700 border-blue-200",
  Advanced: "bg-orange-100 text-orange-700 border-orange-200",
  "300 Level": "bg-violet-100 text-violet-700 border-violet-200",
};

interface CourseCardProps {
  course: Course;
  progress?: CourseProgress | null;
  enrolled?: boolean;
  onEnroll?: (courseId: string) => void;
  compact?: boolean;
}

export function CourseCard({ course, progress, enrolled, onEnroll, compact }: CourseCardProps) {
  const completedLessons = progress?.completedLessons.length ?? 0;
  const totalLessons = course.totalLessons;
  const progressPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className={cn(
      "group rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col",
      compact ? "text-sm" : ""
    )}>

      <div className={cn(
        "relative overflow-hidden",
        compact ? "h-24" : "h-36"
      )}>
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br",
          course.category === "Web Development" ? "from-blue-600 to-blue-800" :
          course.category === "Data Science" ? "from-teal-600 to-teal-800" :
          course.category === "Database" ? "from-indigo-600 to-indigo-800" :
          "from-slate-600 to-slate-800"
        )} />
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <BookOpen className={cn(compact ? "h-12 w-12" : "h-20 w-20", "text-white")} />
        </div>
        <div className="absolute top-2 right-2">
          <Badge className={cn("text-xs border", levelColours[course.level])}>
            {course.level}
          </Badge>
        </div>
        {progress?.completed && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-green-500 text-white text-xs border-0">Completed</Badge>
          </div>
        )}
      </div>


      <div className="flex flex-col flex-1 p-4 gap-3">
        <div>
          <h3 className={cn("font-semibold leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors", compact ? "text-sm" : "text-base")}>
            {course.title}
          </h3>
          {!compact && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
              {course.shortDescription}
            </p>
          )}
        </div>

        {!compact && (
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              {course.totalLessons} lessons
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {Math.round(course.totalDuration / 60)}h {course.totalDuration % 60}m
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {course.enrolledCount.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {course.rating}
            </span>
          </div>
        )}


        {enrolled && progress && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{completedLessons}/{totalLessons} lessons</span>
              <span>{progressPct}%</span>
            </div>
            <Progress value={progressPct} className="h-1.5" />
          </div>
        )}


        <div className="mt-auto pt-1">
          {enrolled ? (
            <Button asChild size="sm" className="w-full" variant={progressPct === 0 ? "default" : "outline"}>
              <Link href={`/courses/${course.id}`}>
                {progressPct === 0 ? "Start Course" : progress?.completed ? "Review Course" : "Continue Learning"}
              </Link>
            </Button>
          ) : (
            <Button
              size="sm"
              className="w-full"
              onClick={() => onEnroll?.(course.id)}
            >
              Enroll Free
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
