import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AuthScreen from '../pages/auth/AuthScreen';
import RootRoute from './RootRoute';
import DashboardLayout from '../pages/dashboardLayout/DashboardLayout';
import Dashboard from '../pages/dashboard/Dashboard';
import QueuePage from '../pages/queue/QueuePage';
import SettingsPage from '../pages/settings/SettingsPage';
import BookingPage from '../pages/booking/BookingPage';
import AnalyticsPage from '../pages/analytics/AnalyticsPage';
import OnboardingPage from '../pages/onBoarding/OnboardingPage';
import BusinessSetupPage from '../pages/businessSetupPage/BusinessSetupPage';
import BrowsePage from '../pages/customer/BrowsePage';
import LandingPage from '../LandingPage';
import OnboardingGuard from './OnboardingGuard';
import BusinesDetailsPage from '../pages/customer/BusinessDetailsPage';
import DashboardGuard from './DashboardGuard';
import BusinessSetupGuard from './BusinessSetupGuard';

export const router = createBrowserRouter([
  // Public routes
  {
    path: '/',
    element: <RootRoute />
  },
  {
    path: '/auth',
    element: <AuthScreen />
  },
  
  {
    path: '/landingPage',
    element: <LandingPage />
  },
  
  // Protected routes with Layout
  {
    path: '/onboarding',
    element: (
      <ProtectedRoute>
        <OnboardingGuard>
        <OnboardingPage />
        </OnboardingGuard>
      </ProtectedRoute>
    )
  },

  // for businesses to complete their setup
    {
    path: '/setup-business',
    element: (
      <ProtectedRoute>
        <BusinessSetupGuard>
          <BusinessSetupPage />
        </BusinessSetupGuard>
      </ProtectedRoute>
    )
  },

  // default route for customers after login to browse businesses
    {
    path: '/browse',
    element: (
      <ProtectedRoute>
        <BrowsePage />
      </ProtectedRoute>
    )
  },

{
  path: '/business/:id',
  element:(
    <ProtectedRoute>
      <BusinesDetailsPage />
    </ProtectedRoute>
  )
},
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardGuard>
          <DashboardLayout />
        </DashboardGuard>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true, 
        element: <Dashboard />
      },
      {
        path: 'queue',
        element: <QueuePage /> 
      },
      {
        path: 'bookings', 
        element: <BookingPage /> 
      },
      {
        path: 'analytics', 
        element: <AnalyticsPage /> 
      },
      {
        path: 'settings',
        element: <SettingsPage /> 
      },
    ]
  },

  // 404
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
])