import { useState } from "react";

import { captureLabError, captureLabEvent } from "../config/sentry";
import "../styles/sentry-lab.css";

export default function SentryLab() {
  const [status, setStatus] = useState("");

  function handleCaptureEvent() {
    captureLabEvent({
      origin: "sentry-lab-page",
      timestamp: new Date().toISOString(),
    });
    setStatus("Evento enviado. Revisa el dashboard de Sentry en Issues o Discover.");
  }

  function handleThrowError() {
    const error = new Error("Lab 10 - Error de prueba capturado desde React frontend");

    captureLabError(error, {
      origin: "sentry-lab-page",
      timestamp: new Date().toISOString(),
    });

    throw error;
  }

  return (
    <main className="sentry-lab">
      <section className="sentry-lab__panel ui-card">
        <p className="ui-eyebrow">Laboratorio 10</p>
        <h1>Prueba de monitorizacion con Sentry</h1>
        <p>
          Esta vista permite generar eventos controlados desde el frontend para
          documentar la integracion en el dashboard de Sentry.
        </p>

        <div className="sentry-lab__actions">
          <button className="ui-button-primary" type="button" onClick={handleCaptureEvent}>
            Enviar evento
          </button>
          <button className="ui-button-dark" type="button" onClick={handleThrowError}>
            Generar error
          </button>
        </div>

        {status && <p className="sentry-lab__status">{status}</p>}
      </section>
    </main>
  );
}
