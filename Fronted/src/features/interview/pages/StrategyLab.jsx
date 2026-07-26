import React, { useState } from 'react'
import '../style/home.scss'
import { useInterview } from '../hooks/useInterview'
import { useNavigate } from 'react-router-dom'

const StrategyLab = () => {
  const { reports, getResumePdf } = useInterview()
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  const filteredReports = (reports || []).filter(r => 
    (r.title || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className='dashboard-page dashboard-page--content'>
      <section className='page-panel'>
        <div className='page-panel__header'>
          <div>
            <p className='dashboard-eyebrow'>Strategy Lab</p>
            <h1>Interview Strategy Archives</h1>
            <p className='panel-subtitle'>Review and refine all your generated interview preparation strategies.</p>
          </div>
          <button className='generate-btn' type='button' onClick={() => navigate('/')}>+ New Strategy</button>
        </div>

        <div className='page-panel__body' style={{ marginTop: '1.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <input 
              type='text' 
              placeholder='Search strategy reports by title...' 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='panel__textarea'
              style={{ minHeight: '42px', height: '42px', padding: '0.5rem 1rem' }}
            />
          </div>

          {filteredReports.length === 0 ? (
            <div className='empty-state-box' style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <h3>No interview strategies found</h3>
              <p>Generate your first AI interview strategy plan from the Dashboard!</p>
            </div>
          ) : (
            <div className='reports-table'>
              <div className='reports-table__header'>
                <span>Title</span>
                <span>Match Score</span>
                <span>Status</span>
                <span>Date</span>
                <span>Actions</span>
              </div>
              {filteredReports.map((report) => (
                <div key={report._id} className='reports-table__row'>
                  <div>
                    <p>{report.title || 'Interview Strategy'}</p>
                    <span className='report-subtitle'>MERN / Fullstack role</span>
                  </div>
                  <div className='report-badge'>{report.matchScore ?? '--'}%</div>
                  <div className={`report-status ${report.matchScore >= 80 ? 'status--high' : report.matchScore >= 60 ? 'status--mid' : 'status--low'}`}>
                    {report.matchScore >= 80 ? 'Strong Match' : report.matchScore >= 60 ? 'Good' : 'Review'}
                  </div>
                  <div>{new Date(report.createdAt).toLocaleDateString()}</div>
                  <div className='report-actions'>
                    <button type='button' onClick={() => navigate(`/interview/${report._id}`)}>View Report</button>
                    <button type='button' onClick={() => getResumePdf(report._id)}>PDF</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default StrategyLab
