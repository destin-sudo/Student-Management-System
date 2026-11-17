"use client";

import { useState } from "react";
import {
  Brain,
  BarChart3,
  ChevronRight,
  Star,
  AlertTriangle,
  TrendingUp,
  BookOpen,
  CheckCircle2,
  RefreshCcw,
  Lightbulb,
  Users,
  Layers,
  ArrowRight,
  Gauge,
} from "lucide-react";
import { cn } from "@/lib/utils";


const FEATURES = [
  {
    id: "mastery",
    icon: <Star className="h-5 w-5" />,
    colour: "text-amber-500",
    bg: "bg-amber-50 border-amber-200",
    activeBg: "bg-amber-500",
    title: "Mastery-Based Progression",
    subtitle: "Route learners forward only when they are ready",
    theory: "Based on Bloom's Mastery Learning (1968) and Knowledge Space Theory (Doignon & Falmagne, 1985).",
    description:
      "Rather than moving every student through content at a fixed pace, the system evaluates quiz performance after each assessment and determines which path each learner should take next. A student who scores 85%+ is considered to have demonstrated mastery and is directed to advance. One who scores below 60% is routed back to review material before progressing.",
    steps: [
      { label: "Student completes a quiz", icon: <BookOpen className="h-4 w-4" /> },
      { label: "Engine calculates average score across all attempts", icon: <BarChart3 className="h-4 w-4" /> },
      { label: "Score < 60%: Review path — revisit lessons", icon: <AlertTriangle className="h-4 w-4 text-red-500" /> },
      { label: "Score 60–84%: Continue path — maintain momentum", icon: <TrendingUp className="h-4 w-4 text-blue-500" /> },
      { label: "Score ≥ 85%: Advance path — mastery confirmed", icon: <Star className="h-4 w-4 text-amber-500" /> },
    ],
    code: `// getAdaptiveRecommendations() in lib/storage.ts
if (avgScore < 60) {
  recommendations.push({ type: "review", ... });
} else if (avgScore >= 85) {
  recommendations.push({ type: "advance", ... });
} else {
  recommendations.push({ type: "continue", ... });
}`,
  },
  {
    id: "feedback",
    icon: <Gauge className="h-5 w-5" />,
    colour: "text-blue-500",
    bg: "bg-blue-50 border-blue-200",
    activeBg: "bg-blue-500",
    title: "Tiered Adaptive Feedback",
    subtitle: "Personalised post-quiz guidance based on proficiency tier",
    theory: "Models Vygotsky's Zone of Proximal Development — meet the learner where they are, not where you expect them to be.",
    description:
      "After every quiz submission the engine classifies the learner into one of four proficiency tiers and returns a different message, colour coding, and action prompt. A struggling learner and an excellent learner receive completely different guidance even if they took the same quiz.",
    steps: [
      { label: "Quiz submitted — score calculated", icon: <CheckCircle2 className="h-4 w-4" /> },
      { label: "Score ≥ 90%: Excellent — encourage advancement", icon: <Star className="h-4 w-4 text-green-600" /> },
      { label: "Score 70–89%: Good — reinforce missed areas", icon: <TrendingUp className="h-4 w-4 text-blue-500" /> },
      { label: "Score 50–69%: Needs Review — redirect to lessons", icon: <RefreshCcw className="h-4 w-4 text-amber-500" /> },
      { label: "Score < 50%: Struggling — strong remediation prompt", icon: <AlertTriangle className="h-4 w-4 text-red-500" /> },
    ],
    code: `// getAdaptiveFeedback() in lib/storage.ts
if (score >= 90) return { level: "excellent", ... };
if (score >= 70) return { level: "good", ... };
if (score >= 50) return { level: "needs-review", ... };
return { level: "struggling", ... };`,
  },
  {
    id: "recommendations",
    icon: <Lightbulb className="h-5 w-5" />,
    colour: "text-teal-500",
    bg: "bg-teal-50 border-teal-200",
    activeBg: "bg-teal-500",
    title: "Personalised Recommendation Engine",
    subtitle: "Each learner's dashboard shows a unique set of next-steps",
    theory: "Collaborative filtering lite — course suggestions are generated from enrolment gaps and performance data, not a global catalogue.",
    description:
      "The dashboard recommendation panel is generated fresh on every login by analysing the current learner's complete history — their course enrolments, lesson completions, quiz scores, and unenrolled courses. Two different students logged in simultaneously will see a completely different set of action cards.",
    steps: [
      { label: "Load all enrolled courses for this user", icon: <BookOpen className="h-4 w-4" /> },
      { label: "Score each course by quiz average", icon: <BarChart3 className="h-4 w-4" /> },
      { label: "Produce Review / Continue / Advance cards", icon: <Layers className="h-4 w-4" /> },
      { label: "Find unenrolled courses → produce Challenge card", icon: <Lightbulb className="h-4 w-4 text-teal-500" /> },
      { label: "Return top 4 ranked recommendations", icon: <ChevronRight className="h-4 w-4" /> },
    ],
    code: `// getAdaptiveRecommendations() in lib/storage.ts
for (const courseProg of progress.courses) {
}
const unenrolled = DEMO_COURSES
  .filter(c => !enrolledIds.includes(c.id));
if (unenrolled.length > 0) {
  recommendations.push({ type: "challenge", ... });
}
return recommendations.slice(0, 4);`,
  },
  {
    id: "difficulty",
    icon: <Layers className="h-5 w-5" />,
    colour: "text-violet-500",
    bg: "bg-violet-50 border-violet-200",
    activeBg: "bg-violet-500",
    title: "Difficulty-Levelled Content Model",
    subtitle: "All content is tagged — the engine can route up or down",
    theory: "Rooted in Item Response Theory (IRT) — difficulty is a first-class property of every item of content.",
    description:
      "Every course, lesson, and quiz question in the system carries an explicit difficulty tag: beginner, intermediate, or advanced. This is not cosmetic — it is the data the adaptive engine uses to decide the direction of the next recommendation. A learner who masters beginner content should be routed toward intermediate lessons, not a repeat of what they already know.",
    steps: [
      { label: "Course created with level: beginner / intermediate / advanced", icon: <Layers className="h-4 w-4" /> },
      { label: "Quiz questions tagged with the same difficulty scale", icon: <BarChart3 className="h-4 w-4" /> },
      { label: "Adaptive engine reads level when building recommendations", icon: <Brain className="h-4 w-4" /> },
      { label: "Advance path → surface higher-level content", icon: <TrendingUp className="h-4 w-4 text-violet-500" /> },
      { label: "Review path → surface same or lower-level content", icon: <RefreshCcw className="h-4 w-4" /> },
    ],
    code: `// Course type in lib/data.ts
export type Course = {
  level: "beginner" | "intermediate" | "advanced";
  ...
};
export type Lesson = {
  difficulty: "beginner" | "intermediate" | "advanced";
  ...
};`,
  },
  {
    id: "analytics",
    icon: <BarChart3 className="h-5 w-5" />,
    colour: "text-rose-500",
    bg: "bg-rose-50 border-rose-200",
    activeBg: "bg-rose-500",
    title: "Learning Analytics Layer",
    subtitle: "Instructors and admins see real-time performance intelligence",
    theory: "Aligns with the JISC Learning Analytics framework — data is collected, processed, and surfaced to stakeholders who can intervene.",
    description:
      "The Analytics and Students dashboards aggregate quiz attempt data, lesson completion rates, enrolment counts, and time-on-task in real time from the stored learner histories. Instructors can identify which courses have low completion rates, which students are struggling, and where the drop-off points are — enabling proactive intervention before a student falls behind.",
    steps: [
      { label: "All quiz attempts & completions stored in localStorage", icon: <CheckCircle2 className="h-4 w-4" /> },
      { label: "getSystemAnalytics() computes per-course stats", icon: <BarChart3 className="h-4 w-4" /> },
      { label: "Completion rate, avg score, enrolment count surfaced", icon: <TrendingUp className="h-4 w-4" /> },
      { label: "Student leaderboard ranked by performance", icon: <Users className="h-4 w-4 text-rose-500" /> },
      { label: "Instructor can identify at-risk learners and intervene", icon: <AlertTriangle className="h-4 w-4 text-amber-500" /> },
    ],
    code: `// getSystemAnalytics() in lib/storage.ts
const courseStats = DEMO_COURSES.map((course) => {
  const enrollments = all.flatMap(u =>
    u.courses.filter(c => c.courseId === course.id)
  );
  const attempts = enrollments.flatMap(c => c.quizAttempts);
  const avgScore = attempts.length > 0
    ? attempts.reduce((s, a) => s + a.score, 0) / attempts.length
    : 0;
  return { title, enrolledCount, completedCount, avgScore };
});`,
  },
];

