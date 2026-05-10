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
  const shortResume = (resume || "").slice(0, 2000);
  const shortJD = (jobDescription || "").slice(0, 1500);

  const prompt = `
Output only valid JSON (no markdown).

You are a senior MERN stack interviewer.

FORMAT:
{
  "technicalQuestions": [
    { "question": "", "intention": "", "answer": "" }
  ],
  "behavioralQuestions": [
    { "question": "", "intention": "", "answer": "" }
  ]
}

RULES:
- EXACTLY 5 technical questions
- EXACTLY 5 behavioral questions
- Tailor to the job description and resume below

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
    data = fallbackQuestions(shortJD, shortResume);
  }

  return data;
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

module.exports = {
  generateInterviewReport,
  generatePreparationPlan
};
