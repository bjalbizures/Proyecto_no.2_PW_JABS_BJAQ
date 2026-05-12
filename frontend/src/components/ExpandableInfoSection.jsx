import { useState } from "react";
import "../styles/expandable-info-section.css";

export default function ExpandableInfoSection({
  id,
  titulo,
  texto,
  imagen,
  reverse = false,
  expandButtonLabel = "Ver más",
  collapseButtonLabel = "Ocultar",
  expandedContent,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  return (
    <section
      className={`expandable-info-section ${reverse ? "reverse" : ""} ${
        isExpanded ? "is-expanded" : ""
      }`}
      id={id}
    >
      {/* TARJETA PRINCIPAL */}
      <div className={`expandable-info-section__card ${isExpanded ? "expanded" : ""}`}>
        <div className="expandable-info-section__media">
          <img src={imagen} alt={titulo} className="expandable-info-section__image" />
        </div>

        <div className="expandable-info-section__content">
          <div className="expandable-info-section__text">
            <h2>{titulo}</h2>
            <p>{texto}</p>
          </div>

          {/* BOTÓN EXPANDIR CENTRADO */}
          <button
            className="expandable-info-section__expand-btn"
            onClick={toggleExpanded}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                toggleExpanded();
              }
            }}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? collapseButtonLabel : expandButtonLabel}
          >
            <span className="expandable-info-section__expand-text">
              {isExpanded ? collapseButtonLabel : expandButtonLabel}
            </span>
            <svg
              className="expandable-info-section__expand-icon"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        </div>
      </div>

      {/* CONTENEDOR EXPANDIBLE */}
      {expandedContent && (
        <div className="expandable-info-section__expanded-zone">
          <div className="expandable-info-section__expanded-inner">{expandedContent}</div>
        </div>
      )}
    </section>
  );
}
