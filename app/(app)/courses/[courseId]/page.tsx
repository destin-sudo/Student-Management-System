"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpen, Clock, Users, Star, CheckCircle2, Circle, Lock,
  ChevronRight, GraduationCap, Target, Award, Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getCourseById, getQuizById } from "@/lib/data";
import {
  getCurrentUser, getCourseProgress, enrollInCourse, getUserProgress
} from "@/lib/storage";
import { cn } from "@/lib/utils";

export default function CourseDetailPage({ params }: { params: Promise<{ courseId: string }> }) {
  const router = useRouter();
  const { courseId } = use(params);
  const [user] = useState(getCurrentUser());
  const [progress, setProgress] = useState<ReturnType<typeof getCourseProgress>>(null);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    if (user) {
      const prog = getCourseProgress(user.id, courseId);
      setProgress(prog);
      setEnrolled(!!prog);
    }
  }, [courseId, user]);

  if (!user) return null;

  const course = getCourseById(courseId);
  if (!course) return (
    <div className="text-center py-20">
      <p className="text-muted-foreground">Course not found.</p>
      <Button asChild variant="link" className="mt-2"><Link href="/courses">Back to Courses</Link></Button>
    </div>
  );

  const completedLessons = progress?.completedLessons ?? [];
  const totalLessons = course.totalLessons;
  const progressPct = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;

  const handleEnroll = () => {
    if (!user) return;
    enrollInCourse(user.id, courseId);
    const prog = getCourseProgress(user.id, courseId);
    setProgress(prog);
    setEnrolled(true);
  };

  const getFirstLesson = () => {
    const mod = course.modules[0];
    const lesson = mod?.lessons[0];
    if (mod && lesson) return `/courses/${courseId}/learn/${mod.id}/${lesson.id}`;
    return null;
  };

  const getContinueLink = () => {
    if (!progress) return getFirstLesson();
    const modId = progress.currentModuleId ?? course.modules[0]?.id;
    const lessonId = progress.currentLessonId ?? course.modules[0]?.lessons[0]?.id;
    if (modId && lessonId) return `/courses/${courseId}/learn/${modId}/${lessonId}`;
    return getFirstLesson();
  };

  const levelColour = {
    Beginner: "bg-green-100 text-green-700 border-green-200",
    Intermediate: "bg-blue-100 text-blue-700 border-blue-200",
    Advanced: "bg-orange-100 text-orange-700 border-orange-200",
    "300 Level": "bg-violet-100 text-violet-700 border-violet-200",
  }[course.level];

  return (
    <div className="space-y-8">

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/courses" className="hover:text-foreground transition-colors">Courses</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium truncate">{course.title}</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2 space-y-6">

          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className={cn("border", levelColour)}>{course.level}</Badge>
              <Badge variant="outline">{course.category}</Badge>
              {course.tags.map((t) => (
                <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
              ))}
            </div>
            <h1 className="text-3xl font-bold text-foreground text-balance">{course.title}</h1>
            <p className="text-muted-foreground mt-3 leading-relaxed">{course.description}</p>
          </div>


          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              {course.totalLessons} lessons
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {Math.floor(course.totalDuration / 60)}h {course.totalDuration % 60}m
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              {course.enrolledCount.toLocaleString()} students
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
              {course.rating} rating
            </span>
            <span className="flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4" />
              {course.instructor}
            </span>
          </div>


          {enrolled && (
            <div className="rounded-xl border border-border bg-card p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Your Progress</span>
                <span className="text-muted-foreground">{completedLessons.length}/{totalLessons} lessons · {progressPct}%</span>
              </div>
              <Progress value={progressPct} className="h-2" />
              {progress?.completed && (
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <Award className="h-4 w-4" />
                  <span className="font-medium">Course completed!</span>
                </div>
              )}
            </div>
          )}


          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              What you'll learn
            </h2>
            <ul className="grid sm:grid-cols-2 gap-2">
              {course.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{obj}</span>
                </li>
              ))}
            </ul>
          </div>


          {course.prerequisites.length > 0 && (
            <div className="rounded-xl border border-border bg-muted/50 p-4">
              <h3 className="font-medium text-sm mb-2">Prerequisites</h3>
              <ul className="space-y-1">
                {course.prerequisites.map((p, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}


          <div>
            <h2 className="font-semibold text-lg mb-4">Course Curriculum</h2>
            <Accordion type="multiple" defaultValue={course.modules.map((m) => m.id)}>
              {course.modules.map((module) => {
                const moduleCompleted = module.lessons.every((l) => completedLessons.includes(l.id));
                const moduleProgress = module.lessons.filter((l) => completedLessons.includes(l.id)).length;
                const quiz = module.quizId ? getQuizById(module.quizId) : null;
                return (
                  <AccordionItem key={module.id} value={module.id} className="border rounded-xl mb-2 overflow-hidden">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
                      <div className="flex items-center gap-3 w-full text-left pr-2">
                        {moduleCompleted ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{module.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {moduleProgress}/{module.lessons.length} lessons
                            {quiz ? " · Quiz included" : ""}
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-0 pb-0">
                      <div className="border-t border-border divide-y divide-border">
                        {module.lessons.map((lesson) => {
                          const isComplete = completedLessons.includes(lesson.id);
                          const lessonLink = `/courses/${courseId}/learn/${module.id}/${lesson.id}`;
                          return (
                            <div key={lesson.id} className={cn(
                              "flex items-center gap-3 px-4 py-3 text-sm",
                              enrolled ? "hover:bg-muted/50" : ""
                            )}>
                              {isComplete ? (
                                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                              ) : enrolled ? (
                                <Play className="h-4 w-4 text-muted-foreground shrink-0" />
                              ) : (
                                <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
                              )}
                              <div className="flex-1 min-w-0">
                                {enrolled ? (
                                  <Link href={lessonLink} className="hover:text-primary transition-colors">
                                    {lesson.title}
                                  </Link>
                                ) : (
                                  <span className="text-muted-foreground">{lesson.title}</span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <Badge variant="outline" className="text-xs capitalize">{lesson.type}</Badge>
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {lesson.duration}m
                                </span>
                              </div>
                            </div>
                          );
                        })}
                        {quiz && (
                          <div className={cn(
                            "flex items-center gap-3 px-4 py-3 text-sm bg-primary/5",
                            enrolled ? "hover:bg-primary/10" : ""
                          )}>
                            <Award className="h-4 w-4 text-primary shrink-0" />
                            <div className="flex-1">
                              {enrolled ? (
                                <Link href={`/courses/${courseId}/quiz/${quiz.id}`} className="hover:text-primary transition-colors font-medium">
                                  {quiz.title}
                                </Link>
                              ) : (
                                <span className="text-muted-foreground">{quiz.title}</span>
                              )}
                              <p className="text-xs text-muted-foreground">{quiz.questions.length} questions · {quiz.passingScore}% to pass</p>
                            </div>
                            {enrolled && (
                              <Badge variant="outline" className="text-xs text-primary border-primary/30">Quiz</Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        </div>


        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border border-border bg-card shadow-sm p-6 space-y-4">

            <div className={cn(
              "rounded-lg h-36 flex items-center justify-center",
              course.category === "Web Development" ? "bg-gradient-to-br from-blue-500 to-blue-700" :
              course.category === "Data Science" ? "bg-gradient-to-br from-teal-500 to-teal-700" :
              "bg-gradient-to-br from-indigo-500 to-indigo-700"
            )}>
              <BookOpen className="h-16 w-16 text-white/30" />
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium text-foreground">Free</span>
                <span className="text-xs text-muted-foreground">{course.enrolledCount.toLocaleString()} enrolled</span>
              </div>
            </div>

            <Separator />

            {enrolled ? (
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span>{progressPct}%</span>
                  </div>
                  <Progress value={progressPct} className="h-2" />
                </div>
                <Button asChild className="w-full" size="lg">
                  <Link href={getContinueLink() ?? "#"}>
                    {progressPct === 0 ? "Start Learning" : progress?.completed ? "Review Course" : "Continue Learning"}
                  </Link>
                </Button>

                {course.modules.map((mod) => mod.quizId && (
                  <Button key={mod.quizId} asChild variant="outline" size="sm" className="w-full">
                    <Link href={`/courses/${courseId}/quiz/${mod.quizId}`}>
                      <Award className="h-4 w-4 mr-2" />
                      Take: {getQuizById(mod.quizId)?.title ?? "Quiz"}
                    </Link>
                  </Button>
                ))}
              </div>
            ) : user.role === "student" ? (
              <Button className="w-full" size="lg" onClick={handleEnroll}>
                Enroll Now — Free
              </Button>
            ) : (
              <Button asChild className="w-full" size="lg" variant="outline">
                <Link href={getFirstLesson() ?? "#"}>Preview Course</Link>
              </Button>
            )}

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Modules</span>
                <span className="font-medium">{course.modules.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lessons</span>
                <span className="font-medium">{course.totalLessons}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium">{Math.floor(course.totalDuration / 60)}h {course.totalDuration % 60}m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Level</span>
                <span className="font-medium">{course.level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Instructor</span>
                <span className="font-medium text-right text-xs">{course.instructor}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
