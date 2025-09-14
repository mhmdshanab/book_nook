import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return null;

  if (!user) return <Navigate to="/login" replace />;

  const userRole = user.role || "user";
  const allowed = roles ? roles.map((r) => String(r).toLowerCase()) : null;

  if (allowed && !allowed.includes(String(userRole).toLowerCase())) {
    return <Navigate to={userRole === "admin" ? "/admin" : "/dashboard"} replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
