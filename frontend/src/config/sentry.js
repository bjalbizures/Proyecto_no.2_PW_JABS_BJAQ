import * as Sentry from "@sentry/react";

function readSampleRate(envKey, fallback) {
  const rawValue = import.meta.env[envKey];

  if (rawValue === undefined || rawValue === "") {
    return fallback;
  }

  const parsedValue = Number(rawValue);
  return Number.isFinite(parsedValue) ? parsedValue : fallback;
}

export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;

  if (!dsn) {
    if (import.meta.env.DEV) {
      console.info("Sentry no se inicializo porque falta VITE_SENTRY_DSN.");
    }

    return;
  }

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: true,
      }),
    ],
    tracesSampleRate: readSampleRate("VITE_SENTRY_TRACES_SAMPLE_RATE", 0.2),
    replaysSessionSampleRate: readSampleRate("VITE_SENTRY_REPLAY_SAMPLE_RATE", 0),
    replaysOnErrorSampleRate: readSampleRate("VITE_SENTRY_REPLAY_ERROR_SAMPLE_RATE", 1),
    sendDefaultPii: false,
  });
}

export function setSentryUser(user) {
  if (!user) {
    Sentry.setUser(null);
    return;
  }

  Sentry.setUser({
    id: String(user.id),
    email: user.email,
    username: user.name,
    role: user.role,
  });
}

export function captureLabEvent(extra = {}) {
  Sentry.withScope((scope) => {
    scope.setTag("lab", "10");
    scope.setTag("area", "frontend");
    scope.setContext("laboratorio", {
      herramienta: "Sentry",
      implementacion: "frontend",
      ...extra,
    });
    Sentry.captureMessage("Lab 10 - Evento manual desde el frontend", "info");
  });
}

export function captureLabError(error, extra = {}) {
  Sentry.withScope((scope) => {
    scope.setTag("lab", "10");
    scope.setTag("area", "frontend");
    scope.setContext("laboratorio", {
      herramienta: "Sentry",
      implementacion: "frontend",
      ...extra,
    });
    Sentry.captureException(error);
  });
}
