const axios = require("axios");

function safeParse(rawText, fallback) {
  if (rawText == null) return fallback;
  try {
    let raw = String(rawText);
    raw = raw.replace(/```json|```/g, "").trim();
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start !== -1 && end !== -1) {
      raw = raw.slice(start, end + 1);
    }
    return JSON.parse(raw);
  } catch (err) {
    console.log("JSON parse failed:", String(rawText).slice(0, 200));
    return fallback;
  }
}

async function geminiGenerateJson(prompt, modelName) {
  const key = process.env.GOOGLE_GENAI_API_KEY;
  if (!key) return null;

  const { GoogleGenerativeAI } = require("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.4,
      responseMimeType: "application/json"
    }
  });

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return safeParse(text, null);
}

async function tryGeminiJson(prompt) {
  const primary = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const fallbacks = [primary, "gemini-1.5-flash", "gemini-1.5-pro"];

  for (const name of fallbacks) {
    try {
      const parsed = await geminiGenerateJson(prompt, name);
      if (parsed) return parsed;
    } catch (err) {
      console.log(`Gemini model ${name} failed:`, err.message);
    }
  }
  return null;
}

async function tryOllamaJson(prompt) {
  const base =
    process.env.OLLAMA_URL?.replace(/\/$/, "") || "http://localhost:11434";
  const model = process.env.OLLAMA_MODEL || "gemma:2b";

  try {
    const response = await axios.post(
      `${base}/api/generate`,
      {
        model,
        prompt,
        stream: false,
        format: "json"
      },
      { timeout: 120000 }
    );

    const raw =
      typeof response.data?.response === "string"
        ? response.data.response
        : JSON.stringify(response.data?.response ?? response.data);

    return safeParse(raw, null);
  } catch (err) {
    console.log("Ollama request failed:", err.message);
    return null;
  }
}

function fallbackQuestions(jobDescription, resume) {
  const topic =
    (jobDescription || "").split(/\s+/).slice(0, 8).join(" ").slice(0, 120) ||
    "this MERN role";

  return {
    technicalQuestions: [
      {
        question: `How would you structure a REST API in Node/Express for requirements like: ${topic}?`,
        intention: "Assess API design, routing, validation, and error handling.",
        answer:
          "Outline resources and routes, use middleware for auth and validation, consistent status codes, and separate controllers from business logic."
      },
      {
        question:
          "Explain how you would model and query data in MongoDB for a multi-user application with relationships.",
        intention: "Check schema design, indexing, and when to embed vs reference.",
        answer:
          "Describe collections, references or embedded subdocuments, indexes on frequent filters, and aggregation for reports."
      },
      {
        question:
          "How does React handle rendering updates, and how would you optimize a large list?",
        intention: "Virtual DOM, keys, memoization, and performance tooling.",
        answer:
          "Mention reconciliation, stable keys, React.memo/useMemo/useCallback, virtualization for long lists, and profiling."
      },
      {
        question:
          "Walk through JWT-based authentication between a React client and Express API.",
        intention: "Security basics: storage, cookies vs localStorage, refresh, HTTPS.",
        answer:
          "Issue signed JWT after login, send via Authorization header or httpOnly cookie, validate middleware on protected routes, short expiry and refresh strategy."
      },
      {
        question:
          "How would you debug a production issue where API latency spikes on a MERN app?",
        intention: "Structured debugging: logs, metrics, DB, and caching.",
        answer:
          "Check slow queries and indexes, connection pool, N+1 patterns, add logging/correlation IDs, consider caching and rate limits."
      }
    ],
    behavioralQuestions: [
      {
        question:
          "Describe a time you had to deliver a feature under a tight deadline. How did you prioritize?",
        intention: "Ownership, communication, and trade-offs.",
        answer:
          "Clarify scope with stakeholders, cut non-essentials, communicate risks early, ship incremental value, and document follow-ups."
      },
      {
        question:
          "Tell me about a disagreement with a teammate. How did you resolve it?",
        intention: "Collaboration and conflict resolution.",
        answer:
          "Focus on shared goals, listen, propose data or prototypes, escalate constructively if blocked, and document decisions."
      },
      {
        question:
          "Describe a complex bug you diagnosed in a full-stack app. What was your process?",
        intention: "Debugging discipline across layers.",
        answer:
          "Reproduce, isolate frontend vs backend, inspect network and logs, add minimal logging, fix root cause, and add a regression test."
      },
      {
        question:
          "How do you keep your skills current with MERN and related tooling?",
        intention: "Learning habits and quality mindset.",
        answer:
          "Side projects, reading release notes, code reviews, pairing, and applying new patterns incrementally in production code."
      },
      {
        question:
          "Tell me about a time you improved reliability or security in an application.",
        intention: "Impact and responsible engineering.",
        answer:
          "Identify risk (auth, validation, dependencies), implement fixes, measure with monitoring, and communicate changes to the team."
      }
    ]
  };
}

