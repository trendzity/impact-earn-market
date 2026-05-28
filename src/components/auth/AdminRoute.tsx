import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getUser } from "@/utils/auth";

/**
 * Admin-only route guard.
 *
 * Notes:
 * - This is a FRONTEND guard only. Backend must still enforce admin authorization.
 * - We keep a small email allowlist fallback to avoid accidental lockout if role
 *   casing/mapping is inconsistent across environments.
 */
export function AdminRoute() {
  const user = getUser();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const role = user.role?.toLowerCase();
  const adminEmails = new Set([
    "admin@trendzity.com",
    "admintrendzity@gmail.com",
  ]);

  const isAdmin = role === "admin" || adminEmails.has(user.email?.toLowerCase?.() || user.email);

  if (!isAdmin) {
    // Logged in but not authorized for admin UI
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

