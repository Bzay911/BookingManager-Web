import { createBrowserRouter, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import AuthScreen from '../pages/auth/AuthScreen'
import Dashboard from '../pages/dashboard/Dashboard'
import LandingPage from '../LandingPage'

export const router = createBrowserRouter([
  // Public routes
  {
    path: '/',
    element: <LandingPage />
  },
  {
    path: '/auth',
    element: <AuthScreen />
  },

  // Protected routes
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    )
  },

  // 404
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
])