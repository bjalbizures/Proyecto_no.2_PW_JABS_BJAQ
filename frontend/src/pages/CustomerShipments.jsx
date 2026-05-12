import { useEffect, useState } from "react";

import { useAuth } from "../hooks/useAuth";
import { api } from "../services/api";
import "../styles/shipments.css";

const INITIAL_FORM = {
  destination: "",
  destinationRegion: "",
  weight: "",
};

const STATUS_LABELS = {
  created: "Creado",
  received: "Recibido",
  in_transit: "En transito",
  ready_for_pickup: "Listo para entrega",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

function formatCurrency(value) {
  return `Q${Number(value || 0).toFixed(2)}`;
}

function formatDate(value) {
  if (!value) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-GT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function CustomerShipments() {
  const { token, user } = useAuth();
  const [shipments, setShipments] = useState([]);
  const [trackingDetail, setTrackingDetail] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTracking, setIsTracking] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadShipments() {
      try {
        const data = await api.listMyShipments(token);

        if (isMounted) {
          setShipments(data.shipments);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadShipments();

    return () => {
      isMounted = false;
    };
  }, [token]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const payload = {
        destination: form.destination.trim(),
        destinationRegion: form.destinationRegion.trim(),
        weight: form.weight ? Number(form.weight) : null,
      };
      const data = await api.createShipment(token, payload);

      setShipments((current) => [data.shipment, ...current]);
      setForm(INITIAL_FORM);
      setSuccess(`Envio creado con guia ${data.shipment.trackingCode}`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleTrack(trackingCode) {
    setError("");
    setSuccess("");
    setIsTracking(trackingCode);

    try {
      const data = await api.trackShipment(trackingCode);
      setTrackingDetail(data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsTracking("");
    }
  }

  return (
    <main className="shipments-page">
      <section className="shipments-shell">
        <div className="shipments-header">
          <div>
            <p className="ui-eyebrow">Cliente</p>
            <h1>Mis envios</h1>
            <p>{user?.fullName}, crea solicitudes y revisa el estado de tus paquetes.</p>
          </div>
        </div>

        <div className="shipments-layout">
          <section className="shipments-panel">
            <div className="shipments-panel__header">
              <h2>Nuevo envio</h2>
              <p>Ingresa el destino para generar una guia.</p>
            </div>

            <form className="shipments-form" onSubmit={handleSubmit}>
              <label>
                Destino
                <input
                  name="destination"
                  type="text"
                  value={form.destination}
                  onChange={handleChange}
                  placeholder="Zona 10, Ciudad de Guatemala"
                  required
                />
              </label>

              <label>
                Region
                <input
                  name="destinationRegion"
                  type="text"
                  value={form.destinationRegion}
                  onChange={handleChange}
                  placeholder="Guatemala"
                />
              </label>

              <label>
                Peso estimado en kg
                <input
                  name="weight"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={form.weight}
                  onChange={handleChange}
                  placeholder="2.5"
                />
              </label>

              {error && <p className="auth-alert">{error}</p>}
              {success && <p className="shipments-success">{success}</p>}

              <button className="ui-button-primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creando..." : "Crear envio"}
              </button>
            </form>
          </section>

          <section className="shipments-panel shipments-panel--list">
            <div className="shipments-panel__header">
              <h2>Listado</h2>
              <p>{shipments.length} envios registrados.</p>
            </div>

            {isLoading ? (
              <p className="shipments-empty">Cargando envios...</p>
            ) : shipments.length === 0 ? (
              <p className="shipments-empty">Todavia no tienes envios creados.</p>
            ) : (
              <div className="shipments-list">
                {shipments.map((shipment) => (
                  <article className="shipment-item" key={shipment.id}>
                    <div className="shipment-item__main">
                      <div>
                        <p className="shipment-item__code">{shipment.trackingCode}</p>
                        <h3>{shipment.destination}</h3>
                      </div>
                      <span className={`shipment-status shipment-status--${shipment.status}`}>
                        {STATUS_LABELS[shipment.status] || shipment.status}
                      </span>
                    </div>

                    <dl className="shipment-meta">
                      <div>
                        <dt>Fecha</dt>
                        <dd>{formatDate(shipment.createdAt)}</dd>
                      </div>
                      <div>
                        <dt>Region</dt>
                        <dd>{shipment.destinationRegion || "Sin region"}</dd>
                      </div>
                      <div>
                        <dt>Costo</dt>
                        <dd>{formatCurrency(shipment.estimatedCost)}</dd>
                      </div>
                    </dl>

                    <button
                      className="shipments-link-button"
                      type="button"
                      onClick={() => handleTrack(shipment.trackingCode)}
                      disabled={isTracking === shipment.trackingCode}
                    >
                      {isTracking === shipment.trackingCode ? "Consultando..." : "Ver rastreo"}
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        {trackingDetail && (
          <section className="shipments-panel tracking-panel">
            <div className="shipments-panel__header">
              <p className="ui-eyebrow">Rastreo</p>
              <h2>{trackingDetail.shipment.trackingCode}</h2>
              <p>{trackingDetail.shipment.destination}</p>
            </div>

            <ol className="tracking-events">
              {trackingDetail.events.map((event) => (
                <li key={event.id}>
                  <span>{STATUS_LABELS[event.status] || event.status}</span>
                  <p>{event.description || "Actualizacion del envio"}</p>
                  <small>{event.location || "Ubicacion pendiente"} · {formatDate(event.createdAt)}</small>
                </li>
              ))}
            </ol>
          </section>
        )}
      </section>
    </main>
  );
}
