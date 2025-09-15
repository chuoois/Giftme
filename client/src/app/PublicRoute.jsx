import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "@/hook/auth/AuthProvider";

export const PublicRoute = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const token = localStorage.getItem("admin-user");

  if (loading) return null; 

  if (token || isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
};
