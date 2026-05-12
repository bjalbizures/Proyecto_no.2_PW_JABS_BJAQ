import { useState } from "react";
import "../styles/contacto.css";

const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

const initialValues = {
  nombre: "",
  correo: "",
  telefono: "",
  mensaje: "",
};

function validateField(name, value) {
  const trimmedValue = value.trim();

  if (name === "nombre") {
    if (!trimmedValue) {
      return "Ingresa tu nombre.";
    }

    if (trimmedValue.length < 2) {
      return "Tu nombre debe tener al menos 2 caracteres.";
    }
  }

  if (name === "correo") {
    if (!trimmedValue) {
      return "Ingresa tu correo.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) {
      return "Ingresa un correo valido.";
    }
  }

  if (name === "telefono") {
    if (!trimmedValue) {
      return "Ingresa tu telefono.";
    }

    if (!/^[\d+\s()-]{8,20}$/.test(trimmedValue)) {
      return "Ingresa un telefono valido.";
    }
  }

  if (name === "mensaje") {
    if (!trimmedValue) {
      return "Escribe tu mensaje.";
    }

    if (trimmedValue.length < 10) {
      return "Tu mensaje debe tener al menos 10 caracteres.";
    }
  }

  return "";
}

function validateForm(values) {
  return Object.keys(values).reduce((errors, field) => {
    const error = validateField(field, values[field]);

    if (error) {
      errors[field] = error;
    }

    return errors;
  }, {});
}

export default function Contacto() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  function handleChange(event) {
    const { name, value } = event.target;

    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: validateField(name, value),
    }));
  }

  function handleBlur(event) {
    const { name, value } = event.target;

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: validateField(name, value),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validateForm(values);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setFeedback({
        type: "error",
        message: "Revisa los campos marcados antes de enviar.",
      });
      return;
    }

    if (!GOOGLE_SCRIPT_URL) {
      setFeedback({
        type: "error",
        message: "No pudimos enviar tu mensaje en este momento.",
      });
      return;
    }

    const formData = new URLSearchParams({
      nombre: values.nombre.trim(),
      correo: values.correo.trim(),
      telefono: values.telefono.trim(),
      mensaje: values.mensaje.trim(),
    });

    setFeedback({ type: "", message: "" });
    setIsSubmitting(true);

    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: formData.toString(),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "No se pudo guardar el formulario.");
      }

      setFeedback({
        type: "success",
        message: "Formulario enviado correctamente.",
      });
      setValues(initialValues);
      setErrors({});
    } catch {
      setFeedback({
        type: "error",
        message: "No pudimos enviar tu mensaje. Intenta de nuevo.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="contacto" id="contacto">
      <h2>Contactanos</h2>
      <p>Dejanos tus datos y tu mensaje.</p>

      <form className="contacto__form" onSubmit={handleSubmit} noValidate>
        <div className="contacto__field">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={values.nombre}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(errors.nombre)}
          />
          {errors.nombre ? (
            <p className="contacto__error">{errors.nombre}</p>
          ) : null}
        </div>

        <div className="contacto__field">
          <input
            type="email"
            name="correo"
            placeholder="Correo"
            value={values.correo}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(errors.correo)}
          />
          {errors.correo ? (
            <p className="contacto__error">{errors.correo}</p>
          ) : null}
        </div>

        <div className="contacto__field">
          <input
            type="text"
            name="telefono"
            placeholder="Telefono"
            value={values.telefono}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(errors.telefono)}
          />
          {errors.telefono ? (
            <p className="contacto__error">{errors.telefono}</p>
          ) : null}
        </div>

        <div className="contacto__field">
          <textarea
            name="mensaje"
            placeholder="Mensaje"
            value={values.mensaje}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(errors.mensaje)}
          />
          {errors.mensaje ? (
            <p className="contacto__error">{errors.mensaje}</p>
          ) : null}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Enviar"}
        </button>

        {feedback.message ? (
          <p
            className={`contacto__feedback contacto__feedback--${feedback.type}`}
          >
            {feedback.message}
          </p>
        ) : null}
      </form>
    </div>
  );
}
