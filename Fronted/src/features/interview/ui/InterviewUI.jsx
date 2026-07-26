import React, { useState, useRef } from "react";
import {
  FaUpload,
  FaUser,
  FaBriefcase,
  FaMagic,
  FaRobot,
  FaCheckCircle,
  FaFileAlt,
  FaBolt
} from "react-icons/fa";
import { useInterview } from "../hooks/useInterview";
import { useNavigate } from 'react-router-dom'
const InterviewUI = () => {
  const { loading, generateReport } = useInterview()
  const [jobDescription, setJobDescription] = useState("")
  const [selfDescription, setSelfDescription] = useState("")
  const resumeInputRef = useRef()

  const navigate = useNavigate()

  const handleGenerateReport = async () => {
    const resumeFile = resumeInputRef.current.files[0]

    if (!jobDescription?.trim()) {
      alert("Please enter a job description")
      return
    }
    if (!resumeFile && !selfDescription?.trim()) {
      alert("Please upload a PDF resume OR enter self description")
      return
    }

    try {
      const data = await generateReport({
        jobDescription,
        selfDescription,
        resumeFile
      })

      if (data?._id) {
        navigate(`/interview/${data._id}`)
      }

    } catch (err) {
      console.log(err)
      alert(err.message || "Could not generate the interview plan.")
    }
  }

  if (loading) {
    return (
      <main className='loading-screen'>
        <h1>Loading your interview plan...</h1>
      </main>
    )
  }

  return (
    <section className="interview-page">
      <div className="interview-card">
        <div className="interview-card__header">
          <div>
            <h1>Create Your Custom Interview Plan</h1>
            <p>
              Let our AI analyze the job requirements and your unique profile to
              build a winning strategy.
            </p>
          </div>
        </div>

        <div className="interview-card__body">
          <div className="panel panel--left">
            <div className="panel__title">
              <h3>
                <FaBriefcase style={{ marginRight: "8px" }} />
                Target Job Description
              </h3>
              <span className="panel__label">Required</span>
            </div>
            <textarea
              onChange={(e) => { setJobDescription(e.target.value) }}
              className="job-description"
              placeholder="Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design..."
              aria-label="Job description"
            />
            <p className="hint">
              e.g. 'Senior Frontend Engineer at Google requires proficiency in
              React, TypeScript, and large-scale system design...'
            </p>
            <div className="char-count">0 / 5000 chars</div>
          </div>

          <div className="panel panel--right">
            <div className="panel__title panel__title--top">
              <h3>
                <FaUser style={{ marginRight: "8px" }} />
                Your Profile
              </h3>
            </div>

            <div className="upload-section">
              <div className="upload-section__heading">
                <span>Upload Resume</span>
                <span className="upload-tag">Best Results</span>
              </div>
              <label htmlFor="resumeUpload" className="upload-box">
                <div className="upload-box__icon">⬆</div>
                <div className="upload-box__content">
                  <p>Click to upload or drag & drop</p>
                  <span>PDF or DOCX (Max 5MB)</span>
                </div>
              </label>
              <input
                ref={resumeInputRef}
                hidden
                id="resumeUpload"
                type="file"
                accept=".pdf"
              />
            </div>

            <div className="upload-separator">OR</div>

            <div className="input-panel">
              <label htmlFor="selfDescription">Quick Self-Description</label>
              <textarea
                onChange={(e) => { setSelfDescription(e.target.value) }}
                id="selfDescription"
                className="self-description"
                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                aria-label="Self description"
              />
            </div>

            <div className="info-card">
              Either a Resume or a Self Description is required to generate a
              personalized plan.
            </div>
          </div>
        </div>

        <div className="interview-card__footer">
          <p className="ai-text">
            <FaRobot style={{ marginRight: "8px" }} />
            AI-Powered Strategy Generation • Approx 30s
          </p>

          <button onClick={handleGenerateReport} className="primary-button"><FaMagic style={{ marginRight: "8px" }} />Generate My Interview Strategy</button>
        </div>
      </div>
    </section>
  );
};

export default InterviewUI;
