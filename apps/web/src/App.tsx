import { Routes, Route, Outlet } from "react-router";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
//import WorkspacesPage from "./pages/WorkspacesPage"
import { Toaster } from "sonner";
import AppLayout from "./layouts/AppLayout";

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
        <Route path="dashboard" element={<AppLayout />} />
      </Routes>
      <Toaster richColors position="top-center" />
    </>
  );
}

export default App
