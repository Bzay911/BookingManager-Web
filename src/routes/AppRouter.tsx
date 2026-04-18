import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AuthScreen from "../pages/auth/AuthScreen";
import RootRoute from "./RootRoute";
import DashboardLayout from "../pages/dashboardLayout/DashboardLayout";
import Dashboard from "../pages/business/dashboard/Dashboard";
import QueuePage from "../pages/business/queue/QueuePage";
import BookingPage from "../pages/business/booking/BookingPage";
import BusinessSetupPage from "../pages/businessSetupPage/BusinessSetupPage";
import BrowsePage from "../pages/customer/BrowsePage";
import LandingPage from "../LandingPage";
import BusinesDetailsPage from "../pages/customer/BusinessDetailsPage";
import DashboardGuard from "./DashboardGuard";
import BusinessSetupGuard from "./BusinessSetupGuard";
import BusinessPage from "../pages/business/businessPage/BusinessPage";

export const router = createBrowserRouter([
  // Public routes
  {
    path: "/",
    element: <RootRoute />,
  },
  {
    path: "/auth",
    element: <AuthScreen />,
  },

  {
    path: "/landingPage",
    element: <LandingPage />,
  },
  {
    path: "/setup-business",
    element: (
      <ProtectedRoute>
        <BusinessSetupGuard>
          <BusinessSetupPage />
        </BusinessSetupGuard>
      </ProtectedRoute>
    ),
  },

  {
    path: "/browse",
    element: (
      // <ProtectedRoute>
      <BrowsePage />
      // </ProtectedRoute>
    ),
  },

  {
    path: "/business/:id",
    element: (
      // <ProtectedRoute>
      <BusinesDetailsPage />
      // </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard",
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
        element: <Dashboard />,
      },
      {
        path: "queue",
        element: <QueuePage />,
      },
      {
        path: "bookings",
        element: <BookingPage />,
      },
      {
        path: "business",
        element: <BusinessPage />,
      },
    ],
  },

  // 404
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
