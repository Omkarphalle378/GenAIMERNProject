import { api } from "../../auth/services/auth.api.js"


/**
 * @description Service to generate interview report based on user self description, resume and job description.
 */
export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {

    const formData = new FormData()
    formData.append("jobDescription", jobDescription)
    formData.append("selfDescription", selfDescription)
    formData.append("resume", resumeFile)

    const response = await api.post("/api/interview/", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        },
        timeout: 300000
    })

    return response.data

}


/**
 * @description Service to get interview report by interviewId.
 */
export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`/api/interview/report/${interviewId}`)

    return response.data
}


/**
 * @description Service to get all interview reports of logged in user.
 */
export const getAllInterviewReports = async () => {
    const response = await api.get("/api/interview/")

    return response.data
}


/**
 * @description Service to generate resume pdf based on user self description, resume content and job description.
 */
export const generateResumePdf = async ({ interviewReportId }) => {
    const response = await api.post(`/api/interview/resume/pdf/${interviewReportId}`, null, {
        responseType: "blob",
        timeout: 120000
    })

    return response.data
}

/**
 * @description Service to generate 5-question AI skill assessment quiz.
 */
export const generateSkillQuizApi = async ({ skill }) => {
    const response = await api.post("/api/interview/quiz/generate", { skill })
    return response.data
}

/**
 * @description Service to generate AI Cover Letter and Recruiter Cold Email Pitch.
 */
export const generateCoverLetterApi = async ({ jobDescription, resumeText, targetCompany, roleTitle }) => {
    const response = await api.post("/api/interview/cover-letter/generate", {
        jobDescription,
        resumeText,
        targetCompany,
        roleTitle
    })
    return response.data
}

/**
 * @description Service to evaluate candidate's mock interview answer.
 */
export const evaluateMockAnswerApi = async ({ question, userAnswer, roleTitle }) => {
    const response = await api.post("/api/interview/mock/evaluate", {
        question,
        userAnswer,
        roleTitle
    })
    return response.data
}