import { useState } from "react";
import "../styles/cotizador.css";

const FACTOR_VOLUMETRICO = Number(import.meta.env.VITE_FACTOR_VOLUMETRICO) || 5000;

const UBICACIONES = [
  { value: "misma-ciudad", label: "Misma ciudad" },
  { value: "otro-departamento", label: "Otro departamento" },
  { value: "internacional", label: "Internacional" },
];

const PAISES_COBERTURA = [
  "Belice",
  "Costa Rica",
  "El Salvador",
  "Guatemala",
  "Honduras",
  "Mexico",
  "Nicaragua",
  "Panama",
];

const CAJAS = [
  {
    nombre: "Pequena",
    factor: 1,
    descripcion: "Ideal para paquetes livianos y pequenos",
  },
  {
    nombre: "Mediana",
    factor: 1.2,
    descripcion: "Para articulos de tamano medio",
  },
  {
    nombre: "Grande",
    factor: 1.5,
    descripcion: "Para paquetes mas amplios",
  },
  {
    nombre: "Extra grande",
    factor: 2,
    descripcion: "Para articulos voluminosos",
  },
];

function obtenerEtiquetaUbicacion(valor) {
  return UBICACIONES.find((ubicacion) => ubicacion.value === valor)?.label || valor;
}

function crearPaquete(id) {
  return {
    id,
    peso: "",
    caja: "",
    largo: "",
    ancho: "",
    alto: "",
  };
}

function obtenerTarifaRuta(origen, destino) {
  const rutas = {
    "misma-ciudad:misma-ciudad": {
      base: 15,
      distancia: 5,
      estandar: "1 a 2 dias",
      expres: "24 horas",
    },
    "misma-ciudad:otro-departamento": {
      base: 18,
      distancia: 12,
      estandar: "2 a 4 dias",
      expres: "1 a 2 dias",
    },
    "otro-departamento:misma-ciudad": {
      base: 18,
      distancia: 12,
      estandar: "2 a 4 dias",
      expres: "1 a 2 dias",
    },
    "otro-departamento:otro-departamento": {
      base: 20,
      distancia: 15,
      estandar: "2 a 4 dias",
      expres: "1 a 2 dias",
    },
    "misma-ciudad:internacional": {
      base: 35,
      distancia: 45,
      estandar: "5 a 9 dias",
      expres: "3 a 5 dias",
    },
    "otro-departamento:internacional": {
      base: 40,
      distancia: 50,
      estandar: "5 a 10 dias",
      expres: "3 a 6 dias",
    },
    "internacional:misma-ciudad": {
      base: 35,
      distancia: 45,
      estandar: "5 a 9 dias",
      expres: "3 a 5 dias",
    },
    "internacional:otro-departamento": {
      base: 40,
      distancia: 50,
      estandar: "5 a 10 dias",
      expres: "3 a 6 dias",
    },
    "internacional:internacional": {
      base: 55,
      distancia: 65,
      estandar: "6 a 10 dias",
      expres: "4 a 7 dias",
    },
  };

  return (
    rutas[`${origen}:${destino}`] || {
      base: 20,
      distancia: 15,
      estandar: "2 a 4 dias",
      expres: "1 a 2 dias",
    }
  );
}

function parsePositiveNumber(value) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

function formatCurrency(value) {
  return `Q${value.toFixed(2)}`;
}

function calcularPesoFacturable(paquete) {
  const pesoReal = parsePositiveNumber(paquete.peso) || 0;
  const largo = parsePositiveNumber(paquete.largo);
  const ancho = parsePositiveNumber(paquete.ancho);
  const alto = parsePositiveNumber(paquete.alto);

  if (!largo && !ancho && !alto) {
    return pesoReal;
  }

  if (!largo || !ancho || !alto) {
    return pesoReal;
  }

  const pesoVolumetrico = (largo * ancho * alto) / FACTOR_VOLUMETRICO;
  return Math.max(pesoReal, pesoVolumetrico);
}

