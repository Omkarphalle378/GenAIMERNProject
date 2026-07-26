import React from 'react'
import DashboardSidebar from './DashboardSidebar'
import "../features/interview/style/home.scss"

export default function DashboardLayout({ children }) {
  return (
    <div className='dashboard-page'>
      <DashboardSidebar />
      <main className='dashboard-main'>
        {children}
      </main>
    </div>
  )
}
