import React, { useState } from 'react'
import '../style/home.scss'
import { generateSkillQuizApi } from '../services/interview.api'
import { useInterview } from '../hooks/useInterview'

const POPULAR_SKILLS = [
  'React',
  'Node.js',
  'MongoDB',
  'System Design',
  'Docker',
  'TypeScript',
  'SQL & Databases',
  'CI/CD Pipelines'
]

const SkillAssessments = () => {
  const { reports } = useInterview()
  
  // Extract all dynamic skill gaps from candidate reports
  const detectedSkillGaps = (reports || []).flatMap(r => r.skillGaps || []).map(g => g.skill).filter(Boolean)
  const uniqueDetectedSkills = Array.from(new Set(detectedSkillGaps))

  const [selectedSkill, setSelectedSkill] = useState('')
  const [customSkillInput, setCustomSkillInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [quizData, setQuizData] = useState(null)
  
  // Quiz runner state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState({}) // { questionId: selectedOptionIndex }
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleStartQuiz = async (skillToTest) => {
    const topic = skillToTest || customSkillInput
    if (!topic || !topic.trim()) {
      setErrorMessage('Please select or type a skill topic')
      return
    }

    setErrorMessage('')
    setLoading(true)
    setSelectedSkill(topic.trim())
    setQuizData(null)
    setUserAnswers({})
    setCurrentQuestionIndex(0)
    setQuizSubmitted(false)

    try {
      const response = await generateSkillQuizApi({ skill: topic.trim() })
      if (response?.data?.questions) {
        setQuizData(response.data)
      } else {
        setErrorMessage('Could not load quiz questions. Please try again.')
      }
    } catch (err) {
      if (err?.response?.status === 401) {
        setErrorMessage('Session expired or unauthorized. Please Log Out and Log In again to refresh your session.')
      } else {
        setErrorMessage(err?.response?.data?.message || err?.message || 'Failed to generate skill quiz')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleOptionSelect = (questionId, optionIndex) => {
    if (quizSubmitted) return
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }))
  }

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true)
  }

  const handleResetQuiz = () => {
    setQuizData(null)
    setUserAnswers({})
    setCurrentQuestionIndex(0)
    setQuizSubmitted(false)
  }

  // Score Calculation
  const calculateScore = () => {
    if (!quizData?.questions) return { score: 0, total: 0, percentage: 0 }
    let correctCount = 0
    quizData.questions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswerIndex) {
        correctCount++
      }
    })
    const total = quizData.questions.length
    const percentage = Math.round((correctCount / total) * 100)
    return { score: correctCount, total, percentage }
  }

  const { score, total, percentage } = quizSubmitted ? calculateScore() : {}

  return (
    <div className='dashboard-page dashboard-page--content'>
      <section className='page-panel'>
        <div className='page-panel__header'>
          <div>
            <p className='dashboard-eyebrow'>Skill Assessments</p>
            <h1>AI Skill Quiz Center</h1>
            <p className='panel-subtitle'>Test your technical expertise with 5-question micro-quizzes generated dynamically for your skill gaps.</p>
          </div>
        </div>

        {/* ── State 1: Skill Selection & Setup ── */}
        {!quizData && !loading && (
          <div className='page-panel__body' style={{ marginTop: '1.5rem' }}>
            {errorMessage && (
              <div className='home-error' role='alert'>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Detected Skill Gaps from Reports */}
            {uniqueDetectedSkills.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--accent-indigo)' }}>
                  🎯 Identified Skill Gaps from Your Reports:
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
                  {uniqueDetectedSkills.map((skill, idx) => (
                    <button
                      key={idx}
                      type='button'
                      onClick={() => handleStartQuiz(skill)}
                      style={{
                        padding: '0.6rem 1.1rem',
                        borderRadius: '999px',
                        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(245, 158, 11, 0.12))',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: 'var(--text-primary)',
                        fontWeight: '700',
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        transition: 'transform 150ms ease'
                      }}
                    >
                      ⚡ Test {skill}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Skills Grid */}
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                💡 Select a Topic to Practice:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.85rem' }}>
                {POPULAR_SKILLS.map((skill, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleStartQuiz(skill)}
                    style={{
                      padding: '1rem',
                      borderRadius: '0.85rem',
                      background: 'var(--bg-panel)',
                      border: '1px solid var(--border-color)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 150ms ease'
                    }}
                  >
                    <span style={{ fontWeight: '700', fontSize: '0.92rem', color: 'var(--text-primary)' }}>{skill}</span>
                    <span style={{ color: 'var(--accent-indigo)', fontWeight: '700' }}>→</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Skill Input */}
            <div style={{ padding: '1.25rem', borderRadius: '0.85rem', background: 'var(--bg-panel)', border: '1px solid var(--border-color)' }}>
              <p style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                🔍 Test a Custom Skill Topic:
              </p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input
                  type='text'
                  placeholder='e.g., GraphQL, Redis, Microservices Architecture...'
                  value={customSkillInput}
                  onChange={(e) => setCustomSkillInput(e.target.value)}
                  className='panel__textarea'
                  style={{ minHeight: '44px', height: '44px', padding: '0.5rem 1rem' }}
                />
                <button
                  type='button'
                  onClick={() => handleStartQuiz(customSkillInput)}
                  className='generate-btn'
                  style={{ whiteSpace: 'nowrap', padding: '0 1.25rem' }}
                >
                  Generate Quiz
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── State 2: AI Loading Screen ── */}
        {loading && (
          <div style={{ padding: '4rem 1rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '4px solid var(--border-color)', borderTopColor: 'var(--accent-indigo)', animation: 'spin 1s linear infinite' }} />
            <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Generating 5-Question AI Quiz for {selectedSkill}...</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Formulating practical engineering scenarios & explanations.</p>
          </div>
        )}

        {/* ── State 3: Quiz Runner & Results ── */}
        {quizData && !loading && (
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Header Status Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', borderRadius: '0.85rem', background: 'var(--bg-panel)', border: '1px solid var(--border-color)' }}>
              <div>
                <span style={{ fontSize: '0.78rem', fontWeight: '700', uppercase: true, color: 'var(--accent-indigo)', letterSpacing: '0.08em' }}>TOPIC:</span>
                <strong style={{ marginLeft: '0.5rem', fontSize: '1rem', color: 'var(--text-primary)' }}>{quizData.skill}</strong>
              </div>
              <div>
                <button type='button' onClick={handleResetQuiz} className='secondary-btn' style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}>
                  ← Back to Topics
                </button>
              </div>
            </div>

            {/* Quiz Progress Bar */}
            {!quizSubmitted && (
              <div style={{ width: '100%', height: '6px', background: 'var(--border-color)', borderRadius: '999px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    width: `${((currentQuestionIndex + 1) / quizData.questions.length) * 100}%`, 
                    height: '100%', 
                    background: 'linear-gradient(90deg, var(--accent-pink), var(--accent-indigo))', 
                    transition: 'width 200ms ease' 
                  }} 
                />
              </div>
            )}

            {/* ── Active Quiz Mode (Before Submission) ── */}
            {!quizSubmitted && (
              <div style={{ padding: '1.5rem', borderRadius: '1rem', background: 'var(--bg-panel)', border: '1px solid var(--border-color)' }}>
                {(() => {
                  const q = quizData.questions[currentQuestionIndex]
                  const selectedOption = userAnswers[q.id]

                  return (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)' }}>QUESTION {currentQuestionIndex + 1} OF {quizData.questions.length}</span>
                        <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--accent-pink)' }}>{Math.round(((currentQuestionIndex + 1) / quizData.questions.length) * 100)}% Complete</span>
                      </div>

                      <h2 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '1.25rem', lineHeight: '1.5' }}>
                        {q.question}
                      </h2>

                      {/* Options Grid */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        {q.options.map((opt, optIdx) => {
                          const isSelected = selectedOption === optIdx
                          return (
                            <div
                              key={optIdx}
                              onClick={() => handleOptionSelect(q.id, optIdx)}
                              style={{
                                padding: '1rem 1.25rem',
                                borderRadius: '0.75rem',
                                background: isSelected ? 'rgba(99, 102, 241, 0.14)' : 'var(--bg-card)',
                                border: isSelected ? '2px solid var(--accent-indigo)' : '1px solid var(--border-color)',
                                color: 'var(--text-primary)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.85rem',
                                transition: 'all 150ms ease'
                              }}
                            >
                              <span style={{ width: '24px', height: '24px', borderRadius: '50%', border: isSelected ? '6px solid var(--accent-indigo)' : '2px solid var(--border-color)', display: 'inline-block', flexShrink: 0 }} />
                              <span style={{ fontSize: '0.93rem', lineHeight: '1.4' }}>{opt}</span>
                            </div>
                          )
                        })}
                      </div>

                      {/* Controls */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <button
                          type='button'
                          onClick={() => setCurrentQuestionIndex(i => Math.max(0, i - 1))}
                          disabled={currentQuestionIndex === 0}
                          className='secondary-btn'
                        >
                          ← Previous
                        </button>

                        {currentQuestionIndex < quizData.questions.length - 1 ? (
                          <button
                            type='button'
                            onClick={() => setCurrentQuestionIndex(i => i + 1)}
                            className='generate-btn'
                            style={{ padding: '0.65rem 1.25rem' }}
                          >
                            Next Question →
                          </button>
                        ) : (
                          <button
                            type='button'
                            onClick={handleSubmitQuiz}
                            className='generate-btn'
                            style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', padding: '0.65rem 1.5rem' }}
                          >
                            ✓ Submit Assessment
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })()}
              </div>
            )}

            {/* ── Quiz Results View (After Submission) ── */}
            {quizSubmitted && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Score Banner Card */}
                <div style={{ padding: '2rem', borderRadius: '1rem', background: 'var(--bg-panel)', border: '1px solid var(--border-color)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: percentage >= 80 ? 'rgba(34, 197, 94, 0.15)' : percentage >= 60 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)', border: `4px solid ${percentage >= 80 ? '#22c55e' : percentage >= 60 ? '#f59e0b' : '#ef4444'}`, display: 'grid', placeItems: 'center' }}>
                    <span style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)' }}>{percentage}%</span>
                  </div>

                  <div>
                    <h2 style={{ margin: '0 0 0.35rem', color: 'var(--text-primary)' }}>
                      {percentage >= 80 ? '🎉 Excellent Readiness!' : percentage >= 60 ? '👍 Good Knowledge!' : '📚 Practice Recommended'}
                    </h2>
                    <p style={{ margin: 0, color: 'var(--text-secondary)' }}>You scored <strong>{score}</strong> out of <strong>{total}</strong> correct on <strong>{quizData.skill}</strong>.</p>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                    <button type='button' onClick={() => handleStartQuiz(quizData.skill)} className='generate-btn'>
                      🔄 Retake Quiz
                    </button>
                    <button type='button' onClick={handleResetQuiz} className='secondary-btn'>
                      Test Another Skill
                    </button>
                  </div>
                </div>

                {/* Detailed Answer Review */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Detailed Answer Review</h3>

                  {quizData.questions.map((q, idx) => {
                    const userSel = userAnswers[q.id]
                    const isCorrect = userSel === q.correctAnswerIndex

                    return (
                      <div key={q.id} style={{ padding: '1.25rem', borderRadius: '0.85rem', background: 'var(--bg-panel)', border: `1px solid ${isCorrect ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                          <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)' }}>QUESTION {idx + 1}</span>
                          <span style={{ fontSize: '0.82rem', fontWeight: '700', color: isCorrect ? '#22c55e' : '#ef4444' }}>
                            {isCorrect ? '✓ Correct (+20%)' : '✗ Incorrect'}
                          </span>
                        </div>

                        <p style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>{q.question}</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                          {q.options.map((opt, optIdx) => {
                            const isUserChoice = userSel === optIdx
                            const isRightAns = q.correctAnswerIndex === optIdx

                            let optionBg = 'var(--bg-card)'
                            let optionBorder = '1px solid var(--border-color)'
                            let tagLabel = null

                            if (isRightAns) {
                              optionBg = 'rgba(34, 197, 94, 0.12)'
                              optionBorder = '1px solid #22c55e'
                              tagLabel = '✓ Correct Answer'
                            } else if (isUserChoice && !isCorrect) {
                              optionBg = 'rgba(239, 68, 68, 0.12)'
                              optionBorder = '1px solid #ef4444'
                              tagLabel = 'Your Selection'
                            }

                            return (
                              <div key={optIdx} style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', background: optionBg, border: optionBorder, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{opt}</span>
                                {tagLabel && (
                                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: isRightAns ? '#22c55e' : '#ef4444' }}>{tagLabel}</span>
                                )}
                              </div>
                            )
                          })}
                        </div>

                        <div style={{ padding: '0.85rem 1rem', borderRadius: '0.5rem', background: 'var(--badge-bg)', border: '1px solid var(--border-color)' }}>
                          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                            💡 <strong>AI Explanation:</strong> {q.explanation}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  )
}

export default SkillAssessments
