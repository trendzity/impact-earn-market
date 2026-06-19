import { Navigate, Outlet } from "react-router-dom";
import { getUser } from "@/utils/auth";

/**
 * AuthOnlyRoute
 *
 * Allows:
 * - logged-in users
 *
 * Does NOT require:
 * - onboarding
 * - role selection
 *
 * Used for:
 * - /select-role
 * - onboarding preparation flows
 */

export const AuthOnlyRoute = () => {
  const user = getUser();

  
  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Already onboarded → redirect to their dashboard
  if (user.onboarded && user.role) {
    const role = user.role.toLowerCase();
    if (role === "admin") return <Navigate to="/admin" replace />;
    if (role === "general" || role === "user") return <Navigate to="/dashboard" replace />;
    return <Navigate to={`/${role}`} replace />;
  }

  // Logged in but not onboarded → allow access to role selection / onboarding
  return <Outlet />;

};