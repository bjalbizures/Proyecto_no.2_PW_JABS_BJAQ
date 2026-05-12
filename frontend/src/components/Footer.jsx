import { NavLink } from "react-router-dom";
import { APP_ROUTES } from "../constants/routes";
import "../styles/footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-links">
        <NavLink
          className={({ isActive }) => `footer-link${isActive ? " footer-link--active" : ""}`}
          to={APP_ROUTES.CONTACTO}
        >
          Contacto
        </NavLink>
        <NavLink
          className={({ isActive }) => `footer-link${isActive ? " footer-link--active" : ""}`}
          to={APP_ROUTES.FAQ}
        >
          Preguntas frecuentes
        </NavLink>
        <NavLink
          className={({ isActive }) => `footer-link${isActive ? " footer-link--active" : ""}`}
          to={APP_ROUTES.ABOUT}
        >
          Sobre nosotros
        </NavLink>
      </div>
    </footer>
  );
}

export default Footer;
