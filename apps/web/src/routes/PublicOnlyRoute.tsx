import { Navigate, Outlet } from "react-router";
import { useAuth } from "../auth/useAuth";
import LoadingSpinner from "../components/ui/LoadingSpinner";

export default function PublicOnlyRoute() {
  const { isAuthLoading, user } = useAuth();

  if (isAuthLoading) {
    return <LoadingSpinner />
  }
  if (user) {
    return <Navigate to="/dashboard" replace />
  }
  return <Outlet />
}
