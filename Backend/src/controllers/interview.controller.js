const pdfParse = require("pdf-parse");
const generateInterviewReport = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

async function generateInterviewReportController(req, res) {
  try {
    const { selfDescription, jobDescription } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Resume file required" });
    }

    
    const parsed = await pdfParse(req.file.buffer);
    const resumeContent = parsed.text;

    
    const interviewReportByAi = await generateInterviewReport({
      resume: resumeContent,
      selfDescription,
      jobDescription
    });

    const {
      technicalQuestions,
      behavioralQuestions,
      skillGaps,
      preparationPlan,
      matchScore
    } = interviewReportByAi;

    const interviewReport = await interviewReportModel.create({
      user: req.user.id,
      resume: resumeContent,
      selfDescription,
      jobDescription,
      matchScore,
      technicalQuestions: technicalQuestions,
      behavioralQuestions: behavioralQuestions,
      skillGaps: skillGaps,
      preparationPlan: preparationPlan
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

module.exports = { generateInterviewReportController };