import "../styles/faq.css";

export default function Faq() {
  const faqs = [
    {
      id: 1,
      pregunta: "¿Cuáles son los tiempos de entrega disponibles?",
      respuesta: "Ofrecemos tres opciones de envío: Estándar (2-4 días), Expresado (1-2 días) e Internacional (5-10 días según destino). Los tiempos pueden variar según la zona de cobertura y disponibilidad."
    },
    {
      id: 2,
      pregunta: "¿Cuánto cuesta enviar un paquete?",
      respuesta: "El costo depende del peso, dimensiones del paquete, tipo de caja seleccionada, origen y destino del envío. Usa nuestro cotizador para obtener un presupuesto exacto según tus necesidades específicas."
    },
    {
      id: 3,
      pregunta: "¿En qué ciudades tienen cobertura?",
      respuesta: "Contamos con cobertura en las principales ciudades del país y destinos internacionales. Verifica la disponibilidad en tu zona al momento de cotizar o contactanos para consultar sobre zonas específicas."
    },
    {
      id: 4,
      pregunta: "¿Puedo asegurar mi paquete?",
      respuesta: "Sí, ofrecemos un servicio de seguro adicional que cubre pérdidas o daños durante el transporte. El costo es variable según el valor declarado del envío."
    },
    {
      id: 5,
      pregunta: "¿Cuál es el peso máximo permitido?",
      respuesta: "Pueden enviarse paquetes de hasta 30 kg en el servicio estándar. Para paquetes más pesados, contáctanos para soluciones especiales de logística."
    },
    {
      id: 6,
      pregunta: "¿Ofrecen servicio de recolección a domicilio?",
      respuesta: "Sí, disponemos de servicio de recolección puerta a puerta con un costo adicional. Este servicio es ideal si no tienes disponibilidad para llevar tu paquete a nuestras sucursales."
    },
    {
      id: 7,
      pregunta: "¿Cómo puedo rastrear mi paquete?",
      respuesta: "Al realizar tu envío, recibirás un código de seguimiento que podrás usar en nuestra plataforma para rastrear tu paquete en tiempo real desde su recolección hasta la entrega."
    },
    {
      id: 8,
      pregunta: "¿Qué tipos de cajas están disponibles?",
      respuesta: "Disponemos de 4 tamaños de cajas: Pequeña, Mediana, Grande y Extra grande. Cada una tiene un factor de costo diferente según su capacidad de volumen."
    },
    {
      id: 9,
      pregunta: "¿Puedo enviar internacionalmente?",
      respuesta: "Sí, ofrecemos envíos internacionales a múltiples destinos con tiempos y costos variables. Contactanos para conocer los países disponibles y los requisitos de documentación."
    },
    {
      id: 10,
      pregunta: "¿Qué sucede si el paquete llega dañado?",
      respuesta: "Si tu paquete llega dañado, reportalo dentro de 48 horas con fotos del daño. Nuestro equipo evaluará el caso y procederá según corresponda con tu reclamo de seguro."
    },
    {
      id: 11,
      pregunta: "¿Cuáles son los horarios de atención?",
      respuesta: "Nuestras sucursales atienden de lunes a viernes de 8:00 AM a 6:00 PM y sábados de 9:00 AM a 2:00 PM. Los domingos estamos cerrados."
    },
    {
      id: 12,
      pregunta: "¿Puedo cambiar mi envío después de cotizar?",
      respuesta: "Sí, puedes modificar los detalles de tu cotización (peso, caja, destino) antes de confirmar el envío. Una vez que confirmes, contacta a nuestro servicio al cliente para cambios posteriores."
    }
  ];

  return (
    <main className="faq-page">
      <div className="faq-header">
        <h1>Preguntas Frecuentes</h1>
        <p>Encuentra respuestas a las preguntas más comunes sobre nuestros servicios de envío</p>
      </div>

      <div className="faq-list">
        {faqs.map((faq) => (
          <div key={faq.id} className="faq-item">
            <div className="faq-question">{faq.pregunta}</div>
            <div className="faq-answer">{faq.respuesta}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
