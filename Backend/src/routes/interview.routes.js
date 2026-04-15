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
module.exports = interviewRouter