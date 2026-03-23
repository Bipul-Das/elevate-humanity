// client/src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  // 1. Check if the user has a "Ticket" (Token)
  const token = localStorage.getItem("token");

  // 2. If no token, kick them back to Login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 3. If token exists, let them pass (Render the child page)
  return <Outlet />;
};

export default ProtectedRoute;
