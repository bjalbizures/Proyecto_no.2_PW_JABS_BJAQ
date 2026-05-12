import ExpandableInfoSection from "./ExpandableInfoSection";
import "../styles/expandable-details-section.css";

function DetailCard({ title, meta, description }) {
  return (
    <article className="expandable-details-section__card">
      <div className="expandable-details-section__header">
        <h4 className="expandable-details-section__title">{title}</h4>
        {meta ? <p className="expandable-details-section__meta">{meta}</p> : null}
      </div>
      <p className="expandable-details-section__description">{description}</p>
    </article>
  );
}

export default function ExpandableDetailsSection({
  id,
  titulo,
  texto,
  imagen,
  reverse = false,
  expandButtonLabel,
  collapseButtonLabel = "Ocultar",
  items,
}) {
  const expandedContent = (
    <div className="expandable-details-section__grid">
      {items.map((item) => (
        <DetailCard
          key={item.id}
          title={item.title}
          meta={item.meta}
          description={item.description}
        />
      ))}
    </div>
  );

  return (
    <ExpandableInfoSection
      id={id}
      titulo={titulo}
      texto={texto}
      imagen={imagen}
      reverse={reverse}
      expandButtonLabel={expandButtonLabel}
      collapseButtonLabel={collapseButtonLabel}
      expandedContent={expandedContent}
    />
  );
}
