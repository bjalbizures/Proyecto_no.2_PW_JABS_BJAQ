import { Link } from "react-router-dom";
import { APP_ROUTES } from "../constants/routes";
import { useAuth } from "../hooks/useAuth";
import "../styles/navbar.css";

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <header className="navbar">
      <img src="/logo.svg" alt="AeroPaq Logo" className="navbar__logo" />

      <nav className="navbar__menu">
        <Link to={APP_ROUTES.HOME}>Inicio</Link>
        <Link to={APP_ROUTES.COTIZADOR} className="navbar__btn">
          Cotizar
        </Link>
        {isAuthenticated ? (
          <>
            <Link to={user?.role === "admin" ? APP_ROUTES.ADMIN_DASHBOARD : APP_ROUTES.CUSTOMER_SHIPMENTS}>
              {user?.role === "admin" ? "Panel" : "Mis envios"}
            </Link>
            <button className="navbar__link-button" type="button" onClick={logout}>
              Salir
            </button>
          </>
        ) : (
          <Link to={APP_ROUTES.LOGIN}>Ingresar</Link>
        )}
      </nav>
    </header>
  );
}