function validarCotizacion({
  origen,
  destino,
  origenPais,
  destinoPais,
  servicio,
  paquetes,
}) {
  const errores = {};

  if (!origen) {
    errores.origen = "Selecciona el origen del envio.";
  }

  if (!destino) {
    errores.destino = "Selecciona el destino del envio.";
  }

  if (origen === "internacional" && !origenPais) {
    errores.origenPais = "Selecciona el pais de origen.";
  }

  if (destino === "internacional" && !destinoPais) {
    errores.destinoPais = "Selecciona el pais de destino.";
  }

  if (!servicio) {
    errores.servicio = "Selecciona un nivel de servicio.";
  }

  const erroresPaquetes = paquetes.map((paquete) => {
    const errorPaquete = {};
    const peso = parsePositiveNumber(paquete.peso);
    const dimensiones = [paquete.largo, paquete.ancho, paquete.alto].map((valor) =>
      valor.trim()
    );
    const dimensionesConValor = dimensiones.filter(Boolean).length;

    if (!peso) {
      errorPaquete.peso = "Ingresa un peso valido mayor a 0.";
    }

    if (!paquete.caja) {
      errorPaquete.caja = "Selecciona un tamano de caja.";
    }

    if (dimensionesConValor > 0 && dimensionesConValor < 3) {
      errorPaquete.dimensiones =
        "Si ingresas dimensiones, completa largo, ancho y alto.";
    }

    if (dimensionesConValor === 3) {
      if (!parsePositiveNumber(paquete.largo)) {
        errorPaquete.largo = "Ingresa un largo valido.";
      }

      if (!parsePositiveNumber(paquete.ancho)) {
        errorPaquete.ancho = "Ingresa un ancho valido.";
      }

      if (!parsePositiveNumber(paquete.alto)) {
        errorPaquete.alto = "Ingresa un alto valido.";
      }
    }

    return errorPaquete;
  });

  if (erroresPaquetes.some((paquete) => Object.keys(paquete).length > 0)) {
    errores.paquetes = erroresPaquetes;
  }

  return errores;
}

