import { Navigate, Outlet, } from "react-router";
import { useAuth } from "../auth/useAuth"

export default function ProtectedRoutes() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth/login" replace />
  }
  return <Outlet />
}
