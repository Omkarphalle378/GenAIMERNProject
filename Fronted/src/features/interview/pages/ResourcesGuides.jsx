import React, { useState } from 'react'
import '../style/home.scss'
import { generateCoverLetterApi } from '../services/interview.api'
import { useInterview } from '../hooks/useInterview'

const ResourcesGuides = () => {
  const { reports } = useInterview()

  // Form State
  const [roleTitle, setRoleTitle] = useState('')
  const [targetCompany, setTargetCompany] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [resumeText, setResumeText] = useState('')
  
  // UI State
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [activeTab, setActiveTab] = useState('coverLetter') // 'coverLetter' | 'coldEmail' | 'highlights'
  const [copyNotification, setCopyNotification] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // Auto-fill from selected report
  const handleSelectReport = (reportId) => {
    const r = (reports || []).find(rep => rep._id === reportId)
    if (r) {
      setRoleTitle(r.title || 'Software Engineer')
      setJobDescription(r.jobDescription || '')
      setResumeText(r.resume || r.selfDescription || '')
    }
  }

  const handleGenerate = async (e) => {
    e.preventDefault()
    if (!jobDescription.trim() && !roleTitle.trim()) {
      setErrorMessage('Please provide a Role Title or Job Description')
      return
    }

    setErrorMessage('')
    setLoading(true)
    setResult(null)

    try {
      const response = await generateCoverLetterApi({
        roleTitle: roleTitle.trim() || 'Software Engineer',
        targetCompany: targetCompany.trim() || 'Hiring Team',
        jobDescription: jobDescription.trim(),
        resumeText: resumeText.trim()
      })

      if (response?.data) {
        setResult(response.data)
      } else {
        setErrorMessage('Failed to receive generated cover letter.')
      }
    } catch (err) {
      if (err?.response?.status === 401) {
        setErrorMessage('Session expired or unauthorized. Please Log Out and Log In again to refresh your session.')
      } else {
        setErrorMessage(err?.response?.data?.message || err?.message || 'Generation failed')
      }
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text, label) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    setCopyNotification(`${label} copied to clipboard!`)
    setTimeout(() => setCopyNotification(''), 3000)
  }

  const handleDownloadTxt = () => {
    if (!result?.coverLetter) return
    const element = document.createElement('a')
    const file = new Blob([result.coverLetter], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `${(targetCompany || 'CoverLetter').replace(/\s+/g, '_')}_Cover_Letter.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className='dashboard-page dashboard-page--content'>
      <section className='page-panel'>
        <div className='page-panel__header'>
          <div>
            <p className='dashboard-eyebrow'>Career Studio</p>
            <h1>AI Cover Letter & Pitch Generator</h1>
            <p className='panel-subtitle'>Craft highly persuasive, customized cover letters and recruiter cold email pitches tailored to your target job description.</p>
          </div>
        </div>

        {copyNotification && (
          <div style={{ padding: '0.75rem 1rem', borderRadius: '0.65rem', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid #22c55e', color: '#22c55e', fontWeight: '700', fontSize: '0.9rem', marginBottom: '1rem' }}>
            ✓ {copyNotification}
          </div>
        )}

        {errorMessage && (
          <div className='home-error' role='alert' style={{ marginBottom: '1rem' }}>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Controls */}
        <form onSubmit={handleGenerate} className='page-panel__body' style={{ gap: '1.25rem' }}>
          
          {/* Quick Auto-fill Dropdown */}
          {reports && reports.length > 0 && (
            <div style={{ padding: '1rem', borderRadius: '0.75rem', background: 'var(--bg-panel)', border: '1px solid var(--border-color)' }}>
              <label style={{ display: 'block', fontWeight: '700', fontSize: '0.85rem', color: 'var(--accent-indigo)', marginBottom: '0.45rem' }}>
                ⚡ Auto-Fill Details From Your Strategy Reports:
              </label>
              <select
                onChange={(e) => handleSelectReport(e.target.value)}
                defaultValue=""
                style={{ width: '100%', padding: '0.6rem 0.9rem', borderRadius: '0.5rem', background: 'var(--badge-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.9rem' }}
              >
                <option value="" disabled style={{ background: '#161b22', color: '#e6edf3' }}>-- Select a recent report to auto-fill --</option>
                {reports.map(r => (
                  <option key={r._id} value={r._id} style={{ background: '#161b22', color: '#e6edf3' }}>{r.title || 'Untitled Strategy Report'}</option>
                ))}
              </select>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '700', fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '0.45rem' }}>
                Target Role Title:
              </label>
              <input
                type='text'
                placeholder='e.g., Senior Full Stack MERN Developer'
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                className='panel__textarea'
                style={{ minHeight: '44px', height: '44px', padding: '0.5rem 1rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: '700', fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '0.45rem' }}>
                Company Name:
              </label>
              <input
                type='text'
                placeholder='e.g., Google, Stripe, Microsoft...'
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                className='panel__textarea'
                style={{ minHeight: '44px', height: '44px', padding: '0.5rem 1rem' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: '700', fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '0.45rem' }}>
              Target Job Description:
            </label>
            <textarea
              placeholder='Paste the job description details here...'
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className='panel__textarea'
              style={{ minHeight: '110px', padding: '0.85rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: '700', fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '0.45rem' }}>
              Candidate Highlights / Key Experience:
            </label>
            <textarea
              placeholder='Paste summary of your skills, achievements, or resume content...'
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className='panel__textarea'
              style={{ minHeight: '90px', padding: '0.85rem' }}
            />
          </div>

          <button
            type='submit'
            className='generate-btn'
            disabled={loading}
            style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', display: 'grid', placeItems: 'center' }}
          >
            {loading ? 'AI is Generating Cover Letter & Recruiter Pitch...' : '✨ Generate Cover Letter & Cold Email Pitch'}
          </button>
        </form>

        {/* ── Generated Output Studio ── */}
        {result && (
          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Output Tabs */}
            <div style={{ display: 'flex', gap: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <button
                type='button'
                onClick={() => setActiveTab('coverLetter')}
                className='secondary-btn'
                style={{
                  background: activeTab === 'coverLetter' ? 'var(--accent-indigo)' : 'var(--badge-bg)',
                  color: activeTab === 'coverLetter' ? '#fff' : 'var(--text-primary)',
                  fontWeight: '700'
                }}
              >
                📄 Cover Letter
              </button>
              <button
                type='button'
                onClick={() => setActiveTab('coldEmail')}
                className='secondary-btn'
                style={{
                  background: activeTab === 'coldEmail' ? 'var(--accent-indigo)' : 'var(--badge-bg)',
                  color: activeTab === 'coldEmail' ? '#fff' : 'var(--text-primary)',
                  fontWeight: '700'
                }}
              >
                ✉️ Recruiter Cold Email
              </button>
              <button
                type='button'
                onClick={() => setActiveTab('highlights')}
                className='secondary-btn'
                style={{
                  background: activeTab === 'highlights' ? 'var(--accent-indigo)' : 'var(--badge-bg)',
                  color: activeTab === 'highlights' ? '#fff' : 'var(--text-primary)',
                  fontWeight: '700'
                }}
              >
                🎯 Matched Highlights
              </button>
            </div>

            {/* TAB 1: COVER LETTER */}
            {activeTab === 'coverLetter' && (
              <div style={{ padding: '1.5rem', borderRadius: '1rem', background: 'var(--bg-panel)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Personalized Cover Letter</h3>
                  <div style={{ display: 'flex', gap: '0.65rem' }}>
                    <button type='button' onClick={() => copyToClipboard(result.coverLetter, 'Cover Letter')} className='secondary-btn' style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}>
                      📋 Copy
                    </button>
                    <button type='button' onClick={handleDownloadTxt} className='secondary-btn' style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}>
                      ⬇️ Download TXT
                    </button>
                  </div>
                </div>

                <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.7', color: 'var(--text-primary)', fontFamily: 'var(--font-stack)', padding: '1.25rem', borderRadius: '0.75rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', fontSize: '0.95rem' }}>
                  {result.coverLetter}
                </div>
              </div>
            )}

            {/* TAB 2: COLD RECRUITER EMAIL */}
            {activeTab === 'coldEmail' && (
              <div style={{ padding: '1.5rem', borderRadius: '1rem', background: 'var(--bg-panel)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Recruiter Cold Email Pitch</h3>
                  <button type='button' onClick={() => copyToClipboard(`Subject: ${result.coldEmail?.subject}\n\n${result.coldEmail?.body}`, 'Email Pitch')} className='secondary-btn' style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}>
                    📋 Copy Full Email
                  </button>
                </div>

                {/* Subject Box */}
                <div style={{ padding: '0.85rem 1rem', borderRadius: '0.65rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-indigo)', uppercase: true }}>SUBJECT LINE:</span>
                    <p style={{ margin: '0.2rem 0 0', fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.95rem' }}>{result.coldEmail?.subject}</p>
                  </div>
                  <button type='button' onClick={() => copyToClipboard(result.coldEmail?.subject, 'Subject Line')} className='secondary-btn' style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}>
                    Copy Subject
                  </button>
                </div>

                {/* Body Box */}
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.7', color: 'var(--text-primary)', padding: '1.25rem', borderRadius: '0.75rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', fontSize: '0.95rem' }}>
                  {result.coldEmail?.body}
                </div>
              </div>
            )}

            {/* TAB 3: MATCHED HIGHLIGHTS */}
            {activeTab === 'highlights' && (
              <div style={{ padding: '1.5rem', borderRadius: '1rem', background: 'var(--bg-panel)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Role Key Selling Points</h3>
                <ul className='dashboard-feature-list'>
                  {(result.keyHighlights || []).map((point, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <span style={{ color: 'var(--accent-indigo)', fontWeight: '700' }}>✓</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        )}
      </section>
    </div>
  )
}

export default ResourcesGuides
