"use client";

import { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft, ChevronRight, CheckCircle2, Circle, BookOpen,
  Clock, Award, Menu, X, FileText, Layers, Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { getCourseById, getQuizById, type Lesson, type Module } from "@/lib/data";
import {
  getCurrentUser, getCourseProgress, markLessonComplete, updateCurrentLesson,
} from "@/lib/storage";
import { cn } from "@/lib/utils";

interface PageParams {
  courseId: string;
  moduleId: string;
  lessonId: string;
}

function LessonContent({ content }: { content: string }) {

  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("# ")) {
      elements.push(<h1 key={i} className="text-2xl font-bold text-foreground mt-0 mb-4">{line.slice(2)}</h1>);
    } else if (line.startsWith("## ")) {
      elements.push(<h2 key={i} className="text-xl font-semibold text-foreground mt-8 mb-3">{line.slice(3)}</h2>);
    } else if (line.startsWith("### ")) {
      elements.push(<h3 key={i} className="text-base font-semibold text-foreground mt-6 mb-2">{line.slice(4)}</h3>);
    } else if (line.startsWith("```")) {

      const lang = line.slice(3);
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <div key={i} className="my-4">
          {lang && <div className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-t-md border border-b-0 border-border font-mono">{lang}</div>}
          <pre className={cn("bg-sidebar text-sidebar-foreground text-sm rounded-md p-4 overflow-x-auto leading-relaxed font-mono", lang ? "rounded-t-none border border-sidebar-border" : "rounded-md border border-sidebar-border")}>
            <code>{codeLines.join("\n")}</code>
          </pre>
        </div>
      );
    } else if (line.startsWith("- **")) {

      const match = line.match(/^- \*\*(.+?)\*\*(.*)$/);
      if (match) {
        elements.push(
          <li key={i} className="ml-4 mb-1 text-sm leading-relaxed">
            <strong className="font-semibold">{match[1]}</strong>{match[2]}
          </li>
        );
      } else {
        elements.push(<li key={i} className="ml-4 mb-1 text-sm leading-relaxed">{line.slice(2)}</li>);
      }
    } else if (line.startsWith("- ")) {
      elements.push(<li key={i} className="ml-4 mb-1 text-sm leading-relaxed list-disc">{line.slice(2)}</li>);
    } else if (line.match(/^\d+\. /)) {
      elements.push(<li key={i} className="ml-4 mb-1 text-sm leading-relaxed list-decimal">{line.replace(/^\d+\. /, "")}</li>);
    } else if (line === "") {
      elements.push(<div key={i} className="h-3" />);
    } else {

      const formatted = line
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/`(.+?)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">$1</code>');
      elements.push(
        <p key={i} className="text-sm leading-relaxed text-foreground mb-2"
          dangerouslySetInnerHTML={{ __html: formatted }} />
      );
    }
    i++;
  }

  return <div className="prose-sm max-w-none">{elements}</div>;
}

function CourseSidebar({
  course,
  currentModuleId,
  currentLessonId,
  completedLessons,
  onNavigate,
}: {
  course: NonNullable<ReturnType<typeof getCourseById>>;
  currentModuleId: string;
  currentLessonId: string;
  completedLessons: string[];
  onNavigate: () => void;
}) {
  const progressPct = Math.round((completedLessons.length / course.totalLessons) * 100);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-sidebar-border">
        <Link href={`/courses/${course.id}`} className="flex items-center gap-2 text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors text-sm mb-3">
          <ChevronLeft className="h-3.5 w-3.5" />
          Back to course
        </Link>
        <h2 className="font-semibold text-sidebar-foreground text-sm leading-tight">{course.title}</h2>
        <div className="mt-2 space-y-1">
          <div className="flex justify-between text-xs text-sidebar-foreground/60">
            <span>{completedLessons.length}/{course.totalLessons} lessons</span>
            <span>{progressPct}%</span>
          </div>
          <Progress value={progressPct} className="h-1.5" />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {course.modules.map((module) => {
            const isCurrentModule = module.id === currentModuleId;
            const quiz = module.quizId ? getQuizById(module.quizId) : null;

            return (
              <div key={module.id}>
                <div className={cn(
                  "px-3 py-2 rounded-md text-xs font-semibold uppercase tracking-wide",
                  isCurrentModule ? "text-sidebar-primary" : "text-sidebar-foreground/50"
                )}>
                  <div className="flex items-center gap-1.5">
                    <Layers className="h-3 w-3" />
                    {module.title}
                  </div>
                </div>
                {module.lessons.map((lesson) => {
                  const isCurrent = lesson.id === currentLessonId;
                  const isComplete = completedLessons.includes(lesson.id);
                  return (
                    <Link
                      key={lesson.id}
                      href={`/courses/${course.id}/learn/${module.id}/${lesson.id}`}
                      onClick={onNavigate}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2 rounded-md text-xs transition-colors",
                        isCurrent
                          ? "bg-sidebar-accent text-sidebar-foreground font-medium"
                          : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                      )}
                    >
                      {isComplete ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-sidebar-primary shrink-0" />
                      ) : (
                        <Circle className="h-3.5 w-3.5 text-sidebar-foreground/30 shrink-0" />
                      )}
                      <span className="truncate flex-1">{lesson.title}</span>
                      <span className="text-sidebar-foreground/40 shrink-0">{lesson.duration}m</span>
                    </Link>
                  );
                })}
                {quiz && (
                  <Link
                    href={`/courses/${course.id}/quiz/${quiz.id}`}
                    onClick={onNavigate}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-md text-xs text-sidebar-primary/80 hover:text-sidebar-primary hover:bg-sidebar-accent/50 transition-colors"
                  >
                    <Award className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate flex-1">{quiz.title}</span>
                    <Badge variant="outline" className="text-[10px] border-sidebar-border text-sidebar-foreground/50 h-4 px-1">Quiz</Badge>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

export default function LessonPage({ params }: { params: Promise<PageParams> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { courseId, moduleId, lessonId } = resolvedParams;

  const user = getCurrentUser();
  const course = getCourseById(courseId);
  const module = course?.modules.find((m) => m.id === moduleId);
  const lesson = module?.lessons.find((l) => l.id === lessonId);

  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [markedComplete, setMarkedComplete] = useState(false);
  const [timeStarted] = useState(Date.now());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) { router.replace("/login"); return; }
    const prog = getCourseProgress(user.id, courseId);
    setCompletedLessons(prog?.completedLessons ?? []);
    setMarkedComplete(prog?.completedLessons.includes(lessonId) ?? false);


    updateCurrentLesson(user.id, courseId, moduleId, lessonId);


    contentRef.current?.scrollTo(0, 0);
  }, [courseId, moduleId, lessonId, user?.id]);

  if (!user || !course || !module || !lesson) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
        Lesson not found. <Link href="/courses" className="ml-2 text-primary underline">Back to courses</Link>
      </div>
    );
  }

  const handleMarkComplete = () => {
    const timeSpent = Math.round((Date.now() - timeStarted) / 60000);
    markLessonComplete(user.id, courseId, lessonId, Math.max(timeSpent, 1));
    setMarkedComplete(true);
    const prog = getCourseProgress(user.id, courseId);
    setCompletedLessons(prog?.completedLessons ?? []);
  };


  const allLessonsFlat: { moduleId: string; lesson: Lesson }[] = course.modules.flatMap((m) =>
    m.lessons.map((l) => ({ moduleId: m.id, lesson: l }))
  );
  const currentIndex = allLessonsFlat.findIndex((x) => x.lesson.id === lessonId);
  const prevEntry = currentIndex > 0 ? allLessonsFlat[currentIndex - 1] : null;
  const nextEntry = currentIndex < allLessonsFlat.length - 1 ? allLessonsFlat[currentIndex + 1] : null;
  const quiz = module.quizId ? getQuizById(module.quizId) : null;
  const isLastInModule = module.lessons[module.lessons.length - 1]?.id === lessonId;

  const typeIcon = lesson.type === "video" ? "Video" : lesson.type === "interactive" ? "Interactive" : "Reading";

  return (
    <div className="-mx-4 -my-8 flex h-[calc(100vh-73px)]">

      <aside className="hidden lg:flex w-72 xl:w-80 shrink-0 bg-sidebar flex-col border-r border-sidebar-border">
        <CourseSidebar
          course={course}
          currentModuleId={moduleId}
          currentLessonId={lessonId}
          completedLessons={completedLessons}
          onNavigate={() => {}}
        />
      </aside>


      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card shrink-0">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0 bg-sidebar border-sidebar-border">
              <CourseSidebar
                course={course}
                currentModuleId={moduleId}
                currentLessonId={lessonId}
                completedLessons={completedLessons}
                onNavigate={() => setSidebarOpen(false)}
              />
            </SheetContent>
          </Sheet>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Link href="/dashboard" className="hover:text-foreground transition-colors flex items-center gap-1">
                <Home className="h-3 w-3" /> Dashboard
              </Link>
              <ChevronRight className="h-3 w-3" />
              <Link href={`/courses/${courseId}`} className="hover:text-foreground transition-colors truncate max-w-[120px]">{course.title}</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground truncate">{lesson.title}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="outline" className="text-xs hidden sm:flex">{typeIcon}</Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />{lesson.duration}m
            </span>
          </div>
        </div>


        <div className="flex-1 overflow-y-auto" ref={contentRef}>
          <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8">

            <div className="mb-6">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <FileText className="h-3.5 w-3.5" />
                <span>{module.title}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground text-balance">{lesson.title}</h1>
            </div>

            <Separator className="mb-8" />


            <div className="leading-relaxed">
              <LessonContent content={lesson.content} />
            </div>

            <Separator className="my-8" />


            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm">Lesson complete?</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Mark this lesson as done to track your progress.</p>
                </div>
                {markedComplete ? (
                  <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                    <CheckCircle2 className="h-5 w-5" />
                    Completed
                  </div>
                ) : (
                  <Button onClick={handleMarkComplete} size="sm" className="gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Mark Complete
                  </Button>
                )}
              </div>

              {isLastInModule && quiz && (
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-3">
                    You have completed all lessons in <strong>{module.title}</strong>. Ready to test your knowledge?
                  </p>
                  <Button asChild variant="outline" className="gap-2 border-primary/40 text-primary hover:bg-primary/5">
                    <Link href={`/courses/${courseId}/quiz/${quiz.id}`}>
                      <Award className="h-4 w-4" />
                      Take Module Quiz: {quiz.title}
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>


        <div className="shrink-0 border-t border-border bg-card px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex-1">
            {prevEntry ? (
              <Link
                href={`/courses/${courseId}/learn/${prevEntry.moduleId}/${prevEntry.lesson.id}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                <div className="hidden sm:block">
                  <div className="text-xs text-muted-foreground">Previous</div>
                  <div className="text-sm font-medium text-foreground truncate max-w-[200px]">{prevEntry.lesson.title}</div>
                </div>
                <span className="sm:hidden">Previous</span>
              </Link>
            ) : (
              <div />
            )}
          </div>

          <div className="text-xs text-muted-foreground shrink-0">
            {currentIndex + 1} / {allLessonsFlat.length}
          </div>

          <div className="flex-1 flex justify-end">
            {nextEntry ? (
              <Link
                href={`/courses/${courseId}/learn/${nextEntry.moduleId}/${nextEntry.lesson.id}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                <div className="hidden sm:block text-right">
                  <div className="text-xs text-muted-foreground">Next</div>
                  <div className="text-sm font-medium text-foreground truncate max-w-[200px]">{nextEntry.lesson.title}</div>
                </div>
                <span className="sm:hidden">Next</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ) : quiz ? (
              <Link
                href={`/courses/${courseId}/quiz/${quiz.id}`}
                className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
              >
                <span>Take Quiz</span>
                <Award className="h-4 w-4" />
              </Link>
            ) : (
              <Link
                href={`/courses/${courseId}`}
                className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
              >
                <span>Finish Course</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
