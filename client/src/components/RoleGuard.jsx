// client/src/components/RoleGuard.jsx
import { Navigate, Outlet } from "react-router-dom";
import Unauthorized from "../pages/public/Unauthorized";

const RoleGuard = ({ allowedRoles }) => {
  // Grab the user data from where you store it upon login
  const user = JSON.parse(localStorage.getItem("user"));

  // 1. If not logged in at all, kick to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. If logged in, but role is not in the allowed array, show the Black Screen
  if (!allowedRoles.includes(user.role)) {
    return <Unauthorized />;
  }

  // 3. If they pass the check, render the child route!
  return <Outlet />;
};

export default RoleGuard;
