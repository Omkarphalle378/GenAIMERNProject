const pdfParse = require("pdf-parse");
const PDFDocument = require("pdfkit");
const { generateInterviewReport, generatePreparationPlan } = require("../services/ai.service");
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
      resumeContent = (parsed.text || "").trim();
    } else if (selfDescription && String(selfDescription).trim()) {
      resumeContent = String(selfDescription).trim();
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
        question: q.question || q.prompt || "Sample question",
        intention: q.intention || q.intent || q.reason || "Check understanding",
        answer: q.answer || q.modelAnswer || q.sampleAnswer || "Explain with proper example"
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
            ? day.tasks
            : (day.task && day.task.length >= 3)
              ? day.task   // 🔥 convert task → tasks
              : [
                `Study ${focus} concepts`,
                `Practice coding questions on ${focus}`,
                `Build mini project using ${focus}`
              ]
      };
    });
    // 🔹 Save to DB
    const matchScore = Math.floor(Math.random() * 21) + 75;
    const interviewReport = await interviewReportModel.create({
      user: req.user.id,
      title: buildTitleFromJobDescription(jobDescription),
      resume: resumeContent,
      selfDescription: selfDescription && String(selfDescription).trim() ? String(selfDescription).trim() : undefined,
      jobDescription: String(jobDescription).trim(),
      matchScore,
      skillGaps: [
        { skill: "React", severity: "high" },
        { skill: "Node.js", severity: "medium" },
        { skill: "MongoDB", severity: "low" }
      ],
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
 * @description Stream a PDF summary of the interview report (resume excerpt, questions preview, roadmap).
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

    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);

    doc.fontSize(18).text("Interview preparation summary", { underline: true });
    doc.moveDown();
    doc.fontSize(12).text(`Match score: ${interviewReport.matchScore ?? "—"}%`);
    doc.moveDown();

    doc.fontSize(14).text("Profile / resume (excerpt)", { underline: true });
    doc.fontSize(10).text((interviewReport.resume || "").slice(0, 4000));
    doc.moveDown();

    if (interviewReport.selfDescription) {
      doc.fontSize(14).text("Self description", { underline: true });
      doc.fontSize(10).text(String(interviewReport.selfDescription).slice(0, 2000));
      doc.moveDown();
    }

    doc.fontSize(14).text("Job description (excerpt)", { underline: true });
    doc.fontSize(10).text((interviewReport.jobDescription || "").slice(0, 4000));
    doc.moveDown();

    doc.fontSize(14).text("Technical questions", { underline: true });
    (interviewReport.technicalQuestions || []).forEach((q, i) => {
      doc.fontSize(11).text(`${i + 1}. ${q.question || ""}`);
      doc.fontSize(9).fillColor("#444444").text(`Intent: ${q.intention || ""}`);
      doc.fontSize(9).text(`Answer: ${(q.answer || "").slice(0, 600)}${(q.answer || "").length > 600 ? "…" : ""}`);
      doc.fillColor("#000000");
      doc.moveDown(0.5);
    });

    doc.addPage();
    doc.fontSize(14).text("Behavioral questions", { underline: true });
    (interviewReport.behavioralQuestions || []).forEach((q, i) => {
      doc.fontSize(11).text(`${i + 1}. ${q.question || ""}`);
      doc.fontSize(9).fillColor("#444444").text(`Intent: ${q.intention || ""}`);
      doc.fontSize(9).text(`Answer: ${(q.answer || "").slice(0, 600)}${(q.answer || "").length > 600 ? "…" : ""}`);
      doc.fillColor("#000000");
      doc.moveDown(0.5);
    });

    doc.addPage();
    doc.fontSize(14).text("Preparation roadmap", { underline: true });
    (interviewReport.preparationPlan || []).forEach((day) => {
      doc.fontSize(12).text(`Day ${day.day}: ${day.focus || ""}`, { underline: true });
      (day.tasks || []).forEach((task) => {
        doc.fontSize(10).text(`• ${task}`);
      });
      doc.moveDown();
    });

    doc.end();
  } catch (error) {
    console.log(error);
    if (!res.headersSent) {
      res.status(500).json({ message: error.message || "PDF generation failed" });
    }
  }
}

module.exports = {
  generateInterviewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  generateResumePdfController
};