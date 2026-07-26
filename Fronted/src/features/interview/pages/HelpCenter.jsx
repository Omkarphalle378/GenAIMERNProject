import React, { useState } from 'react'
import '../style/home.scss'

const FAQS = [
  {
    id: 1,
    question: 'How does the ATS Resume Match Score work?',
    answer: 'HireSmart AI analyzes your uploaded PDF resume or candidate background against the target Job Description requirements. It evaluates key technical skills, experience alignment, and keyword density to generate a 0-100% match score.'
  },
  {
    id: 2,
    question: 'How do I download my strategy plan as a PDF report?',
    answer: 'Navigate to any generated report on your Dashboard or from the Strategy Lab. Click the "Download PDF Plan" button in the left section panel to generate a styled PDF report with dark headers and ATS score badges.'
  },
  {
    id: 3,
    question: 'What is the AI Mock Interview Arena?',
    answer: 'The Mock Arena is a timed practice simulator. You can import questions directly from your generated reports or pick a role preset. Type your answer and click "Submit Answer for Feedback" to get instant AI scoring (0-100), key strengths, missing points, and senior model answers.'
  },
  {
    id: 4,
    question: 'How are Skill Assessment quizzes generated?',
    answer: 'The Skill Assessment center automatically pulls detected skill gaps from your reports (e.g., Docker, System Design, MongoDB, React). You can also type any custom skill topic to generate a 5-question micro-quiz with instant scoring and explanations.'
  },
  {
    id: 5,
    question: 'Can I generate customized cover letters and recruiter cold emails?',
    answer: 'Yes! Go to the Cover Letter & Pitch studio in your sidebar. Auto-fill details from any existing report to generate a 3-paragraph tailored cover letter and a recruiter cold email pitch with a catchy subject line.'
  }
]

const HelpCenter = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [openFaq, setOpenFaq] = useState(1) // Default open first FAQ
  
  // Support Form State
  const [supportMessage, setSupportMessage] = useState('')
  const [supportSubject, setSupportSubject] = useState('')
  const [supportSubmitted, setSupportSubmitted] = useState(false)

  const filteredFaqs = FAQS.filter(f => 
    f.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.answer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSupportSubmit = (e) => {
    e.preventDefault()
    if (!supportMessage.trim()) return
    setSupportSubmitted(true)
    setTimeout(() => {
      setSupportSubmitted(false)
      setSupportMessage('')
      setSupportSubject('')
    }, 4000)
  }

  return (
    <div className='dashboard-page dashboard-page--content'>
      <section className='page-panel'>
        <div className='page-panel__header'>
          <div>
            <p className='dashboard-eyebrow'>Help & Support</p>
            <h1>Help Center & Knowledge Base</h1>
            <p className='panel-subtitle'>Find instant answers to common questions or reach out to our support team for guidance.</p>
          </div>
        </div>

        <div className='page-panel__body' style={{ marginTop: '1.5rem', gap: '1.5rem' }}>
          
          {/* Search Box */}
          <div style={{ padding: '1.25rem', borderRadius: '0.85rem', background: 'var(--bg-panel)', border: '1px solid var(--border-color)' }}>
            <p style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--accent-indigo)', margin: '0 0 0.65rem' }}>
              🔍 Search Knowledge Base:
            </p>
            <input
              type='text'
              placeholder='Type to search FAQs (e.g., PDF download, ATS score, Mock Arena)...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='panel__textarea'
              style={{ minHeight: '44px', height: '44px', padding: '0.5rem 1rem' }}
            />
          </div>

          {/* FAQ Accordion List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Frequently Asked Questions</h3>

            {filteredFaqs.map((faq) => {
              const isOpen = openFaq === faq.id
              return (
                <div
                  key={faq.id}
                  style={{
                    borderRadius: '0.85rem',
                    background: 'var(--bg-panel)',
                    border: '1px solid var(--border-color)',
                    overflow: 'hidden',
                    transition: 'all 150ms ease'
                  }}
                >
                  <div
                    onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                    style={{
                      padding: '1.1rem 1.25rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      background: isOpen ? 'var(--badge-bg)' : 'transparent'
                    }}
                  >
                    <strong style={{ fontSize: '0.98rem', color: 'var(--text-primary)' }}>{faq.question}</strong>
                    <span style={{ color: 'var(--accent-indigo)', fontWeight: '700', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 200ms ease' }}>
                      ▼
                    </span>
                  </div>

                  {isOpen && (
                    <div style={{ padding: '1rem 1.25rem 1.25rem', borderTop: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Contact Support Card */}
          <div style={{ padding: '1.5rem', borderRadius: '1rem', background: 'var(--bg-panel)', border: '1px solid var(--border-color)', marginTop: '1rem' }}>
            <h3 style={{ margin: '0 0 0.35rem', color: 'var(--text-primary)' }}>💬 Contact Support & Feedback</h3>
            <p style={{ margin: '0 0 1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Have a question not answered in our knowledge base? Send a message directly to our engineering team.
            </p>

            {supportSubmitted ? (
              <div style={{ padding: '0.85rem 1rem', borderRadius: '0.65rem', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid #22c55e', color: '#22c55e', fontWeight: '700', fontSize: '0.9rem' }}>
                ✓ Support ticket submitted successfully! Our team will respond shortly.
              </div>
            ) : (
              <form onSubmit={handleSupportSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                  type='text'
                  placeholder='Subject / Topic (e.g., Report Generation Question)'
                  value={supportSubject}
                  onChange={(e) => setSupportSubject(e.target.value)}
                  className='panel__textarea'
                  style={{ minHeight: '44px', height: '44px', padding: '0.5rem 1rem' }}
                  required
                />
                <textarea
                  placeholder='Describe your question, issue, or feedback in detail...'
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  className='panel__textarea'
                  style={{ minHeight: '100px', padding: '0.85rem' }}
                  required
                />
                <button type='submit' className='generate-btn' style={{ alignSelf: 'flex-start', padding: '0.65rem 1.5rem' }}>
                  Submit Support Ticket
                </button>
              </form>
            )}
          </div>

        </div>
      </section>
    </div>
  )
}

export default HelpCenter
