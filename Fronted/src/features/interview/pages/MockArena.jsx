import React, { useState, useEffect } from 'react'
import '../style/home.scss'
import { evaluateMockAnswerApi } from '../services/interview.api'
import { useInterview } from '../hooks/useInterview'

const PRACTICE_PRESETS = [
  {
    role: 'Full Stack MERN Engineer',
    questions: [
      'How would you structure a REST API in Node/Express for a scalable multi-user web application?',
      'Explain how React handles rendering updates and how you optimize large component lists.',
      'Walk through JWT-based authentication between a React client and Express API.',
      'How would you debug a production issue where API latency spikes on a MERN app?'
    ]
  },
  {
    role: 'Frontend React Specialist',
    questions: [
      'What are the core differences between useMemo, useCallback, and useEffect?',
      'How do you manage complex global state in React apps and prevent unnecessary re-renders?',
      'Explain how Webpack or Vite bundles modules and how code-splitting works.',
      'How do you design accessible, responsive UI components using CSS and React?'
    ]
  },
  {
    role: 'Backend & Systems Engineer',
    questions: [
      'Explain how database indexing works in MongoDB / SQL and when NOT to use an index.',
      'How do you handle race conditions and concurrency in Node.js backend services?',
      'Describe the architecture of a Redis caching layer for high-throughput API endpoints.',
      'How do you secure Node.js APIs against OWASP Top 10 vulnerabilities like XSS and Injection?'
    ]
  }
]

