const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const interviewRouter = express.Router()
const interviewController = require("../controllers/interview.controller")
const upload = require("../middlewares/file.middleware")

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
 * @route POST /api/interview/resume/pdf/:interviewReportId
 * @description Download a PDF summary of the interview report
 * @access Private
 */
interviewRouter.post(
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