import { Routes, Route, Outlet } from "react-router";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import WorkspacesPage from "./pages/WorkspacesPage"
import DashboardPage from "./pages/DashboardPage"
import { Toaster } from "sonner";
import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

function AuthLayout() {
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <Outlet />
    </div>
  )
}



function App() {
  return (
    <>
      <Routes>
        <Route path="auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        {/* protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<AppLayout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="workspaces" element={<WorkspacesPage />} />
          </Route>
        </Route>
      </Routes>
      <Toaster richColors position="top-center" />
    </>
  );
}

export default App
