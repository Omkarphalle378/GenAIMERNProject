const pdfParse = require("pdf-parse");
const PDFDocument = require("pdfkit");
const { generateInterviewReport, generatePreparationPlan, generateSkillQuizService, generateCoverLetterService, evaluateMockAnswerService } = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

function buildTitleFromJobDescription(jobDescription) {
  const text = String(jobDescription || "").replace(/\s+/g, " ").trim();
  if (!text) return "Interview Preparation Plan";
  const [firstSentence] = text.split(/[.!?]/);
  const base = (firstSentence || text).trim();
  return base.length > 70 ? `${base.slice(0, 67)}...` : base;
}

function getDefaultQuestions() {
  return {
    technicalQuestions: [
      {
        question: "How would you design REST API routes and validation for a MERN app?",
        intention: "Evaluate API design and backend architecture skills.",
        answer: "Describe resource-based routes, middleware validation, centralized error handling, and clear HTTP status codes."
      },
      {
        question: "How do you optimize React rendering performance in large component trees?",
        intention: "Check practical frontend performance optimization understanding.",
        answer: "Use stable keys, memoization (React.memo/useMemo/useCallback), code splitting, and profiling to reduce unnecessary renders."
      },
      {
        question: "When should data be embedded vs referenced in MongoDB schemas?",
        intention: "Assess database modeling and trade-off analysis.",
        answer: "Embed when data is tightly coupled and read together; reference when relationships are large/shared or updated independently."
      },
      {
        question: "How would you secure authentication and authorization in a Node/Express app?",
        intention: "Validate auth and security best practices.",
        answer: "Use JWT with expiry, verify token in middleware, enforce role checks on routes, validate input, and store secrets securely."
      },
      {
        question: "How do you debug high API latency in production?",
        intention: "Check systematic debugging across app and DB.",
        answer: "Inspect logs/metrics, identify slow DB queries and missing indexes, profile hotspots, then optimize and re-measure."
      }
    ],
    behavioralQuestions: [
      {
        question: "Describe a time you handled a critical production bug.",
        intention: "Assess ownership and incident handling.",
        answer: "Explain diagnosis steps, communication, root-cause fix, and prevention via tests/monitoring."
      },
      {
        question: "How do you prioritize when deadlines are tight?",
        intention: "Measure planning and stakeholder alignment.",
        answer: "Prioritize core outcomes, communicate trade-offs, deliver incrementally, and defer low-impact items."
      },
      {
        question: "Tell me about a disagreement with a teammate and how you resolved it.",
        intention: "Evaluate collaboration and conflict resolution.",
        answer: "Focus on shared goals, discuss evidence-based options, agree on decision criteria, and document outcome."
      },
      {
        question: "How do you ensure code quality in fast-paced development?",
        intention: "Check engineering discipline.",
        answer: "Use code reviews, linting/tests, clear PRs, and post-deployment monitoring to catch issues early."
      },
      {
        question: "Describe how you learn a new technology quickly for a project.",
        intention: "Assess adaptability and learning strategy.",
        answer: "Start with docs and small prototypes, apply in a scoped feature, seek feedback, and document learnings."
      }
    ]
  };
}


function cleanPdfText(text) {
  if (!text) return "";
  return String(text)
    .replace(/[%ÏÐ]|[\x00-\x09\x0B\x0C\x0E-\x1F\x7F-\x9F\uFEFF\uFFFD]/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n+/g, "\n\n")
    .trim();
}

/**
 * @description controller to generate the interview report based on user seld description,resume and job description
 */
