

export type UserRole = "student" | "instructor" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  avatar: string;
  enrolledCourses: string[];
  joinedAt: string;
  bio?: string;
  department?: string;
  gender?: string;
  matricNumber?: string;
}

export interface Lesson {
  id: string;
  title: string;
  type: "video" | "reading" | "interactive";
  duration: number;
  content: string;
  videoUrl?: string;
  order: number;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  quizId?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  topic: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  passingScore: number;
  timeLimit?: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  instructor: string;
  instructorId: string;
  category: string;
  level: "300 Level" | "Beginner" | "Intermediate" | "Advanced";
  thumbnail: string;
  tags: string[];
  modules: Module[];
  totalLessons: number;
  totalDuration: number;
  enrolledCount: number;
  rating: number;
  createdAt: string;
  objectives: string[];
  prerequisites: string[];
}

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  timeSpent: number;
  completedAt?: string;
}

export interface QuizAttempt {
  quizId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  answers: number[];
  completedAt: string;
  timeTaken: number;
}

export interface CourseProgress {
  courseId: string;
  enrolledAt: string;
  lastAccessedAt: string;
  completedLessons: string[];
  quizAttempts: QuizAttempt[];
  overallScore: number;
  currentModuleId?: string;
  currentLessonId?: string;
  completed: boolean;
  completedAt?: string;
  timeSpent: number;
}

export interface UserProgress {
  userId: string;
  courses: CourseProgress[];
}

export const DEMO_USERS: User[] = [
  { id: "user-1", name: "Destiny Ayegba", email: "RUN/CMP/24/17176", password: "demo$$123", role: "student", avatar: "DA", enrolledCourses: ["course-1", "course-2", "course-3"], joinedAt: "2025-09-01", bio: "300-level Computer Science student.", department: "Computer Science", gender: "Female" },
  { id: "user-2", name: "Ayanbiyi Abiodun", email: "Run/cmp/24/17174", password: "demo$$123", role: "student", avatar: "AA", enrolledCourses: ["course-1", "course-4"], joinedAt: "2025-09-01", bio: "300-level Computer Science student.", department: "Computer Science", gender: "Male" },
  { id: "user-3", name: "Inioluwa Ayandare", email: "run/cmp/24/17175", password: "demo$$123", role: "student", avatar: "IA", enrolledCourses: ["course-2", "course-3", "course-4"], joinedAt: "2025-09-01", bio: "300-level Information Technology student.", department: "Information Technology", gender: "Male" },
  { id: "user-4", name: "Adeshola Emiloju", email: "run/cmp/24/17189", password: "demo$$123", role: "student", avatar: "AE", enrolledCourses: ["course-1", "course-3"], joinedAt: "2025-09-01", bio: "300-level Computer Science student.", department: "Computer Science", gender: "Male" },
  { id: "user-5", name: "Kolawole Balogun", email: "run/cmp/24/17178", password: "demo$$123", role: "student", avatar: "KB", enrolledCourses: ["course-2", "course-4"], joinedAt: "2025-09-01", bio: "300-level student.", department: "Not provided", gender: "Not provided" },
  { id: "user-6", name: "Miss Oluwaseun Amore", email: "instructor", password: "demo$$123", role: "instructor", avatar: "OA", enrolledCourses: [], joinedAt: "2025-09-01", bio: "Course instructor for the 300-level learning portal.", department: "Computer Science", gender: "Female" },
];


