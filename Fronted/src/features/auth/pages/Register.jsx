import React, { useState } from 'react'
import "../auth.form.scss"
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const Register = () => {
  const navigate = useNavigate()
  const { loading, handleRegister } = useAuth()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Password Requirements Validation
  const hasMinLength = password.length >= 6
  const hasUppercase = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const passwordsMatch = password && confirmPassword && password === confirmPassword

  const getPasswordStrength = (pass) => {
    if (!pass) return null
    if (pass.length < 6) return 'Weak'
    if (hasUppercase && hasNumber && pass.length >= 8) return 'Strong'
    return 'Medium'
  }

  const strength = getPasswordStrength(password)
  const strengthLevel = strength === 'Weak' ? 1 : strength === 'Medium' ? 2 : strength === 'Strong' ? 3 : 0

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username || !email || !password || !confirmPassword) {
      setError('All fields are required')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (!agreeTerms) {
      setError('Please agree to the Terms of Service & Privacy Policy')
      return
    }

    setError('')
    setSubmitting(true)
    const result = await handleRegister({ username: username.trim(), email: email.trim(), password })
    setSubmitting(false)
    if (result.ok) navigate('/')
    else setError(result.message || 'Registration failed.')
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
            <span className='badge-tag'>🚀 Career Acceleration Platform</span>
            <h1>Every interview plan, built around the actual job.</h1>
            <p>Create an account to save your prep plans, revisit them anytime, and track how you match up against each role you're targeting.</p>
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
              Dynamic 5-question AI skill assessments &amp; quizzes
            </li>
            <li>
              <span className='feature-icon'>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              </span>
              Instant ATS resume match scoring &amp; PDF reports
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
            <h1>Create your account</h1>
            <p className='subtitle'>Start building your interview prep plan.</p>
          </div>

          {/* Social Sign-Up Mockups */}
          <div className='auth-social-group'>
            <button type='button' className='auth-social-btn' onClick={() => setError('Google sign-up will be enabled soon. Please register via email.')}>
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.9 5 12 5z"/><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/><path fill="#FBBC05" d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.35s.2-1.65.4-2.35L1.6 7.1C.6 9.1 0 11.5 0 14s.6 4.9 1.6 6.9l3.7-2.9z"/><path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.3L1.6 16C3.5 19.8 7.4 23 12 23z"/></svg>
              Sign up with Google
            </button>
          </div>

          <div className='auth-divider'>
            <span>OR REGISTER WITH EMAIL</span>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {error && (
              <div className='auth-error' role="alert">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span>{error}</span>
              </div>
            )}

            <div className='field'>
              <label htmlFor='username'>Full Name / Username</label>
              <input
                onChange={(e) => setUsername(e.target.value)}
                type='text'
                id='username'
                value={username}
                autoComplete='username'
                placeholder='e.g., Alex Mercer'
                required
              />
            </div>

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
              <label htmlFor='password'>Password</label>
              <div className='input-wrapper'>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  id='password'
                  value={password}
                  autoComplete='new-password'
                  placeholder='Create a password'
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

              {/* Password Strength Meter & Live Checklist */}
              {password && (
                <div>
                  <div className='strength-meter'>
                    <div className='strength-meter__track'>
                      {[1, 2, 3].map((seg) => (
                        <span
                          key={seg}
                          className={`strength-meter__segment ${seg <= strengthLevel ? `strength-meter__segment--filled-${strength.toLowerCase()}` : ''}`}
                        />
                      ))}
                    </div>
                    <span className={`strength-meter__label strength-meter__label--${strength.toLowerCase()}`}>
                      {strength} Password
                    </span>
                  </div>

                  <div className='password-checklist'>
                    <span className={`check-item ${hasMinLength ? 'check-item--valid' : ''}`}>
                      {hasMinLength ? '✓' : '•'} At least 6 characters
                    </span>
                    <span className={`check-item ${hasUppercase ? 'check-item--valid' : ''}`}>
                      {hasUppercase ? '✓' : '•'} At least 1 uppercase letter
                    </span>
                    <span className={`check-item ${hasNumber ? 'check-item--valid' : ''}`}>
                      {hasNumber ? '✓' : '•'} At least 1 number
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className='field'>
              <div className='label-row'>
                <label htmlFor='confirmPassword'>Confirm Password</label>
                {confirmPassword && (
                  <span style={{ fontSize: '0.78rem', fontWeight: '700', color: passwordsMatch ? '#22c55e' : '#ef4444' }}>
                    {passwordsMatch ? '✓ Passwords match' : '✗ Do not match'}
                  </span>
                )}
              </div>
              <div className='input-wrapper'>
                <input
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  id='confirmPassword'
                  value={confirmPassword}
                  autoComplete='new-password'
                  placeholder='Re-enter your password'
                  required
                />
              </div>
            </div>

            <div className='auth-checkbox-row'>
              <label>
                <input
                  type='checkbox'
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
                I agree to the Terms of Service &amp; Privacy Policy
              </label>
            </div>

            <button type='submit' className='button primary-button' disabled={submitting}>
              {submitting ? (
                <>
                  <span className='auth-spinner' />
                  Creating account…
                </>
              ) : 'Create account'}
            </button>
          </form>

          <p className='auth-card__footer'>
            Already have an account? <Link to='/login'>Log in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register