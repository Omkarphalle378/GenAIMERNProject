import React, { useState } from 'react'
import '../style/interview.scss'
import { useInterview } from '../hooks/useInterview.js'
import { useParams, useNavigate } from 'react-router-dom'

const NAV_ITEMS = [
    { id: 'technical', label: 'Technical Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>) },
    { id: 'behavioral', label: 'Behavioral Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>) },
    { id: 'roadmap', label: 'Road Map', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>) },
]

// ── Sub-components ────────────────────────────────────────────────────────────
const QuestionCard = ({ item, index }) => {
    const [open, setOpen] = useState(false)
    const [copied, setCopied] = useState(false)
    const navigate = useNavigate()

    const handleCopy = (e) => {
        e.stopPropagation()
        if (item.answer) {
            navigator.clipboard.writeText(item.answer)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <div className={`q-card ${open ? 'open' : ''}`}>
            <div className='q-card__header' onClick={() => setOpen(o => !o)}>
                <span className='q-card__index'>Q{index + 1}</span>
                <p className='q-card__question'>{item.question}</p>
                <span className={`q-card__chevron ${open ? 'q-card__chevron--open' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                </span>
            </div>
            {open && (
                <div className='q-card__body'>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--intention'>Interviewer Intention</span>
                        <p>{item.intention || "Understand your approach, technical depth, and communication style."}</p>
                    </div>
                    <div className='q-card__section'>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <span className='q-card__tag q-card__tag--answer'>Model Answer Strategy</span>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button 
                                    type="button" 
                                    onClick={() => navigate('/mock-arena')}
                                    style={{ background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', color: '#818cf8', borderRadius: '4px', padding: '3px 10px', fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer' }}
                                >
                                    🎙️ Practice Answer
                                </button>
                                <button 
                                    type="button" 
                                    onClick={handleCopy}
                                    style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', borderRadius: '4px', padding: '3px 10px', fontSize: '0.78rem', cursor: 'pointer' }}
                                >
                                    {copied ? '✓ Copied' : 'Copy Model Answer'}
                                </button>
                            </div>
                        </div>
                        <p style={{ marginTop: '0.65rem', lineHeight: '1.6' }}>{item.answer || "Structure your answer with context, implementation details, trade-offs, and a concrete example."}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

const RoadMapDay = ({ day }) => (
    <div className='roadmap-day'>
        <div className='roadmap-day__header'>
            <span className='roadmap-day__badge'>Day {day.day}</span>
            <h3 className='roadmap-day__focus'>{day.focus}</h3>
        </div>
        <ul className='roadmap-day__tasks'>
            {day.tasks.map((task, i) => (
                <li key={i}>
                    <span className='roadmap-day__icon'>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </span>
                    <span>{task}</span>
                </li>
            ))}
        </ul>
    </div>
)

// ── Main Component ────────────────────────────────────────────────────────────
const Interview = () => {
    const [activeNav, setActiveNav] = useState('technical')
    const { report, loading, getResumePdf } = useInterview()
    const { interviewId } = useParams()
    const navigate = useNavigate()

    if (loading || !report) {
        return (
            <main className='loading-screen'>
                <h1>Loading your interview plan...</h1>
            </main>
        )
    }

    const scoreColor =
        report.matchScore >= 80 ? 'score--high' :
            report.matchScore >= 60 ? 'score--mid' : 'score--low'

    return (
        <div className='interview-page'>
            <div className='interview-layout'>

                {/* ── Left Nav ── */}
                <nav className='interview-nav'>
                    <div className="nav-content">
                        <button 
                            type="button" 
                            onClick={() => navigate('/')}
                            className="back-btn"
                            style={{ 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                gap: '0.4rem', 
                                background: 'var(--badge-bg)', 
                                border: '1px solid var(--border-color)', 
                                color: 'var(--text-primary)', 
                                padding: '0.5rem 0.85rem', 
                                borderRadius: '0.5rem', 
                                fontSize: '0.85rem', 
                                fontWeight: '600',
                                cursor: 'pointer', 
                                marginBottom: '1.25rem' 
                            }}
                        >
                            ← Dashboard
                        </button>

                        <p className='interview-nav__label'>Sections</p>
                        {NAV_ITEMS.map(item => (
                            <button
                                key={item.id}
                                className={`interview-nav__item ${activeNav === item.id ? 'interview-nav__item--active' : ''}`}
                                onClick={() => setActiveNav(item.id)}
                            >
                                <span className='interview-nav__icon'>{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => {
                            const targetId = report?._id || interviewId
                            if (!targetId) {
                                alert("Interview id is missing. Please reload this page.")
                                return
                            }
                            getResumePdf(targetId)
                        }}
                        className='button primary-button' >
                        <svg height={"0.8rem"} style={{ marginRight: "0.5rem" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"></path></svg>
                        Download PDF Plan
                    </button>
                </nav>

                {/* ── Center Content ── */}
                <main className='interview-content'>
                    {activeNav === 'technical' && (
                        <section>
                            <div className='content-header'>
                                <h2>Technical Questions</h2>
                                <span className='content-header__count'>{report.technicalQuestions.length} questions</span>
                            </div>
                            <div className='q-list'>
                                {report.technicalQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'behavioral' && (
                        <section>
                            <div className='content-header'>
                                <h2>Behavioral Questions</h2>
                                <span className='content-header__count'>{report.behavioralQuestions.length} questions</span>
                            </div>
                            <div className='q-list'>
                                {report.behavioralQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'roadmap' && (
                        <section>
                            <div className='content-header'>
                                <h2>Preparation Road Map</h2>
                                <span className='content-header__count'>{report.preparationPlan.length}-day plan</span>
                            </div>
                            <div className='roadmap-list'>
                                {report.preparationPlan.map((day) => (
                                    <RoadMapDay key={day.day} day={day} />
                                ))}
                            </div>
                        </section>
                    )}
                </main>

                {/* ── Right Sidebar ── */}
                <aside className='interview-sidebar'>

                    {/* Match Score Gauge */}
                    <div className='match-score'>
                        <p className='match-score__label'>MATCH SCORE</p>
                        
                        <div className='match-score__gauge-box'>
                            <svg width="120" height="120" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
                                <defs>
                                    <linearGradient id="gaugeHigh" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#22c55e" />
                                        <stop offset="100%" stopColor="#10b981" />
                                    </linearGradient>
                                    <linearGradient id="gaugeMid" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#f59e0b" />
                                        <stop offset="100%" stopColor="#d97706" />
                                    </linearGradient>
                                    <linearGradient id="gaugeLow" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#ef4444" />
                                        <stop offset="100%" stopColor="#ec4899" />
                                    </linearGradient>
                                </defs>

                                <circle cx="50" cy="50" r="42" stroke="var(--border-color)" strokeWidth="8" fill="none" opacity="0.6" />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="42"
                                    stroke={report.matchScore >= 80 ? 'url(#gaugeHigh)' : report.matchScore >= 60 ? 'url(#gaugeMid)' : 'url(#gaugeLow)'}
                                    strokeWidth="8"
                                    fill="none"
                                    strokeDasharray={2 * Math.PI * 42}
                                    strokeDashoffset={2 * Math.PI * 42 - ((report.matchScore || 0) / 100) * (2 * Math.PI * 42)}
                                    strokeLinecap="round"
                                    style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)' }}
                                />
                            </svg>

                            <div className='match-score__overlay'>
                                <span className='match-score__number'>{report.matchScore || 0}</span>
                                <span className='match-score__symbol'>%</span>
                            </div>
                        </div>

                        <div className={`match-score__status-pill status-pill--${report.matchScore >= 80 ? 'high' : report.matchScore >= 60 ? 'mid' : 'low'}`}>
                            {report.matchScore >= 80 ? '🚀 High Compatibility' : report.matchScore >= 60 ? '👍 Solid Baseline' : '⚠️ Gaps Detected'}
                        </div>

                        <p className='match-score__sub'>
                            {report.matchScore >= 80 
                                ? 'Your resume aligns with 90%+ of target job requirements.' 
                                : report.matchScore >= 60 
                                ? 'Good match for core skills. Review skill gaps before applying.' 
                                : 'Consider addressing skill gaps to boost interview calls.'}
                        </p>
                    </div>

                    {/* Quick Practice Actions Card (Replaces empty dark box) */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                        <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.18em', color: 'var(--text-muted)' }}>QUICK ACTIONS</p>
                        <button
                            type="button"
                            onClick={() => navigate('/mock-arena')}
                            style={{ width: '100%', padding: '0.65rem', borderRadius: '0.65rem', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', color: '#818cf8', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}
                        >
                            🎙️ Practice in Mock Arena
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/resources-guides')}
                            style={{ width: '100%', padding: '0.65rem', borderRadius: '0.65rem', background: 'var(--badge-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer' }}
                        >
                            ✉️ Generate Cover Letter
                        </button>
                    </div>

                    {/* Skill Gaps */}
                    <div className='skill-gaps'>
                        <p className='skill-gaps__label'>SKILL GAPS (CLICK TO QUIZ)</p>
                        <div className='skill-gaps__list'>
                            {report.skillGaps.map((gap, i) => (
                                <span 
                                    key={i} 
                                    className={`skill-tag skill-tag--${gap.severity}`}
                                    onClick={() => navigate('/skill-assessments')}
                                    style={{ cursor: 'pointer', title: 'Click to start skill assessment quiz' }}
                                >
                                    {gap.skill}
                                </span>
                            ))}
                        </div>
                    </div>

                </aside>
            </div>
        </div>
    )
}

export default Interview