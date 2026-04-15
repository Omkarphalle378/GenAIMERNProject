const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY
});

const interviewReportSchema = z.object({
  matchScore: z.number().describe(
    "A score between 0 and 100 indicating how well the candidate's profile matches the job description"
  ),

  technicalQuestions: z.array(
    z.object({
      question: z.string().describe("The technical question that can be asked in the interview"),
      intention: z.string().describe("The intention of the interviewer behind asking this question"),
      answer: z.string().describe("How to answer this question, including key points and approach")
    })
  ).describe("Technical questions that can be asked in the interview along with their intention"),

  behavioralQuestions: z.array(
    z.object({
      question: z.string().describe("The behavioral question that can be asked in the interview"),
      intention: z.string().describe("The intention of the interviewer behind asking this question"),
      answer: z.string().describe("How to answer this question, including key points and approach")
    })
  ).describe("Behavioral questions that can be asked in the interview along with their intention"),

  skillGaps: z.array(
    z.object({
      skill: z.string().describe("The skill which the candidate is lacking"),
      severity: z.enum(["low", "medium", "high"]).describe(
        "The severity of this skill gap, i.e., how important this skill is for the candidate's profile"
      )
    })
  ).describe("List of skill gaps in the candidate's profile along with their severity"),

  preparationPlan: z.array(
    z.object({
      day: z.number().describe("The day number in the preparation plan, starting from 1"),
      focus: z.string().describe(
        "The main focus of this day in the preparation plan, e.g., data structures, system design, mock interviews"
      ),
      tasks: z.array(z.string()).describe(
        "List of tasks to be done on this day to follow the preparation plan"
      )
    })
  ).describe(
    "A day-wise preparation plan for the candidate to follow in order to prepare effectively for the interview"
  )
});

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

const prompt = `
You are an expert technical interviewer.

First, THINK step-by-step about:
- Candidate skills
- Job requirements
- Gaps
- Suitable interview questions

Then generate a COMPLETE report.

After thinking, output ONLY JSON in this format:

{
  "matchScore": number,
  "technicalQuestions": [
    { "question": "", "intention": "", "answer": "" }
  ],
  "behavioralQuestions": [
    { "question": "", "intention": "", "answer": "" }
  ],
  "skillGaps": [
    { "skill": "", "severity": "low | medium | high" }
  ],
  "preparationPlan": [
    { "day": number, "focus": "", "tasks": [] }
  ]
}

STRICT RULES:
- Do NOT return empty arrays
- Each section MUST contain at least 3 items
- Make content detailed and realistic
- Output ONLY JSON

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      // responseJsonSchema: zodToJsonSchema(interviewReportSchema)
    }
  });

  // ✅ FIX: safer parsing
  const cleanText = response.text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleanText);
}

module.exports = generateInterviewReport;