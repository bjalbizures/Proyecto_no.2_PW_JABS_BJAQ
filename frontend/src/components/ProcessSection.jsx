import ExpandableDetailsSection from "./ExpandableDetailsSection";

const sectionContent = {
  title: "¿Cómo funciona?",
  text: "El proceso es simple: coordinas tu envío, realizamos la recolección, despachamos el paquete y damos seguimiento hasta su entrega final.",
  image: "/comoFunciona.png",
};

const processSteps = [
  {
    id: 1,
    title: "Solicitud del envío",
    meta: "Paso 1",
    description:
      "Registras la información del remitente, destinatario, tipo de paquete y modalidad de entrega para iniciar el proceso.",
  },
  {
    id: 2,
    title: "Recolección y verificación",
    meta: "Paso 2",
    description:
      "Recogemos el paquete en tu domicilio o lo recibimos en sucursal, verificando que esté listo para su envío.",
  },
  {
    id: 3,
    title: "Clasificación y despacho",
    meta: "Paso 3",
    description:
      "Organizamos el envío según su destino y prioridad para asignarlo a la ruta más adecuada y segura.",
  },
  {
    id: 4,
    title: "Seguimiento y entrega",
    meta: "Paso 4",
    description:
      "Puedes consultar el estado de tu paquete durante el trayecto hasta que sea entregado en su destino final.",
  },
];

export default function ProcessSection({ id, reverse }) {
  return (
    <ExpandableDetailsSection
      id={id}
      titulo={sectionContent.title}
      texto={sectionContent.text}
      imagen={sectionContent.image}
      reverse={reverse}
      items={processSteps}
      expandButtonLabel="Ver proceso completo"
      collapseButtonLabel="Ocultar"
    />
  );
}
