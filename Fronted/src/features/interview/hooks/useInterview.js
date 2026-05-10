import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api"
import { useContext, useEffect } from "react"
import { useParams } from "react-router"
import { InterviewContext } from './../style/interview.context';


export const useInterview = () => {

    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        let reportDoc = null
        try {
            const response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            reportDoc = response?.data ?? null
            if (reportDoc) setReport(reportDoc)
        } catch (error) {
            console.log(error)
            const msg =
                error.response?.data?.message ||
                error.message ||
                "Could not generate the interview plan."
            throw new Error(msg)
        } finally {
            setLoading(false)
        }

        return reportDoc
    }

    const getReportById = async (interviewId) => {
        setLoading(true)
        let reportDoc = null
        try {
            const response = await getInterviewReportById(interviewId)
            reportDoc = response?.data ?? null
            if (reportDoc) setReport(reportDoc)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
        return reportDoc
    }

    const getReports = async () => {
        setLoading(true)
        let list = []
        try {
            const response = await getAllInterviewReports()
            list = response?.interviewReports ?? []
            setReports(list)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

        return list
    }

    const getResumePdf = async (interviewReportId) => {
        try {
            const response = await generateResumePdf({ interviewReportId })
            const url = window.URL.createObjectURL(new Blob([ response ], { type: "application/pdf" }))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)
        }
        catch (error) {
            console.log(error)
            let blobMessage = null
            if (error.response?.data instanceof Blob) {
                try {
                    const text = await error.response.data.text()
                    const parsed = JSON.parse(text)
                    blobMessage = parsed?.message || null
                } catch {
                    blobMessage = null
                }
            } else {
                blobMessage = error.response?.data?.message || null
            }
            const msg =
                blobMessage ||
                error.message ||
                "Could not download resume PDF."
            alert(msg)
        }
    }

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
        }
    }, [ interviewId ])

    return { loading, report, reports, generateReport, getReportById, getReports, getResumePdf }

}