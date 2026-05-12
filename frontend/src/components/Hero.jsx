import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="hero" id="inicio">
      <img src="/main.png" alt="Envíos AeroPaq" className="hero__image" />

      <div className="hero__content">
        <h1>Envíos rápidos y seguros</h1>
        <p>
          AeroPaq te ayuda a gestionar tus envíos nacionales e internacionales
          de forma rápida, segura y confiable.
        </p>

        <Link to="/cotizador" className="hero__button">
          Cotizar
        </Link>
      </div>
    </section>
  );
}