const SCORE_DEMO = [
  { score: 92, tier: "Excellent", colour: "bg-green-500", text: "text-green-700", msg: "Outstanding! You've demonstrated excellent mastery. Consider exploring advanced topics." },
  { score: 76, tier: "Good", colour: "bg-blue-500", text: "text-blue-700", msg: "Good work! Review the questions you missed to solidify your understanding." },
  { score: 57, tier: "Needs Review", colour: "bg-amber-500", text: "text-amber-700", msg: "Keep practising. Revisit the lesson material before moving on." },
  { score: 38, tier: "Struggling", colour: "bg-red-500", text: "text-red-700", msg: "Extra practice needed. Focus on the explanations for each question." },
];

export default function AdaptivePage() {
  const [activeFeature, setActiveFeature] = useState(FEATURES[0].id);
  const [demoScore, setDemoScore] = useState(76);

  const feature = FEATURES.find((f) => f.id === activeFeature)!;

  const getTier = (score: number) => {
    if (score >= 90) return SCORE_DEMO[0];
    if (score >= 70) return SCORE_DEMO[1];
    if (score >= 50) return SCORE_DEMO[2];
    return SCORE_DEMO[3];
  };
  const tier = getTier(demoScore);

  return (
    <div className="min-h-screen bg-background">

      <div className="bg-sidebar text-sidebar-foreground">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
              <Brain className="h-6 w-6 text-accent-foreground" />
            </div>
            <span className="text-sm font-medium text-sidebar-foreground/60 uppercase tracking-widest">
              Smart Adaptive LMS
            </span>
          </div>
          <h1 className="text-4xl font-bold leading-tight mb-3 text-balance">
            How the Adaptive Engine Works
          </h1>
          <p className="text-sidebar-foreground/70 text-lg max-w-2xl leading-relaxed">
            A technical and academic walkthrough of every adaptive feature in this system — from mastery-based progression to real-time learning analytics.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {["Rule-Based Adaptive System", "Mastery Learning", "ZPD (Vygotsky)", "Knowledge Space Theory", "Learning Analytics"].map((tag) => (
              <span key={tag} className="inline-flex items-center rounded-full bg-sidebar-accent px-3 py-1 text-xs font-medium text-sidebar-foreground/80">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-14">


        <section>
          <h2 className="text-xl font-bold text-foreground mb-6">System Architecture Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center">
            {[
              { label: "Learner Activity", sub: "lessons, quizzes, time", icon: <Users className="h-5 w-5" /> },
              { label: "Data Layer", sub: "localStorage progress store", icon: <Layers className="h-5 w-5" /> },
              { label: "Adaptive Engine", sub: "rules + thresholds", icon: <Brain className="h-5 w-5" /> },
              { label: "Personalised Output", sub: "recommendations + feedback", icon: <Lightbulb className="h-5 w-5" /> },
              { label: "Analytics Dashboard", sub: "instructor intelligence", icon: <BarChart3 className="h-5 w-5" /> },
            ].map((node, i) => (
              <div key={node.label} className="flex md:flex-col items-center gap-3 md:gap-2">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground mb-2">
                    {node.icon}
                  </div>
                  <span className="text-sm font-semibold text-foreground text-balance">{node.label}</span>
                  <span className="text-xs text-muted-foreground mt-0.5">{node.sub}</span>
                </div>
                {i < 4 && (
                  <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0 rotate-0 md:rotate-0 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </section>


        <section>
          <h2 className="text-xl font-bold text-foreground mb-6">Feature Deep-Dives</h2>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

            <div className="space-y-2">
              {FEATURES.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFeature(f.id)}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all",
                    activeFeature === f.id
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/40 hover:bg-muted/40"
                  )}
                >
                  <div className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg shrink-0",
                    activeFeature === f.id ? f.activeBg + " text-white" : "bg-muted text-muted-foreground"
                  )}>
                    {f.icon}
                  </div>
                  <div>
                    <p className={cn("text-sm font-medium leading-tight", activeFeature === f.id ? "text-foreground" : "text-muted-foreground")}>
                      {f.title}
                    </p>
                  </div>
                </button>
              ))}
            </div>


            <div className="lg:col-span-3 space-y-5">
              <div className={cn("rounded-xl border p-5", feature.bg)}>
                <div className="flex items-center gap-3 mb-1">
                  <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", feature.activeBg, "text-white")}>
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.subtitle}</p>
                  </div>
                </div>
                <p className="text-xs font-medium text-muted-foreground mt-3 italic border-l-2 border-current pl-3">
                  {feature.theory}
                </p>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>


              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">How it flows</p>
                <div className="space-y-2">
                  {feature.steps.map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground text-xs font-bold shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        {step.icon}
                        {step.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>


              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Relevant code</p>
                <pre className="rounded-xl bg-sidebar text-sidebar-foreground text-xs leading-relaxed p-4 overflow-x-auto font-mono whitespace-pre-wrap">
                  {feature.code}
                </pre>
              </div>
            </div>
          </div>
        </section>


        <section>
          <h2 className="text-xl font-bold text-foreground mb-2">Live Demo: Adaptive Feedback Tiers</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Drag the slider to simulate a quiz score. The system instantly classifies the learner and produces a different message.
          </p>
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Simulated quiz score</span>
              <span className="text-2xl font-bold text-foreground">{demoScore}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={demoScore}
              onChange={(e) => setDemoScore(Number(e.target.value))}
              className="w-full accent-primary mb-6"
            />


            <div className="grid grid-cols-4 gap-3 mb-6">
              {SCORE_DEMO.map((t) => (
                <div
                  key={t.tier}
                  className={cn(
                    "rounded-xl border p-3 text-center transition-all",
                    tier.tier === t.tier ? "border-primary shadow-md scale-105" : "border-border opacity-40"
                  )}
                >
                  <div className={cn("h-2 rounded-full mb-2", t.colour)} />
                  <p className="text-xs font-semibold text-foreground">{t.tier}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {t.tier === "Excellent" ? "≥ 90%" : t.tier === "Good" ? "70–89%" : t.tier === "Needs Review" ? "50–69%" : "< 50%"}
                  </p>
                </div>
              ))}
            </div>

            <div className={cn("rounded-xl border-l-4 p-4", tier.colour.replace("bg-", "border-"), "bg-muted/30")}>
              <p className={cn("font-semibold text-sm mb-1", tier.text)}>{tier.tier}</p>
              <p className="text-sm text-foreground">{tier.msg}</p>
            </div>
          </div>
        </section>


        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">Academic Framing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: "What type of adaptive system is this?",
                body: "This is a Rule-Based Adaptive System — the simplest and most interpretable category. Learner proficiency is determined by explicit performance thresholds rather than a trained statistical model. This makes the system transparent, auditable, and appropriate for an educational context where explainability matters.",
              },
              {
                title: "Why not use machine learning?",
                body: "ML-based adaptive systems (e.g. Bayesian Knowledge Tracing, Deep Knowledge Tracing) require large historical datasets to train on. With a new platform and limited real learner data, rule-based rules produce more reliable and defensible outcomes. ML is the natural Phase 2 upgrade once sufficient data has accumulated.",
              },
              {
                title: "Which established frameworks does this map to?",
                body: "Mastery-Based Progression (Bloom, 1968), Knowledge Space Theory (Doignon & Falmagne, 1985), Zone of Proximal Development (Vygotsky, 1978), Item Response Theory for difficulty tagging, and the JISC Learning Analytics Framework for the instructor analytics layer.",
              },
              {
                title: "What would Phase 2 look like?",
                body: "Replace fixed score thresholds with a trained logistic regression or Bayesian Knowledge Tracing classifier. Add spaced repetition scheduling for lesson review. Introduce a learning style questionnaire (VARK) at registration and use the result to personalise content format preferences.",
              },
            ].map((card) => (
              <div key={card.title} className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-semibold text-foreground mb-2 text-sm">{card.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
