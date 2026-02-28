import { Navigate, Outlet, } from "react-router";
import { useAuth } from "../auth/useAuth"
import { Loader } from "lucide-react";

export default function ProtectedRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="mx-auto text-center">{<Loader size={12} className="animate-spin mx-auto" />}</div>
  }

  if (!loading && !user) {
    return <Navigate to="/auth/login" replace />
  }
  return <Outlet />
}
