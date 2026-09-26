/**
 * ============================================================================
 * SHIWANT GOYAL // PORTFOLIO DATA (SINGLE SOURCE OF TRUTH)
 * ============================================================================
 * Easily edit this file to update any text, links, projects, skills, or stats
 * without touching component code.
 */

const portfolioData = {
  personal: {
    name: "Shiwant Goyal",
    kanjiName: "剛矢 志腕", // Decorative stylistic Japanese Kanji
    badge: "TOTAL CONCENTRATION // BCA 1ST YEAR",
    role: "BCA Student & Aspiring Web Developer",
    educationBrief: "Bachelor of Computer Applications (BCA), 1st Year",
    status: "Currently Pursuing",
    shortIntro:
      "I’m Shiwant Goyal, a BCA student passionate about programming, web development, and problem solving. I’m currently building a strong foundation in programming and modern web technologies while working on projects to improve my practical skills.",
    careerGoal:
      "To become a skilled full-stack developer and build useful, modern, real-world web applications.",
    avatar: "assets/profile-photo.png",
    avatarFallback: "assets/profile-photo.svg",
    collegeLogo: "assets/college-logo.png",
    collegeName: "Bharati Vidyapeeth Institute of Management & Research (BVIMR)",
    location: "New Delhi, India",
    corpsRank: "Kizuki Apprentice // Web Corps",
    demonSlayerMotto: "滅 — Slay the Bugs, Forge the Future.",
  },

  socials: {
    instagram: {
      username: "@shiwant_goyal_",
      url: "https://www.instagram.com/shiwant_goyal_/",
      label: "Instagram",
    },
    linkedin: {
      username: "shiwant-goyal-8a3926412",
      url: "https://www.linkedin.com/in/shiwant-goyal-8a3926412",
      label: "LinkedIn",
    },
    github: {
      username: "goyalshiwant8-create",
      url: "https://github.com/goyalshiwant8-create",
      label: "GitHub",
    },
    email: {
      address: "your-email@example.com", // Replace with your real email when ready!
      placeholderNote: "Click to copy email address",
    },
  },

  // About Section Highlights
  about: {
    heading: "About Me",
    kanjiSubtitle: "自己紹介 — ABOUT THE SLAYER",
    paragraphs: [
      "I'm Shiwant Goyal, a BCA student currently in my first year. I’m interested in programming and web development and enjoy learning by actually building things.",
      "I'm currently strengthening my fundamentals in C programming, HTML, CSS, JavaScript, logic building, and problem solving. My focus is not just on learning theory but also on turning what I learn into practical projects.",
      "My long-term goal is to become a skilled developer capable of creating useful, scalable, and visually appealing web applications.",
    ],
    infoCards: [
      {
        icon: "GraduationCap",
        title: "BCA Student",
        subtitle: "1st Year at BVIMR",
        description: "Studying computer applications & core algorithmic concepts.",
        kanji: "学",
      },
      {
        icon: "Code",
        title: "Aspiring Developer",
        subtitle: "Crafting Digital Realities",
        description: "Focusing on modern web standards, UI/UX, and clean syntax.",
        kanji: "術",
      },
      {
        icon: "Rocket",
        title: "Learning & Building",
        subtitle: "Hands-on Mindset",
        description: "Turning daily textbook concepts into working digital tools.",
        kanji: "創",
      },
      {
        icon: "Brain",
        title: "Problem Solving",
        subtitle: "Logic & Architecture",
        description: "Mastering loops, memory, flow control, and debugging.",
        kanji: "鍛",
      },
    ],
  },

  // Skills Section
  skills: {
    heading: "Skills & Arsenal",
    kanjiSubtitle: "呼吸術 — BREATHING DISCIPLINES",
    description:
      "A transparent overview of my current technical toolkit. As a 1st-year BCA student, I focus on solid foundational principles rather than superficial claims.",
    categories: [
      {
        id: "programming",
        title: "Programming",
        badge: "Core Logic",
        kanji: "刀",
        icon: "Cpu",
        items: [
          {
            name: "C",
            level: "Foundational Core",
            status: "Primary Language",
            description: "Control structures, pointers, memory models, functions, and structured modular programming.",
          },
          {
            name: "Problem Solving",
            level: "Active Practice",
            status: "Analytical Thinking",
            description: "Breaking down complex specifications into step-by-step algorithmic solutions.",
          },
          {
            name: "Logic Building",
            level: "Foundational Core",
            status: "Core Strength",
            description: "Flowcharting, conditional flows, loop optimizations, and edge-case handling.",
          },
        ],
      },
      {
        id: "web-dev",
        title: "Web Development",
        badge: "Client Interface",
        kanji: "波",
        icon: "Globe",
        items: [
          {
            name: "HTML5",
            level: "Semantic Standard",
            status: "Strong Base",
            description: "Accessible markup, modern DOM hierarchy, clean document outlines, and SEO best practices.",
          },
          {
            name: "CSS3",
            level: "Styling & Responsive",
            status: "Design Implementation",
            description: "Flexbox, CSS Grid, media queries, CSS variables, glassmorphism, and smooth transitions.",
          },
          {
            name: "JavaScript",
            level: "Interactive Logic",
            status: "Active Implementation",
            description: "DOM manipulation, event listeners, ES6+ arrow syntax, array methods, and async operations.",
          },
        ],
      },
      {
        id: "learning",
        title: "Currently Learning",
        badge: "Active Growth",
        kanji: "修",
        icon: "Sparkles",
        items: [
          {
            name: "JavaScript (Advanced)",
            level: "In Depth",
            status: "Daily Practice",
            description: "Deepening knowledge of asynchronous promises, closures, prototypes, and browser APIs.",
          },
          {
            name: "React",
            level: "Component Architecture",
            status: "Actively Exploring",
            description: "State management, hooks (useState, useEffect), props flow, and component lifecycle.",
          },
          {
            name: "Full-Stack Development",
            level: "Roadmap Horizon",
            status: "Upcoming Focus",
            description: "Studying backend runtimes, RESTful API architecture, databases, and deployment pipelines.",
          },
        ],
      },
    ],
  },

  // Projects Section
  projects: {
    heading: "Featured Projects",
    kanjiSubtitle: "戦歴 — DEMON SLAYER SCROLLS",
    description:
      "A showcase of real code and practical assignments. Each project marks a milestone in my journey from initial syntax to production code.",
    items: [
      {
        id: "portfolio-website",
        title: "Portfolio Website",
        breathingStyle: "Water Breathing: Flow Form",
        badge: "In Progress",
        badgeType: "progress",
        description:
          "A personal portfolio website designed to showcase my skills, learning journey, projects, and contact information.",
        details:
          "Engineered with a responsive, Demon Slayer inspired dark aesthetic, interactive code simulator, dynamic particle canvas, and modular component architecture.",
        tech: ["HTML5", "CSS3", "JavaScript", "React"],
        liveUrl: "#top",
        githubUrl: "https://github.com/goyalshiwant8-create/SHIWANT-GOYAL",
        featured: true,
      },
      {
        id: "c-programming-projects",
        title: "C Programming Projects",
        breathingStyle: "Sun Breathing: Forge Form",
        badge: "Learning / Ongoing",
        badgeType: "learning",
        description:
          "A collection of beginner-to-intermediate C programming exercises focused on conditional statements, loops, functions, and logic building.",
        details:
          "Structured implementations including arithmetic calculators, number guessing games, matrix operations, pattern printing, and array manipulation algorithms.",
        tech: ["C", "Algorithms", "GCC", "Memory Models"],
        liveUrl: "#terminal-section",
        githubUrl: "https://github.com/goyalshiwant8-create",
        featured: true,
      },
    ],
    comingSoonCard: {
      title: "More Projects Coming Soon...",
      kanji: "未来",
      description:
        "Currently working on interactive JavaScript utilities, responsive client apps, and expanding C algorithm implementations. Watch this space!",
      badge: "In The Forge",
    },
  },

  // Education Section
  education: {
    heading: "Education",
    kanjiSubtitle: "学問 — PATH OF KNOWLEDGE",
    degree: "Bachelor of Computer Applications (BCA)",
    year: "1st Year",
    status: "Currently Pursuing",
    institution: "Bharati Vidyapeeth Institute of Management & Research (BVIMR)",
    location: "New Delhi, India",
    period: "2025 – 2028 (Expected)",
    description:
      "Engaged in foundational coursework covering computer fundamentals, structured programming in C, mathematical logic, web basics, and software principles.",
    highlights: [
      "Building rigorous logic and problem-solving skills through hands-on programming labs.",
      "Active participant in tech hackathons, coding workshops, and collaborative peer learning.",
      "Balancing university curriculum with daily independent web development practice.",
    ],
  },

  // Learning Journey Section
  journey: {
    heading: "My Learning Journey",
    kanjiSubtitle: "修行の道 — STEPS OF MASTERY",
    description:
      "A clear step-by-step roadmap showing where I started, what I'm mastering right now, and where I am headed next.",
    steps: [
      {
        step: "01",
        kanji: "壱",
        title: "Programming Fundamentals",
        breathingForm: "First Form: Foundation Slash",
        description: "Learning C programming and developing logical thinking.",
        status: "Mastering Core",
        statusColor: "emerald",
        points: [
          "Data types, operators, flow control (if-else, switch)",
          "Loops (for, while, do-while) and nested logic",
          "Functions, scope, arrays, and standard I/O",
        ],
      },
      {
        step: "02",
        kanji: "弐",
        title: "Web Fundamentals",
        breathingForm: "Second Form: Water Surface Weave",
        description: "Learning HTML, CSS, and the fundamentals of creating websites.",
        status: "Active Building",
        statusColor: "cyan",
        points: [
          "Semantic HTML5 tags and document outline structure",
          "Responsive CSS, Flexbox, CSS Grid layouts, and media queries",
          "Modern typography, glassmorphism, and color theory",
        ],
      },
      {
        step: "03",
        kanji: "参",
        title: "JavaScript",
        breathingForm: "Third Form: Dynamic Blade Strike",
        description: "Building understanding of programming for interactive web applications.",
        status: "Active Learning",
        statusColor: "amber",
        points: [
          "DOM manipulation and dynamic browser event handling",
          "Modern ES6+ syntax, arrays, objects, and functions",
          "Understanding asynchronous concepts, fetch APIs, and state",
        ],
      },
      {
        step: "04",
        kanji: "肆",
        title: "Full-Stack Development",
        breathingForm: "Fourth Form: Total Concentration Horizon",
        description: "Future goal: learning frontend, backend, databases, APIs, and deployment.",
        status: "Upcoming Goal",
        statusColor: "purple",
        points: [
          "React component architecture, state management, and hooks",
          "Backend server development with Node.js and REST APIs",
          "Relational and NoSQL databases, authentication, and cloud deployment",
        ],
      },
    ],
  },

  // Contact Section
  contact: {
    heading: "Let's Build Something Together",
    kanjiSubtitle: "通信 — SEND A TRANSMISSION",
    subtext:
      "Have a project idea, collaboration opportunity, or simply want to connect? Feel free to reach out. I’m always eager to learn, discuss technology, and build exciting new projects.",
  },

  // Demon Slayer Breathing Themes
  breathingStyles: {
    water: {
      id: "water",
      name: "Water Breathing",
      japanese: "水の呼吸",
      kanji: "水",
      colorName: "Mizu Cyan",
      primaryColor: "#06b6d4",
      accentColor: "#10b981",
      glowColor: "rgba(6, 182, 212, 0.4)",
      auraEffect: "Flowing currents & calm water ripples",
      icon: "Droplets",
    },
    sun: {
      id: "sun",
      name: "Sun Breathing",
      japanese: "日の呼吸",
      kanji: "日",
      colorName: "Hinokami Flame",
      primaryColor: "#f97316",
      accentColor: "#ef4444",
      glowColor: "rgba(249, 115, 22, 0.45)",
      auraEffect: "Solar embers & dance of the fire god",
      icon: "Flame",
    },
    thunder: {
      id: "thunder",
      name: "Thunder Breathing",
      japanese: "雷の呼吸",
      kanji: "雷",
      colorName: "Kaminari Gold",
      primaryColor: "#eab308",
      accentColor: "#a855f7",
      glowColor: "rgba(234, 179, 8, 0.4)",
      auraEffect: "High-speed electric sparks & flash strikes",
      icon: "Zap",
    },
  },

  // Interactive Code Simulator Snippets
  codeSnippets: [
    {
      id: "main.c",
      language: "c",
      label: "main.c",
      badge: "C Logic",
      code: `#include <stdio.h>

int main() {
    // Shiwant Goyal // BCA 1st Year
    // Total Concentration: Logic Building
    printf("Total Concentration: C Programming!\\n");
    
    char* slayer = "Shiwant Goyal";
    char* mission = "Building Useful Web Apps";
    int year = 1;
    
    printf("Developer: %s (BCA Year %d)\\n", slayer, year);
    printf("Current Quest: %s\\n", mission);
    
    return 0;
}`,
      output: `[GCC COMPILE SUCCESSFUL]
> ./shiwant_core.exe
Total Concentration: C Programming!
Developer: Shiwant Goyal (BCA Year 1)
Current Quest: Building Useful Web Apps
Status: 0 Errors, 0 Warnings // Logic Verified.`,
    },
    {
      id: "App.jsx",
      language: "jsx",
      label: "App.jsx",
      badge: "React UI",
      code: `import React, { useState } from 'react';

export default function ShiwantPortfolio() {
  const [breathingStyle, setStyle] = useState('Water Breathing');
  const [discipline] = useState('Continuous Learning');

  return (
    <div className="slayer-card">
      <h2>Shiwant Goyal // BCA 1st Year</h2>
      <p>Active Form: {breathingStyle} 🌊</p>
      <p>Rule: {discipline} 🚀</p>
    </div>
  );
}`,
      output: `[REACT DOM HYDRATION COMPLETE]
Component <ShiwantPortfolio /> rendered in 1.4ms
Virtual DOM: Synchronized with Nichirin Canvas
State: Ready for Web Development!`,
    },
    {
      id: "algorithms.c",
      language: "c",
      label: "algorithms.c",
      badge: "Algorithms",
      code: `#include <stdio.h>

// Nichirin Binary Search & Logic Algorithm
int binarySearch(int arr[], int size, int target) {
    int low = 0, high = size - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1; // Target not found
}

int main() {
    int skills[] = {1, 3, 7, 11, 23, 42, 99};
    int found = binarySearch(skills, 7, 42);
    printf("Target 42 found at index: %d\\n", found);
    printf("Total Concentration: O(log N) Efficiency!\\n");
    return 0;
}`,
      output: `[GCC COMPILE SUCCESSFUL]
> ./algorithms.exe
Target 42 found at index: 5
Total Concentration: O(log N) Efficiency!
All test cases passed cleanly.`,
    },
    {
      id: "journey.md",
      language: "markdown",
      label: "journey.md",
      badge: "Roadmap",
      code: `# Shiwant Goyal's Developer Roadmap

## Current Phase: BCA 1st Year
- Master C fundamentals & memory mechanics
- Write accessible, responsive HTML5 & modern CSS3
- Master JavaScript (DOM, ES6+, API requests)

## Next Phase: Full-Stack Mastery
- Build scalable applications with React & Node.js
- Collaborate on open-source repositories
- Slay every bug with relentless persistence!`,
      output: `[MARKDOWN RENDERED]
Target Goal: Full-Stack Web Developer
Foundational Mastery: Active and progressing.
Every line of code counts!`,
    },
  ],

  // Interactive Quiz: Demon Slayer Developer Rank Test
  quiz: {
    title: "Demon Slayer Developer Rank Test",
    subtitle: "3 Quick Challenges to Test Your Logic & Web Mastery",
    questions: [
      {
        id: 1,
        discipline: "C Programming & Logic",
        question: "In C language, what is the output of: printf(\"%d\", 7 / 2); ?",
        options: ["3.5", "3", "4", "Runtime Error"],
        correct: 1,
        explanation: "In C, integer divided by integer performs integer division (truncating decimals), yielding 3!",
      },
      {
        id: 2,
        discipline: "Modern Web Standards",
        question: "Which HTML5 semantic element is best practice for primary site navigation?",
        options: ["<div class=\"nav\">", "<navigation>", "<nav>", "<menu-bar>"],
        correct: 2,
        explanation: "<nav> is the standardized HTML5 landmark tag for accessibility and SEO.",
      },
      {
        id: 3,
        discipline: "Total Concentration Engineering",
        question: "In Demon Slayer, constant practice preserves form. In software development, which practice achieves this?",
        options: [
          "Refactoring & continuous testing",
          "Never touching working code",
          "Copy-pasting from StackOverflow without reading",
          "Writing 1000-line single functions"
        ],
        correct: 0,
        explanation: "Continuous refactoring, automated testing, and modular architecture keep codebases maintainable!",
      },
    ],
    ranks: {
      0: { title: "Mizunoto Initiate", kanji: "癸", badge: "Beginner Slayer", message: "Keep training your breathing basics! Every master began as a novice." },
      1: { title: "Kinoe Apprentice", kanji: "甲", badge: "Rising Talent", message: "Strong grasp! Your foundational blade is sharpening fast." },
      2: { title: "Tsuguko Candidate", kanji: "継子", badge: "Advanced Practitioner", message: "Impressive focus! You demonstrate deep technical discipline." },
      3: { title: "Hashira Rank Developer", kanji: "柱", badge: "Total Concentration Master", message: "Flawless score! You possess the wisdom of a true Web & C Hashira!" },
    },
  },

  // Dynamic Visitor Reactions (Initial counts, synced to localStorage)
  reactions: {
    slay: { id: "slay", emoji: "⚔️", label: "Total Concentration", defaultCount: 142 },
    speed: { id: "speed", emoji: "⚡", label: "Fast Learner", defaultCount: 98 },
    potential: { id: "potential", emoji: "🚀", label: "High Potential", defaultCount: 116 },
    clean: { id: "clean", emoji: "💡", label: "Clean Code", defaultCount: 89 },
  },

  // Dynamic Guestbook / Endorsements Wall (Stored in localStorage with seed items)
  guestbook: [
    {
      id: "seed-1",
      name: "Aryan Sharma",
      role: "BCA Classmate @ BVIMR",
      badge: "Fellow Slayer",
      message: "Shiwant's dedication to C programming and web UI is genuinely inspiring! His Demon Slayer theme is super sick.",
      date: "Recent",
      avatarEmoji: "🌊",
    },
    {
      id: "seed-2",
      name: "Rohit Verma",
      role: "Web Developer",
      badge: "Tech Peer",
      message: "Really clean code structure and attention to detail. Great job on the procedural audio and interactive terminal!",
      date: "Recent",
      avatarEmoji: "🔥",
    },
    {
      id: "seed-3",
      name: "Aditi Gupta",
      role: "BCA Tech Club Member",
      badge: "Campus Student",
      message: "Great portfolio, Shiwant! Loved how you documented both your current C projects and upcoming React roadmap.",
      date: "Recent",
      avatarEmoji: "⚡",
    },
  ],

  // AI Assistant Knowledge Base
  assistant: {
    botName: "Shiwant AI",
    botTitle: "Nichirin Portfolio Assistant",
    greeting: "Konnichiwa! I am Shiwant's AI Assistant. Ask me anything about his BCA studies at BVIMR, C programming, web projects, skills, or collaboration opportunities!",
    quickQuestions: [
      { text: "What is Shiwant's education?", query: "education" },
      { text: "What are his main skills?", query: "skills" },
      { text: "Show me his C projects", query: "c projects" },
      { text: "How can I contact him?", query: "contact" },
      { text: "Why Demon Slayer theme?", query: "theme" },
    ],
  },
};

// Export for module/window environments
if (typeof module !== "undefined" && module.exports) {
  module.exports = portfolioData;
}
if (typeof window !== "undefined") {
  window.portfolioData = portfolioData;
}
