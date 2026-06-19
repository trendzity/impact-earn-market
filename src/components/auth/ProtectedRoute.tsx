
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { fetchProfile, getUser } from "@/utils/auth";
import { useEffect } from "react";

export const ProtectedRoute = () => {
  const user = getUser();
  const location = useLocation();

    useEffect(() => {
    if (user) {
      // Fetch fresh, verified profile from database and update localStorage
      fetchProfile();
    }
  }, [location.pathname]);


  if (!user) {
    // Not logged in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Admin bypass
  const isAdmin = user?.role === "admin";
  
  if (
  !user.role &&
  !isAdmin &&
  location.pathname !== "/select-role"
) {
  return <Navigate to="/select-role" replace />;
}

  // If they have a role but haven't onboarded yet, send to onboarding
  // We exclude /onboarding from this check to avoid infinite recursion
  if (!isAdmin && !user.onboarded && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
};
