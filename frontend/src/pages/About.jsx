import "../styles/about.css";
import BenefitItem from "../components/BenefitItem";

export default function About() {
  const historia = [
    {
      id: 1,
      titulo: "Cómo comenzó todo",
      contenido:
        "AeroPaq nació con el propósito de hacer los envíos más simples, seguros y accesibles. Lo que inició como un proyecto enfocado en atender entregas locales fue creciendo gracias a la confianza de clientes que buscaban un servicio cercano y confiable.",
    },
    {
      id: 2,
      titulo: "Crecimiento de la operación",
      contenido:
        "Con el paso del tiempo, ampliamos nuestra cobertura a más ciudades y fortalecimos nuestros procesos logísticos para responder de mejor manera a las necesidades de personas, emprendimientos y negocios.",
    },
    {
      id: 3,
      titulo: "Impulso digital",
      contenido:
        "La incorporación de herramientas digitales nos permitió agilizar la gestión de envíos, mejorar el seguimiento de paquetes y ofrecer una experiencia más práctica, transparente y eficiente para nuestros clientes.",
    },
    {
      id: 4,
      titulo: "AeroPaq hoy",
      contenido:
        "Actualmente, seguimos creciendo con una visión clara: conectar envíos dentro del país y hacia Centroamérica y México, manteniendo un servicio confiable, humano y orientado a la mejora continua.",
    },
  ];

  const identidad = [
    {
      id: 1,
      etiqueta: "Misión",
      titulo: "Hacer los envíos más simples y confiables",
      contenido:
        "Brindamos soluciones logísticas accesibles, seguras y eficientes para conectar personas, familias y negocios en cada entrega. Nos enfocamos en ofrecer atención cercana, procesos claros y una experiencia confiable de principio a fin.",
    },
    {
      id: 2,
      etiqueta: "Visión",
      titulo: "Ser un aliado logístico de confianza",
      contenido:
        "Queremos seguir fortaleciendo nuestra presencia con un servicio moderno, transparente y eficiente, ampliando nuestra cobertura y consolidándonos como una opción confiable para envíos nacionales y regionales.",
    },
  ];

  const valores = [
    "Confianza en cada envío",
    "Compromiso con el cliente",
    "Mejora continua",
    "Responsabilidad en cada entrega",
    "Innovación en el servicio",
  ];

  const beneficios = [
    {
      id: 1,
      icon: "✓",
      titulo: "Atención confiable",
      descripcion:
        "Acompañamos cada envío con un servicio cercano y orientado a brindar tranquilidad.",
    },
    {
      id: 2,
      icon: "✓",
      titulo: "Cobertura amplia",
      descripcion:
        "Llegamos a distintos puntos del país y contamos con alcance hacia Centroamérica y México.",
    },
    {
      id: 3,
      icon: "✓",
      titulo: "Seguimiento del envío",
      descripcion:
        "Facilitamos el control del proceso para que puedas conocer el estado de tu paquete.",
    },
    {
      id: 4,
      icon: "✓",
      titulo: "Soluciones flexibles",
      descripcion:
        "Ofrecemos opciones adaptadas a diferentes necesidades de envío, desde documentos hasta carga.",
    },
  ];

  return (
    <div className="about-page">
      <div className="about-header">
        <h1>Nuestra historia</h1>
        <p>Conectamos personas, negocios y destinos a través de cada envío.</p>
      </div>

      <div className="about-grid">
        {historia.map((item) => (
          <div key={item.id} className="about-card">
            <div className="about-card__header">
              <span className="about-card__number">{item.id}</span>
              <h3>{item.titulo}</h3>
            </div>
            <p className="about-card__content">{item.contenido}</p>
          </div>
        ))}
      </div>

      <section className="about-identity">
        <div className="about-identity__intro">
          <h2>Lo que define a AeroPaq</h2>
          <p>
            Nuestra misión y visión reflejan la forma en que trabajamos,
            tomamos decisiones y construimos relaciones de confianza con cada
            cliente.
          </p>
        </div>

        <div className="about-identity__grid">
          {identidad.map((item) => (
            <article key={item.id} className="about-identity__card">
              <span className="about-identity__label">{item.etiqueta}</span>
              <h3>{item.titulo}</h3>
              <p>{item.contenido}</p>
            </article>
          ))}
        </div>

        <div className="about-values">
          <h3>Nuestros valores</h3>
          <p>
            Estos principios orientan la forma en que trabajamos con nuestros
            clientes, aliados y cada entrega que forma parte de AeroPaq.
          </p>
          <div className="about-values__list">
            {valores.map((valor) => (
              <span key={valor} className="about-values__item">
                {valor}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="about-footer">
        <h2>¿Por qué elegir AeroPaq?</h2>
        <div className="about-benefits">
          {beneficios.map((beneficio) => (
            <BenefitItem
              key={beneficio.id}
              icon={beneficio.icon}
              title={beneficio.titulo}
              description={beneficio.descripcion}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
