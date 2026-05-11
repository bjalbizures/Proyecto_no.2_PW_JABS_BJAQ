import { Link } from "react-router-dom";
import { APP_ROUTES } from "../constants/routes";
import "../styles/navbar.css";

export default function Navbar() {
  return (
    <header className="navbar">
      <img src="/logo.svg" alt="AeroPaq Logo" className="navbar__logo" />

      <nav className="navbar__menu">
        <Link to={APP_ROUTES.HOME}>Inicio</Link>
        <Link to={APP_ROUTES.COTIZADOR} className="navbar__btn">
          Cotizar
        </Link>
      </nav>
    </header>
  );
}