function fixedSevenDayPlan() {
  return {
    preparationPlan: [
      {
        day: 1,
        focus: "React Basics",
        tasks: [
          "Study React fundamentals",
          "Practice components and props",
          "Build simple React app"
        ]
      },
      {
        day: 2,
        focus: "Node + Express",
        tasks: [
          "Learn Express routing",
          "Build REST API",
          "Test using Postman"
        ]
      },
      {
        day: 3,
        focus: "MongoDB",
        tasks: [
          "Learn CRUD operations",
          "Practice queries",
          "Connect with Node"
        ]
      },
      {
        day: 4,
        focus: "Full Stack Integration",
        tasks: [
          "Connect frontend + backend",
          "Handle API calls",
          "Debug issues"
        ]
      },
      {
        day: 5,
        focus: "DSA",
        tasks: [
          "Solve 5 problems",
          "Revise arrays & strings",
          "Practice recursion"
        ]
      },
      {
        day: 6,
        focus: "System Design",
        tasks: [
          "Learn basics",
          "Design simple system",
          "Understand scalability"
        ]
      },
      {
        day: 7,
        focus: "Mock Interview",
        tasks: [
          "Revise all topics",
          "Give mock interview",
          "Improve weak areas"
        ]
      }
    ]
  };
}

function normalizePlanDays(data) {
  const fixedPlan = (data?.preparationPlan || []).map((day, i) => {
    const focus = day.focus || "MERN Practice";
    return {
      day: i + 1,
      focus,
      tasks:
        day.tasks && day.tasks.length >= 3
          ? day.tasks
          : day.task && day.task.length >= 3
            ? day.task
            : [
                `Study ${focus} concepts`,
                `Practice coding questions on ${focus}`,
                `Build a mini project using ${focus}`
              ]
    };
  });

  if (fixedPlan.length === 0) {
    return fixedSevenDayPlan();
  }

  return { preparationPlan: fixedPlan };
}

async function generateInterviewReport({ resume, jobDescription }) {
  const shortResume = (resume || "").slice(0, 3000);
  const shortJD = (jobDescription || "").slice(0, 2000);

  const prompt = `
Output only valid JSON (no markdown).

You are an expert ATS (Applicant Tracking System) & technical interviewer.
Analyze the candidate's resume against the job description below.

FORMAT:
{
  "matchScore": 85,
  "skillGaps": [
    { "skill": "TypeScript", "severity": "high" },
    { "skill": "Docker", "severity": "medium" }
  ],
  "technicalQuestions": [
    { "question": "", "intention": "", "answer": "" }
  ],
  "behavioralQuestions": [
    { "question": "", "intention": "", "answer": "" }
  ]
}

RULES:
- "matchScore": an integer from 0 to 100 indicating how well the candidate's skills and experience match the job description requirements.
- "skillGaps": 3 to 6 specific skills or tech stack requirements mentioned in the job description that are missing or weak in the candidate's resume. "severity" MUST be "low", "medium", or "high".
- EXACTLY 5 technical questions tailored to the role and gaps.
- EXACTLY 5 behavioral questions tailored to the role.

Resume:
${shortResume}

Job Description:
${shortJD}
`;

  let data =
    (await tryGeminiJson(prompt)) ||
    (await tryOllamaJson(prompt));

  if (
    !data ||
    !Array.isArray(data.technicalQuestions) ||
    data.technicalQuestions.length === 0
  ) {
    const fallback = fallbackQuestions(shortJD, shortResume);
    data = {
      ...fallback,
      matchScore: data?.matchScore ?? calculateKeywordMatchScore(shortResume, shortJD),
      skillGaps: data?.skillGaps ?? extractDynamicSkillGaps(shortResume, shortJD)
    };
  }

  return data;
}