const MockArena = () => {
  const { reports } = useInterview()

  // Arena Setup State
  const [selectedRole, setSelectedRole] = useState('')
  const [activeQuestions, setActiveQuestions] = useState([])
  const [sessionActive, setSessionActive] = useState(false)
  const [sessionComplete, setSessionComplete] = useState(false)

  // Question Runner State
  const [questionIndex, setQuestionIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [evaluations, setEvaluations] = useState([]) // Array of evaluated answer objects
  const [currentEvaluation, setCurrentEvaluation] = useState(null)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')

  // Timer effect during active question
  useEffect(() => {
    let interval = null
    if (sessionActive && !currentEvaluation && !sessionComplete) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1)
      }, 1000)
    } else {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [sessionActive, currentEvaluation, sessionComplete])

  const formatTime = (totalSec) => {
    const mins = Math.floor(totalSec / 60)
    const secs = totalSec % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  // Load Preset or Report Questions
  const handleStartSession = (questionsList, roleName) => {
    if (!questionsList || questionsList.length === 0) return
    setActiveQuestions(questionsList)
    setSelectedRole(roleName)
    setSessionActive(true)
    setSessionComplete(false)
    setQuestionIndex(0)
    setUserAnswer('')
    setEvaluations([])
    setCurrentEvaluation(null)
    setTimerSeconds(0)
    setErrorMessage('')
  }

  const handleSelectReport = (reportId) => {
    const r = (reports || []).find(rep => rep._id === reportId)
    if (r) {
      const techQs = (r.technicalQuestions || []).map(q => q.question)
      const behQs = (r.behavioralQuestions || []).map(q => q.question)
      const allQs = [...techQs, ...behQs].filter(Boolean)
      if (allQs.length > 0) {
        handleStartSession(allQs, r.title || 'Custom Role Strategy')
      } else {
        setErrorMessage('No interview questions found in this report.')
      }
    }
  }

  // Submit answer for AI Evaluation
  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) {
      setErrorMessage('Please type your answer before submitting.')
      return
    }

    setErrorMessage('')
    setLoading(true)
    const currentQ = activeQuestions[questionIndex]

    try {
      const response = await evaluateMockAnswerApi({
        question: currentQ,
        userAnswer: userAnswer.trim(),
        roleTitle: selectedRole
      })

      if (response?.data) {
        const evalData = response.data
        setCurrentEvaluation(evalData)
        setEvaluations(prev => [...prev, evalData])
      } else {
        setErrorMessage('Failed to evaluate response.')
      }
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || err?.message || 'Evaluation failed')
    } finally {
      setLoading(false)
    }
  }

  const handleNextQuestion = () => {
    if (questionIndex < activeQuestions.length - 1) {
      setQuestionIndex(i => i + 1)
      setUserAnswer('')
      setCurrentEvaluation(null)
      setTimerSeconds(0)
    } else {
      setSessionComplete(true)
    }
  }

  const handleResetArena = () => {
    setSessionActive(false)
    setSessionComplete(false)
    setActiveQuestions([])
    setEvaluations([])
    setCurrentEvaluation(null)
    setUserAnswer('')
  }

  // Session Average Score Calculation
  const calculateAverageScore = () => {
    if (evaluations.length === 0) return 0
    const sum = evaluations.reduce((acc, curr) => acc + (curr.score || 0), 0)
    return Math.round(sum / evaluations.length)
  }

  const avgScore = calculateAverageScore()

  return (
    <div className='dashboard-page dashboard-page--content'>
      <section className='page-panel'>
        <div className='page-panel__header'>
          <div>
            <p className='dashboard-eyebrow'>Mock Arena</p>
            <h1>AI Mock Interview Simulator</h1>
            <p className='panel-subtitle'>Practice technical and behavioral questions in a timed environment and receive instant AI feedback on your answers.</p>
          </div>
        </div>

        {errorMessage && (
          <div className='home-error' role='alert' style={{ marginBottom: '1rem' }}>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ── State 1: Arena Setup & Selection ── */}
        {!sessionActive && !sessionComplete && (
          <div className='page-panel__body' style={{ marginTop: '1.5rem' }}>
            
            {/* Auto-fill from recent reports */}
            {reports && reports.length > 0 && (
              <div style={{ padding: '1.25rem', borderRadius: '0.85rem', background: 'var(--bg-panel)', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
                <p style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--accent-indigo)', margin: '0 0 0.65rem' }}>
                  🎯 Practice Questions from Your Strategy Reports:
                </p>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <select
                    onChange={(e) => handleSelectReport(e.target.value)}
                    defaultValue=""
                    style={{ flex: 1, padding: '0.65rem 0.9rem', borderRadius: '0.5rem', background: 'var(--badge-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.9rem' }}
                  >
                    <option value="" disabled style={{ background: '#161b22', color: '#e6edf3' }}>-- Select a recent report to practice --</option>
                    {reports.map(r => (
                      <option key={r._id} value={r._id} style={{ background: '#161b22', color: '#e6edf3' }}>{r.title || 'Untitled Strategy Report'}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Practice Presets Grid */}
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                💡 Select a Practice Role Preset:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {PRACTICE_PRESETS.map((preset, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleStartSession(preset.questions, preset.role)}
                    style={{
                      padding: '1.25rem',
                      borderRadius: '0.85rem',
                      background: 'var(--bg-panel)',
                      border: '1px solid var(--border-color)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                      transition: 'all 200ms ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)'
                      e.currentTarget.style.borderColor = 'var(--accent-indigo)'
                      e.currentTarget.style.boxShadow = '0 10px 25px rgba(99, 102, 241, 0.25)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.borderColor = 'var(--border-color)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{preset.role}</strong>
                      <span style={{ color: 'var(--accent-indigo)', fontWeight: '700' }}>→</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {preset.questions.length} simulated technical &amp; architecture scenarios.
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ── State 2: Active Interview Question ── */}
        {sessionActive && !sessionComplete && (
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Header Status Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', borderRadius: '0.85rem', background: 'var(--bg-panel)', border: '1px solid var(--border-color)' }}>
              <div>
                <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--accent-indigo)', letterSpacing: '0.08em' }}>ROLE:</span>
                <strong style={{ marginLeft: '0.5rem', fontSize: '0.95rem', color: 'var(--text-primary)' }}>{selectedRole}</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontFamily: 'monospace', fontWeight: '700', fontSize: '0.95rem', color: 'var(--accent-pink)', background: 'rgba(236, 72, 153, 0.12)', padding: '0.3rem 0.75rem', borderRadius: '0.5rem' }}>
                  ⏱️ {formatTime(timerSeconds)}
                </span>
                <button type='button' onClick={handleResetArena} className='secondary-btn' style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}>
                  Exit Session
                </button>
              </div>
            </div>

            {/* Active Question Card */}
            <div style={{ padding: '1.75rem', borderRadius: '1rem', background: 'var(--bg-panel)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                  QUESTION {questionIndex + 1} OF {activeQuestions.length}
                </span>
                <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--accent-indigo)' }}>
                  {Math.round(((questionIndex + 1) / activeQuestions.length) * 100)}% Complete
                </span>
              </div>

              <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0, lineHeight: '1.5' }}>
                {activeQuestions[questionIndex]}
              </h2>

              {/* Answer Input */}
              {!currentEvaluation && (
                <div>
                  <textarea
                    placeholder='Type your technical response here as if speaking to the interviewer...'
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className='panel__textarea'
                    style={{ minHeight: '160px', padding: '1rem', fontSize: '0.95rem', lineHeight: '1.6' }}
                  />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {userAnswer.length} characters • {userAnswer.split(/\s+/).filter(Boolean).length} words
                    </span>
                    <button
                      type='button'
                      onClick={handleSubmitAnswer}
                      disabled={loading || !userAnswer.trim()}
                      className='generate-btn'
                      style={{ padding: '0.75rem 1.5rem' }}
                    >
                      {loading ? 'AI is Evaluating Answer...' : '✨ Submit Answer for Feedback'}
                    </button>
                  </div>
                </div>
              )}

              {/* AI Feedback View */}
              {currentEvaluation && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '0.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
                  
                  {/* Score & Verdict Banner */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem', borderRadius: '0.85rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: currentEvaluation.score >= 80 ? 'rgba(34, 197, 94, 0.15)' : currentEvaluation.score >= 65 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)', border: `3px solid ${currentEvaluation.score >= 80 ? '#22c55e' : currentEvaluation.score >= 65 ? '#f59e0b' : '#ef4444'}`, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                      <strong style={{ fontSize: '1.3rem', color: 'var(--text-primary)' }}>{currentEvaluation.score}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.78rem', fontWeight: '700', uppercase: true, color: currentEvaluation.score >= 80 ? '#22c55e' : currentEvaluation.score >= 65 ? '#f59e0b' : '#ef4444' }}>
                        {currentEvaluation.verdict}
                      </span>
                      <h3 style={{ margin: '0.1rem 0 0', color: 'var(--text-primary)', fontSize: '1.1rem' }}>Answer Feedback Evaluation</h3>
                    </div>
                  </div>

                  {/* Strengths & Missing Points Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem' }}>
                    <div style={{ padding: '1rem', borderRadius: '0.75rem', background: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34, 197, 94, 0.25)' }}>
                      <p style={{ fontWeight: '700', fontSize: '0.85rem', color: '#22c55e', margin: '0 0 0.5rem' }}>✓ Key Answer Strengths:</p>
                      <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.88rem', color: 'var(--text-primary)', display: 'grid', gap: '0.35rem' }}>
                        {(currentEvaluation.strengths || []).map((st, i) => (
                          <li key={i}>{st}</li>
                        ))}
                      </ul>
                    </div>

                    <div style={{ padding: '1rem', borderRadius: '0.75rem', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
                      <p style={{ fontWeight: '700', fontSize: '0.85rem', color: '#f59e0b', margin: '0 0 0.5rem' }}>💡 Missing Concepts to Mention:</p>
                      <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.88rem', color: 'var(--text-primary)', display: 'grid', gap: '0.35rem' }}>
                        {(currentEvaluation.missingPoints || []).map((mp, i) => (
                          <li key={i}>{mp}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Ideal Model Answer */}
                  <div style={{ padding: '1.1rem', borderRadius: '0.75rem', background: 'var(--badge-bg)', border: '1px solid var(--border-color)' }}>
                    <p style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--accent-indigo)', margin: '0 0 0.4rem' }}>⭐ Ideal Senior Answer Model:</p>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                      {currentEvaluation.modelAnswer}
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                    <button type='button' onClick={handleNextQuestion} className='generate-btn' style={{ padding: '0.75rem 1.75rem' }}>
                      {questionIndex < activeQuestions.length - 1 ? 'Next Question →' : 'Finish Mock Session'}
                    </button>
                  </div>

                </div>
              )}

            </div>
          </div>
        )}

        {/* ── State 3: Session Complete Summary Scorecard ── */}
        {sessionComplete && (
          <div style={{ padding: '2.5rem 1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', marginTop: '1.5rem', background: 'var(--bg-panel)', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
            <div style={{ width: '96px', height: '96px', borderRadius: '50%', background: avgScore >= 80 ? 'rgba(34, 197, 94, 0.15)' : avgScore >= 65 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)', border: `4px solid ${avgScore >= 80 ? '#22c55e' : avgScore >= 65 ? '#f59e0b' : '#ef4444'}`, display: 'grid', placeItems: 'center' }}>
              <span style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)' }}>{avgScore}%</span>
            </div>

            <div>
              <h2 style={{ margin: '0 0 0.35rem', color: 'var(--text-primary)' }}>
                {avgScore >= 80 ? '🎉 Mock Session Mastered!' : avgScore >= 65 ? '👍 Solid Performance!' : '📚 Keep Practicing!'}
              </h2>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                You completed <strong>{evaluations.length}</strong> questions for <strong>{selectedRole}</strong>.
              </p>
            </div>

            <button type='button' onClick={handleResetArena} className='generate-btn' style={{ padding: '0.8rem 1.75rem', fontSize: '1rem' }}>
              🔄 Start Another Mock Session
            </button>
          </div>
        )}

      </section>
    </div>
  )
}

export default MockArena
