
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getUser } from "@/utils/auth";

export const ProtectedRoute = () => {
  const user = getUser();
  const location = useLocation();

  if (!user) {
    // Not logged in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Admin bypass
  const isAdmin = user.email === "admintrendzity@gmail.com";
  
  if (!user.role && !isAdmin) {
    // Logged in but no role selected
    return <Navigate to="/select-role" replace />;
  }

  // If they have a role but haven't onboarded yet, send to onboarding
  // We exclude /onboarding from this check to avoid infinite recursion
  if (!isAdmin && !user.onboarded && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
};
