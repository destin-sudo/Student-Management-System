"use client";

import {
  DEMO_USERS,
  DEMO_COURSES,
  type User,
  type UserProgress,
  type CourseProgress,
  type QuizAttempt,
} from "./data";

const STORAGE_KEYS = {
  CURRENT_USER: "lms_current_user_v2",
  USER_PROGRESS: "lms_user_progress",
  INITIALIZED: "lms_initialized_v3",
};


export function initializeDemoData(): void {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(STORAGE_KEYS.INITIALIZED)) return;


  const demoProgress: UserProgress = {
    userId: "user-1",
    courses: [
      {
        courseId: "course-1",
        enrolledAt: "2025-09-15",
        lastAccessedAt: new Date().toISOString(),
        completedLessons: [
          "lesson-1-1-1",
          "lesson-1-1-2",
          "lesson-1-1-3",
        ],
        quizAttempts: [
          {
            quizId: "quiz-1",
            score: 80,
            totalQuestions: 5,
            correctAnswers: 4,
            answers: [0, 2, 3, 1, 2],
            completedAt: "2025-09-20T10:30:00",
            timeTaken: 480,
          },
        ],
        overallScore: 80,
        currentModuleId: "mod-1-1",
        currentLessonId: "lesson-1-1-4",
        completed: false,
        timeSpent: 75,
      },
      {
        courseId: "course-2",
        enrolledAt: "2025-10-01",
        lastAccessedAt: "2025-10-10T14:00:00",
        completedLessons: ["lesson-2-1-1"],
        quizAttempts: [],
        overallScore: 0,
        currentModuleId: "mod-2-1",
        currentLessonId: "lesson-2-1-2",
        completed: false,
        timeSpent: 20,
      },
      {
        courseId: "course-3",
        enrolledAt: "2025-10-15",
        lastAccessedAt: "2025-11-01T09:00:00",
        completedLessons: [],
        quizAttempts: [],
        overallScore: 0,
        currentModuleId: "mod-3-1",
        currentLessonId: "lesson-3-1-1",
        completed: false,
        timeSpent: 0,
      },
    ],
  };

  const allProgress: UserProgress[] = [demoProgress];
  localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(allProgress));
  localStorage.setItem(STORAGE_KEYS.INITIALIZED, "true");
}


export function setCurrentUser(user: User): void {
  const { password: _password, ...safeUser } = user;
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(safeUser));
}

export function logoutUser(): void {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as User;
  } catch {
    return null;
  }
}


function getAllProgress(): UserProgress[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
  if (!stored) return [];
  try {
    return JSON.parse(stored) as UserProgress[];
  } catch {
    return [];
  }
}

function saveAllProgress(data: UserProgress[]): void {
  localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(data));
}

export function getUserProgress(userId: string): UserProgress {
  const all = getAllProgress();
  const existing = all.find((p) => p.userId === userId);
  if (existing) return existing;
  return { userId, courses: [] };
}

export function getCourseProgress(userId: string, courseId: string): CourseProgress | null {
  const progress = getUserProgress(userId);
  return progress.courses.find((c) => c.courseId === courseId) ?? null;
}

export function enrollInCourse(userId: string, courseId: string): void {
  const all = getAllProgress();
  let userProg = all.find((p) => p.userId === userId);
  if (!userProg) {
    userProg = { userId, courses: [] };
    all.push(userProg);
  }

  const alreadyEnrolled = userProg.courses.find((c) => c.courseId === courseId);
  if (alreadyEnrolled) return;

  const course = DEMO_COURSES.find((c) => c.id === courseId);
  const firstModule = course?.modules[0];
  const firstLesson = firstModule?.lessons[0];

  userProg.courses.push({
    courseId,
    enrolledAt: new Date().toISOString(),
    lastAccessedAt: new Date().toISOString(),
    completedLessons: [],
    quizAttempts: [],
    overallScore: 0,
    currentModuleId: firstModule?.id,
    currentLessonId: firstLesson?.id,
    completed: false,
    timeSpent: 0,
  });

  saveAllProgress(all);


  const current = getCurrentUser();
  if (current && current.id === userId) {
    if (!current.enrolledCourses.includes(courseId)) {
      current.enrolledCourses = [...current.enrolledCourses, courseId];
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(current));
    }
  }
}

export function markLessonComplete(userId: string, courseId: string, lessonId: string, timeSpent: number): void {
  const all = getAllProgress();
  const userProg = all.find((p) => p.userId === userId);
  if (!userProg) return;

  const courseProg = userProg.courses.find((c) => c.courseId === courseId);
  if (!courseProg) return;

  if (!courseProg.completedLessons.includes(lessonId)) {
    courseProg.completedLessons.push(lessonId);
  }
  courseProg.timeSpent += timeSpent;
  courseProg.lastAccessedAt = new Date().toISOString();


  const course = DEMO_COURSES.find((c) => c.id === courseId);
  if (course) {
    const allLessons = course.modules.flatMap((m) => m.lessons.map((l) => l.id));
    if (allLessons.every((lid) => courseProg.completedLessons.includes(lid))) {
      courseProg.completed = true;
      courseProg.completedAt = new Date().toISOString();
    }
  }

  saveAllProgress(all);
}

export function saveQuizAttempt(
  userId: string,
  courseId: string,
  attempt: QuizAttempt
): void {
  const all = getAllProgress();
  const userProg = all.find((p) => p.userId === userId);
  if (!userProg) return;

  const courseProg = userProg.courses.find((c) => c.courseId === courseId);
  if (!courseProg) return;

  courseProg.quizAttempts.push(attempt);


  if (courseProg.quizAttempts.length > 0) {
    courseProg.overallScore =
      courseProg.quizAttempts.reduce((sum, a) => sum + a.score, 0) /
      courseProg.quizAttempts.length;
  }

  courseProg.lastAccessedAt = new Date().toISOString();
  saveAllProgress(all);
}