export const DEMO_QUIZZES: Quiz[] = [
  {
    id: "quiz-1",
    title: "HTML & CSS Fundamentals Quiz",
    description: "Test your understanding of HTML structure and CSS styling basics.",
    passingScore: 70,
    timeLimit: 15,
    questions: [
      {
        id: "q1-1",
        question: "What does HTML stand for?",
        options: [
          "Hyper Text Markup Language",
          "High Text Machine Language",
          "Hyperlinks and Text Markup Language",
          "Home Tool Markup Language",
        ],
        correctAnswer: 0,
        explanation: "HTML stands for Hyper Text Markup Language, the standard language for creating web pages.",
        difficulty: "beginner",
        topic: "HTML Basics",
      },
      {
        id: "q1-2",
        question: "Which CSS property is used to change the text color of an element?",
        options: ["font-color", "text-color", "color", "foreground-color"],
        correctAnswer: 2,
        explanation: "The 'color' property in CSS is used to set the foreground color of an element's text.",
        difficulty: "beginner",
        topic: "CSS Styling",
      },
      {
        id: "q1-3",
        question: "What is the correct HTML element for the largest heading?",
        options: ["<h6>", "<head>", "<heading>", "<h1>"],
        correctAnswer: 3,
        explanation: "<h1> defines the largest heading. Headings range from <h1> (largest) to <h6> (smallest).",
        difficulty: "beginner",
        topic: "HTML Elements",
      },
      {
        id: "q1-4",
        question: "Which CSS display value creates a flex container?",
        options: ["display: block", "display: flex", "display: inline", "display: grid"],
        correctAnswer: 1,
        explanation: "'display: flex' creates a flex container, enabling flexbox layout for child elements.",
        difficulty: "intermediate",
        topic: "CSS Layout",
      },
      {
        id: "q1-5",
        question: "What is the CSS Box Model order from inside to outside?",
        options: [
          "Content → Border → Padding → Margin",
          "Content → Padding → Margin → Border",
          "Content → Padding → Border → Margin",
          "Margin → Border → Padding → Content",
        ],
        correctAnswer: 2,
        explanation: "The CSS Box Model layers from inside out are: Content → Padding → Border → Margin.",
        difficulty: "intermediate",
        topic: "CSS Box Model",
      },
    ],
  },
  {
    id: "quiz-2",
    title: "JavaScript Essentials Quiz",
    description: "Assess your JavaScript fundamentals including variables, functions, and DOM manipulation.",
    passingScore: 70,
    timeLimit: 20,
    questions: [
      {
        id: "q2-1",
        question: "Which keyword is used to declare a variable that cannot be reassigned in JavaScript?",
        options: ["var", "let", "const", "static"],
        correctAnswer: 2,
        explanation: "'const' declares a block-scoped variable whose value cannot be reassigned after initialization.",
        difficulty: "beginner",
        topic: "Variables",
      },
      {
        id: "q2-2",
        question: "What will 'typeof null' return in JavaScript?",
        options: ["'null'", "'undefined'", "'object'", "'number'"],
        correctAnswer: 2,
        explanation: "This is a well-known JavaScript quirk — 'typeof null' returns 'object' due to a legacy bug in the language.",
        difficulty: "intermediate",
        topic: "Data Types",
      },
      {
        id: "q2-3",
        question: "Which method is used to add an element to the end of an array?",
        options: ["array.append()", "array.push()", "array.add()", "array.insert()"],
        correctAnswer: 1,
        explanation: "The push() method adds one or more elements to the end of an array and returns the new length.",
        difficulty: "beginner",
        topic: "Arrays",
      },
      {
        id: "q2-4",
        question: "What is a closure in JavaScript?",
        options: [
          "A way to close the browser window",
          "A function that has access to its outer function's scope even after the outer function returns",
          "A method to end a loop",
          "An error handling mechanism",
        ],
        correctAnswer: 1,
        explanation: "A closure is a function that retains access to its lexical scope, even when the function is executed outside that scope.",
        difficulty: "advanced",
        topic: "Functions & Closures",
      },
      {
        id: "q2-5",
        question: "What does 'async/await' do in JavaScript?",
        options: [
          "Makes synchronous code run faster",
          "Creates new threads",
          "Provides syntactic sugar for working with Promises",
          "Blocks the event loop",
        ],
        correctAnswer: 2,
        explanation: "async/await is syntactic sugar built on Promises, making asynchronous code easier to write and read.",
        difficulty: "intermediate",
        topic: "Async JavaScript",
      },
      {
        id: "q2-6",
        question: "Which of the following is NOT a JavaScript primitive type?",
        options: ["string", "number", "array", "boolean"],
        correctAnswer: 2,
        explanation: "Array is an object type, not a primitive. Primitives in JS include: string, number, boolean, null, undefined, symbol, and bigint.",
        difficulty: "intermediate",
        topic: "Data Types",
      },
    ],
  },
  {
    id: "quiz-3",
    title: "React Fundamentals Quiz",
    description: "Test your knowledge of React components, hooks, and state management.",
    passingScore: 75,
    timeLimit: 20,
    questions: [
      {
        id: "q3-1",
        question: "What hook is used to manage state in a functional React component?",
        options: ["useEffect", "useState", "useRef", "useContext"],
        correctAnswer: 1,
        explanation: "useState is the primary hook for adding state to functional components in React.",
        difficulty: "beginner",
        topic: "React Hooks",
      },
      {
        id: "q3-2",
        question: "When does useEffect run by default?",
        options: [
          "Only on component mount",
          "Only on component unmount",
          "After every render",
          "Only when specified state changes",
        ],
        correctAnswer: 2,
        explanation: "By default, useEffect runs after every render. You can control this behavior with the dependency array.",
        difficulty: "intermediate",
        topic: "React Hooks",
      },
      {
        id: "q3-3",
        question: "What is the Virtual DOM in React?",
        options: [
          "A DOM that only exists on the server",
          "A lightweight JavaScript representation of the real DOM",
          "A CSS framework for React",
          "An alternative to HTML",
        ],
        correctAnswer: 1,
        explanation: "The Virtual DOM is a lightweight JavaScript object that React uses to diff against the real DOM to minimize expensive DOM updates.",
        difficulty: "intermediate",
        topic: "React Concepts",
      },
      {
        id: "q3-4",
        question: "What is the correct way to pass data from a parent to a child component?",
        options: ["Using state", "Using refs", "Using props", "Using context only"],
        correctAnswer: 2,
        explanation: "Props are used to pass data from parent to child components in React. They are read-only from the child's perspective.",
        difficulty: "beginner",
        topic: "Components & Props",
      },
      {
        id: "q3-5",
        question: "What does the key prop help React with in lists?",
        options: [
          "Styling list items",
          "Identifying which items have changed, been added, or removed",
          "Sorting the list",
          "Filtering the list",
        ],
        correctAnswer: 1,
        explanation: "Keys help React identify which list items have changed, been added, or removed, improving reconciliation performance.",
        difficulty: "intermediate",
        topic: "Lists & Keys",
      },
    ],
  },
  {
    id: "quiz-4",
    title: "Python for Data Science Quiz",
    description: "Evaluate your Python skills in the context of data analysis and scientific computing.",
    passingScore: 70,
    timeLimit: 15,
    questions: [
      {
        id: "q4-1",
        question: "Which library is primarily used for data manipulation in Python?",
        options: ["NumPy", "Matplotlib", "Pandas", "Scikit-learn"],
        correctAnswer: 2,
        explanation: "Pandas is the go-to library for data manipulation and analysis, providing DataFrame and Series structures.",
        difficulty: "beginner",
        topic: "Python Libraries",
      },
      {
        id: "q4-2",
        question: "What is a Python list comprehension?",
        options: [
          "A way to import lists from files",
          "A concise way to create lists based on existing iterables",
          "A method to sort lists",
          "A way to merge two lists",
        ],
        correctAnswer: 1,
        explanation: "List comprehensions provide a concise way to create lists: [expression for item in iterable if condition].",
        difficulty: "intermediate",
        topic: "Python Syntax",
      },
      {
        id: "q4-3",
        question: "What does the .shape attribute of a NumPy array return?",
        options: [
          "The data type of the array",
          "The total number of elements",
          "A tuple representing the dimensions of the array",
          "The memory size of the array",
        ],
        correctAnswer: 2,
        explanation: "The .shape attribute returns a tuple indicating the number of elements along each dimension of the array.",
        difficulty: "intermediate",
        topic: "NumPy",
      },
      {
        id: "q4-4",
        question: "What is the difference between '==' and 'is' in Python?",
        options: [
          "They are identical",
          "'==' compares values; 'is' checks identity (same object in memory)",
          "'is' compares values; '==' checks identity",
          "Both check memory identity",
        ],
        correctAnswer: 1,
        explanation: "'==' compares the values of two objects, while 'is' checks whether two variables refer to the same object in memory.",
        difficulty: "intermediate",
        topic: "Python Operators",
      },
      {
        id: "q4-5",
        question: "Which method reads a CSV file into a Pandas DataFrame?",
        options: ["pd.open_csv()", "pd.read_csv()", "pd.load_csv()", "pd.import_csv()"],
        correctAnswer: 1,
        explanation: "pd.read_csv() is used to read comma-separated values files into a Pandas DataFrame.",
        difficulty: "beginner",
        topic: "Pandas",
      },
    ],
  },
  {
    id: "quiz-5",
    title: "Machine Learning Basics Quiz",
    description: "Test your conceptual understanding of machine learning algorithms and concepts.",
    passingScore: 70,
    timeLimit: 20,
    questions: [
      {
        id: "q5-1",
        question: "What is overfitting in machine learning?",
        options: [
          "When a model performs poorly on training data",
          "When a model learns the training data too well, performing poorly on new data",
          "When a model is too simple",
          "When training takes too long",
        ],
        correctAnswer: 1,
        explanation: "Overfitting occurs when a model learns the noise and detail in training data to the extent it negatively impacts performance on new data.",
        difficulty: "intermediate",
        topic: "ML Concepts",
      },
      {
        id: "q5-2",
        question: "Which of the following is a supervised learning algorithm?",
        options: ["K-Means Clustering", "Principal Component Analysis", "Linear Regression", "Autoencoders"],
        correctAnswer: 2,
        explanation: "Linear Regression is a supervised learning algorithm that uses labeled training data to learn the relationship between input and output variables.",
        difficulty: "beginner",
        topic: "Algorithms",
      },
      {
        id: "q5-3",
        question: "What is the purpose of the training/test split?",
        options: [
          "To speed up training",
          "To evaluate model performance on unseen data",
          "To increase the dataset size",
          "To reduce overfitting automatically",
        ],
        correctAnswer: 1,
        explanation: "Splitting data into training and test sets allows us to evaluate how well a model generalizes to new, unseen data.",
        difficulty: "beginner",
        topic: "Model Evaluation",
      },
      {
        id: "q5-4",
        question: "What does the learning rate control in gradient descent?",
        options: [
          "The number of training epochs",
          "How fast the model reads data",
          "The size of the steps taken towards the minimum of the loss function",
          "The complexity of the model",
        ],
        correctAnswer: 2,
        explanation: "The learning rate controls the size of the weight update steps in gradient descent. Too large can overshoot; too small can be slow to converge.",
        difficulty: "intermediate",
        topic: "Optimization",
      },
      {
        id: "q5-5",
        question: "What is cross-validation?",
        options: [
          "Validating the code syntax",
          "A technique for assessing model performance by training on different subsets of data",
          "Comparing two different algorithms",
          "Cleaning inconsistent data",
        ],
        correctAnswer: 1,
        explanation: "Cross-validation is a resampling technique used to evaluate ML models by training and testing on different partitions of the data multiple times.",
        difficulty: "intermediate",
        topic: "Model Evaluation",
      },
    ],
  },
];


