import React from 'react'
import '../style/home.scss'

const TermsConditions = () => {
  return (
    <div className='dashboard-page dashboard-page--content'>
      <section className='page-panel'>
        <div className='page-panel__header'>
          <div>
            <p className='dashboard-eyebrow'>Legal & Trust</p>
            <h1>Terms of Service</h1>
            <p className='panel-subtitle'>Effective Date: July 2026 • Terms & Conditions</p>
          </div>
        </div>

        <div className='page-panel__body' style={{ gap: '1.5rem', lineHeight: '1.7', color: 'var(--text-primary)' }}>
          <div style={{ padding: '1.25rem', borderRadius: '0.85rem', background: 'var(--bg-panel)', border: '1px solid var(--border-color)' }}>
            <h3 style={{ margin: '0 0 0.5rem', color: 'var(--text-primary)' }}>📜 1. Acceptance of Terms</h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              By registering or accessing HireSmart AI services, you agree to comply with these Terms of Service. These terms govern your access to AI-generated interview strategy reports, PDF exporters, skill assessments, and career tools.
            </p>
          </div>

          <div style={{ padding: '1.25rem', borderRadius: '0.85rem', background: 'var(--bg-panel)', border: '1px solid var(--border-color)' }}>
            <h3 style={{ margin: '0 0 0.5rem', color: 'var(--text-primary)' }}>🤖 2. AI Content & Advisory Disclaimer</h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              HireSmart AI utilizes advanced generative AI models to score resume matches, curate technical questions, and formulate preparation roadmaps. While reports are designed to mirror industry standards, candidate success in real interviews depends on individual preparation and recruiter evaluations.
            </p>
          </div>

          <div style={{ padding: '1.25rem', borderRadius: '0.85rem', background: 'var(--bg-panel)', border: '1px solid var(--border-color)' }}>
            <h3 style={{ margin: '0 0 0.5rem', color: 'var(--text-primary)' }}>🛡️ 3. Acceptable Use & Account Integrity</h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Candidates agree to submit accurate resume and job description information. Misuse of platform APIs, automated scraping, or unauthorized access attempts are strictly prohibited and subject to account suspension.
            </p>
          </div>

          <div style={{ padding: '1.25rem', borderRadius: '0.85rem', background: 'var(--bg-panel)', border: '1px solid var(--border-color)' }}>
            <h3 style={{ margin: '0 0 0.5rem', color: 'var(--text-primary)' }}>💼 4. Intellectual Property</h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              All software architecture, visual design elements, and platform branding are the exclusive property of HireSmart AI. Generated strategy reports and PDF downloads belong to the candidate for personal interview preparation.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default TermsConditions
