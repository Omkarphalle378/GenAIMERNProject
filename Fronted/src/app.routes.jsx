import { createBrowserRouter, Navigate } from "react-router-dom"

import Login from "./features/auth/pages/Login"
import Register from "./features/auth/pages/Register"
import Protected from "./features/auth/components/Protected"
import Home from "./features/interview/pages/Home"
import Interview from './features/interview/pages/interview'
import Profile from './features/interview/pages/Profile'
import StrategyLab from './features/interview/pages/StrategyLab'
import MockArena from './features/interview/pages/MockArena'
import SkillAssessments from './features/interview/pages/SkillAssessments'
import ResourcesGuides from './features/interview/pages/ResourcesGuides'
import PrivacyPolicy from './features/interview/pages/PrivacyPolicy'
import TermsConditions from './features/interview/pages/TermsConditions'
import HelpCenter from './features/interview/pages/HelpCenter'
import DashboardLayout from './layouts/DashboardLayout'

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Protected>
        <DashboardLayout>
          <Home />
        </DashboardLayout>
      </Protected>
    )
  },
  {
    path: "/profile",
    element: (
      <Protected>
        <DashboardLayout>
          <Profile />
        </DashboardLayout>
      </Protected>
    )
  },
  {
    path: "/strategy-lab",
    element: (
      <Protected>
        <DashboardLayout>
          <StrategyLab />
        </DashboardLayout>
      </Protected>
    )
  },
  {
    path: "/mock-arena",
    element: (
      <Protected>
        <DashboardLayout>
          <MockArena />
        </DashboardLayout>
      </Protected>
    )
  },
  {
    path: "/skill-assessments",
    element: (
      <Protected>
        <DashboardLayout>
          <SkillAssessments />
        </DashboardLayout>
      </Protected>
    )
  },
  {
    path: "/resources-guides",
    element: (
      <Protected>
        <DashboardLayout>
          <ResourcesGuides />
        </DashboardLayout>
      </Protected>
    )
  },
  {
    path: "/privacy",
    element: (
      <DashboardLayout>
        <PrivacyPolicy />
      </DashboardLayout>
    )
  },
  {
    path: "/terms",
    element: (
      <DashboardLayout>
        <TermsConditions />
      </DashboardLayout>
    )
  },
  {
    path: "/help",
    element: (
      <DashboardLayout>
        <HelpCenter />
      </DashboardLayout>
    )
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/interview/:interviewId",
    element: <Protected><Interview /></Protected>
  },
  {
    path: "*",
    element: <Navigate to="/" replace />
  }
])