async function generateInterviewReportController(req, res) {
  try {
    const selfDescription = req.body?.selfDescription;
    const jobDescription = req.body?.jobDescription;

    if (!jobDescription || !String(jobDescription).trim()) {
      return res.status(400).json({ message: "Job description is required" });
    }

    let resumeContent = "";

    if (req.file) {
      if (req.file.mimetype !== "application/pdf") {
        return res.status(400).json({ message: "Resume must be a PDF file" });
      }
      const parsed = await pdfParse(req.file.buffer);
      resumeContent = cleanPdfText(parsed.text || "");
    } else if (selfDescription && String(selfDescription).trim()) {
      resumeContent = cleanPdfText(selfDescription);
    } else {
      return res.status(400).json({ message: "Resume PDF or self description is required" });
    }

    if (!resumeContent) {
      return res.status(400).json({ message: "Could not read resume text; try another PDF or use self description" });
    }

    // Generate both in parallel to avoid long client waits/timeouts.
    const [questions, plan] = await Promise.all([
      generateInterviewReport({
        resume: resumeContent,
        jobDescription
      }),
      generatePreparationPlan({
        resume: resumeContent,
        jobDescription
      })
    ]);

    // 🔹 Merge results
    const interviewReportByAi = {
      ...questions,
      ...plan
    };

    const sanitizeQuestions = (arr) =>
      arr.map((q = {}) => ({
        question: cleanPdfText(q.question || q.prompt || "Sample question"),
        intention: cleanPdfText(q.intention || q.intent || q.reason || "Check understanding"),
        answer: cleanPdfText(q.answer || q.modelAnswer || q.sampleAnswer || "Explain with proper example")
      }));

    let technicalQuestions = sanitizeQuestions(interviewReportByAi.technicalQuestions || []);
    let behavioralQuestions = sanitizeQuestions(interviewReportByAi.behavioralQuestions || []);

    if (!technicalQuestions.length || !behavioralQuestions.length) {
      const defaults = getDefaultQuestions();
      if (!technicalQuestions.length) technicalQuestions = defaults.technicalQuestions;
      if (!behavioralQuestions.length) behavioralQuestions = defaults.behavioralQuestions;
    }

    const preparationPlan = (interviewReportByAi.preparationPlan || []).map((day, i) => {
      const focus = day.focus || "MERN Practice";

      return {
        day: i + 1,
        focus,
        tasks:
          (day.tasks && day.tasks.length >= 3)
            ? day.tasks.map(t => cleanPdfText(t))
            : (day.task && day.task.length >= 3)
              ? day.task.map(t => cleanPdfText(t))
              : [
                `Study ${focus} concepts`,
                `Practice coding questions on ${focus}`,
                `Build mini project using ${focus}`
              ]
      };
    });

    // 🔹 Calculate real matchScore & extract dynamic skillGaps
    let matchScore = typeof interviewReportByAi.matchScore === "number" && interviewReportByAi.matchScore >= 0 && interviewReportByAi.matchScore <= 100
      ? Math.round(interviewReportByAi.matchScore)
      : 75;

    let skillGaps = Array.isArray(interviewReportByAi.skillGaps) && interviewReportByAi.skillGaps.length > 0
      ? interviewReportByAi.skillGaps.map(g => ({
          skill: cleanPdfText(g.skill || "Technical Skill"),
          severity: ["low", "medium", "high"].includes(String(g.severity).toLowerCase()) ? String(g.severity).toLowerCase() : "medium"
        })).filter(g => g.skill)
      : [
          { skill: "System Design", severity: "medium" },
          { skill: "Performance Optimization", severity: "medium" },
          { skill: "CI/CD Pipeline", severity: "low" }
        ];

    const interviewReport = await interviewReportModel.create({
      user: req.user.id,
      title: buildTitleFromJobDescription(jobDescription),
      resume: resumeContent,
      selfDescription: selfDescription && String(selfDescription).trim() ? cleanPdfText(selfDescription) : undefined,
      jobDescription: cleanPdfText(jobDescription),
      matchScore,
      skillGaps,
      technicalQuestions,
      behavioralQuestions,
      preparationPlan
    });

    res.status(201).json({
      message: "Interview Report generated successfully",
      data: interviewReport
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}


/**
 * @description controller to get interview report by interviewId
 */
async function getInterviewReportByIdController(req, res) {
  const { interviewId } = req.params

  const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })
  if (!interviewReport) {
    return res.status(404).json({
      message: "Interview Report not found"
    })
  }

  res.status(200).json({
    message: "Interview report fetched successfully",
    data: interviewReport
  })
}


/**
 * @description controller to get the all interview reports of logged in user
 */
async function getAllInterviewReportsController(req, res) {
  const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

  res.status(200).json({
    message: "Interview Reports fetched successfully",
    interviewReports
  })
}

/**
 * @description Stream a styled PDF summary of the interview report.
 */
async function generateResumePdfController(req, res) {
  const { interviewReportId } = req.params;

  try {
    const interviewReport = await interviewReportModel.findOne({
      _id: interviewReportId,
      user: req.user.id
    });

    if (!interviewReport) {
      return res.status(404).json({ message: "Interview Report not found" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="interview-plan-${interviewReportId}.pdf"`
    );

    const doc = new PDFDocument({
      margin: 40,
      bufferPages: true
    });
    doc.pipe(res);

    // Color Palette
    const primaryColor = "#4f46e5"; // Indigo accent
    const secondaryColor = "#ec4899"; // Pink accent
    const darkBg = "#0f172a"; // Slate dark
    const textDark = "#1e293b";
    const textMuted = "#64748b";

    // ── Document Header ──
    doc.rect(0, 0, doc.page.width, 85).fill(darkBg);

    doc.fillColor("#ffffff").fontSize(20).font("Helvetica-Bold")
       .text("HireSmart AI", 40, 22);
    doc.fontSize(10).font("Helvetica")
       .fillColor("#94a3b8")
       .text("Tailored Interview Strategy & Preparation Plan", 40, 48);

    // Match Score Pill Badge (top right)
    const score = interviewReport.matchScore ?? 80;
    const scoreColor = score >= 80 ? "#22c55e" : score >= 60 ? "#f59e0b" : "#ef4444";

    doc.roundedRect(doc.page.width - 160, 20, 120, 45, 6)
       .fill(scoreColor);
    doc.fillColor("#ffffff").fontSize(16).font("Helvetica-Bold")
       .text(`${score}%`, doc.page.width - 160, 28, { width: 120, align: "center" });
    doc.fontSize(8).font("Helvetica")
       .text("MATCH SCORE", doc.page.width - 160, 48, { width: 120, align: "center" });

    doc.y = 105;

    // Helper for Section Titles
    const renderSectionHeader = (title) => {
      if (doc.y > doc.page.height - 90) doc.addPage();
      doc.moveDown(0.5);
      const startY = doc.y;
      doc.rect(40, startY, doc.page.width - 80, 24).fill("#e0e7ff");
      doc.fillColor(primaryColor).fontSize(11).font("Helvetica-Bold")
         .text(title.toUpperCase(), 50, startY + 6);
      doc.y = startY + 32;
    };

    // 1. Report Title & Info
    doc.fillColor(textDark).fontSize(14).font("Helvetica-Bold")
       .text(cleanPdfText(interviewReport.title || "Interview Strategy Plan"), 40, doc.y);
    doc.fontSize(9).font("Helvetica").fillColor(textMuted)
       .text(`Generated on: ${new Date(interviewReport.createdAt).toLocaleDateString()}`);
    doc.moveDown(0.5);

    // 2. Skill Gaps Section
    if (interviewReport.skillGaps && interviewReport.skillGaps.length > 0) {
      renderSectionHeader("Identified Skill Gaps");
      let currentX = 40;
      let currentY = doc.y;

      interviewReport.skillGaps.forEach((gap) => {
        const skillName = `${cleanPdfText(gap.skill || "Skill")} (${(gap.severity || "medium").toUpperCase()})`;
        const textWidth = doc.widthOfString(skillName, { font: "Helvetica-Bold", size: 8.5 }) + 16;

        if (currentX + textWidth > doc.page.width - 40) {
          currentX = 40;
          currentY += 22;
        }

        const tagColor = gap.severity === "high" ? "#fee2e2" : gap.severity === "medium" ? "#fef3c7" : "#dcfce7";
        const tagTextColor = gap.severity === "high" ? "#991b1b" : gap.severity === "medium" ? "#92400e" : "#166534";

        doc.roundedRect(currentX, currentY, textWidth, 18, 4).fill(tagColor);
        doc.fillColor(tagTextColor).fontSize(8.5).font("Helvetica-Bold")
           .text(skillName, currentX, currentY + 4, { width: textWidth, align: "center" });

        currentX += textWidth + 8;
      });
      doc.y = currentY + 28;
    }

    // 3. Technical Questions
    renderSectionHeader("Technical Questions");
    (interviewReport.technicalQuestions || []).forEach((q, i) => {
      if (doc.y > doc.page.height - 110) doc.addPage();

      doc.fillColor(primaryColor).fontSize(10).font("Helvetica-Bold")
         .text(`Q${i + 1}: ${cleanPdfText(q.question || "")}`, 45, doc.y, { width: doc.page.width - 90 });

      if (q.intention) {
        doc.moveDown(0.2);
        doc.fontSize(8.5).font("Helvetica-Oblique").fillColor(textMuted)
           .text(`Intent: ${cleanPdfText(q.intention)}`, 55, doc.y, { width: doc.page.width - 100 });
      }

      if (q.answer) {
        doc.moveDown(0.2);
        doc.fontSize(9).font("Helvetica").fillColor(textDark)
           .text(`Model Answer: ${cleanPdfText(q.answer)}`, 55, doc.y, { width: doc.page.width - 100 });
      }
      doc.moveDown(0.6);
    });

    // 4. Behavioral Questions
    renderSectionHeader("Behavioral Questions");
    (interviewReport.behavioralQuestions || []).forEach((q, i) => {
      if (doc.y > doc.page.height - 110) doc.addPage();

      doc.fillColor(secondaryColor).fontSize(10).font("Helvetica-Bold")
         .text(`Q${i + 1}: ${cleanPdfText(q.question || "")}`, 45, doc.y, { width: doc.page.width - 90 });

      if (q.intention) {
        doc.moveDown(0.2);
        doc.fontSize(8.5).font("Helvetica-Oblique").fillColor(textMuted)
           .text(`Intent: ${cleanPdfText(q.intention)}`, 55, doc.y, { width: doc.page.width - 100 });
      }

      if (q.answer) {
        doc.moveDown(0.2);
        doc.fontSize(9).font("Helvetica").fillColor(textDark)
           .text(`Model Answer: ${cleanPdfText(q.answer)}`, 55, doc.y, { width: doc.page.width - 100 });
      }
      doc.moveDown(0.6);
    });

    // 5. Preparation Roadmap
    renderSectionHeader("Preparation Roadmap");
    (interviewReport.preparationPlan || []).forEach((day) => {
      if (doc.y > doc.page.height - 90) doc.addPage();

      doc.fillColor(primaryColor).fontSize(10).font("Helvetica-Bold")
         .text(`Day ${day.day}: ${cleanPdfText(day.focus || "")}`, 45, doc.y);
      doc.moveDown(0.2);

      (day.tasks || []).forEach((task) => {
        doc.fontSize(8.5).font("Helvetica").fillColor(textDark)
           .text(`•  ${cleanPdfText(task)}`, 55, doc.y, { width: doc.page.width - 100 });
      });
      doc.moveDown(0.5);
    });

    // 6. Resume & Job Description Excerpt (Sanitized)
    if (interviewReport.resume || interviewReport.selfDescription) {
      renderSectionHeader("Candidate Profile & Resume Excerpt");
      const profileText = cleanPdfText(interviewReport.resume || interviewReport.selfDescription || "").slice(0, 2000);
      doc.fontSize(8.5).font("Helvetica").fillColor(textDark)
         .text(profileText, 45, doc.y, { width: doc.page.width - 90 });
      doc.moveDown(0.8);
    }

    if (interviewReport.jobDescription) {
      renderSectionHeader("Target Job Description Excerpt");
      const jdText = cleanPdfText(interviewReport.jobDescription).slice(0, 2000);
      doc.fontSize(8.5).font("Helvetica").fillColor(textDark)
         .text(jdText, 45, doc.y, { width: doc.page.width - 90 });
    }

    // Add Page Numbers to all pages
    const pages = doc.bufferedPageRange();
    for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(i);
      doc.fontSize(8).font("Helvetica").fillColor("#94a3b8")
         .text(`HireSmart AI • Page ${i + 1} of ${pages.count}`, 40, doc.page.height - 30, {
           width: doc.page.width - 80,
           align: "center"
         });
    }

    doc.end();
  } catch (error) {
    console.log(error);
    if (!res.headersSent) {
      res.status(500).json({ message: error.message || "PDF generation failed" });
    }
  }
}

/**
 * @description Generates a 5-question AI skill quiz for a targeted skill.
 */
async function generateSkillQuizController(req, res) {
  try {
    const { skill } = req.body;
    if (!skill || !String(skill).trim()) {
      return res.status(400).json({ message: "Skill parameter is required" });
    }

    const quiz = await generateSkillQuizService({ skill: String(skill).trim() });
    res.status(200).json({
      message: "Skill quiz generated successfully",
      data: quiz
    });
  } catch (error) {
    console.log("generateSkillQuizController error:", error);
    res.status(500).json({ message: error.message || "Failed to generate skill quiz" });
  }
}

/**
 * @description Generates a personalized cover letter & recruiter email pitch.
 */
async function generateCoverLetterController(req, res) {
  try {
    const { jobDescription, resumeText, targetCompany, roleTitle } = req.body;

    const result = await generateCoverLetterService({
      jobDescription,
      resumeText,
      targetCompany,
      roleTitle
    });

    res.status(200).json({
      message: "Cover letter and recruiter pitch generated successfully",
      data: result
    });
  } catch (error) {
    console.log("generateCoverLetterController error:", error);
    res.status(500).json({ message: error.message || "Failed to generate cover letter" });
  }
}

/**
 * @description Evaluates a candidate's mock interview answer and returns AI scoring & feedback.
 */
async function evaluateMockAnswerController(req, res) {
  try {
    const { question, userAnswer, roleTitle } = req.body;
    if (!question || !String(question).trim()) {
      return res.status(400).json({ message: "Question parameter is required" });
    }

    const evaluation = await evaluateMockAnswerService({
      question,
      userAnswer,
      roleTitle
    });

    res.status(200).json({
      message: "Mock answer evaluated successfully",
      data: evaluation
    });
  } catch (error) {
    console.log("evaluateMockAnswerController error:", error);
    res.status(500).json({ message: error.message || "Failed to evaluate mock answer" });
  }
}

module.exports = {
  generateInterviewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  generateResumePdfController,
  generateSkillQuizController,
  generateCoverLetterController,
  evaluateMockAnswerController
};