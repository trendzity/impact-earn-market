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

  // Logged in → allow access
  return <Outlet />;
};