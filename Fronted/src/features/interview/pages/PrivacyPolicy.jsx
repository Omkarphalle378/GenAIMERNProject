import React from 'react'
import '../style/home.scss'

const PrivacyPolicy = () => {
  return (
    <div className='dashboard-page dashboard-page--content'>
      <section className='page-panel'>
        <div className='page-panel__header'>
          <div>
            <p className='dashboard-eyebrow'>Legal & Trust</p>
            <h1>Privacy Policy</h1>
            <p className='panel-subtitle'>Effective Date: July 2026 • Last Updated: Today</p>
          </div>
        </div>

        <div className='page-panel__body' style={{ gap: '1.5rem', lineHeight: '1.7', color: 'var(--text-primary)' }}>
          <div style={{ padding: '1.25rem', borderRadius: '0.85rem', background: 'var(--bg-panel)', border: '1px solid var(--border-color)' }}>
            <h3 style={{ margin: '0 0 0.5rem', color: 'var(--text-primary)' }}>🔒 1. Data Protection & Security Commitment</h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              At HireSmart AI, we prioritize candidate privacy and data security. All uploaded resumes, self-descriptions, and generated strategy reports are encrypted in transit via SSL/TLS and stored securely in isolated MongoDB databases.
            </p>
          </div>

          <div style={{ padding: '1.25rem', borderRadius: '0.85rem', background: 'var(--bg-panel)', border: '1px solid var(--border-color)' }}>
            <h3 style={{ margin: '0 0 0.5rem', color: 'var(--text-primary)' }}>📄 2. Information We Collect & How It Is Used</h3>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-secondary)', fontSize: '0.92rem', display: 'grid', gap: '0.4rem' }}>
              <li><strong>Account Credentials:</strong> Username and email address used for authentication and session management.</li>
              <li><strong>Candidate Content:</strong> Uploaded PDF resumes, job descriptions, and user practice answers.</li>
              <li><strong>AI Processing:</strong> Candidate data is passed transiently to Google Generative AI strictly for generating reports, quizzes, and cover letters.</li>
            </ul>
          </div>

          <div style={{ padding: '1.25rem', borderRadius: '0.85rem', background: 'var(--bg-panel)', border: '1px solid var(--border-color)' }}>
            <h3 style={{ margin: '0 0 0.5rem', color: 'var(--text-primary)' }}>🤖 3. Zero Model Training Guarantee</h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              We do <strong>NOT</strong> use candidate resume data or personal information to train public AI models. Your resume text remains confidential and accessible only to you through your authenticated candidate dashboard.
            </p>
          </div>

          <div style={{ padding: '1.25rem', borderRadius: '0.85rem', background: 'var(--bg-panel)', border: '1px solid var(--border-color)' }}>
            <h3 style={{ margin: '0 0 0.5rem', color: 'var(--text-primary)' }}>🗑️ 4. User Rights & Data Deletion</h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              You retain full ownership of your data. You may request full account and report deletion at any time by contacting our support team or clearing your historical strategy reports from the Strategy Lab.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PrivacyPolicy
