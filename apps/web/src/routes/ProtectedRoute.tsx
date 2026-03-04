import { Navigate, Outlet, } from "react-router";
import { useAuth } from "../auth/useAuth"
import LoadingSpinner from "../components/ui/LoadingSpinner";

export default function ProtectedRoutes() {
  const { user, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />
  }
  return <Outlet />
}
