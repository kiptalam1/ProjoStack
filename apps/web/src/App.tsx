import { Routes, Route, Outlet, Navigate } from "react-router";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import WorkspacesPage from "./pages/WorkspacesPage";
import ProjectsPage from "./pages/ProjectsPage";
import WorkspaceProjectsPage from "./pages/WorkspaceProjectsPage";
import DashboardPage from "./pages/DashboardPage";
import { Toaster } from "sonner";
import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import ProjectTasksPage from "./pages/ProjectTasksPage";
import PublicOnlyRoute from "./routes/PublicOnlyRoute";
import TasksPage from "./pages/TasksPage";
import SettingsPage from "./pages/SettingsPage";

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
        <Route element={<PublicOnlyRoute />} >
          <Route path="auth" element={<AuthLayout />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>
        </Route>

        {/* protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="workspaces">
              <Route index element={<WorkspacesPage />} />
              <Route path=":workspaceId/projects" element={<WorkspaceProjectsPage />} />
              <Route path=":workspaceId/projects/:projectId/tasks" element={<ProjectTasksPage />} />
            </Route>
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="tasks/all" element={<TasksPage />} />
            <Route path="settings" element={<SettingsPage />} />
            {/*<Route path="*" element={<NotFoundPage />} />*/}
          </Route>
        </Route>
      </Routes>
      <Toaster richColors position="top-center" />
    </>
  );
}

export default App
