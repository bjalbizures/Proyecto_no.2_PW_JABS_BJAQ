import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { APP_ROUTES } from "../constants/routes";
import "../styles/auth.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login, user } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    const destination = user?.role === "admin"
      ? APP_ROUTES.ADMIN_DASHBOARD
      : APP_ROUTES.CUSTOMER_SHIPMENTS;

    return <Navigate to={destination} replace />;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const session = await login(form);
      const fallbackRoute = session.user.role === "admin"
        ? APP_ROUTES.ADMIN_DASHBOARD
        : APP_ROUTES.CUSTOMER_SHIPMENTS;
      const redirectTo = location.state?.from?.pathname || fallbackRoute;

      navigate(redirectTo, { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-card__header">
          <p className="ui-eyebrow">Acceso</p>
          <h1>Iniciar sesion</h1>
          <p>Entra para gestionar tus envios y consultar tus guias.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Correo electronico
            <input
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Contrasena
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>

          {error && <p className="auth-alert">{error}</p>}

          <button className="ui-button-primary auth-form__submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p className="auth-card__footer">
          No tienes cuenta? <Link to={APP_ROUTES.REGISTER}>Registrate</Link>
        </p>
      </section>
    </main>
  );
}
