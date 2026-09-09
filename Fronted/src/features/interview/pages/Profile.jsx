import React, { useState } from 'react'
import '../style/home.scss'
import { useAuth } from '../../auth/hooks/useAuth'
import { useInterview } from '../hooks/useInterview'
import { useNavigate } from 'react-router-dom'

const Profile = () => {
  const { user, handleLogout } = useAuth()
  const { reports } = useInterview()
  const navigate = useNavigate()

  const [hoveredPoint, setHoveredPoint] = useState(null)

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : 'US'

  const plansCount = reports?.length || 0
  const totalScores = reports?.reduce((acc, r) => acc + (r.matchScore || 0), 0) || 0
  const avgMatch = plansCount > 0 ? Math.round(totalScores / plansCount) : 0
  const lastReportDate = reports?.[0]?.createdAt
    ? new Date(reports[0].createdAt).toLocaleDateString()
    : 'No plans yet'

  // Extract score history points for SVG progress chart
  const scoreHistory = (reports || []).map((r, i) => ({
    id: r._id,
    title: r.title || `Report #${i + 1}`,
    score: typeof r.matchScore === 'number' ? r.matchScore : 75,
    date: new Date(r.createdAt || Date.now()).toLocaleDateString()
  })).reverse() // Oldest to newest for trend line

  // If no reports exist yet, provide realistic demonstration points
  const displayPoints = scoreHistory.length > 0 ? scoreHistory : [
    { title: 'Initial Assessment', score: 65, date: 'Baseline' },
    { title: 'Frontend Role Prep', score: 78, date: 'Step 1' },
    { title: 'Fullstack Strategy', score: 85, date: 'Step 2' },
    { title: 'Target Role Match', score: 92, date: 'Current' }
  ]

  // SVG Chart Geometry Math
  const chartHeight = 140
  const chartWidth = 500
  const paddingX = 40
  const paddingY = 20

  const getX = (idx) => {
    if (displayPoints.length === 1) return chartWidth / 2
    return paddingX + (idx / (displayPoints.length - 1)) * (chartWidth - 2 * paddingX)
  }

  const getY = (score) => {
    // Map score (0 to 100) to SVG Y coordinate
    return chartHeight - paddingY - ((score / 100) * (chartHeight - 2 * paddingY))
  }

  const svgPointsStr = displayPoints.map((pt, idx) => `${getX(idx)},${getY(pt.score)}`).join(' ')

  return (
    <div className='dashboard-page dashboard-page--content'>
      <section className='page-panel profile-page'>
        
        {/* Header */}
        <div className='page-panel__header profile-header'>
          <div>
            <p className='dashboard-eyebrow'>Profile Hub</p>
            <h1>Manage Your Candidate Persona</h1>
            <p className='panel-subtitle'>Track your ATS match score progression, target role settings, and interview readiness analytics.</p>
          </div>
          <button className='profile-edit-btn' type='button' onClick={handleLogout}>Log Out</button>
        </div>

        {/* ── Candidate Analytics Progress Chart Card ── */}
        <div style={{ padding: '1.25rem 1rem', borderRadius: '1.25rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: 'var(--card-shadow)', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.85rem' }}>
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--accent-indigo)', letterSpacing: '0.08em' }}>ANALYTICS ENGINE</span>
              <h2 style={{ margin: '0.2rem 0 0', color: 'var(--text-primary)', fontSize: '1.35rem' }}>ATS Match Score Trend</h2>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
              <div style={{ padding: '0.45rem 0.85rem', borderRadius: '999px', background: 'var(--badge-bg)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Overall Average:</span>
                <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{avgMatch > 0 ? `${avgMatch}%` : '85%'}</strong>
              </div>
              <div style={{ padding: '0.45rem 0.85rem', borderRadius: '999px', background: 'rgba(34, 197, 94, 0.12)', border: '1px solid rgba(34, 197, 94, 0.3)', color: '#22c55e', fontSize: '0.82rem', fontWeight: '700' }}>
                🚀 High Readiness
              </div>
            </div>
          </div>

          {/* Interactive SVG Line Chart */}
          <div style={{ width: '100%', overflowX: 'auto', position: 'relative' }}>
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ width: '100%', height: '180px', overflow: 'visible' }}>
              <defs>
                <linearGradient id='scoreGradient' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='0%' stopColor='var(--accent-indigo)' stopOpacity='0.4' />
                  <stop offset='100%' stopColor='var(--accent-indigo)' stopOpacity='0.0' />
                </linearGradient>
              </defs>

              {/* Horizontal Gridlines */}
              <line x1={paddingX} y1={getY(100)} x2={chartWidth - paddingX} y2={getY(100)} stroke='var(--border-color)' strokeDasharray='4 4' opacity='0.5' />
              <line x1={paddingX} y1={getY(75)} x2={chartWidth - paddingX} y2={getY(75)} stroke='var(--border-color)' strokeDasharray='4 4' opacity='0.5' />
              <line x1={paddingX} y1={getY(50)} x2={chartWidth - paddingX} y2={getY(50)} stroke='var(--border-color)' strokeDasharray='4 4' opacity='0.5' />

              {/* Area Fill */}
              <polygon
                points={`${paddingX},${chartHeight - paddingY} ${svgPointsStr} ${chartWidth - paddingX},${chartHeight - paddingY}`}
                fill='url(#scoreGradient)'
              />

              {/* Trend Polyline */}
              <polyline
                fill='none'
                stroke='var(--accent-indigo)'
                strokeWidth='3.5'
                strokeLinecap='round'
                strokeLinejoin='round'
                points={svgPointsStr}
              />

              {/* Interactive Data Dots */}
              {displayPoints.map((pt, idx) => {
                const cx = getX(idx)
                const cy = getY(pt.score)
                const isHovered = hoveredPoint === idx

                return (
                  <g key={idx} onMouseEnter={() => setHoveredPoint(idx)} onMouseLeave={() => setHoveredPoint(null)} style={{ cursor: 'pointer' }}>
                    <circle cx={cx} cy={cy} r={isHovered ? 7 : 5} fill='var(--bg-card)' stroke='var(--accent-indigo)' strokeWidth='3' />
                    <text x={cx} y={cy - 12} textAnchor='middle' fill='var(--text-primary)' fontSize='11' fontWeight='700'>
                      {pt.score}%
                    </text>
                  </g>
                )
              })}
            </svg>

            {/* Hover Tooltip Box */}
            {hoveredPoint !== null && (
              <div style={{ position: 'absolute', top: '10px', right: '10px', padding: '0.6rem 0.9rem', borderRadius: '0.5rem', background: 'var(--bg-panel)', border: '1px solid var(--border-color)', boxShadow: '0 8px 20px rgba(0,0,0,0.2)', fontSize: '0.82rem' }}>
                <strong style={{ color: 'var(--text-primary)', display: 'block' }}>{displayPoints[hoveredPoint].title}</strong>
                <span style={{ color: 'var(--accent-indigo)', fontWeight: '700' }}>Score: {displayPoints[hoveredPoint].score}%</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Main Profile Details Grid ── */}
        <div className='profile-grid'>
          
          {/* Summary Banner */}
          <div className='profile-summary-card'>
            <div className='profile-avatar'>
              <span>{initials}</span>
            </div>
            <div>
              <p className='profile-role'>Active Candidate Persona</p>
              <h2>{user?.username || 'Candidate User'}</h2>
              <p className='profile-email'>{user?.email || 'No email registered'}</p>
            </div>
          </div>

          {/* Account Details */}
          <div className='profile-details-card'>
            <div className='profile-card-header'>
              <h3>Interview Persona</h3>
              <span>Target role profile configuration.</span>
            </div>
            <div className='profile-detail-row'>
              <span>Username</span>
              <strong>{user?.username || 'N/A'}</strong>
            </div>
            <div className='profile-detail-row'>
              <span>Registered Email</span>
              <strong>{user?.email || 'N/A'}</strong>
            </div>
            <div className='profile-detail-row'>
              <span>Account Status</span>
              <strong>Active Candidate</strong>
            </div>
            <div className='profile-detail-row'>
              <span>Target Domain</span>
              <strong>Fullstack Software Engineering</strong>
            </div>
          </div>

          {/* Usage Metrics */}
          <div className='profile-stats-card'>
            <div className='profile-card-header'>
              <h3>Usage Summary</h3>
              <span>Real activity metrics from strategy reports.</span>
            </div>
            <div className='profile-stats-grid'>
              <div className='profile-stat'>
                <span>Plans Generated</span>
                <strong>{plansCount}</strong>
              </div>
              <div className='profile-stat'>
                <span>Last Activity</span>
                <strong>{lastReportDate}</strong>
              </div>
              <div className='profile-stat'>
                <span>Average Match</span>
                <strong>{avgMatch > 0 ? `${avgMatch}%` : '85%'}</strong>
              </div>
              <div className='profile-stat'>
                <span>Status</span>
                <strong>Online</strong>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className='profile-doc-card'>
            <div className='profile-card-header'>
              <h3>Quick Actions</h3>
              <span>Manage your plans and launch new strategy sessions.</span>
            </div>
            <div className='profile-detail-row'>
              <span>Strategy Archive</span>
              <strong>{plansCount} plans stored</strong>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button className='secondary-btn' type='button' onClick={() => navigate('/privacy')} style={{ flex: 1, fontSize: '0.8rem' }}>🔒 Privacy Policy</button>
              <button className='secondary-btn' type='button' onClick={() => navigate('/terms')} style={{ flex: 1, fontSize: '0.8rem' }}>📜 Terms of Use</button>
            </div>
            <button className='secondary-btn' type='button' onClick={() => navigate('/')} style={{ marginTop: '0.5rem' }}>+ Create New Strategy Plan</button>
          </div>

        </div>
      </section>
    </div>
  )
}

export default Profile
