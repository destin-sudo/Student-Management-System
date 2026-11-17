"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Clock, ChevronLeft, ChevronRight, CheckCircle2, XCircle,
  Award, RotateCcw, BookOpen, AlertCircle, Timer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { getQuizById, getCourseById } from "@/lib/data";
import {
  getCurrentUser, saveQuizAttempt, getAdaptiveFeedback, getCourseProgress,
} from "@/lib/storage";

interface PageParams {
  courseId: string;
  quizId: string;
}

type QuizState = "intro" | "active" | "review" | "results";

export default function QuizPage({ params }: { params: Promise<PageParams> }) {
  const router = useRouter();
  const { courseId, quizId } = use(params);

  const user = getCurrentUser();
  const quiz = getQuizById(quizId);
  const course = getCourseById(courseId);

  const [state, setState] = useState<QuizState>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!user) { router.replace("/login"); return; }
    if (quiz) setTimeLeft((quiz.timeLimit ?? 20) * 60);
  }, [quiz, user?.id]);


  useEffect(() => {
    if (state !== "active" || submitted) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          handleSubmit(selectedAnswers);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [state, submitted]);

  if (!user || !quiz || !course) {
    return (
      <div className="text-center py-20 text-muted-foreground text-sm">
        Quiz not found. <Link href="/courses" className="text-primary underline">Back to courses</Link>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleStart = () => {
    setSelectedAnswers(new Array(quiz.questions.length).fill(null));
    setStartTime(Date.now());
    setCurrentQ(0);
    setSubmitted(false);
    setState("active");
  };

  const handleSelect = (optionIndex: number) => {
    if (submitted) return;
    const updated = [...selectedAnswers];
    updated[currentQ] = optionIndex;
    setSelectedAnswers(updated);
  };

  const handleSubmit = (answers: (number | null)[]) => {
    if (submitted) return;
    setSubmitted(true);

    const correctCount = quiz.questions.filter(
      (q, i) => answers[i] === q.correctAnswer
    ).length;
    const score = Math.round((correctCount / quiz.questions.length) * 100);
    const timeTaken = Math.round((Date.now() - startTime) / 1000);

    const attempt = {
      quizId,
      score,
      totalQuestions: quiz.questions.length,
      correctAnswers: correctCount,
      answers: answers.map((a) => a ?? -1),
      completedAt: new Date().toISOString(),
      timeTaken,
    };

    saveQuizAttempt(user.id, courseId, attempt);
    setState("results");
  };

  const prevAttempts = getCourseProgress(user.id, courseId)?.quizAttempts.filter(
    (a) => a.quizId === quizId
  ) ?? [];


  if (state === "intro") {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href={`/courses/${courseId}`} className="hover:text-foreground transition-colors flex items-center gap-1">
            <ChevronLeft className="h-3.5 w-3.5" />{course.title}
          </Link>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 space-y-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Award className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{quiz.title}</h1>
            <p className="text-muted-foreground mt-2 leading-relaxed">{quiz.description}</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl bg-muted p-4">
              <p className="text-2xl font-bold text-foreground">{quiz.questions.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Questions</p>
            </div>
            <div className="rounded-xl bg-muted p-4">
              <p className="text-2xl font-bold text-foreground">{quiz.timeLimit}m</p>
              <p className="text-xs text-muted-foreground mt-1">Time Limit</p>
            </div>
            <div className="rounded-xl bg-muted p-4">
              <p className="text-2xl font-bold text-foreground">{quiz.passingScore}%</p>
              <p className="text-xs text-muted-foreground mt-1">Pass Mark</p>
            </div>
          </div>

          {prevAttempts.length > 0 && (
            <div className="rounded-xl border border-border p-4 text-left space-y-2">
              <p className="text-sm font-medium">Previous Attempts</p>
              <div className="space-y-1">
                {prevAttempts.slice(-3).reverse().map((a, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-muted-foreground text-xs">
                      {new Date(a.completedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                    <span className={cn("font-semibold text-xs", a.score >= quiz.passingScore ? "text-green-600" : "text-destructive")}>
                      {a.score}% {a.score >= quiz.passingScore ? "(Passed)" : "(Failed)"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-left flex items-start gap-3">
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-800 leading-relaxed">
              Once started, the timer cannot be paused. Answer all questions before time runs out. Each question has one correct answer.
            </div>
          </div>

          <Button onClick={handleStart} size="lg" className="w-full gap-2">
            <Award className="h-5 w-5" />
            Start Quiz
          </Button>
        </div>
      </div>
    );
  }


  if (state === "results") {
    const correctCount = quiz.questions.filter((q, i) => selectedAnswers[i] === q.correctAnswer).length;
    const score = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;
    const feedback = getAdaptiveFeedback(score);
    const timeTaken = prevAttempts.length > 0 ? prevAttempts[prevAttempts.length - 1].timeTaken : 0;

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href={`/courses/${courseId}`} className="hover:text-foreground transition-colors flex items-center gap-1">
            <ChevronLeft className="h-3.5 w-3.5" />{course.title}
          </Link>
        </div>


        <div className={cn(
          "rounded-2xl p-8 text-center space-y-4 border",
          passed ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
        )}>
          <div className={cn(
            "mx-auto flex h-20 w-20 items-center justify-center rounded-full",
            passed ? "bg-green-100" : "bg-red-100"
          )}>
            {passed
              ? <CheckCircle2 className="h-10 w-10 text-green-600" />
              : <XCircle className="h-10 w-10 text-red-600" />
            }
          </div>
          <div>
            <p className={cn("text-5xl font-bold", passed ? "text-green-700" : "text-red-700")}>{score}%</p>
            <p className={cn("text-lg font-semibold mt-2", passed ? "text-green-800" : "text-red-800")}>{feedback.title}</p>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-sm mx-auto">{feedback.message}</p>
          </div>
          <div className="flex justify-center gap-6 pt-2">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{correctCount}/{quiz.questions.length}</p>
              <p className="text-xs text-muted-foreground">Correct</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{formatTime(timeTaken)}</p>
              <p className="text-xs text-muted-foreground">Time Taken</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{quiz.passingScore}%</p>
              <p className="text-xs text-muted-foreground">Pass Mark</p>
            </div>
          </div>
        </div>


        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setState("review")} variant="outline" className="flex-1 gap-2">
            <BookOpen className="h-4 w-4" />
            Review Answers
          </Button>
          <Button onClick={handleStart} variant="outline" className="flex-1 gap-2">
            <RotateCcw className="h-4 w-4" />
            Retake Quiz
          </Button>
          <Button asChild className="flex-1 gap-2">
            <Link href={`/courses/${courseId}`}>
              Back to Course
            </Link>
          </Button>
        </div>


        {!passed && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
            <BookOpen className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-900">Adaptive Recommendation</p>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                Your score of {score}% is below the {quiz.passingScore}% pass mark. Our adaptive system suggests revisiting the course lessons before retaking. Focus on the topics you found most challenging.
              </p>
              <Button asChild size="sm" variant="link" className="text-amber-700 px-0 mt-1 h-auto text-xs">
                <Link href={`/courses/${courseId}`}>Go back to lessons</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }


  if (state === "review") {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => setState("results")} className="gap-2 text-muted-foreground">
            <ChevronLeft className="h-4 w-4" /> Back to Results
          </Button>
          <h2 className="font-semibold">Answer Review</h2>
          <div />
        </div>

        <div className="space-y-4">
          {quiz.questions.map((q, qi) => {
            const userAnswer = selectedAnswers[qi];
            const isCorrect = userAnswer === q.correctAnswer;
            const difficultyColour = {
              beginner: "bg-green-100 text-green-700 border-green-200",
              intermediate: "bg-blue-100 text-blue-700 border-blue-200",
              advanced: "bg-orange-100 text-orange-700 border-orange-200",
            }[q.difficulty];

            return (
              <div key={q.id} className={cn(
                "rounded-xl border p-5 space-y-4",
                isCorrect ? "border-green-200 bg-green-50/50" : "border-red-200 bg-red-50/50"
              )}>
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold mt-0.5",
                    isCorrect ? "bg-green-600 text-white" : "bg-red-600 text-white"
                  )}>
                    {qi + 1}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap gap-2 items-center">
                      <Badge className={cn("text-xs border capitalize", difficultyColour)}>{q.difficulty}</Badge>
                      <span className="text-xs text-muted-foreground">{q.topic}</span>
                    </div>
                    <p className="font-medium text-sm text-foreground">{q.question}</p>
                  </div>
                  {isCorrect
                    ? <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                    : <XCircle className="h-5 w-5 text-red-600 shrink-0" />
                  }
                </div>

                <div className="space-y-2 ml-9">
                  {q.options.map((option, oi) => {
                    const isUserChoice = userAnswer === oi;
                    const isCorrectOption = q.correctAnswer === oi;
                    return (
                      <div key={oi} className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm border",
                        isCorrectOption ? "border-green-400 bg-green-100 text-green-900" :
                        isUserChoice && !isCorrectOption ? "border-red-300 bg-red-100 text-red-900" :
                        "border-border bg-background text-muted-foreground"
                      )}>
                        <span className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                          isCorrectOption ? "bg-green-600 text-white" :
                          isUserChoice ? "bg-red-500 text-white" :
                          "bg-muted text-muted-foreground"
                        )}>
                          {String.fromCharCode(65 + oi)}
                        </span>
                        <span className="flex-1">{option}</span>
                        {isCorrectOption && <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />}
                        {isUserChoice && !isCorrectOption && <XCircle className="h-4 w-4 text-red-500 shrink-0" />}
                      </div>
                    );
                  })}
                </div>


                <div className="ml-9 rounded-lg bg-blue-50 border border-blue-200 p-3 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-900 leading-relaxed">{q.explanation}</p>
                </div>
              </div>
            );
          })}
        </div>

        <Button onClick={() => setState("results")} className="w-full gap-2">
          <ChevronLeft className="h-4 w-4" />
          Back to Results
        </Button>
      </div>
    );
  }


  const question = quiz.questions[currentQ];
  const totalQ = quiz.questions.length;
  const answeredCount = selectedAnswers.filter((a) => a !== null).length;
  const progressPct = Math.round((answeredCount / totalQ) * 100);
  const isLastQ = currentQ === totalQ - 1;
  const timeWarning = timeLeft <= 60;

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-lg">{quiz.title}</h1>
          <p className="text-xs text-muted-foreground">{answeredCount}/{totalQ} answered</p>
        </div>
        <div className={cn(
          "flex items-center gap-2 rounded-xl px-4 py-2 font-mono font-bold text-sm",
          timeWarning ? "bg-red-100 text-red-700 border border-red-300" : "bg-muted text-foreground border border-border"
        )}>
          <Timer className="h-4 w-4" />
          {formatTime(timeLeft)}
        </div>
      </div>


      <div className="space-y-1.5">
        <Progress value={progressPct} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Question {currentQ + 1} of {totalQ}</span>
          <span>{progressPct}% answered</span>
        </div>
      </div>


      <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">
              {currentQ + 1}
            </span>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs capitalize">{question.difficulty}</Badge>
              <Badge variant="secondary" className="text-xs">{question.topic}</Badge>
            </div>
          </div>
          <p className="text-base font-semibold text-foreground leading-relaxed">{question.question}</p>
        </div>

        <div className="space-y-3">
          {question.options.map((option, oi) => {
            const isSelected = selectedAnswers[currentQ] === oi;
            return (
              <button
                key={oi}
                onClick={() => handleSelect(oi)}
                className={cn(
                  "w-full flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition-all",
                  isSelected
                    ? "border-primary bg-primary/10 text-foreground font-medium"
                    : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-muted/50"
                )}
              >
                <span className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold border",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted text-muted-foreground border-border"
                )}>
                  {String.fromCharCode(65 + oi)}
                </span>
                <span className="flex-1 leading-snug">{option}</span>
              </button>
            );
          })}
        </div>
      </div>


      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={() => setCurrentQ((q) => Math.max(q - 1, 0))}
          disabled={currentQ === 0}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>


        <div className="flex gap-1.5 flex-wrap justify-center">
          {quiz.questions.map((_, qi) => (
            <button
              key={qi}
              onClick={() => setCurrentQ(qi)}
              className={cn(
                "h-2.5 w-2.5 rounded-full transition-all",
                qi === currentQ ? "bg-primary scale-125" :
                selectedAnswers[qi] !== null ? "bg-primary/40" :
                "bg-border"
              )}
              aria-label={`Go to question ${qi + 1}`}
            />
          ))}
        </div>

        {isLastQ ? (
          <Button
            onClick={() => handleSubmit(selectedAnswers)}
            className="gap-2"
            disabled={answeredCount < totalQ}
          >
            Submit Quiz
            <CheckCircle2 className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={() => setCurrentQ((q) => Math.min(q + 1, totalQ - 1))}
            className="gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>


      {answeredCount === totalQ && !isLastQ && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-green-800">
            <CheckCircle2 className="h-4 w-4" />
            All questions answered!
          </div>
          <Button size="sm" onClick={() => handleSubmit(selectedAnswers)} className="bg-green-700 hover:bg-green-800 gap-2">
            Submit <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
}
