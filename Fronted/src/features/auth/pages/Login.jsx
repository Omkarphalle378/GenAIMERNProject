import React, { useState } from 'react'
import "../auth.form.scss"
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const Login = () => {
  const { loading, handleLogin } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState(() => localStorage.getItem('hire_smart_remembered_email') || '')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotSubmitting, setForgotSubmitting] = useState(false)
  const [forgotSuccessMessage, setForgotSuccessMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email?.trim() || !password) {
      setError('Please enter your email and password')
      return
    }

    if (rememberMe) {
      localStorage.setItem('hire_smart_remembered_email', email.trim())
    } else {
      localStorage.removeItem('hire_smart_remembered_email')
    }

    setSubmitting(true)
    const result = await handleLogin({ email: email.trim(), password })
    setSubmitting(false)
    if (result.ok) navigate('/')
    else setError(result.message || 'Login failed. Please check your credentials.')
  }

  const handleForgotSubmit = (e) => {
    e.preventDefault()
    if (!forgotEmail || !forgotEmail.includes('@')) {
      return
    }
    setForgotSubmitting(true)
    setTimeout(() => {
      setForgotSubmitting(false)
      setForgotSuccessMessage(`Password reset link sent to ${forgotEmail}! Please check your inbox.`)
    }, 1200)
  }

  return (
    <div className='auth-page'>
      {/* ── Left Hero Panel ── */}
      <aside className='auth-hero'>
        <div className='auth-hero__brand' onClick={() => navigate('/')}>
          <span className='mark'>H</span>
          HireSmart AI
        </div>

        <div>
          <div className='auth-hero__content'>
            <span className='badge-tag'>✨ AI-Powered Career Intelligence</span>
            <h1>Walk into your next interview already knowing what's coming.</h1>
            <p>Paste a job description, share your background, and get a tailored prep plan built around exactly what that role expects.</p>
          </div>

          <ul className='auth-hero__features'>
            <li>
              <span className='feature-icon'>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              </span>
              Technical &amp; behavioral questions matched to the role
            </li>
            <li>
              <span className='feature-icon'>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              </span>
              A day-by-day roadmap for the skills you're missing
            </li>
            <li>
              <span className='feature-icon'>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              </span>
              Instant AI Cover Letter &amp; Recruiter Pitch Studio
            </li>
          </ul>

          <div className='auth-hero__sample'>
            <div className='auth-hero__sample__ring'>
              <svg width="58" height="58" viewBox="0 0 52 52">
                <circle cx="26" cy="26" r="22" stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="none" />
                <circle cx="26" cy="26" r="22" stroke="#6366F1" strokeWidth="4" fill="none"
                  strokeDasharray={2 * Math.PI * 22}
                  strokeDashoffset={2 * Math.PI * 22 - 0.87 * (2 * Math.PI * 22)}
                  strokeLinecap="round" />
              </svg>
              <span className='ring-value'>87%</span>
            </div>
            <div>
              <p className='auth-hero__sample__label'>Sample report</p>
              <p className='auth-hero__sample__title'>Senior Frontend Engineer match</p>
            </div>
          </div>
        </div>

        <div />
      </aside>

      {/* ── Right Form Panel ── */}
      <div className='auth-form-panel'>
        <div className='auth-topbar' onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <span className='mark'>H</span>
          HireSmart AI
        </div>

        <div className='auth-card'>
          <div className='auth-card__head'>
            <h1>Welcome back</h1>
            <p className='subtitle'>Log in to pick up where you left off.</p>
          </div>

          {/* Social Sign-In Mockups */}
          <div className='auth-social-group'>
            <button type='button' className='auth-social-btn' onClick={() => setError('Google sign-in will be enabled soon. Please use email.')}>
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.9 5 12 5z"/><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/><path fill="#FBBC05" d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.35s.2-1.65.4-2.35L1.6 7.1C.6 9.1 0 11.5 0 14s.6 4.9 1.6 6.9l3.7-2.9z"/><path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.3L1.6 16C3.5 19.8 7.4 23 12 23z"/></svg>
              Continue with Google
            </button>
          </div>

          <div className='auth-divider'>
            <span>OR EMAIL</span>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {error && (
              <div className='auth-error' role="alert">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span>{error}</span>
              </div>
            )}

            <div className='field'>
              <label htmlFor='email'>Email Address</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type='email'
                id='email'
                value={email}
                autoComplete='email'
                placeholder='you@example.com'
                required
              />
            </div>

            <div className='field'>
              <div className='label-row'>
                <label htmlFor='password'>Password</label>
                <span 
                  className='forgot-link' 
                  onClick={() => {
                    setForgotEmail(email)
                    setShowForgotModal(true)
                  }}
                >
                  Forgot password?
                </span>
              </div>
              <div className='input-wrapper'>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  id='password'
                  value={password}
                  autoComplete='current-password'
                  placeholder='Enter your password'
                  required
                />
                <button
                  type='button'
                  className='password-toggle'
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.9 18.9 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a18.9 18.9 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            <div className='auth-checkbox-row'>
              <label>
                <input
                  type='checkbox'
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me on this device
              </label>
            </div>

            <button type='submit' className='button primary-button' disabled={submitting}>
              {submitting ? (
                <>
                  <span className='auth-spinner' />
                  Logging in…
                </>
              ) : 'Log in'}
            </button>
          </form>

          <p className='auth-card__footer'>
            Don't have an account? <Link to='/register'>Create one</Link>
          </p>
        </div>
      </div>

      {/* ── Forgot Password Modal ── */}
      {showForgotModal && (
        <div className='auth-modal-backdrop' onClick={() => setShowForgotModal(false)}>
          <div className='auth-modal' onClick={(e) => e.stopPropagation()}>
            <button 
              type='button' 
              className='modal-close-icon' 
              onClick={() => {
                setShowForgotModal(false)
                setForgotSuccessMessage('')
              }}
              title="Close modal"
            >
              ✕
            </button>

            <h2>Reset Password</h2>
            <p>Enter your email address and we'll send you instructions to reset your password.</p>

            {forgotSuccessMessage ? (
              <div style={{ padding: '0.85rem 1rem', borderRadius: '0.65rem', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid #22c55e', color: '#22c55e', fontSize: '0.88rem', fontWeight: '600' }}>
                {forgotSuccessMessage}
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit}>
                <div className='field'>
                  <label htmlFor='forgot-email'>Email Address</label>
                  <input
                    type='email'
                    id='forgot-email'
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder='you@example.com'
                    required
                  />
                </div>

                <button type='submit' className='button primary-button' disabled={forgotSubmitting} style={{ marginTop: '0.5rem' }}>
                  {forgotSubmitting ? 'Sending reset link…' : 'Send Reset Link'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Login