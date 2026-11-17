PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  user_id TEXT PRIMARY KEY,
  identifier TEXT NOT NULL UNIQUE COLLATE NOCASE,
  matric_number TEXT UNIQUE COLLATE NOCASE,
  full_name TEXT NOT NULL,
  department TEXT,
  gender TEXT,
  year_level INTEGER,
  role TEXT NOT NULL CHECK (role IN ('student', 'instructor', 'admin')),
  password_salt TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK ((role = 'student' AND matric_number IS NOT NULL) OR role <> 'student')
);

CREATE TABLE IF NOT EXISTS courses (
  course_id TEXT PRIMARY KEY,
  course_code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT '300 Level',
  instructor_id TEXT NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS modules (
  module_id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  sort_order INTEGER NOT NULL CHECK (sort_order > 0),
  UNIQUE (course_id, sort_order)
);

CREATE TABLE IF NOT EXISTS lessons (
  lesson_id TEXT PRIMARY KEY,
  module_id TEXT NOT NULL REFERENCES modules(module_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  content_type TEXT NOT NULL DEFAULT 'reading' CHECK (content_type IN ('video', 'reading', 'interactive')),
  duration_minutes INTEGER NOT NULL DEFAULT 15 CHECK (duration_minutes > 0),
  sort_order INTEGER NOT NULL CHECK (sort_order > 0),
  UNIQUE (module_id, sort_order)
);

CREATE TABLE IF NOT EXISTS enrollments (
  user_id TEXT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  course_id TEXT NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE,
  enrolled_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'withdrawn')),
  PRIMARY KEY (user_id, course_id)
);

CREATE TABLE IF NOT EXISTS lesson_progress (
  user_id TEXT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL REFERENCES lessons(lesson_id) ON DELETE CASCADE,
  completed INTEGER NOT NULL DEFAULT 0 CHECK (completed IN (0, 1)),
  time_spent_minutes INTEGER NOT NULL DEFAULT 0 CHECK (time_spent_minutes >= 0),
  completed_at TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS quizzes (
  quiz_id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  passing_score INTEGER NOT NULL DEFAULT 70 CHECK (passing_score BETWEEN 0 AND 100),
  time_limit_minutes INTEGER CHECK (time_limit_minutes IS NULL OR time_limit_minutes > 0)
);

CREATE TABLE IF NOT EXISTS quiz_questions (
  question_id TEXT PRIMARY KEY,
  quiz_id TEXT NOT NULL REFERENCES quizzes(quiz_id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  options_json TEXT NOT NULL CHECK (json_valid(options_json)),
  correct_answer INTEGER NOT NULL CHECK (correct_answer >= 0),
  explanation TEXT NOT NULL DEFAULT '',
  difficulty TEXT NOT NULL DEFAULT 'intermediate' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  topic TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL CHECK (sort_order > 0),
  UNIQUE (quiz_id, sort_order)
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
  attempt_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  quiz_id TEXT NOT NULL REFERENCES quizzes(quiz_id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score BETWEEN 0 AND 100),
  total_questions INTEGER NOT NULL CHECK (total_questions > 0),
  correct_answers INTEGER NOT NULL CHECK (correct_answers BETWEEN 0 AND total_questions),
  answers_json TEXT NOT NULL CHECK (json_valid(answers_json)),
  time_taken_seconds INTEGER NOT NULL DEFAULT 0 CHECK (time_taken_seconds >= 0),
  completed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_courses_instructor ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_modules_course_order ON modules(course_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_lessons_module_order ON lessons(module_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_status ON enrollments(course_id, status);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON lesson_progress(user_id, completed);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_date ON quiz_attempts(user_id, completed_at);
CREATE INDEX IF NOT EXISTS idx_sessions_expiry ON sessions(expires_at);