function calculateKeywordMatchScore(resume, jd) {
  if (!jd || !resume) return 70;
  const jdWords = new Set(jd.toLowerCase().match(/\b[a-z0-9+#.]{3,}\b/g) || []);
  const resumeWords = new Set(resume.toLowerCase().match(/\b[a-z0-9+#.]{3,}\b/g) || []);
  if (jdWords.size === 0) return 75;

  let matches = 0;
  for (const word of jdWords) {
    if (resumeWords.has(word)) matches++;
  }

  const ratio = matches / jdWords.size;
  return Math.min(95, Math.max(55, Math.round(ratio * 100 + 35)));
}

function extractDynamicSkillGaps(resume, jd) {
  const commonTech = [
    "react", "node", "express", "mongodb", "typescript", "javascript", "python",
    "docker", "kubernetes", "aws", "gcp", "azure", "graphql", "redux", "next.js",
    "tailwind", "postgresql", "mysql", "redis", "kafka", "ci/cd", "git", "jest", "system design"
  ];
  const jdLower = (jd || "").toLowerCase();
  const resumeLower = (resume || "").toLowerCase();

  const missing = commonTech.filter(tech => jdLower.includes(tech) && !resumeLower.includes(tech));

  if (missing.length === 0) {
    return [
      { skill: "System Architecture", severity: "medium" },
      { skill: "Performance Optimization", severity: "medium" },
      { skill: "CI/CD Pipeline", severity: "low" }
    ];
  }

  return missing.slice(0, 4).map((tech, idx) => ({
    skill: tech.charAt(0).toUpperCase() + tech.slice(1),
    severity: idx === 0 ? "high" : idx === 1 ? "medium" : "low"
  }));
}

async function generatePreparationPlan({ resume, jobDescription }) {
  const shortResume = (resume || "").slice(0, 2000);
  const shortJD = (jobDescription || "").slice(0, 1500);

  const prompt = `
Output only valid JSON (no markdown).

You are a MERN stack mentor.

Create a 7-day interview preparation plan.

FORMAT:
{
  "preparationPlan": [
    {
      "day": 1,
      "focus": "",
      "tasks": ["", "", ""]
    }
  ]
}

RULES:
- EXACTLY 7 days
- Focus on MERN, DSA basics, and simple system design
- Each day must have exactly 3 tasks

Resume:
${shortResume}

Job Description:
${shortJD}
`;

  let data =
    (await tryGeminiJson(prompt)) ||
    (await tryOllamaJson(prompt));

  return normalizePlanDays(data || {});
}

/**
 * @description Generates a 5-question multiple choice skill assessment quiz for a targeted skill.
 */
async function generateSkillQuizService({ skill }) {
  const targetSkill = String(skill || "Fullstack Engineering").trim();

  const prompt = `
You are an expert technical interviewer and educator.
Create a 5-question multiple choice skill assessment quiz for the topic: "${targetSkill}".

Requirements:
1. Generate exactly 5 challenging, practical, real-world questions suitable for software engineers.
2. For each question, provide 4 options (A, B, C, D).
3. Specify zero-based index (0, 1, 2, 3) for 'correctAnswerIndex'.
4. Provide a clear 1-2 sentence explanation of why the correct answer is right.

Return ONLY a valid JSON object matching this schema:
{
  "skill": "${targetSkill}",
  "questions": [
    {
      "id": 1,
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswerIndex": 0,
      "explanation": "Detailed explanation here."
    }
  ]
}
`;

  let result = await tryGeminiJson(prompt);
  if (!result || !Array.isArray(result.questions) || result.questions.length === 0) {
    result = await tryOllamaJson(prompt);
  }

  if (result && Array.isArray(result.questions) && result.questions.length > 0) {
    return result;
  }

  // Robust Fallback Quiz Generator
  return {
    skill: targetSkill,
    questions: [
      {
        id: 1,
        question: `What is a core best practice when working with ${targetSkill}?`,
        options: [
          "Ensure modular architecture and proper error handling",
          "Avoid using external libraries",
          "Store secret keys in public repositories",
          "Disable logging in production"
        ],
        correctAnswerIndex: 0,
        explanation: "Modular architecture and error handling ensure software reliability and maintainability."
      },
      {
        id: 2,
        question: `Which concept is fundamental to ${targetSkill} performance optimization?`,
        options: [
          "Synchronous blocking loops",
          "Caching, indexing, and efficient memory management",
          "Ignoring database queries",
          "Monolithic file structuring"
        ],
        correctAnswerIndex: 1,
        explanation: "Caching and efficient database indexing significantly reduce latency and resource overhead."
      },
      {
        id: 3,
        question: `How should security vulnerabilities be addressed in ${targetSkill}?`,
        options: [
          "Ignore sanitization",
          "Use input validation, authentication, and dependency audits",
          "Hardcode API tokens in client code",
          "Disable HTTPS"
        ],
        correctAnswerIndex: 1,
        explanation: "Validating user input and keeping dependencies updated prevents common security exploits."
      },
      {
        id: 4,
        question: `What is the primary benefit of automated testing in ${targetSkill}?`,
        options: [
          "Slows down development deployments",
          "Prevents regressions and verifies expected behavior",
          "Replaces code reviews",
          "Increases bundle size"
        ],
        correctAnswerIndex: 1,
        explanation: "Automated testing catches bugs early in the pipeline before reaching production."
      },
      {
        id: 5,
        question: `When scaling applications built with ${targetSkill}, which pattern is recommended?`,
        options: [
          "Single point of failure server setup",
          "Decoupled stateless architecture and load balancing",
          "Manual server restarts",
          "Unlimited memory allocation"
        ],
        correctAnswerIndex: 1,
        explanation: "Stateless services scale horizontally across multiple compute nodes effortlessly."
      }
    ]
  };
}

/**
 * @description Generates a personalized cover letter and cold recruiter email pitch matching candidate profile to job description.
 */
async function generateCoverLetterService({ jobDescription, resumeText, targetCompany, roleTitle }) {
  const company = String(targetCompany || "the hiring team").trim();
  const role = String(roleTitle || "Software Engineer").trim();
  const shortJD = String(jobDescription || "").slice(0, 3000);
  const shortResume = String(resumeText || "").slice(0, 3000);

  const prompt = `
You are an expert executive career coach and recruiter copywriter.
Create a highly persuasive, customized Cover Letter and Cold Recruiter Email Pitch for a candidate applying for the role of "${role}" at "${company}".

Candidate Resume Excerpt:
${shortResume || "Experienced software engineer specializing in modern web applications, clean architecture, and fullstack development."}

Target Job Description:
${shortJD || "Looking for a proactive developer with strong problem-solving skills, API development experience, and teamwork orientation."}

Requirements:
1. Cover Letter: Professional 3-paragraph letter explaining why the candidate is a top fit for ${role} at ${company}.
2. Cold Email Pitch: A punchy 3-sentence recruiter cold email pitch including a catchy Subject Line.
3. Key Selling Points: Exactly 3 bullet points matching candidate strengths to the job requirements.

Return ONLY a valid JSON object matching this schema:
{
  "company": "${company}",
  "role": "${role}",
  "coverLetter": "Dear Hiring Manager at ${company},\\n\\nParagraph 1...\\n\\nParagraph 2...\\n\\nParagraph 3...\\n\\nSincerely,\\nCandidate",
  "coldEmail": {
    "subject": "Application for ${role} Role - Candidate Name",
    "body": "Hi [Hiring Manager], I saw your opening for ${role} at ${company}... I would love to connect!"
  },
  "keyHighlights": [
    "Highlight 1 relevant to job requirements",
    "Highlight 2 relevant to job requirements",
    "Highlight 3 relevant to job requirements"
  ]
}
`;

  let result = await tryGeminiJson(prompt);
  if (!result || !result.coverLetter) {
    result = await tryOllamaJson(prompt);
  }

  if (result && result.coverLetter) {
    return result;
  }

  // Robust Fallback
  return {
    company,
    role,
    coverLetter: `Dear Hiring Team at ${company},\n\nI am writing to express my enthusiastic interest in the ${role} position. With my background in fullstack development, software engineering best practices, and building scalable applications, I am confident in my ability to make an immediate positive impact on your team.\n\nThroughout my career, I have focused on delivering clean, maintainable code and solving complex technical challenges. My experience aligns directly with the requirements outlined in your job description, particularly in designing robust APIs, optimizing frontend performance, and collaborating effectively in modern engineering workflows.\n\nI am eager to contribute my skills to ${company}'s goals and would welcome the opportunity to discuss how my technical background aligns with your vision. Thank you for your time and consideration.\n\nSincerely,\nCandidate`,
    coldEmail: {
      subject: `Application for ${role} Position - Experienced Software Engineer`,
      body: `Hi Hiring Team at ${company},\n\nI recently came across the ${role} opening at ${company} and wanted to reach out directly. Given my experience in fullstack development and building reliable web solutions, I am confident I can drive value for your team.\n\nWould you be open to a brief conversation this week to discuss how my technical background matches your current priorities?\n\nBest regards,\nCandidate`
    },
    keyHighlights: [
      `Strong alignment with ${role} technical requirements and system architecture`,
      `Proven experience building responsive, user-focused web applications`,
      `Commitment to software quality, performance optimization, and clean code`
    ]
  };
}

/**
 * @description Evaluates a candidate's mock interview answer and provides instant scoring & AI feedback.
 */
async function evaluateMockAnswerService({ question, userAnswer, roleTitle }) {
  const targetQuestion = String(question || "Technical Question").trim();
  const answerText = String(userAnswer || "").trim();
  const role = String(roleTitle || "Software Engineer").trim();

  const prompt = `
You are a Staff Software Engineer and Senior Technical Interviewer for a candidate applying for "${role}".
Evaluate the candidate's answer to the following interview question.

Question:
"${targetQuestion}"

Candidate's Submitted Answer:
"${answerText || "Candidate provided no answer."}"

Requirements:
1. Provide a numerical score from 0 to 100 based on technical accuracy, clarity, and completeness.
2. List 2-3 specific Strengths in what the candidate answered well.
3. List 2-3 Missing Key Points or concepts they should add next time.
4. Provide a 2-3 sentence Ideal Answer Model demonstrating how a senior engineer would answer this question.

Return ONLY a valid JSON object matching this schema:
{
  "question": "${targetQuestion}",
  "score": 85,
  "verdict": "Strong Answer / Good Answer / Needs Improvement",
  "strengths": ["Strength 1", "Strength 2"],
  "missingPoints": ["Missing point 1", "Missing point 2"],
  "modelAnswer": "Ideal response text here."
}
`;

  let result = await tryGeminiJson(prompt);
  if (!result || typeof result.score !== "number") {
    result = await tryOllamaJson(prompt);
  }

  if (result && typeof result.score === "number") {
    return result;
  }

  // Robust Fallback Evaluation
  const wordCount = answerText.split(/\s+/).length;
  const mockScore = answerText.length > 50 ? (wordCount > 40 ? 88 : 75) : 55;

  return {
    question: targetQuestion,
    score: mockScore,
    verdict: mockScore >= 80 ? "Strong Answer" : mockScore >= 65 ? "Good Answer" : "Needs Improvement",
    strengths: [
      "Addressed the core intent of the question clearly",
      "Demonstrated practical understanding of core software engineering principles"
    ],
    missingPoints: [
      "Could elaborate further on edge cases, error handling, and performance trade-offs",
      "Include concrete real-world metrics or architectural examples"
    ],
    modelAnswer: `When answering '${targetQuestion}', start with a high-level architectural overview, detail the core implementation strategy, and explain how you handle edge cases and scalability under production load.`
  };
}

module.exports = {
  generateInterviewReport,
  generatePreparationPlan,
  generateSkillQuizService,
  generateCoverLetterService,
  evaluateMockAnswerService
};
