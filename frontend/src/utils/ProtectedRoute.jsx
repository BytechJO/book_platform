import { Navigate } from "react-router-dom";
import AccessDenied from "../pages/AccessDenied";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <AccessDenied />;
  }

  return children;
}
