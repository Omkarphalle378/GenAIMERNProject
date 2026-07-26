const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const interviewRouter = express.Router()
const interviewController = require("../controllers/interview.controller")
const upload = require("../middlewares/file.middleware")

/**
 * @route POST /api/interview/quiz/generate
 * @description Generate 5-question AI skill quiz
 * @access Private
 */
interviewRouter.post("/quiz/generate", authMiddleware.authUser, interviewController.generateSkillQuizController)

/**
 * @route POST /api/interview/cover-letter/generate
 * @description Generate personalized Cover Letter & Recruiter Pitch
 * @access Private
 */
interviewRouter.post("/cover-letter/generate", authMiddleware.authUser, interviewController.generateCoverLetterController)

/**
 * @route POST /api/interview/mock/evaluate
 * @description Evaluate candidate's mock interview answer with instant AI scoring & feedback
 * @access Private
 */
interviewRouter.post("/mock/evaluate", authMiddleware.authUser, interviewController.evaluateMockAnswerController)

/**
 * @route POST /api/interview
 * @description Generate the new interview report on the basis of user self decription , resume pdf,and job description
 * @access Private
 */
interviewRouter.post("/",authMiddleware.authUser,upload.single("resume"),interviewController.generateInterviewReportController)


/**
 * @route POST /api/interview/report/:interviewId
 * @description get interview report by interviewId
 * @access Private
 */
interviewRouter.get("/report/:interviewId",authMiddleware.authUser,interviewController.getInterviewReportByIdController)

/**
 * @route GET/POST /api/interview/resume/pdf/:interviewReportId
 * @description Download a PDF summary of the interview report
 * @access Private
 */
interviewRouter.post(
  "/resume/pdf/:interviewReportId",
  authMiddleware.authUser,
  interviewController.generateResumePdfController
)
interviewRouter.get(
  "/resume/pdf/:interviewReportId",
  authMiddleware.authUser,
  interviewController.generateResumePdfController
)

/**
 * @routes GET/api/interview/
 * @description get all interview reports of logged n user
 * @access private
 */

interviewRouter.get("/",authMiddleware.authUser,interviewController.getAllInterviewReportsController)

module.exports = interviewRouter