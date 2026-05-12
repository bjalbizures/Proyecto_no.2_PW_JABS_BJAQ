import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { APP_ROUTES } from "../constants/routes";
import "../styles/auth.css";

const INITIAL_FORM = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  password: "",
};

export default function Register() {
  const navigate = useNavigate();
  const { isAuthenticated, register, user } = useAuth();
  const [form, setForm] = useState(INITIAL_FORM);
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
      await register(form);
      navigate(APP_ROUTES.CUSTOMER_SHIPMENTS, { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card auth-card--wide">
        <div className="auth-card__header">
          <p className="ui-eyebrow">Registro</p>
          <h1>Crear cuenta</h1>
          <p>Guarda tus datos para solicitar envios y consultar tus paquetes.</p>
        </div>

        <form className="auth-form auth-form--grid" onSubmit={handleSubmit}>
          <label>
            Nombre completo
            <input
              name="fullName"
              type="text"
              autoComplete="name"
              value={form.fullName}
              onChange={handleChange}
              required
            />
          </label>

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
            Telefono
            <input
              name="phone"
              type="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Direccion
            <input
              name="address"
              type="text"
              autoComplete="street-address"
              value={form.address}
              onChange={handleChange}
              required
            />
          </label>

          <label className="auth-form__full">
            Contrasena
            <input
              name="password"
              type="password"
              autoComplete="new-password"
              minLength="8"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>

          {error && <p className="auth-alert auth-form__full">{error}</p>}

          <button className="ui-button-primary auth-form__submit auth-form__full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <p className="auth-card__footer">
          Ya tienes cuenta? <Link to={APP_ROUTES.LOGIN}>Inicia sesion</Link>
        </p>
      </section>
    </main>
  );
}