const BASE_COURSES: Course[] = [
  {
    id: "course-1",
    title: "CSC 301 · Data Structures",
    shortDescription: "Explore core data structures, algorithms, and problem-solving techniques.",
    description:
      "Study arrays, linked lists, stacks, queues, trees, graphs, searching, sorting, and algorithm analysis through guided 300-level practice. This prototype uses sample learning content.",
    instructor: "Miss Oluwaseun Amore",
    instructorId: "user-6",
    category: "Data Structures",
    level: "300 Level",
    thumbnail: "/images/course-web-dev.jpg",
    tags: ["HTML", "CSS", "JavaScript", "Responsive Design"],
    enrolledCount: 1284,
    rating: 4.8,
    createdAt: "2024-09-01",
    totalLessons: 12,
    totalDuration: 180,
    objectives: [
      "Build fully functional websites using HTML, CSS, and JavaScript",
      "Understand responsive design principles and CSS Grid/Flexbox",
      "Write clean, maintainable JavaScript code",
      "Deploy websites to production hosting platforms",
    ],
    prerequisites: ["Basic computer literacy", "No programming experience required"],
    modules: [
      {
        id: "mod-1-1",
        title: "HTML Foundations",
        description: "Learn the building blocks of every web page",
        quizId: "quiz-1",
        lessons: [
          {
            id: "lesson-1-1-1",
            title: "Introduction to HTML",
            type: "reading",
            duration: 15,
            order: 1,
            content: `# Introduction to HTML

HTML (HyperText Markup Language) is the standard markup language used to create web pages. It describes the structure of web content using a series of elements represented by tags.

## What is HTML?

HTML is not a programming language — it is a **markup language** that defines the structure of your content. HTML consists of a series of elements that you use to enclose, or wrap, different parts of the content to make it appear or act a certain way.

## Your First HTML Document

Every HTML document follows this basic structure:

\`\`\`html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Page</title>
  </head>
  <body>
    <h1>Hello, World!</h1>
    <p>This is my first web page.</p>
  </body>
</html>
\`\`\`

## Key HTML Elements

- **\`<html>\`** - The root element of an HTML page
- **\`<head>\`** - Contains meta information about the document
- **\`<title>\`** - Specifies a title for the document (shown in browser tab)
- **\`<body>\`** - Contains the visible page content
- **\`<h1>\` to \`<h6>\`** - Headings (h1 is the largest)
- **\`<p>\`** - Paragraph
- **\`<a>\`** - Hyperlink
- **\`<img>\`** - Image
- **\`<div>\`** - Generic container for content

## Semantic HTML

Modern HTML encourages the use of semantic elements — tags that have meaning beyond just their appearance:

- **\`<header>\`** - Introductory content or navigation
- **\`<nav>\`** - Navigation links
- **\`<main>\`** - Main content of the page
- **\`<article>\`** - Independent, self-contained content
- **\`<section>\`** - A thematic grouping of content
- **\`<footer>\`** - Footer content

Using semantic HTML improves accessibility and SEO.

## Summary

In this lesson, you learned:
- What HTML is and its purpose
- The basic structure of an HTML document
- Common HTML elements and their uses
- The importance of semantic HTML

In the next lesson, we'll dive deeper into HTML forms and interactive elements.`,
          },
          {
            id: "lesson-1-1-2",
            title: "HTML Elements & Attributes",
            type: "reading",
            duration: 20,
            order: 2,
            content: `# HTML Elements & Attributes

## HTML Attributes

Attributes provide additional information about HTML elements. They are always specified in the **start tag** and usually come in name/value pairs like: \`name="value"\`.

### Common Attributes

\`\`\`html

<a href="https://example.com">Visit Example</a>


<img src="photo.jpg" alt="A beautiful photo">


<p class="highlight">This text is highlighted.</p>


<div id="main-content">Main content here</div>
\`\`\`

## HTML Forms

Forms are used to collect user input:

\`\`\`html
<form action="/submit" method="POST">
  <label for="name">Name:</label>
  <input type="text" id="name" name="name" required>

  <label for="email">Email:</label>
  <input type="email" id="email" name="email" required>

  <label for="message">Message:</label>
  <textarea id="message" name="message" rows="4"></textarea>

  <button type="submit">Send Message</button>
</form>
\`\`\`

## HTML Lists

### Unordered List
\`\`\`html
<ul>
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
</ul>
\`\`\`

### Ordered List
\`\`\`html
<ol>
  <li>Learn HTML</li>
  <li>Learn CSS</li>
  <li>Learn JavaScript</li>
</ol>
\`\`\`

## HTML Tables

\`\`\`html
<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Age</th>
      <th>City</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Alice</td>
      <td>28</td>
      <td>London</td>
    </tr>
  </tbody>
</table>
\`\`\`

## Key Takeaways

- Attributes modify or provide additional info to HTML elements
- Forms are essential for collecting user data
- Lists and tables help organise content structurally
- Always use appropriate semantic elements for better accessibility`,
          },
          {
            id: "lesson-1-1-3",
            title: "CSS Fundamentals",
            type: "reading",
            duration: 25,
            order: 3,
            content: `# CSS Fundamentals

CSS (Cascading Style Sheets) is the language we use to style an HTML document. It describes how HTML elements should be displayed.

## CSS Syntax

A CSS rule consists of a selector and a declaration block:

\`\`\`css
selector {
  property: value;
  property: value;
}
\`\`\`

## Ways to Add CSS

### 1. Inline CSS
\`\`\`html
<h1 style="color: blue; font-size: 24px;">Hello World</h1>
\`\`\`

### 2. Internal CSS (in \`<head>\`)
\`\`\`html
<style>
  h1 {
    color: blue;
    font-size: 24px;
  }
</style>
\`\`\`

### 3. External CSS (recommended)
\`\`\`html
<link rel="stylesheet" href="styles.css">
\`\`\`

## CSS Selectors

\`\`\`css

p { color: gray; }


.highlight { background-color: yellow; }


#header { font-size: 32px; }


nav a { text-decoration: none; }


a:hover { color: red; }
\`\`\`

## The CSS Box Model

Every HTML element is a rectangular box. The box model describes how these boxes are sized and spaced:

\`\`\`
┌─────────────────────────────┐
│           Margin            │
│  ┌───────────────────────┐  │
│  │        Border         │  │
│  │  ┌─────────────────┐  │  │
│  │  │     Padding      │  │  │
│  │  │  ┌───────────┐  │  │  │
│  │  │  │  Content  │  │  │  │
│  │  │  └───────────┘  │  │  │
│  │  └─────────────────┘  │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
\`\`\`

\`\`\`css
.box {
  width: 300px;
  padding: 20px;
  border: 2px solid black;
  margin: 10px;
}
\`\`\`

## Flexbox Layout

\`\`\`css
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}
\`\`\`

## Key Takeaways

- CSS controls the visual presentation of HTML
- The Box Model is fundamental to understanding layout
- Use external stylesheets for maintainability
- Flexbox makes creating layouts much easier`,
          },
          {
            id: "lesson-1-1-4",
            title: "Responsive Design Principles",
            type: "reading",
            duration: 20,
            order: 4,
            content: `# Responsive Design Principles

Responsive design ensures your website looks and works well on all devices — from desktop monitors to mobile phones.

## Core Principles

### 1. Fluid Grids
Use relative units (%, em, rem) instead of fixed pixels:

\`\`\`css
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.column {
  width: 50%;
}
\`\`\`

### 2. Flexible Images
\`\`\`css
img {
  max-width: 100%;
  height: auto;
}
\`\`\`

### 3. CSS Media Queries

Media queries allow you to apply different styles for different screen sizes:

\`\`\`css

.grid {
  display: grid;
  grid-template-columns: 1fr;
}


@media (min-width: 768px) {
  .grid {
    grid-template-columns: 1fr 1fr;
  }
}


@media (min-width: 1024px) {
  .grid {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
\`\`\`

## Mobile-First Design

Start with styles for small screens, then add complexity for larger screens. This approach ensures a good base experience and layers on complexity progressively.

## CSS Grid for Responsive Layouts

\`\`\`css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}
\`\`\`

This single line creates a responsive grid that automatically adjusts columns based on available space!

## Viewport Meta Tag

Always include this in your HTML \`<head>\`:

\`\`\`html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
\`\`\`

## Summary

Responsive design is no longer optional — it's essential. Key takeaways:
- Use relative units and flexible layouts
- Apply mobile-first methodology
- Test on multiple devices and screen sizes
- Use CSS Grid and Flexbox for modern layouts`,
          },
        ],
      },
      {
        id: "mod-1-2",
        title: "JavaScript Essentials",
        description: "Bring your web pages to life with JavaScript",
        quizId: "quiz-2",
        lessons: [
          {
            id: "lesson-1-2-1",
            title: "JavaScript Variables & Data Types",
            type: "reading",
            duration: 20,
            order: 1,
            content: `# JavaScript Variables & Data Types

JavaScript is the programming language of the web. It allows you to make your web pages dynamic and interactive.

## Variables

In modern JavaScript, use \`const\` and \`let\`:

\`\`\`javascript
const PI = 3.14159;
const siteName = "LevelUp";

let userScore = 0;
userScore = 85;

var oldVariable = "legacy";
\`\`\`

## Primitive Data Types

\`\`\`javascript
const name = "Alice";
const greeting = \`Hello, \${name}!\`; // Template literal

const age = 25;
const price = 9.99;

const isLoggedIn = true;
const isComplete = false;

const emptyValue = null;

let notAssigned;
console.log(notAssigned); // undefined
\`\`\`

## Objects & Arrays

\`\`\`javascript
const student = {
  name: "Alex",
  age: 22,
  course: "Web Development",
  isEnrolled: true
};

console.log(student.name); // "Alex"
console.log(student["course"]); // "Web Development"

const grades = [85, 92, 78, 96, 88];
console.log(grades[0]); // 85
console.log(grades.length); // 5
\`\`\`

## Functions

\`\`\`javascript
function greetStudent(name) {
  return \`Welcome back, \${name}!\`;
}

const calculateAverage = (scores) => {
  const sum = scores.reduce((acc, score) => acc + score, 0);
  return sum / scores.length;
};

console.log(greetStudent("Alex")); // "Welcome back, Alex!"
console.log(calculateAverage([85, 92, 78])); // 85
\`\`\`

## Summary

- Use \`const\` by default, \`let\` when you need to reassign
- JavaScript has 7 primitive types: string, number, boolean, null, undefined, symbol, bigint
- Objects and arrays are reference types
- Arrow functions provide a concise syntax for function expressions`,
          },
          {
            id: "lesson-1-2-2",
            title: "DOM Manipulation & Events",
            type: "reading",
            duration: 25,
            order: 2,
            content: `# DOM Manipulation & Events

The Document Object Model (DOM) is a programming interface for web documents. It represents the page as a tree of objects that JavaScript can interact with.

## Selecting Elements

\`\`\`javascript
const header = document.getElementById("main-header");

const buttons = document.getElementsByClassName("btn");

const navLink = document.querySelector(".nav-link");
const allCards = document.querySelectorAll(".card");
\`\`\`

## Modifying Elements

\`\`\`javascript
element.textContent = "New Text";

element.innerHTML = "<strong>Bold Text</strong>";

element.style.color = "blue";
element.style.fontSize = "18px";

element.classList.add("active");
element.classList.remove("hidden");
element.classList.toggle("selected");
\`\`\`

## Creating & Adding Elements

\`\`\`javascript
const newCard = document.createElement("div");
newCard.classList.add("card");
newCard.textContent = "New Course Card";

const container = document.querySelector(".container");
container.appendChild(newCard);
\`\`\`

## Event Handling

\`\`\`javascript
const submitBtn = document.querySelector("#submit-btn");

submitBtn.addEventListener("click", function(event) {
  event.preventDefault(); // Prevent form submission
  console.log("Button clicked!");
  validateForm();
});

element.addEventListener("click", handler);
element.addEventListener("mouseover", handler);
element.addEventListener("keydown", handler);
element.addEventListener("input", handler);
element.addEventListener("submit", handler);

document.querySelector(".course-list").addEventListener("click", (e) => {
  if (e.target.classList.contains("enroll-btn")) {
    enrollInCourse(e.target.dataset.courseId);
  }
});
\`\`\`

## Fetch API

\`\`\`javascript
async function fetchCourses() {
  try {
    const response = await fetch("/api/courses");
    const data = await response.json();
    renderCourses(data);
  } catch (error) {
    console.error("Failed to fetch courses:", error);
  }
}
\`\`\`

## Key Takeaways

- The DOM represents your HTML as a JavaScript-accessible tree
- Use \`querySelector\`/\`querySelectorAll\` for element selection
- Event listeners make pages interactive
- The Fetch API handles asynchronous data loading`,
          },
          {
            id: "lesson-1-2-3",
            title: "Asynchronous JavaScript",
            type: "reading",
            duration: 25,
            order: 3,
            content: `# Asynchronous JavaScript

JavaScript is single-threaded, but asynchronous programming allows non-blocking operations, making your apps responsive even when waiting for data.

## The Event Loop

JavaScript uses an event loop to handle asynchronous operations without blocking the main thread.

## Callbacks (Old Approach)

\`\`\`javascript
fetchUser(userId, function(user) {
  fetchCourses(user.id, function(courses) {
    fetchGrades(courses[0].id, function(grades) {
      displayResults(grades);
    });
  });
});
\`\`\`

## Promises

\`\`\`javascript
fetchUser(userId)
  .then(user => fetchCourses(user.id))
  .then(courses => fetchGrades(courses[0].id))
  .then(grades => displayResults(grades))
  .catch(error => console.error("Error:", error));
\`\`\`

## Async/Await (Modern Approach)

\`\`\`javascript
async function loadStudentData(userId) {
  try {
    const user = await fetchUser(userId);
    const courses = await fetchCourses(user.id);
    const grades = await fetchGrades(courses[0].id);
    displayResults(grades);
  } catch (error) {
    showErrorMessage("Failed to load data");
    console.error(error);
  }
}

async function loadDashboard(userId) {
  try {
    const [user, notifications] = await Promise.all([
      fetchUser(userId),
      fetchNotifications(userId)
    ]);
    renderDashboard(user, notifications);
  } catch (error) {
    handleError(error);
  }
}
\`\`\`

## Local Storage

\`\`\`javascript
localStorage.setItem("userPrefs", JSON.stringify({ theme: "dark" }));

const prefs = JSON.parse(localStorage.getItem("userPrefs"));

localStorage.removeItem("userPrefs");
\`\`\`

## Summary

- Always use async/await for modern asynchronous JavaScript
- Use Promise.all() for parallel operations
- Handle errors with try/catch blocks
- localStorage persists data between sessions`,
          },
          {
            id: "lesson-1-2-4",
            title: "ES6+ Modern JavaScript",
            type: "reading",
            duration: 20,
            order: 4,
            content: `# ES6+ Modern JavaScript Features

ES6 (ECMAScript 2015) and later versions introduced powerful features that modernize JavaScript development.

## Destructuring

\`\`\`javascript
const [first, second, ...rest] = [1, 2, 3, 4, 5];
console.log(first); // 1
console.log(rest);  // [3, 4, 5]

const { name, age, role = "student" } = user;

function displayUser({ name, email, role }) {
  console.log(\`\${name} (\${role}): \${email}\`);
}
\`\`\`

## Spread & Rest Operators

\`\`\`javascript
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5, 6]; // [1, 2, 3, 4, 5, 6]

const user = { name: "Alex", age: 22 };
const updatedUser = { ...user, role: "student" };

function sum(...numbers) {
  return numbers.reduce((acc, n) => acc + n, 0);
}
\`\`\`

## Array Methods

\`\`\`javascript
const courses = [
  { id: 1, title: "Web Dev", level: "beginner", enrolled: true },
  { id: 2, title: "React", level: "intermediate", enrolled: false },
  { id: 3, title: "Node.js", level: "advanced", enrolled: true },
];

const enrolledCourses = courses.filter(c => c.enrolled);

const titles = courses.map(c => c.title);

const beginnerCourse = courses.find(c => c.level === "beginner");

const enrolledCount = courses.reduce((count, c) =>
  c.enrolled ? count + 1 : count, 0
);

const enrolledTitles = courses
  .filter(c => c.enrolled)
  .map(c => c.title);
\`\`\`

## Modules

\`\`\`javascript
export const add = (a, b) => a + b;
export const multiply = (a, b) => a * b;

export default function formatDate(date) {
  return new Intl.DateTimeFormat("en-GB").format(date);
}

import formatDate from "./utils.js";
import { add, multiply } from "./math.js";
\`\`\`

## Summary

Modern JavaScript features make code more readable, concise, and maintainable. Master destructuring, spread/rest, and array methods as they're used constantly in React and modern frameworks.`,
          },
        ],
      },
    ],
  },
  {
    id: "course-2",
    title: "CSC 307 · Operating Systems",
    shortDescription: "Explore processes, memory management, concurrency, and operating system design.",
    description:
      "Examine current directions in computer science, emerging technologies, and innovation practices. Lessons and assessment examples are sample content for this 300-level project.",
    instructor: "Miss Oluwaseun Amore",
    instructorId: "user-6",
    category: "Operating Systems",
    level: "300 Level",
    thumbnail: "/images/course-react.jpg",
    tags: ["React", "JavaScript", "Frontend", "Hooks", "State Management"],
    enrolledCount: 892,
    rating: 4.9,
    createdAt: "2024-10-15",
    totalLessons: 10,
    totalDuration: 160,
    objectives: [
      "Build complex React applications with functional components and hooks",
      "Manage application state effectively with useState, useReducer, and Context",
      "Optimize React performance with useMemo, useCallback, and React.memo",
      "Integrate with REST APIs and handle asynchronous data fetching",
    ],
    prerequisites: ["JavaScript fundamentals", "Basic HTML & CSS knowledge"],
    modules: [
      {
        id: "mod-2-1",
        title: "React Fundamentals",
        description: "Components, props, and JSX",
        quizId: "quiz-3",
        lessons: [
          {
            id: "lesson-2-1-1",
            title: "Introduction to React",
            type: "reading",
            duration: 20,
            order: 1,
            content: `# Introduction to React

React is a JavaScript library for building user interfaces, developed by Facebook (now Meta). It's component-based, declarative, and uses a virtual DOM for efficient updates.

## Why React?

- **Component-Based**: Build encapsulated components that manage their own state
- **Declarative**: Describe what the UI should look like, React handles the DOM updates
- **Virtual DOM**: React creates a lightweight copy of the DOM to minimize expensive real DOM operations
- **Ecosystem**: Huge ecosystem of tools, libraries, and community support

## Your First React Component

\`\`\`jsx
function WelcomeCard({ name, role }) {
  return (
    <div className="card">
      <h2>Welcome, {name}!</h2>
      <p>Role: {role}</p>
    </div>
  );
}

function App() {
  return (
    <main>
      <WelcomeCard name="Alex" role="Student" />
      <WelcomeCard name="Sarah" role="Instructor" />
    </main>
  );
}
\`\`\`

## JSX Rules

\`\`\`jsx
function Component() {
  return (
    <>
      <h1>Title</h1>
      <p>Content</p>
    </>
  );
}



const message = "Hello";
return <h1>{message}</h1>;
\`\`\`

## Props

Props allow you to pass data from parent to child components:

\`\`\`jsx
<CourseCard
  title="Web Development"
  level="Beginner"
  instructor="Dr. Mitchell"
  enrolledCount={1284}
/>

function CourseCard({ title, level, instructor, enrolledCount }) {
  return (
    <div className="course-card">
      <h3>{title}</h3>
      <span className="badge">{level}</span>
      <p>by {instructor}</p>
      <p>{enrolledCount} students enrolled</p>
    </div>
  );
}
\`\`\`

## Key Takeaways

- React is component-based — build small, reusable pieces
- JSX is JavaScript + HTML-like syntax that compiles to React.createElement()
- Props pass data down the component tree (parent → child)
- Components must return JSX`,
          },
          {
            id: "lesson-2-1-2",
            title: "State & Event Handling",
            type: "reading",
            duration: 25,
            order: 2,
            content: `# State & Event Handling in React

State allows React components to respond to user interactions and update the UI dynamically.

## useState Hook

\`\`\`jsx
import { useState } from 'react';

function QuizComponent() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const handleAnswer = (selectedIndex) => {
    if (selectedIndex === questions[currentQuestion].correct) {
      setScore(prev => prev + 1);
    }

    if (currentQuestion + 1 >= questions.length) {
      setIsFinished(true);
    } else {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  if (isFinished) {
    return <ResultCard score={score} total={questions.length} />;
  }

  return (
    <div>
      <p>Question {currentQuestion + 1} of {questions.length}</p>
      <p>{questions[currentQuestion].text}</p>
      {questions[currentQuestion].options.map((option, i) => (
        <button key={i} onClick={() => handleAnswer(i)}>
          {option}
        </button>
      ))}
    </div>
  );
}
\`\`\`

## State Update Rules

\`\`\`jsx
state.count++;
setState(prev => prev + 1);

const [user, setUser] = useState({ name: "Alex", score: 0 });
user.score = 85;
setUser(prev => ({ ...prev, score: 85 }));

const [courses, setCourses] = useState([]);
setCourses(prev => [...prev, newCourse]);
setCourses(prev => prev.filter(c => c.id !== courseId));
setCourses(prev => prev.map(c => c.id === id ? { ...c, enrolled: true } : c));
\`\`\`

## Event Handling

\`\`\`jsx
function SearchBar() {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchCourses(query);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search courses..."
      />
      <button type="submit">Search</button>
    </form>
  );
}
\`\`\`

## Lifting State Up

When multiple components need to share state, lift it to their closest common ancestor:

\`\`\`jsx
function CourseFilter() {
  const [selectedLevel, setSelectedLevel] = useState("all");

  return (
    <>
      <FilterButtons
        selected={selectedLevel}
        onChange={setSelectedLevel}
      />
      <CourseGrid level={selectedLevel} />
    </>
  );
}
\`\`\`

## Key Takeaways

- useState manages component-level state
- Always treat state as immutable — create new values instead of modifying
- Events in React use camelCase (onClick, onChange, onSubmit)
- Lift state up to share it between components`,
          },
          {
            id: "lesson-2-1-3",
            title: "useEffect & Data Fetching",
            type: "reading",
            duration: 25,
            order: 3,
            content: `# useEffect & Data Fetching

useEffect allows you to perform side effects in functional components — things like data fetching, subscriptions, and DOM manipulation.

## useEffect Basics

\`\`\`jsx
import { useState, useEffect } from 'react';

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    fetchCoursesByCategory(selectedCategory);
  }, [selectedCategory]);
}
\`\`\`

## Data Fetching Pattern

\`\`\`jsx
function StudentProgress({ studentId }) {
  const [progress, setProgress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; // Prevent state update on unmounted component

    async function loadProgress() {
      try {
        setIsLoading(true);
        const data = await fetchStudentProgress(studentId);
        if (isMounted) {
          setProgress(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProgress();

    return () => {
      isMounted = false;
    };
  }, [studentId]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  return <ProgressDisplay data={progress} />;
}
\`\`\`

## Cleanup Functions

\`\`\`jsx
useEffect(() => {
  const timer = setInterval(() => {
    updateProgress();
  }, 5000);

  return () => clearInterval(timer);
}, []);
\`\`\`

## Custom Hooks

Extract reusable effect logic into custom hooks:

\`\`\`jsx
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  const setStoredValue = (newValue) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, setStoredValue];
}

const [theme, setTheme] = useLocalStorage("theme", "light");
\`\`\`

## Key Takeaways

- useEffect handles side effects (data fetching, subscriptions, DOM updates)
- The dependency array controls when the effect runs
- Always return a cleanup function when setting up subscriptions or timers
- Custom hooks let you extract and reuse effect logic`,
          },
        ],
      },
    ],
  },
  {
    id: "course-3",
    title: "CSC 321 · Computer Science Innovation and New Technologies",
    shortDescription: "Investigate new technologies and innovation in contemporary computer science.",
    description:
      "This comprehensive data science course takes you from Python basics to implementing machine learning algorithms. You'll work with real datasets using NumPy and Pandas for data manipulation, Matplotlib for visualisation, and Scikit-learn for machine learning. The course includes hands-on projects covering regression, classification, and data analysis.",
    instructor: "Miss Oluwaseun Amore",
    instructorId: "user-6",
    category: "Innovation",
    level: "300 Level",
    thumbnail: "/images/course-python.jpg",
    tags: ["Python", "Machine Learning", "Data Science", "NumPy", "Pandas"],
    enrolledCount: 2341,
    rating: 4.7,
    createdAt: "2024-11-01",
    totalLessons: 10,
    totalDuration: 150,
    objectives: [
      "Write efficient Python code for data analysis tasks",
      "Manipulate and analyse datasets using Pandas and NumPy",
      "Visualise data insights using Matplotlib and Seaborn",
      "Build and evaluate machine learning models with Scikit-learn",
    ],
    prerequisites: ["Basic programming concepts", "High school mathematics"],
    modules: [
      {
        id: "mod-3-1",
        title: "Python & Data Libraries",
        description: "Python fundamentals and the data science stack",
        quizId: "quiz-4",
        lessons: [
          {
            id: "lesson-3-1-1",
            title: "Python for Data Science",
            type: "reading",
            duration: 25,
            order: 1,
            content: `# Python for Data Science

Python has become the dominant language in data science due to its simplicity, readability, and powerful ecosystem of libraries.

## Why Python for Data Science?

- **Readable Syntax**: Easy to learn and write
- **Rich Ecosystem**: NumPy, Pandas, Matplotlib, Scikit-learn, TensorFlow
- **Community**: Huge data science community and resources
- **Versatility**: From data cleaning to deep learning

## Setting Up Your Environment

\`\`\`python
# Install essential libraries
# pip install numpy pandas matplotlib scikit-learn jupyter

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split

print(f"NumPy version: {np.__version__}")
print(f"Pandas version: {pd.__version__}")
\`\`\`

## Python Basics Refresher

\`\`\`python
# Variables and types
name = "Alice"
score = 92.5
is_enrolled = True
grade = None

# Lists (mutable)
scores = [85, 92, 78, 96, 88]
print(f"Average: {sum(scores) / len(scores):.1f}")

# Dictionaries
student = {
    "name": "Alex Johnson",
    "id": "B01799327",
    "courses": ["Web Dev", "Python", "ML"],
    "gpa": 3.8
}

# List comprehension
passing_scores = [s for s in scores if s >= 70]
percentages = [s / 100 for s in scores]
\`\`\`

## NumPy Basics

\`\`\`python
import numpy as np

# Create arrays
arr = np.array([1, 2, 3, 4, 5])
matrix = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])

# Array operations (vectorised - much faster than loops)
scores = np.array([85, 92, 78, 96, 88])
print(f"Mean: {scores.mean():.1f}")
print(f"Std Dev: {scores.std():.1f}")
print(f"Max: {scores.max()}, Min: {scores.min()}")

# Broadcasting
normalised = (scores - scores.mean()) / scores.std()

# Shape and indexing
print(f"Shape: {matrix.shape}")  # (3, 3)
print(f"Row 0: {matrix[0]}")     # [1, 2, 3]
print(f"Element: {matrix[1, 2]}") # 6
\`\`\`

## Pandas DataFrames

\`\`\`python
import pandas as pd

# Create a DataFrame
data = {
    "student": ["Alice", "Bob", "Charlie", "Diana"],
    "quiz1": [85, 72, 91, 78],
    "quiz2": [88, 76, 86, 92],
    "assignment": [90, 68, 95, 85]
}
df = pd.DataFrame(data)

# Basic exploration
print(df.head())          # First 5 rows
print(df.describe())      # Statistical summary
print(df.dtypes)          # Column types
print(df.shape)           # (rows, columns)

# Access columns
print(df["quiz1"])
print(df[["quiz1", "quiz2"]])

# Filtering
high_performers = df[df["quiz1"] > 80]

# New column
df["total"] = df["quiz1"] + df["quiz2"] + df["assignment"]
df["average"] = df["total"] / 3
\`\`\`

## Summary

Python's clean syntax and powerful data libraries make it ideal for data science. The combination of NumPy for numerical computing, Pandas for data manipulation, and Scikit-learn for ML forms the core data science stack.`,
          },
          {
            id: "lesson-3-1-2",
            title: "Data Visualisation with Matplotlib",
            type: "reading",
            duration: 20,
            order: 2,
            content: `# Data Visualisation with Matplotlib

Effective data visualisation is a critical skill in data science. Matplotlib is the foundational plotting library in Python.

## Basic Plots

\`\`\`python
import matplotlib.pyplot as plt
import numpy as np

# Line plot - great for trends over time
months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
scores = [72, 78, 75, 83, 88, 91]

plt.figure(figsize=(10, 6))
plt.plot(months, scores, marker='o', linewidth=2, color='#2563EB')
plt.fill_between(range(len(months)), scores, alpha=0.1, color='#2563EB')
plt.title('Student Performance Over Time', fontsize=16, fontweight='bold')
plt.xlabel('Month')
plt.ylabel('Average Score (%)')
plt.ylim(0, 100)
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()
\`\`\`

## Bar Charts

\`\`\`python
# Compare performance across courses
courses = ['Web Dev', 'React', 'Python', 'ML']
avg_scores = [82, 78, 85, 76]
colors = ['#2563EB', '#16A34A', '#DC2626', '#D97706']

plt.figure(figsize=(10, 6))
bars = plt.bar(courses, avg_scores, color=colors, edgecolor='white', linewidth=0.5)

# Add value labels on bars
for bar, score in zip(bars, avg_scores):
    plt.text(bar.get_x() + bar.get_width()/2., bar.get_height() + 0.5,
             f'{score}%', ha='center', va='bottom', fontweight='bold')

plt.title('Average Scores by Course', fontsize=16, fontweight='bold')
plt.ylabel('Average Score (%)')
plt.ylim(0, 100)
plt.axhline(y=70, color='red', linestyle='--', alpha=0.7, label='Passing Grade (70%)')
plt.legend()
plt.tight_layout()
plt.show()
\`\`\`

## Histograms & Distributions

\`\`\`python
# Score distribution
np.random.seed(42)
scores = np.random.normal(75, 12, 200)  # Mean=75, std=12, n=200

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

# Histogram
ax1.hist(scores, bins=20, color='#2563EB', edgecolor='white', alpha=0.8)
ax1.axvline(scores.mean(), color='red', linestyle='--', label=f'Mean: {scores.mean():.1f}')
ax1.set_title('Score Distribution')
ax1.set_xlabel('Score')
ax1.set_ylabel('Frequency')
ax1.legend()

# Box plot
ax2.boxplot(scores, patch_artist=True,
            boxprops=dict(facecolor='#2563EB', alpha=0.7))
ax2.set_title('Score Box Plot')
ax2.set_ylabel('Score')

plt.tight_layout()
plt.show()
\`\`\`

## Heatmap (Correlation)

\`\`\`python
import seaborn as sns  # Built on top of matplotlib

# Correlation matrix
corr_data = df[['quiz1', 'quiz2', 'assignment', 'total']].corr()
plt.figure(figsize=(8, 6))
sns.heatmap(corr_data, annot=True, cmap='coolwarm', center=0,
            fmt='.2f', square=True)
plt.title('Correlation Heatmap')
plt.show()
\`\`\`

## Best Practices

1. Always label your axes and add titles
2. Use appropriate chart types for your data
3. Use colorblind-friendly palettes
4. Keep it simple — don't overload with information
5. Provide context with annotations and references lines`,
          },
          {
            id: "lesson-3-1-3",
            title: "Machine Learning with Scikit-learn",
            type: "reading",
            duration: 30,
            order: 3,
            content: `# Machine Learning with Scikit-learn

Scikit-learn provides a consistent API for hundreds of machine learning algorithms, making it the most popular ML library for beginners and professionals alike.

## The Machine Learning Workflow

1. **Define the problem** - What are you predicting?
2. **Collect and explore data** - EDA
3. **Preprocess data** - Clean, encode, scale
4. **Split data** - Training and test sets
5. **Choose and train a model**
6. **Evaluate the model**
7. **Improve and deploy**

## Complete Example: Predicting Student Performance

\`\`\`python
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, r2_score

# 1. Generate sample student data
np.random.seed(42)
n_students = 500

data = {
    'study_hours': np.random.normal(5, 2, n_students).clip(0, 12),
    'attendance': np.random.normal(80, 15, n_students).clip(0, 100),
    'prev_score': np.random.normal(70, 15, n_students).clip(0, 100),
    'quiz_avg': np.random.normal(72, 12, n_students).clip(0, 100)
}
df = pd.DataFrame(data)

# Target: final score (regression)
df['final_score'] = (
    0.3 * df['study_hours'] * 4 +
    0.2 * df['attendance'] * 0.8 +
    0.3 * df['prev_score'] +
    0.2 * df['quiz_avg'] +
    np.random.normal(0, 5, n_students)
).clip(0, 100)

# Binary target: pass (>=60) or fail
df['passed'] = (df['final_score'] >= 60).astype(int)

# 2. Prepare features and target
X = df[['study_hours', 'attendance', 'prev_score', 'quiz_avg']]
y_reg = df['final_score']
y_cls = df['passed']

# 3. Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y_cls, test_size=0.2, random_state=42, stratify=y_cls
)

# 4. Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# 5. Train models
models = {
    'Logistic Regression': LogisticRegression(random_state=42),
    'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42)
}

for name, model in models.items():
    model.fit(X_train_scaled, y_train)
    y_pred = model.predict(X_test_scaled)
    accuracy = accuracy_score(y_test, y_pred)
    cv_score = cross_val_score(model, X_train_scaled, y_train, cv=5).mean()
    print(f"{name}:")
    print(f"  Accuracy: {accuracy:.3f}")
    print(f"  CV Score: {cv_score:.3f}")
    print()

# 6. Feature Importance (Random Forest)
rf = models['Random Forest']
importances = pd.Series(
    rf.feature_importances_,
    index=X.columns
).sort_values(ascending=False)
print("Feature Importances:")
print(importances)
\`\`\`

## Key Concepts

### Bias-Variance Tradeoff
- **High Bias (Underfitting)**: Model too simple, misses patterns
- **High Variance (Overfitting)**: Model too complex, memorises noise
- **Goal**: Find the sweet spot with good generalisation

### Cross-Validation
Always use cross-validation for reliable performance estimates:
\`\`\`python
from sklearn.model_selection import KFold
cv = KFold(n_splits=5, shuffle=True, random_state=42)
scores = cross_val_score(model, X, y, cv=cv, scoring='accuracy')
print(f"CV Accuracy: {scores.mean():.3f} ± {scores.std():.3f}")
\`\`\`

## Summary

Scikit-learn's consistent API (fit/predict/score) makes it easy to experiment with different algorithms. Always split your data, scale features, and use cross-validation for reliable evaluation.`,
          },
        ],
      },
      {
        id: "mod-3-2",
        title: "Machine Learning Concepts",
        description: "Algorithms, evaluation, and practical applications",
        quizId: "quiz-5",
        lessons: [
          {
            id: "lesson-3-2-1",
            title: "Supervised Learning Deep Dive",
            type: "reading",
            duration: 30,
            order: 1,
            content: `# Supervised Learning Deep Dive

Supervised learning uses labelled training data to learn a mapping from inputs to outputs.

## Types of Problems

### Regression (Continuous Output)
Predict a numerical value:
- Student final grade (0-100)
- House price
- Temperature forecast

### Classification (Categorical Output)
Predict a category:
- Pass/Fail prediction
- Email spam detection
- Medical diagnosis

## Key Algorithms

### Linear Regression
\`\`\`python
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

model = LinearRegression()
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

print(f"R² Score: {r2_score(y_test, y_pred):.3f}")
print(f"RMSE: {np.sqrt(mean_squared_error(y_test, y_pred)):.2f}")
print(f"Coefficients: {dict(zip(feature_names, model.coef_))}")
\`\`\`

### Decision Trees & Random Forests
\`\`\`python
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier

# Decision Tree (interpretable but prone to overfitting)
dt = DecisionTreeClassifier(max_depth=5, random_state=42)
dt.fit(X_train, y_train)

# Random Forest (ensemble of trees - more robust)
rf = RandomForestClassifier(
    n_estimators=100,
    max_depth=10,
    min_samples_split=5,
    random_state=42
)
rf.fit(X_train, y_train)
print(f"Random Forest Accuracy: {rf.score(X_test, y_test):.3f}")
\`\`\`

### Support Vector Machines
\`\`\`python
from sklearn.svm import SVC
from sklearn.pipeline import Pipeline

# Pipeline: scale + train
svm_pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('svm', SVC(kernel='rbf', C=1.0, gamma='scale'))
])
svm_pipeline.fit(X_train, y_train)
\`\`\`

## Model Evaluation Metrics

### For Classification
\`\`\`python
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score,
    f1_score, confusion_matrix, classification_report
)

print(classification_report(y_test, y_pred))
# Shows precision, recall, F1 for each class

cm = confusion_matrix(y_test, y_pred)
# [[TN, FP],
#  [FN, TP]]
\`\`\`

### For Regression
\`\`\`python
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

print(f"MAE: {mean_absolute_error(y_test, y_pred):.2f}")
print(f"RMSE: {np.sqrt(mean_squared_error(y_test, y_pred)):.2f}")
print(f"R²: {r2_score(y_test, y_pred):.3f}")
\`\`\`

## Hyperparameter Tuning

\`\`\`python
from sklearn.model_selection import GridSearchCV

param_grid = {
    'n_estimators': [50, 100, 200],
    'max_depth': [5, 10, None],
    'min_samples_split': [2, 5, 10]
}

grid_search = GridSearchCV(
    RandomForestClassifier(random_state=42),
    param_grid,
    cv=5,
    scoring='accuracy',
    n_jobs=-1  # Use all CPU cores
)
grid_search.fit(X_train, y_train)
print(f"Best params: {grid_search.best_params_}")
print(f"Best CV score: {grid_search.best_score_:.3f}")
\`\`\`

## Summary

Supervised learning is the foundation of predictive analytics. Master the evaluation metrics, understand the bias-variance tradeoff, and always use proper validation techniques to build reliable models.`,
          },
          {
            id: "lesson-3-2-2",
            title: "Adaptive Learning & Personalisation",
            type: "reading",
            duration: 25,
            order: 2,
            content: `# Adaptive Learning & Personalisation in Educational Systems

Adaptive learning systems use data about learner behaviour and performance to personalise the learning experience.

## Core Concepts

### Learner Modelling
Track key learner attributes:
- **Knowledge State**: What the learner knows
- **Performance Data**: Quiz scores, time on task
- **Learning Style**: Visual, auditory, reading/writing, kinesthetic
- **Engagement Metrics**: Session duration, completion rates

### Adaptive Strategies

\`\`\`python
class AdaptiveLearningEngine:
    def __init__(self):
        self.difficulty_levels = ['beginner', 'intermediate', 'advanced']

    def calculate_proficiency(self, quiz_scores, lesson_times):
        """
        Calculate learner proficiency based on performance data.
        Returns a score from 0-100.
        """
        if not quiz_scores:
            return 50  # Default to intermediate

        avg_score = sum(quiz_scores) / len(quiz_scores)
        consistency = 1 - (max(quiz_scores) - min(quiz_scores)) / 100

        # Weight recent performance more heavily
        recency_weights = [0.5 ** i for i in range(len(quiz_scores))]
        recency_weights = [w / sum(recency_weights) for w in recency_weights]
        weighted_score = sum(s * w for s, w in zip(reversed(quiz_scores), recency_weights))

        # Combine metrics
        proficiency = 0.6 * weighted_score + 0.2 * avg_score + 0.2 * consistency * 100
        return min(100, max(0, proficiency))

    def recommend_difficulty(self, proficiency_score):
        """Map proficiency to recommended difficulty."""
        if proficiency_score < 40:
            return 'beginner'
        elif proficiency_score < 70:
            return 'intermediate'
        else:
            return 'advanced'

    def recommend_next_content(self, learner_profile, available_content):
        """
        Rule-based content recommendation.
        """
        proficiency = self.calculate_proficiency(
            learner_profile['quiz_scores'],
            learner_profile['lesson_times']
        )
        recommended_level = self.recommend_difficulty(proficiency)

        # Filter content by recommended level
        suitable = [c for c in available_content
                   if c['difficulty'] == recommended_level
                   and c['id'] not in learner_profile['completed']]

        if not suitable:
            # Fall back to any uncompleted content
            suitable = [c for c in available_content
                       if c['id'] not in learner_profile['completed']]

        # Sort by relevance (topics learner struggles with)
        return sorted(suitable, key=lambda c:
                      -learner_profile['topic_scores'].get(c['topic'], 50))[:5]
\`\`\`

## Adaptive Feedback System

\`\`\`python
def generate_adaptive_feedback(score, topic, previous_attempts):
    """Generate personalised feedback based on performance."""

    if score >= 90:
        feedback = {
            "type": "excellence",
            "message": f"Outstanding! You've mastered {topic}.",
            "recommendation": "Challenge yourself with advanced topics.",
            "next_difficulty": "advanced"
        }
    elif score >= 70:
        feedback = {
            "type": "proficient",
            "message": f"Good work on {topic}! A few areas to review.",
            "recommendation": "Review the concepts you missed, then proceed.",
            "next_difficulty": "intermediate"
        }
    elif score >= 50:
        feedback = {
            "type": "developing",
            "message": f"Keep working on {topic}. You're making progress.",
            "recommendation": "Revisit the core lessons before retrying.",
            "next_difficulty": "beginner"
        }
    else:
        feedback = {
            "type": "struggling",
            "message": f"Let's strengthen your foundation in {topic}.",
            "recommendation": "Start with the fundamentals and build up gradually.",
            "next_difficulty": "beginner",
            "suggest_resources": True
        }

    # Adjust for repeated attempts
    if len(previous_attempts) >= 3:
        feedback["additional"] = "Consider seeking help from your instructor."

    return feedback
\`\`\`

## Learning Path Optimisation

The adaptive system in this LMS uses these rules:
1. **Below 50% quiz score** → Recommend reviewing foundational lessons
2. **50-70% quiz score** → Standard progression, with targeted review
3. **Above 70% quiz score** → Progress to next module, optionally skip simpler content
4. **Above 90% quiz score** → Unlock advanced bonus content

## Real-World Adaptive LMS Examples

- **Duolingo**: Uses spaced repetition and performance-based difficulty
- **Khan Academy**: Mastery-based progression with adaptive hints
- **Coursera**: Personalised course recommendations based on learning history
- **Smart Sparrow**: Branching scenarios based on learner responses

## Ethical Considerations

- Transparency: Learners should know when content is being adapted
- Bias: Ensure recommendations don't disadvantage certain groups
- Privacy: Learner data must be protected and used responsibly
- Agency: Learners should be able to override recommendations

## Summary

Adaptive learning bridges the gap between one-size-fits-all education and truly personalised tutoring. By combining learner data with intelligent rules, systems like this LMS can guide each student towards their optimal learning path.`,
          },
        ],
      },
    ],
  },
  {
    id: "course-4",
    title: "DTS 305 · Data Management I",
    shortDescription: "Manage data with relational concepts, SQL operations, data integrity, and database design.",
    description:
      "Build foundational data management skills, including relational data, SQL operations, data integrity, and introductory database design. Activities use demo records only.",
    instructor: "Miss Oluwaseun Amore",
    instructorId: "user-6",
    category: "Data Management",
    level: "300 Level",
    thumbnail: "/images/course-database.jpg",
    tags: ["SQL", "PostgreSQL", "Database Design", "Query Optimisation"],
    enrolledCount: 654,
    rating: 4.6,
    createdAt: "2024-12-01",
    totalLessons: 8,
    totalDuration: 120,
    objectives: [
      "Design normalised relational database schemas",
      "Write complex SQL queries using joins, subqueries, and window functions",
      "Optimise query performance with indexes and query analysis",
      "Understand ACID transactions and concurrency control",
    ],
    prerequisites: ["Basic computer literacy", "No prior database experience required"],
    modules: [
      {
        id: "mod-4-1",
        title: "SQL Foundations",
        description: "Relational model, basic SQL, and database design",
        quizId: undefined,
        lessons: [
          {
            id: "lesson-4-1-1",
            title: "Introduction to Databases & SQL",
            type: "reading",
            duration: 20,
            order: 1,
            content: `# Introduction to Databases & SQL

A database is an organised collection of structured information, stored electronically. A Database Management System (DBMS) provides the tools to create, read, update, and delete that data.

## The Relational Model

Relational databases organise data into **tables** (also called relations) with **rows** (records) and **columns** (attributes).

### Key Concepts

- **Table/Relation**: A collection of related data
- **Row/Tuple**: A single data record
- **Column/Attribute**: A specific piece of information
- **Primary Key**: Uniquely identifies each row
- **Foreign Key**: References a primary key in another table
- **Index**: A data structure that speeds up queries

## Example: LMS Database Schema

\`\`\`sql
CREATE TABLE users (
    user_id    SERIAL PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(150) UNIQUE NOT NULL,
    role       VARCHAR(20) DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE courses (
    course_id   SERIAL PRIMARY KEY,
    title       VARCHAR(200) NOT NULL,
    description TEXT,
    level       VARCHAR(20),
    instructor_id INT REFERENCES users(user_id)
);

CREATE TABLE enrollments (
    enrollment_id SERIAL PRIMARY KEY,
    user_id       INT REFERENCES users(user_id) ON DELETE CASCADE,
    course_id     INT REFERENCES courses(course_id) ON DELETE CASCADE,
    enrolled_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed     BOOLEAN DEFAULT FALSE,
    UNIQUE(user_id, course_id)  -- Prevent duplicate enrollments
);
\`\`\`

## Basic SQL Commands

\`\`\`sql
SELECT name, email FROM users WHERE role = 'student';

INSERT INTO users (name, email, role)
VALUES ('Alex Johnson', 'alex@example.com', 'student');

UPDATE users
SET name = 'Alexander Johnson'
WHERE email = 'alex@example.com';

DELETE FROM users WHERE user_id = 5;
\`\`\`

## Filtering and Sorting

\`\`\`sql
SELECT * FROM courses
WHERE level = 'Beginner'
  AND instructor_id IS NOT NULL;

SELECT title, rating
FROM courses
ORDER BY rating DESC, title ASC;

SELECT * FROM courses
ORDER BY created_at DESC
LIMIT 10 OFFSET 20;  -- Page 3 of 10-per-page results
\`\`\`

## Summary

SQL (Structured Query Language) is the standard language for relational databases. Mastering the SELECT, INSERT, UPDATE, and DELETE commands along with WHERE filtering gives you the foundation to work with any relational database.`,
          },
          {
            id: "lesson-4-1-2",
            title: "Joins & Aggregations",
            type: "reading",
            duration: 25,
            order: 2,
            content: `# SQL Joins & Aggregations

Joins allow you to combine data from multiple tables, while aggregations summarise data across rows.

## Types of Joins

\`\`\`sql
SELECT
    u.name AS student_name,
    c.title AS course_title,
    e.enrolled_at
FROM enrollments e
INNER JOIN users u ON e.user_id = u.user_id
INNER JOIN courses c ON e.course_id = c.course_id
WHERE u.role = 'student';

SELECT
    u.name,
    COUNT(e.enrollment_id) AS courses_enrolled
FROM users u
LEFT JOIN enrollments e ON u.user_id = e.user_id
WHERE u.role = 'student'
GROUP BY u.user_id, u.name
ORDER BY courses_enrolled DESC;
\`\`\`

## Aggregation Functions

\`\`\`sql
SELECT
    c.title,
    COUNT(e.user_id) AS enrolled_students,
    AVG(qa.score) AS avg_quiz_score,
    MAX(qa.score) AS top_score,
    MIN(qa.score) AS lowest_score
FROM courses c
LEFT JOIN enrollments e ON c.course_id = e.course_id
LEFT JOIN quiz_attempts qa ON e.enrollment_id = qa.enrollment_id
GROUP BY c.course_id, c.title
ORDER BY enrolled_students DESC;
\`\`\`

## HAVING Clause

\`\`\`sql
SELECT
    c.title,
    COUNT(e.user_id) AS enrolled_students
FROM courses c
LEFT JOIN enrollments e ON c.course_id = e.course_id
GROUP BY c.course_id, c.title
HAVING COUNT(e.user_id) > 100
ORDER BY enrolled_students DESC;
\`\`\`

## Window Functions (Advanced)

\`\`\`sql
SELECT
    u.name,
    c.title,
    qa.score,
    RANK() OVER (PARTITION BY c.course_id ORDER BY qa.score DESC) AS rank_in_course,
    AVG(qa.score) OVER (PARTITION BY c.course_id) AS course_avg
FROM quiz_attempts qa
JOIN enrollments e ON qa.enrollment_id = e.enrollment_id
JOIN users u ON e.user_id = u.user_id
JOIN courses c ON e.course_id = c.course_id;
\`\`\`

## Practical: Analytics Query

\`\`\`sql
WITH learner_stats AS (
    SELECT
        u.user_id,
        u.name,
        COUNT(DISTINCT e.course_id) AS courses_enrolled,
        COUNT(DISTINCT CASE WHEN e.completed THEN e.course_id END) AS courses_completed,
        AVG(qa.score) AS avg_score,
        MAX(l.accessed_at) AS last_active
    FROM users u
    LEFT JOIN enrollments e ON u.user_id = e.user_id
    LEFT JOIN quiz_attempts qa ON e.enrollment_id = qa.enrollment_id
    LEFT JOIN lesson_access l ON u.user_id = l.user_id
    WHERE u.role = 'student'
    GROUP BY u.user_id, u.name
)
SELECT
    *,
    ROUND(courses_completed::numeric / NULLIF(courses_enrolled, 0) * 100, 1) AS completion_rate,
    CASE
        WHEN avg_score >= 85 THEN 'High Performer'
        WHEN avg_score >= 70 THEN 'On Track'
        ELSE 'Needs Support'
    END AS performance_tier
FROM learner_stats
ORDER BY avg_score DESC NULLS LAST;
\`\`\`

## Key Takeaways

- INNER JOIN returns only matching rows; LEFT JOIN keeps all left table rows
- GROUP BY + aggregate functions summarise data
- HAVING filters aggregated results
- Window functions enable powerful analytical queries without collapsing rows`,
          },
          {
            id: "lesson-4-1-3",
            title: "Database Design & Normalisation",
            type: "reading",
            duration: 30,
            order: 3,
            content: `# Database Design & Normalisation

Good database design prevents data redundancy and inconsistency through a process called normalisation.

## Normal Forms

### First Normal Form (1NF)
- Each column contains atomic (indivisible) values
- No repeating groups of columns

\`\`\`sql

CREATE TABLE enrollments (
    user_id   INT REFERENCES users(user_id),
    course_id INT REFERENCES courses(course_id),
    PRIMARY KEY (user_id, course_id)
);
\`\`\`

### Second Normal Form (2NF)
- Must be in 1NF
- All non-key attributes depend on the entire primary key

### Third Normal Form (3NF)
- Must be in 2NF
- No transitive dependencies (non-key columns should not depend on other non-key columns)

## Entity-Relationship (ER) Diagram

For our LMS:

\`\`\`
USERS ──< ENROLLMENTS >── COURSES
  |                           |
  |                       MODULES
  |                           |
  |                        LESSONS
  |
  └──< QUIZ_ATTEMPTS >── QUIZZES
\`\`\`

## Indexing Strategy

\`\`\`sql
CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_quiz_attempts_score ON quiz_attempts(score);
CREATE INDEX idx_users_email ON users(email);

CREATE INDEX idx_enrollments_user_course ON enrollments(user_id, course_id);

CREATE INDEX idx_active_users ON users(last_active)
WHERE is_active = TRUE;
\`\`\`

## Transactions & ACID Properties

\`\`\`sql
BEGIN;

INSERT INTO enrollments (user_id, course_id) VALUES (42, 7);
UPDATE courses SET enrolled_count = enrolled_count + 1 WHERE course_id = 7;
INSERT INTO activity_log (user_id, action) VALUES (42, 'enrolled_in_course_7');

COMMIT;  -- All succeed together

ROLLBACK;  -- Nothing is changed
\`\`\`

## Performance Optimisation

\`\`\`sql
EXPLAIN ANALYZE
SELECT u.name, COUNT(e.*)
FROM users u
JOIN enrollments e ON u.user_id = e.user_id
GROUP BY u.user_id;

\`\`\`

## Summary

Proper database design ensures data integrity, reduces redundancy, and improves performance. Follow normalisation principles, design thoughtful indexes, and always use transactions for multi-step operations.`,
          },
        ],
      },
    ],
  },
];