export function updateCurrentLesson(
  userId: string,
  courseId: string,
  moduleId: string,
  lessonId: string
): void {
  const all = getAllProgress();
  const userProg = all.find((p) => p.userId === userId);
  if (!userProg) return;

  const courseProg = userProg.courses.find((c) => c.courseId === courseId);
  if (!courseProg) return;

  courseProg.currentModuleId = moduleId;
  courseProg.currentLessonId = lessonId;
  courseProg.lastAccessedAt = new Date().toISOString();
  saveAllProgress(all);
}


export interface AdaptiveRecommendation {
  type: "review" | "continue" | "advance" | "challenge";
  title: string;
  description: string;
  courseId?: string;
  lessonId?: string;
  quizId?: string;
}

export function getAdaptiveRecommendations(userId: string): AdaptiveRecommendation[] {
  const progress = getUserProgress(userId);
  const user = DEMO_USERS.find((u) => u.id === userId);
  if (!user) return [];

  const recommendations: AdaptiveRecommendation[] = [];


  for (const courseProg of progress.courses) {
    const course = DEMO_COURSES.find((c) => c.id === courseProg.courseId);
    if (!course) continue;

    const attempts = courseProg.quizAttempts;
    const avgScore = attempts.length > 0
      ? attempts.reduce((s, a) => s + a.score, 0) / attempts.length
      : null;

    if (avgScore !== null && avgScore < 60) {
      recommendations.push({
        type: "review",
        title: `Review: ${course.title}`,
        description: `Your average quiz score is ${avgScore.toFixed(0)}%. Revisiting the lessons will help reinforce key concepts.`,
        courseId: course.id,
      });
    } else if (avgScore !== null && avgScore >= 85) {
      recommendations.push({
        type: "advance",
        title: `Advance in: ${course.title}`,
        description: `Excellent work! Your ${avgScore.toFixed(0)}% average shows mastery. Consider the advanced modules.`,
        courseId: course.id,
      });
    } else if (courseProg.completedLessons.length > 0 && !courseProg.completed) {
      recommendations.push({
        type: "continue",
        title: `Continue: ${course.title}`,
        description: `You've completed ${courseProg.completedLessons.length} lessons. Keep the momentum going!`,
        courseId: course.id,
        lessonId: courseProg.currentLessonId,
      });
    }
  }


  const enrolledIds = progress.courses.map((c) => c.courseId);
  const unenrolled = DEMO_COURSES.filter((c) => !enrolledIds.includes(c.id));

  if (unenrolled.length > 0) {
    const suggested = unenrolled[0];
    recommendations.push({
      type: "challenge",
      title: `New Course: ${suggested.title}`,
      description: `Expand your skills with ${suggested.title}. ${suggested.shortDescription}`,
      courseId: suggested.id,
    });
  }

  return recommendations.slice(0, 4);
}

export function getAdaptiveFeedback(score: number): {
  level: "excellent" | "good" | "needs-review" | "struggling";
  title: string;
  message: string;
  colour: string;
} {
  if (score >= 90) {
    return {
      level: "excellent",
      title: "Outstanding!",
      message: "You've demonstrated excellent mastery of this material. Consider exploring advanced topics.",
      colour: "text-green-600",
    };
  } else if (score >= 70) {
    return {
      level: "good",
      title: "Good Work!",
      message: "You've passed this assessment. Review the questions you missed to solidify your understanding.",
      colour: "text-blue-600",
    };
  } else if (score >= 50) {
    return {
      level: "needs-review",
      title: "Keep Practising",
      message: "You're making progress but should review the lesson material before moving on.",
      colour: "text-amber-600",
    };
  } else {
    return {
      level: "struggling",
      title: "Extra Practice Needed",
      message: "We recommend revisiting the lessons and trying again. Focus on the explanations for each question.",
      colour: "text-red-600",
    };
  }
}


export function getSystemAnalytics() {
  const all = getAllProgress();

  const totalStudents = DEMO_USERS.filter((u) => u.role === "student").length;
  const totalEnrollments = all.reduce((sum, u) => sum + u.courses.length, 0);
  const totalCompleted = all.reduce(
    (sum, u) => sum + u.courses.filter((c) => c.completed).length,
    0
  );
  const allAttempts = all.flatMap((u) => u.courses.flatMap((c) => c.quizAttempts));
  const avgScore =
    allAttempts.length > 0
      ? allAttempts.reduce((s, a) => s + a.score, 0) / allAttempts.length
      : 0;

  const courseStats = DEMO_COURSES.map((course) => {
    const courseEnrollments = all.flatMap((u) =>
      u.courses.filter((c) => c.courseId === course.id)
    );
    const courseAttempts = courseEnrollments.flatMap((c) => c.quizAttempts);
    const avgCourseScore =
      courseAttempts.length > 0
        ? courseAttempts.reduce((s, a) => s + a.score, 0) / courseAttempts.length
        : 0;
    return {
      courseId: course.id,
      title: course.title,
      enrolledCount: courseEnrollments.length,
      completedCount: courseEnrollments.filter((c) => c.completed).length,
      avgScore: avgCourseScore,
    };
  });

  return {
    totalStudents,
    totalEnrollments,
    totalCompleted,
    completionRate: totalEnrollments > 0 ? (totalCompleted / totalEnrollments) * 100 : 0,
    avgScore,
    courseStats,
  };
}
