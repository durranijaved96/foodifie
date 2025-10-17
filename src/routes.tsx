import { Navigate, useRoutes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardAppPage from "./pages/Dashboard";
import DashboardLayout from "./layouts/dashboard/DashboardLayout";
import SignupPage from "./pages/SignUpPage";
import PasswordReset from "./pages/PasswordResetPage";
import NewPassword from "./pages/NewPassword";
import SubscriptionsPage from "./pages/SubscriptionsPage";
import SuccessLayout from "./pages/SuccessLayout";
import CancelLayout from "./pages/CancelLayout";
import ProtectedRoute from "./protectRoute";
import HomeDashboard from "./pages/Home/Dashboard";


export default function Router() {
  const routes = useRoutes([
    {
      path: "/",
      element: <LoginPage />,
    },
    {
      path: "/home",
      element: <HomeDashboard />,
    },
    {
      path: "/dashboard",
      element: <ProtectedRoute element={<DashboardLayout />} />, // Protect the /dashboard route
      children: [
        { element: <Navigate to="/dashboard/home" />, index: true },
        { path: "app", element: <DashboardAppPage /> },
        { path: "subscription", element: <SubscriptionsPage /> },
        { path: "home", element: <HomeDashboard /> },

      ],
    },
    {
      path: "/signup",
      element: <SignupPage />,
    },
    {
      path: "/resetpassword",
      element: <PasswordReset />,
    },
    {
      path: "/newpassword",
      element: <NewPassword />,
    },
    {
      path: "/success",
      element: <ProtectedRoute element={ <SuccessLayout /> } />, // Protect the /success route
    },
    {
      path: "/cancel",
      element: <ProtectedRoute element={<CancelLayout />} />, // Add the cancel page route
    },
    // Add a catch-all route to handle any other paths
    { path: "*", element: <Navigate to="/" replace /> },
  ]);

  return routes;
}
