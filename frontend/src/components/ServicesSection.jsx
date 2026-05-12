import ExpandableDetailsSection from "./ExpandableDetailsSection";

const sectionContent = {
  title: "Nuestros servicios",
  text: "Brindamos soluciones de envío pensadas para adaptarse a tus necesidades, con opciones nacionales, internacionales, recolección a domicilio y servicio exprés.",
  image: "/nuestrosServicios.png",
};

const services = [
  {
    id: 1,
    title: "Envíos nacionales",
    meta: "Cobertura en el país",
    description: "Realizamos entregas rápidas y seguras a distintos destinos dentro del país.",
  },
  {
    id: 2,
    title: "Envíos internacionales",
    meta: "Conexión global",
    description: "Llevamos tus envíos al extranjero con un servicio confiable y eficiente.",
  },
  {
    id: 3,
    title: "Recolección a domicilio",
    meta: "Mayor comodidad",
    description: "Recogemos tu paquete en casa o en tu negocio para ahorrarte tiempo.",
  },
  {
    id: 4,
    title: "Servicio exprés",
    meta: "Entrega prioritaria",
    description: "Atendemos envíos urgentes con prioridad para que lleguen lo antes posible.",
  },
];

export default function ServicesSection({ id }) {
  return (
    <ExpandableDetailsSection
      id={id}
      titulo={sectionContent.title}
      texto={sectionContent.text}
      imagen={sectionContent.image}
      items={services}
      expandButtonLabel="Ver servicios"
      collapseButtonLabel="Ocultar"
    />
  );
}
