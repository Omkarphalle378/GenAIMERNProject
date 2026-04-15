import React from "react";

const InterviewUI = () => {
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
              <h2>Target Job Description</h2>
              <span className="panel__label">Required</span>
            </div>
            <textarea
              className="job-description"
              placeholder="Paste the full job description here..."
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
              <h2>Your Profile</h2>
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
                hidden
                id="resumeUpload"
                type="file"
                accept=".pdf,.doc,.docx"
              />
            </div>

            <div className="upload-separator">OR</div>

            <div className="input-panel">
              <label htmlFor="selfDescription">Quick Self-Description</label>
              <textarea
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
          <span>AI-Powered Strategy Generation • Approx 30s</span>
          <button className="primary-button">Generate My Interview Strategy</button>
        </div>
      </div>
    </section>
  );
};

export default InterviewUI;