const ADDITIONAL_COURSES = [
  { code: "ICT 305", title: "Data Communication System and Network", category: "Networking" },
  { code: "SEN 301", title: "Object Oriented Analysis and Design", category: "Software Engineering" },
  { code: "DTS 301", title: "Big Data Computing", category: "Data Science" },
  { code: "GIT 313", title: "Cisco Certified Network Associate", category: "Networking" },
  { code: "FIC 303", title: "Theology of Science and Innovation", category: "General Studies" },
  { code: "IFT 301", title: "Web Application Development", category: "Web Development" },
  { code: "IFT 355", title: "Database Programming", category: "Database" },
];

export const DEMO_COURSES: Course[] = [
  ...BASE_COURSES,
  ...ADDITIONAL_COURSES.map((course, index) => {
    const source = BASE_COURSES[index % BASE_COURSES.length];
    const id = `course-${index + BASE_COURSES.length + 1}`;
    return {
      ...source,
      id,
      title: `${course.code} · ${course.title}`,
      shortDescription: `300-level course module: ${course.title}.`,
      description: `${course.title} is included as a sample 300-level course. Learning materials and activities use demo content for this project prototype.`,
      instructor: "Miss Oluwaseun Amore",
      instructorId: "user-6",
      category: course.category,
      tags: [course.code, course.category, "300 Level"],
      modules: source.modules.map((module, moduleIndex) => ({
        ...module,
        id: `${id}-module-${moduleIndex + 1}`,
        lessons: module.lessons.map((lesson, lessonIndex) => ({
          ...lesson,
          id: `${id}-module-${moduleIndex + 1}-lesson-${lessonIndex + 1}`,
        })),
      })),
    };
  }),
];

export function getCourseById(id: string): Course | undefined {
  return DEMO_COURSES.find((c) => c.id === id);
}


export function getQuizById(id: string): Quiz | undefined {
  return DEMO_QUIZZES.find((q) => q.id === id);
}


export function getUserByEmail(email: string): User | undefined {
  const normalized = email.trim().toLowerCase();
  return DEMO_USERS.find((u) => u.email.toLowerCase() === normalized);
}


export function getUserById(id: string): User | undefined {
  return DEMO_USERS.find((u) => u.id === id);
}