function Cotizador() {
  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("");
  const [origenPais, setOrigenPais] = useState("");
  const [destinoPais, setDestinoPais] = useState("");
  const [servicio, setServicio] = useState("");
  const [extras, setExtras] = useState({
    recoleccion: false,
    seguro: false,
  });
  const [paquetes, setPaquetes] = useState([crearPaquete(1)]);
  const [errores, setErrores] = useState({});
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [resultado, setResultado] = useState(null);

  const actualizarPaquete = (id, campo, valor) => {
    setPaquetes((actuales) =>
      actuales.map((paquete) =>
        paquete.id === id ? { ...paquete, [campo]: valor } : paquete
      )
    );

    setErrores((actuales) => {
      if (!actuales.paquetes) {
        return actuales;
      }

      return {
        ...actuales,
        paquetes: actuales.paquetes.map((errorPaquete, index) =>
          paquetes[index]?.id === id ? { ...errorPaquete, [campo]: "" } : errorPaquete
        ),
      };
    });
  };

  const agregarPaquete = () => {
    setPaquetes((actuales) => [...actuales, crearPaquete(Date.now())]);
  };

  const eliminarPaquete = (id) => {
    if (paquetes.length === 1) {
      return;
    }

    setPaquetes((actuales) => actuales.filter((paquete) => paquete.id !== id));
    setErrores((actuales) => {
      if (!actuales.paquetes) {
        return actuales;
      }

      return {
        ...actuales,
        paquetes: actuales.paquetes.filter((_, index) => paquetes[index]?.id !== id),
      };
    });
  };

  const manejarExtra = (event) => {
    const { name, checked } = event.target;

    setExtras((actuales) => ({
      ...actuales,
      [name]: checked,
    }));
  };

  const manejarCambioOrigen = (value) => {
    setOrigen(value);
    if (value !== "internacional") {
      setOrigenPais("");
    }

    setErrores((actuales) => ({
      ...actuales,
      origen: "",
      origenPais: "",
    }));
  };

  const manejarCambioDestino = (value) => {
    setDestino(value);
    if (value !== "internacional") {
      setDestinoPais("");
    }

    setErrores((actuales) => ({
      ...actuales,
      destino: "",
      destinoPais: "",
    }));
  };

  const calcularCotizacion = () => {
    const erroresValidacion = validarCotizacion({
      origen,
      destino,
      origenPais,
      destinoPais,
      servicio,
      paquetes,
    });

    if (Object.keys(erroresValidacion).length > 0) {
      setErrores(erroresValidacion);
      setMostrarResultado(false);
      return;
    }

    const tarifaRuta = obtenerTarifaRuta(origen, destino);
    let costoBase = tarifaRuta.base;
    let costoDistancia = tarifaRuta.distancia;
    let costoPeso = 0;
    let costoExtras = 0;

    paquetes.forEach((paquete) => {
      const pesoFacturable = calcularPesoFacturable(paquete);
      const cajaSeleccionada = CAJAS.find((caja) => caja.nombre === paquete.caja);
      const factorCaja = cajaSeleccionada?.factor || 1;

      costoPeso += pesoFacturable * 2.25 * factorCaja;
    });

    if (servicio === "expres") {
      costoBase += 20;
    }

    if (extras.recoleccion) {
      costoExtras += 10;
    }

    if (extras.seguro) {
      costoExtras += 15;
    }

    const total = costoBase + costoDistancia + costoPeso + costoExtras;
    const detalleRuta =
      origen === "internacional" || destino === "internacional"
        ? `${origen === "internacional" ? origenPais : obtenerEtiquetaUbicacion(origen)} -> ${
            destino === "internacional"
              ? destinoPais
              : obtenerEtiquetaUbicacion(destino)
          }`
        : `${obtenerEtiquetaUbicacion(origen)} -> ${obtenerEtiquetaUbicacion(destino)}`;

    setErrores({});
    setResultado({
      servicio: servicio === "expres" ? "Expres" : "Estandar",
      descripcion: `${paquetes.length} paquete(s) cotizado(s)`,
      ruta: detalleRuta,
      desglose: {
        base: costoBase,
        distancia: costoDistancia,
        peso: costoPeso,
        extras: costoExtras,
      },
      total,
      tiempo: tarifaRuta[servicio],
    });
    setMostrarResultado(true);
  };

  return (
    <main className="cotizador-page">
      <section className="cotizador ui-card">
        <div className="cotizador__row">
          <div className="cotizador__field">
            <label htmlFor="origen">Desde donde se enviara tu pedido</label>
            <select
              id="origen"
              value={origen}
              onChange={(event) => manejarCambioOrigen(event.target.value)}
              aria-invalid={Boolean(errores.origen)}
            >
              <option value="">Selecciona una opcion</option>
              {UBICACIONES.map((ubicacion) => (
                <option key={ubicacion.value} value={ubicacion.value}>
                  {ubicacion.label}
                </option>
              ))}
            </select>
            {errores.origen ? (
              <p className="cotizador__error ui-error">{errores.origen}</p>
            ) : null}
          </div>

          <div className="cotizador__field">
            <label htmlFor="destino">A donde se enviara tu pedido</label>
            <select
              id="destino"
              value={destino}
              onChange={(event) => manejarCambioDestino(event.target.value)}
              aria-invalid={Boolean(errores.destino)}
            >
              <option value="">Selecciona una opcion</option>
              {UBICACIONES.map((ubicacion) => (
                <option key={ubicacion.value} value={ubicacion.value}>
                  {ubicacion.label}
                </option>
              ))}
            </select>
            {errores.destino ? (
              <p className="cotizador__error ui-error">{errores.destino}</p>
            ) : null}
          </div>
        </div>

        {(origen === "internacional" || destino === "internacional") && (
          <div className="cotizador__row">
            <div className="cotizador__field">
              <label htmlFor="origen-pais">Pais de origen</label>
              <select
                id="origen-pais"
                value={origenPais}
                onChange={(event) => {
                  setOrigenPais(event.target.value);
                  setErrores((actuales) => ({ ...actuales, origenPais: "" }));
                }}
                disabled={origen !== "internacional"}
                aria-invalid={Boolean(errores.origenPais)}
              >
                <option value="">Selecciona un pais</option>
                {PAISES_COBERTURA.map((pais) => (
                  <option key={pais} value={pais}>
                    {pais}
                  </option>
                ))}
              </select>
              {errores.origenPais ? (
                <p className="cotizador__error ui-error">{errores.origenPais}</p>
              ) : null}
            </div>

            <div className="cotizador__field">
              <label htmlFor="destino-pais">Pais de destino</label>
              <select
                id="destino-pais"
                value={destinoPais}
                onChange={(event) => {
                  setDestinoPais(event.target.value);
                  setErrores((actuales) => ({ ...actuales, destinoPais: "" }));
                }}
                disabled={destino !== "internacional"}
                aria-invalid={Boolean(errores.destinoPais)}
              >
                <option value="">Selecciona un pais</option>
                {PAISES_COBERTURA.map((pais) => (
                  <option key={pais} value={pais}>
                    {pais}
                  </option>
                ))}
              </select>
              {errores.destinoPais ? (
                <p className="cotizador__error ui-error">{errores.destinoPais}</p>
              ) : null}
            </div>
          </div>
        )}

        <div className="cotizador__group">
          <p>Nivel de servicio</p>
          <label>
            <input
              type="radio"
              name="servicio"
              value="estandar"
              checked={servicio === "estandar"}
              onChange={(event) => {
                setServicio(event.target.value);
                setErrores((actuales) => ({ ...actuales, servicio: "" }));
              }}
            />
            Estandar
          </label>
          <label>
            <input
              type="radio"
              name="servicio"
              value="expres"
              checked={servicio === "expres"}
              onChange={(event) => {
                setServicio(event.target.value);
                setErrores((actuales) => ({ ...actuales, servicio: "" }));
              }}
            />
            Expres
          </label>
        </div>
        {errores.servicio ? (
          <p className="cotizador__error cotizador__error--group ui-error">
            {errores.servicio}
          </p>
        ) : null}

        <div className="cotizador__group">
          <p>Extras</p>
          <label>
            <input
              type="checkbox"
              name="recoleccion"
              checked={extras.recoleccion}
              onChange={manejarExtra}
            />
            Recoleccion a domicilio
          </label>
          <label>
            <input
              type="checkbox"
              name="seguro"
              checked={extras.seguro}
              onChange={manejarExtra}
            />
            Seguro contra perdidas y accidentes
          </label>
        </div>

        <div className="cotizador__actions">
          <button type="button" className="ui-button-primary" onClick={agregarPaquete}>
            Agregar paquete
          </button>
        </div>

        {paquetes.map((paquete, index) => {
          const errorPaquete = errores.paquetes?.[index] || {};

          return (
            <section className="cotizador__paquete" key={paquete.id}>
              <div className="cotizador__paquete-top">
                <div className="cotizador__paquete-header">
                  Paquete no. {index + 1}
                </div>

                {paquetes.length > 1 ? (
                  <button
                    type="button"
                    className="cotizador__eliminar ui-button-dark"
                    onClick={() => eliminarPaquete(paquete.id)}
                  >
                    Eliminar
                  </button>
                ) : null}
              </div>

              <div className="cotizador__row cotizador__row--package">
                <div className="cotizador__peso-individual">
                  <label htmlFor={`peso-${paquete.id}`}>Peso del paquete (lb)</label>
                  <input
                    id={`peso-${paquete.id}`}
                    type="number"
                    min="0.1"
                    step="0.1"
                    placeholder="Ej. 10"
                    value={paquete.peso}
                    onChange={(event) =>
                      actualizarPaquete(paquete.id, "peso", event.target.value)
                    }
                    aria-invalid={Boolean(errorPaquete.peso)}
                  />
                  {errorPaquete.peso ? (
                    <p className="cotizador__error ui-error">{errorPaquete.peso}</p>
                  ) : null}
                </div>

                <div className="cotizador__dimensiones">
                  <label>Dimensiones opcionales (cm)</label>
                  <div className="cotizador__dimensiones-grid">
                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      placeholder="Largo"
                      value={paquete.largo}
                      onChange={(event) =>
                        actualizarPaquete(paquete.id, "largo", event.target.value)
                      }
                      aria-invalid={Boolean(errorPaquete.largo || errorPaquete.dimensiones)}
                    />
                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      placeholder="Ancho"
                      value={paquete.ancho}
                      onChange={(event) =>
                        actualizarPaquete(paquete.id, "ancho", event.target.value)
                      }
                      aria-invalid={Boolean(errorPaquete.ancho || errorPaquete.dimensiones)}
                    />
                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      placeholder="Alto"
                      value={paquete.alto}
                      onChange={(event) =>
                        actualizarPaquete(paquete.id, "alto", event.target.value)
                      }
                      aria-invalid={Boolean(errorPaquete.alto || errorPaquete.dimensiones)}
                    />
                  </div>
                  {errorPaquete.dimensiones ? (
                    <p className="cotizador__error ui-error">{errorPaquete.dimensiones}</p>
                  ) : null}
                  {errorPaquete.largo ? (
                    <p className="cotizador__error ui-error">{errorPaquete.largo}</p>
                  ) : null}
                  {errorPaquete.ancho ? (
                    <p className="cotizador__error ui-error">{errorPaquete.ancho}</p>
                  ) : null}
                  {errorPaquete.alto ? (
                    <p className="cotizador__error ui-error">{errorPaquete.alto}</p>
                  ) : null}
                </div>
              </div>

              <div className="cotizador__cards">
                {CAJAS.map((caja) => (
                  <button
                    key={caja.nombre}
                    type="button"
                    className={`cotizador__card ${
                      paquete.caja === caja.nombre ? "seleccionada" : ""
                    }`}
                    onClick={() => actualizarPaquete(paquete.id, "caja", caja.nombre)}
                  >
                    <h4>{caja.nombre}</h4>
                    <p>{caja.descripcion}</p>
                  </button>
                ))}
              </div>
              {errorPaquete.caja ? (
                <p className="cotizador__error cotizador__error--card ui-error">
                  {errorPaquete.caja}
                </p>
              ) : null}
            </section>
          );
        })}

        <div className="cotizador__center">
          <button
            className="cotizador__btn ui-button-primary"
            type="button"
            onClick={calcularCotizacion}
          >
            Cotizar
          </button>
        </div>

        {mostrarResultado && resultado ? (
          <section className="cotizador__resultado ui-card">
            <div className="cotizador__resultado-header">
              <div>
                <p className="cotizador__resultado-eyebrow ui-eyebrow">Cotizacion lista</p>
                <h3>Resultado</h3>
              </div>
              <div className="cotizador__resultado-badges">
                <span className="cotizador__badge ui-badge">{resultado.servicio}</span>
                <span className="cotizador__badge cotizador__badge--soft ui-badge ui-badge--soft">
                  {resultado.tiempo}
                </span>
              </div>
            </div>

            <div className="cotizador__resultado-ruta">
              <span className="cotizador__resultado-label">Ruta</span>
              <p>{resultado.ruta}</p>
              <span className="cotizador__resultado-meta">{resultado.descripcion}</span>
            </div>

            <div className="cotizador__resultado-desglose">
              <div className="cotizador__resultado-item">
                <span>Costo base</span>
                <strong>{formatCurrency(resultado.desglose.base)}</strong>
              </div>
              <div className="cotizador__resultado-item">
                <span>Costo por distancia</span>
                <strong>{formatCurrency(resultado.desglose.distancia)}</strong>
              </div>
              <div className="cotizador__resultado-item">
                <span>Costo por peso</span>
                <strong>{formatCurrency(resultado.desglose.peso)}</strong>
              </div>
              <div className="cotizador__resultado-item">
                <span>Extras</span>
                <strong>{formatCurrency(resultado.desglose.extras)}</strong>
              </div>
            </div>

            <div className="cotizador__resultado-total">
              <div>
                <span className="cotizador__resultado-label">Total estimado</span>
                <p>{formatCurrency(resultado.total)}</p>
              </div>
              <div className="cotizador__resultado-time">
                <span className="cotizador__resultado-label">Tiempo estimado</span>
                <p>{resultado.tiempo}</p>
              </div>
            </div>
          </section>
        ) : null}
      </section>
    </main>
  );
}

export default Cotizador;
