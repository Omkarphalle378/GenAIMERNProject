import React, { useState, useRef } from 'react'
import '../style/home.scss'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router-dom'

const GENERATION_STATUS_MESSAGES = [
  'Reading job description…',
  'Analyzing skills & keywords…',
  'Comparing your background…',
  'Building technical questions…',
  'Drafting 7-day preparation roadmap…',
  'Finalizing your interview plan…',
]

const MAX_JOB_DESCRIPTION_LENGTH = 10000

const Home = () => {
  const [jobDescription, setJobDescription] = useState('')
  const [selfDescription, setSelfDescription] = useState('')
  const [fileName, setFileName] = useState(null)
  const [statusIndex, setStatusIndex] = useState(0)
  const [formError, setFormError] = useState('')
  const [generating, setGenerating] = useState(false)

  const resumeInputRef = useRef(null)
  const navigate = useNavigate()
  const { reports, loading, generateReport, getResumePdf } = useInterview()

  React.useEffect(() => {
    if (!generating) {
      setStatusIndex(0)
      return
    }
    const id = setInterval(() => setStatusIndex((i) => (i + 1) % GENERATION_STATUS_MESSAGES.length), 4500)
    return () => clearInterval(id)
  }, [generating])

  const handleFileChange = (e) => {
    const f = e.target.files?.[0]
    setFileName(f ? f.name : null)
  }

  const handleRemoveFile = () => {
    if (resumeInputRef.current) resumeInputRef.current.value = ''
    setFileName(null)
  }

  const handleGenerateReport = async () => {
    const resumeFile = resumeInputRef.current?.files?.[0]
    setFormError('')
    if (!jobDescription?.trim()) return setFormError('Please enter a job description')
    if (!resumeFile && !selfDescription?.trim()) return setFormError('Please upload a PDF resume or enter a self description')

    setGenerating(true)
    try {
      const data = await generateReport({ jobDescription, selfDescription, resumeFile })
      if (data?._id) navigate(`/interview/${data._id}`)
      else setFormError('Could not generate the interview plan. Check the server and try again.')
    } catch (err) {
      setFormError(err?.message || 'Could not generate the interview plan.')
    } finally {
      setGenerating(false)
    }
  }

  const planUsage = reports?.length || 0
  const latestReport = reports?.[0]

  const openLatestReport = () => {
    if (!latestReport?._id) return
    navigate(`/interview/${latestReport._id}`)
  }

  if (loading && !generating) return (
    <div className='dashboard-page'>
      <div className='home-skeleton'>
        <div className='home-skeleton__line home-skeleton__line--title' />
        <div className='home-skeleton__line home-skeleton__line--subtitle' />
        <div className='home-skeleton__card' />
      </div>
    </div>
  )

  return (
    <div className='dashboard-page dashboard-page--content'>
      <div className='dashboard-page__header'>
        <p className='dashboard-eyebrow'>Strategy Generator</p>
        <h1>Generate Your AI Interview Plan</h1>
        <p className='dashboard-subtitle'>
          Paste a target job description and share your candidate profile to get a personalized technical &amp; behavioral prep roadmap.
        </p>
      </div>

      <div className='kpi-row'>
        <div className='kpi-card'>
          <div className='kpi-card__header'>
            <span className='kpi-card__label'>Total Strategy Plans</span>
            <span className='kpi-card__icon'>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </span>
          </div>
          <strong className='kpi-card__value'>{planUsage}</strong>
        </div>
        <div className='kpi-card'>
          <div className='kpi-card__header'>
            <span className='kpi-card__label'>Best match</span>
            <span className='kpi-card__icon kpi-card__icon--success'>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
            </span>
          </div>
          <strong className='kpi-card__value'>{latestReport?.matchScore ?? '--'}%</strong>
        </div>
        <div className='kpi-card'>
          <div className='kpi-card__header'>
            <span className='kpi-card__label'>Response time</span>
            <span className='kpi-card__icon kpi-card__icon--speed'>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            </span>
          </div>
          <strong className='kpi-card__value'>~30s</strong>
        </div>
      </div>

      {latestReport && (
        <section className='latest-report-card'>
          <div className='latest-report-card__header'>
            <div>
              <p className='dashboard-eyebrow'>Latest report</p>
              <h2>{latestReport.title || 'Interview Strategy Report'}</h2>
              <p className='report-meta'>Generated on {new Date(latestReport.createdAt).toLocaleString()}</p>
            </div>
            <div className='latest-report-actions'>
              <button type='button' onClick={openLatestReport}>Open report</button>
              <button type='button' onClick={() => getResumePdf(latestReport._id)}>Download PDF</button>
            </div>
          </div>
        </section>
      )}

      {formError && (
        <div className='home-error' role='alert' aria-live='assertive'>
          <span>{formError}</span>
        </div>
      )}

      <section className='dashboard-card'>
        <div className='dashboard-card__body'>
          <div className='panel panel--left'>
            <div className='panel__header'>
              <h2>Target Job Description</h2>
              <p className='panel-subtitle'>Paste the full job description for tailored strategy.</p>
            </div>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className='panel__textarea'
              placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'`}
              maxLength={MAX_JOB_DESCRIPTION_LENGTH}
              disabled={generating}
              aria-label='Target job description'
            />
            <div className='job-hint'>A complete job description helps the model generate more accurate questions and skills guidance.</div>
          </div>

          <div className='panel-divider' />

          <div className='panel panel--right'>
            <div className='panel__header'>
              <h2>Your Profile</h2>
              <p className='panel-subtitle'>Upload a resume or enter a short profile summary.</p>
            </div>

            <div className='upload-section'>
              {fileName ? (
                <div className='file-chip'>
                  <span className='file-chip__name'>{fileName}</span>
                  <button type='button' onClick={handleRemoveFile}>Remove</button>
                </div>
              ) : (
                <label className='dropzone' htmlFor='resume'>
                  <input ref={resumeInputRef} hidden type='file' id='resume' accept='.pdf' onChange={handleFileChange} />
                  <div className='dropzone__content'>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    <p className='dropzone__title'>Click to upload or drag &amp; drop</p>
                    <span className='dropzone__subtitle'>PDF resume files up to 10MB</span>
                  </div>
                </label>
              )}
            </div>

            <div className='or-divider'><span>OR</span></div>

            <div className='self-description'>
              <label htmlFor='selfDescription'>Quick self-description</label>
              <textarea
                id='selfDescription'
                value={selfDescription}
                onChange={(e) => setSelfDescription(e.target.value)}
                className='panel__textarea panel__textarea--short'
                disabled={generating}
                placeholder='Briefly describe your experience, skills, and role focus.'
              />
            </div>
          </div>
        </div>

        <div className='interview-card__footer'>
          <span className='footer-info'>AI-Powered Strategy Generation • Approx 30s</span>
          <button onClick={handleGenerateReport} className='generate-btn' disabled={generating}>
            {generating ? 'Generating…' : 'Generate My Interview Strategy'}
          </button>
        </div>

        {generating && (
          <div className='generation-progress'>
            <p className='generation-progress__status'>{GENERATION_STATUS_MESSAGES[statusIndex]}</p>
            <div className='generation-progress__bar'>
              <span />
            </div>
          </div>
        )}
      </section>

      {reports?.length > 0 && (
        <section className='recent-reports'>
          <div className='reports-section-header'>
            <div>
              <p className='recent-reports__eyebrow'>My Recent Interview Plans</p>
              <h2>{reports.length} plans generated</h2>
            </div>
            <div className='recent-reports__meta'>Latest plans, match scores, and quick actions.</div>
          </div>

          <div className='reports-table'>
            <div className='reports-table__header'>
              <span>Title</span>
              <span>Matches</span>
              <span>Status</span>
              <span>Date</span>
              <span>Actions</span>
            </div>
            {reports.map((report) => (
              <div key={report._id} className='reports-table__row'>
                <div>
                  <p>{report.title || 'Interview Plan'}</p>
                  <span className='report-subtitle'>{report.title || 'Strategy snapshot'}</span>
                </div>
                <div className='report-badge'>{report.matchScore ?? '--'}%</div>
                <div className={`report-status ${report.matchScore >= 80 ? 'status--high' : report.matchScore >= 60 ? 'status--mid' : 'status--low'}`}>
                  {report.matchScore >= 80 ? 'Strong' : report.matchScore >= 60 ? 'Good' : 'Review'}
                </div>
                <div>{new Date(report.createdAt).toLocaleDateString()}</div>
                <div className='report-actions'>
                  <button type='button' onClick={() => navigate(`/interview/${report._id}`)}>View</button>
                  <button type='button' onClick={() => getResumePdf(report._id)}>Download</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <footer className='page-footer'>
        <span style={{ cursor: 'pointer', color: 'var(--text-secondary)', transition: 'color 150ms ease' }} onClick={() => navigate('/privacy')}>Privacy Policy</span>
        <span style={{ cursor: 'pointer', color: 'var(--text-secondary)', transition: 'color 150ms ease' }} onClick={() => navigate('/terms')}>Terms of Service</span>
        <span style={{ cursor: 'pointer', color: 'var(--text-secondary)', transition: 'color 150ms ease' }} onClick={() => navigate('/help')}>Help Center</span>
      </footer>
    </div>
  )
}

export default Home
