import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { useEffect, useState } from "react";

/**
 * Usage:
 * <ProtectedRoute roles={["admin", "private_sector"]}>...</ProtectedRoute>
 * If roles is not provided, only authentication is checked.
 */
const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user } = useAuth();
  const [checking, setChecking] = useState(true);
  const [redirect, setRedirect] = useState(null);

  useEffect(() => {
    // Wait for user to be loaded
    if (typeof isAuthenticated === "undefined" || user === null) {
      setChecking(true);
      return;
    }
    setChecking(false);

    if (!isAuthenticated) {
      setRedirect(<Navigate to="/login" replace />);
      return;
    }
    if (roles && roles.length > 0) {
      const userType = user?.user_type;
      if (!roles.includes(userType)) {
        setRedirect(<Navigate to="/forbidden" replace />);
        return;
      }
    }
    setRedirect(null);
  }, [isAuthenticated, user, roles]);

  if (checking) return null;
  if (redirect) return redirect;

  return children;
};

export default ProtectedRoute;
