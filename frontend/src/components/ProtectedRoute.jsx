import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { APP_ROUTES } from "../constants/routes";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, isCheckingSession, user } = useAuth();
  const location = useLocation();

  if (isCheckingSession) {
    return (
      <main className="auth-page">
        <section className="auth-card">
          <p>Validando sesion...</p>
        </section>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={APP_ROUTES.LOGIN} replace state={{ from: location }} />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(user?.role)) {
    return <Navigate to={APP_ROUTES.CUSTOMER_SHIPMENTS} replace />;
  }

  return children;
}
