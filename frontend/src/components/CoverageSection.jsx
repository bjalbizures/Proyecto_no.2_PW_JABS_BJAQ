import ExpandableDetailsSection from "./ExpandableDetailsSection";

const sectionContent = {
  title: "Cobertura",
  text: "Contamos con cobertura en distintas ciudades y departamentos del país, además de envíos hacia Centroamérica y México, para brindarte un servicio confiable y de amplio alcance.",
  image: "/cobertura.png",
};

const coverageAreas = [
  {
    id: 1,
    title: "Zona urbana",
    meta: "Ciudades principales",
    description: "Tenemos presencia en las principales ciudades del país para ofrecer entregas rápidas y seguras.",
  },
  {
    id: 2,
    title: "Zona rural",
    meta: "Sectores remotos",
    description: "Extendemos nuestro servicio a municipios y comunidades para acercar tus envíos a más destinos.",
  },
  {
    id: 3,
    title: "Centroamérica y México",
    meta: "Cobertura regional",
    description: "Conectamos tus envíos con distintos destinos de Centroamérica y México mediante un servicio confiable y eficiente.",
  },
  {
    id: 4,
    title: "Logística especial",
    meta: "Documentos y carga",
    description: "Ofrecemos soluciones adaptadas para envíos que requieren un manejo más específico.",
  },
];

export default function CoverageSection({ id, reverse }) {
  return (
    <ExpandableDetailsSection
      id={id}
      titulo={sectionContent.title}
      texto={sectionContent.text}
      imagen={sectionContent.image}
      reverse={reverse}
      items={coverageAreas}
      expandButtonLabel="Ver cobertura"
      collapseButtonLabel="Ocultar"
    />
  );
}