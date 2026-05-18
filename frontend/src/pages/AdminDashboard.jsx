import { useEffect, useMemo, useState } from "react";

import { useAuth } from "../hooks/useAuth";
import { api } from "../services/api";
import "../styles/admin-dashboard.css";

const EMPTY_USER_FORM = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  role: "customer",
  password: "",
};

const EMPTY_SHIPMENT_FORM = {
  userId: "",
  destination: "",
  destinationRegion: "",
  status: "created",
  weight: "",
  estimatedCost: "",
  eventDescription: "",
  eventLocation: "",
};

const STATUS_LABELS = {
  created: "Creado",
  received: "Recibido",
  in_transit: "En transito",
  ready_for_pickup: "Listo para entrega",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

const STATUS_OPTIONS = Object.keys(STATUS_LABELS);

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

export default function AdminDashboard() {
  const { token, user } = useAuth();
  const [activeTab, setActiveTab] = useState("summary");
  const [dashboard, setDashboard] = useState(null);
  const [users, setUsers] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [userForm, setUserForm] = useState(EMPTY_USER_FORM);
  const [shipmentForm, setShipmentForm] = useState(EMPTY_SHIPMENT_FORM);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingShipmentId, setEditingShipmentId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const customerOptions = useMemo(
    () => users.filter((currentUser) => currentUser.role === "customer"),
    [users],
  );

  useEffect(() => {
    let isMounted = true;

    async function loadAdminData() {
      try {
        const [dashboardData, usersData, shipmentsData] = await Promise.all([
          api.getAdminDashboard(token),
          api.listAdminUsers(token),
          api.listAdminShipments(token),
        ]);

        if (!isMounted) {
          return;
        }

        setDashboard(dashboardData);
        setUsers(usersData.users);
        setShipments(shipmentsData.shipments);
      } catch (requestError) {
        if (isMounted) {
          setFeedback({ type: "error", message: requestError.message });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadAdminData();

    return () => {
      isMounted = false;
    };
  }, [token]);

  async function refreshDashboard() {
    const dashboardData = await api.getAdminDashboard(token);
    setDashboard(dashboardData);
  }

  function handleUserFormChange(event) {
    const { name, value } = event.target;
    setUserForm((current) => ({ ...current, [name]: value }));
  }

  function handleShipmentFormChange(event) {
    const { name, value } = event.target;
    setShipmentForm((current) => ({ ...current, [name]: value }));
  }

  function resetUserForm() {
    setEditingUserId(null);
    setUserForm(EMPTY_USER_FORM);
  }

  function resetShipmentForm() {
    setEditingShipmentId(null);
    setShipmentForm(EMPTY_SHIPMENT_FORM);
  }

  async function handleUserSubmit(event) {
    event.preventDefault();
    setFeedback({ type: "", message: "" });
    setIsSubmitting(true);

    try {
      const payload = {
        fullName: userForm.fullName.trim(),
        email: userForm.email.trim(),
        phone: userForm.phone.trim(),
        address: userForm.address.trim(),
        role: userForm.role,
      };

      if (userForm.password.trim()) {
        payload.password = userForm.password;
      }

      if (editingUserId) {
        const data = await api.updateAdminUser(token, editingUserId, payload);
        setUsers((current) => current.map((item) => (item.id === editingUserId ? data.user : item)));
        setFeedback({ type: "success", message: "Usuario actualizado correctamente." });
      } else {
        const data = await api.createAdminUser(token, payload);
        setUsers((current) => [data.user, ...current]);
        setFeedback({ type: "success", message: "Usuario creado correctamente." });
      }

      resetUserForm();
      await refreshDashboard();
    } catch (requestError) {
      setFeedback({ type: "error", message: requestError.message });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteUser(userId) {
    setFeedback({ type: "", message: "" });

    try {
      await api.deleteAdminUser(token, userId);
      setUsers((current) => current.filter((item) => item.id !== userId));
      setFeedback({ type: "success", message: "Usuario eliminado correctamente." });
      await refreshDashboard();
    } catch (requestError) {
      setFeedback({ type: "error", message: requestError.message });
    }
  }

  function startEditingUser(selectedUser) {
    setEditingUserId(selectedUser.id);
    setUserForm({
      fullName: selectedUser.fullName || "",
      email: selectedUser.email || "",
      phone: selectedUser.phone || "",
      address: selectedUser.address || "",
      role: selectedUser.role || "customer",
      password: "",
    });
    setActiveTab("users");
  }

  async function handleShipmentSubmit(event) {
    event.preventDefault();
    setFeedback({ type: "", message: "" });
    setIsSubmitting(true);

    try {
      const payload = {
        destination: shipmentForm.destination.trim(),
        destinationRegion: shipmentForm.destinationRegion.trim(),
        status: shipmentForm.status,
        weight: shipmentForm.weight ? Number(shipmentForm.weight) : null,
        estimatedCost: shipmentForm.estimatedCost ? Number(shipmentForm.estimatedCost) : null,
        eventDescription: shipmentForm.eventDescription.trim(),
        eventLocation: shipmentForm.eventLocation.trim(),
      };

      if (!editingShipmentId) {
        payload.userId = Number(shipmentForm.userId);
      }

      if (editingShipmentId) {
        const data = await api.updateAdminShipment(token, editingShipmentId, payload);
        setShipments((current) => current.map((item) => (item.id === editingShipmentId ? data.shipment : item)));
        setFeedback({ type: "success", message: "Envio actualizado correctamente." });
      } else {
        const data = await api.createAdminShipment(token, payload);
        setShipments((current) => [data.shipment, ...current]);
        setFeedback({ type: "success", message: "Envio creado correctamente." });
      }

      resetShipmentForm();
      await refreshDashboard();
    } catch (requestError) {
      setFeedback({ type: "error", message: requestError.message });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteShipment(shipmentId) {
    setFeedback({ type: "", message: "" });

    try {
      await api.deleteAdminShipment(token, shipmentId);
      setShipments((current) => current.filter((item) => item.id !== shipmentId));
      setFeedback({ type: "success", message: "Envio eliminado correctamente." });
      await refreshDashboard();
    } catch (requestError) {
      setFeedback({ type: "error", message: requestError.message });
    }
  }

  function startEditingShipment(shipment) {
    setEditingShipmentId(shipment.id);
    setShipmentForm({
      userId: String(shipment.userId),
      destination: shipment.destination || "",
      destinationRegion: shipment.destinationRegion || "",
      status: shipment.status || "created",
      weight: shipment.weight ?? "",
      estimatedCost: shipment.estimatedCost ?? "",
      eventDescription: "",
      eventLocation: "",
    });
    setActiveTab("shipments");
  }

  const summary = dashboard?.summary;

  return (
    <main className="admin-page">
      <section className="admin-shell">
        <div className="admin-header">
          <div>
            <p className="ui-eyebrow">Panel interno</p>
            <h1>Dashboard administrativo</h1>
            <p>{user?.fullName}, administra usuarios, envios y metricas operativas.</p>
          </div>
        </div>

        {feedback.message ? (
          <p className={`admin-feedback admin-feedback--${feedback.type}`}>{feedback.message}</p>
        ) : null}

        <div className="admin-tabs" role="tablist" aria-label="Secciones administrativas">
          <button type="button" className={activeTab === "summary" ? "is-active" : ""} onClick={() => setActiveTab("summary")}>
            Resumen
          </button>
          <button type="button" className={activeTab === "users" ? "is-active" : ""} onClick={() => setActiveTab("users")}>
            Usuarios
          </button>
          <button type="button" className={activeTab === "shipments" ? "is-active" : ""} onClick={() => setActiveTab("shipments")}>
            Envios
          </button>
        </div>

        {isLoading ? (
          <section className="admin-panel">
            <p className="admin-empty">Cargando informacion administrativa...</p>
          </section>
        ) : null}

        {!isLoading && activeTab === "summary" ? (
          <section className="admin-stack">
            <div className="admin-metrics">
              <article>
                <span>Usuarios</span>
                <strong>{summary?.totalUsers ?? 0}</strong>
              </article>
              <article>
                <span>Clientes</span>
                <strong>{summary?.totalCustomers ?? 0}</strong>
              </article>
              <article>
                <span>Envios</span>
                <strong>{summary?.totalShipments ?? 0}</strong>
              </article>
              <article>
                <span>Ingresos estimados</span>
                <strong>{formatCurrency(summary?.totalEstimatedRevenue)}</strong>
              </article>
            </div>

            <div className="admin-grid">
              <section className="admin-panel">
                <div className="admin-panel__header">
                  <h2>Envios por mes</h2>
                </div>
                <div className="admin-chart-list">
                  {(dashboard?.shipmentsByMonth || []).map((item) => (
                    <div key={item.month}>
                      <span>{item.month}</span>
                      <strong>{item.total}</strong>
                    </div>
                  ))}
                </div>
              </section>

              <section className="admin-panel">
                <div className="admin-panel__header">
                  <h2>Envios por region</h2>
                </div>
                <div className="admin-chart-list">
                  {(dashboard?.shipmentsByRegion || []).map((item) => (
                    <div key={item.region}>
                      <span>{item.region}</span>
                      <strong>{item.total}</strong>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <section className="admin-panel">
              <div className="admin-panel__header">
                <h2>Envios recientes</h2>
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Guia</th>
                      <th>Cliente</th>
                      <th>Destino</th>
                      <th>Estado</th>
                      <th>Costo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(dashboard?.recentShipments || []).map((shipment) => (
                      <tr key={shipment.id}>
                        <td>{shipment.trackingCode}</td>
                        <td>{shipment.customerName}</td>
                        <td>{shipment.destination}</td>
                        <td>{STATUS_LABELS[shipment.status] || shipment.status}</td>
                        <td>{formatCurrency(shipment.estimatedCost)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </section>
        ) : null}

        {!isLoading && activeTab === "users" ? (
          <section className="admin-grid admin-grid--form">
            <form className="admin-panel admin-form" onSubmit={handleUserSubmit}>
              <div className="admin-panel__header">
                <h2>{editingUserId ? "Editar usuario" : "Crear usuario"}</h2>
              </div>
              <label>
                Nombre completo
                <input name="fullName" value={userForm.fullName} onChange={handleUserFormChange} required />
              </label>
              <label>
                Correo
                <input name="email" type="email" value={userForm.email} onChange={handleUserFormChange} required />
              </label>
              <label>
                Telefono
                <input name="phone" value={userForm.phone} onChange={handleUserFormChange} required />
              </label>
              <label>
                Direccion
                <input name="address" value={userForm.address} onChange={handleUserFormChange} required />
              </label>
              <label>
                Rol
                <select name="role" value={userForm.role} onChange={handleUserFormChange}>
                  <option value="customer">Cliente</option>
                  <option value="admin">Administrador</option>
                </select>
              </label>
              <label>
                Contrasena
                <input name="password" type="password" value={userForm.password} onChange={handleUserFormChange} placeholder={editingUserId ? "Mantener actual" : "Aeropaq123!"} />
              </label>
              <div className="admin-actions">
                <button className="ui-button-primary" type="submit" disabled={isSubmitting}>
                  {editingUserId ? "Guardar" : "Crear"}
                </button>
                {editingUserId ? <button type="button" className="admin-secondary-button" onClick={resetUserForm}>Cancelar</button> : null}
              </div>
            </form>

            <section className="admin-panel">
              <div className="admin-panel__header">
                <h2>Usuarios registrados</h2>
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Correo</th>
                      <th>Rol</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((currentUser) => (
                      <tr key={currentUser.id}>
                        <td>{currentUser.fullName}</td>
                        <td>{currentUser.email}</td>
                        <td>{currentUser.role === "admin" ? "Administrador" : "Cliente"}</td>
                        <td>
                          <div className="admin-row-actions">
                            <button type="button" onClick={() => startEditingUser(currentUser)}>Editar</button>
                            <button type="button" onClick={() => handleDeleteUser(currentUser.id)}>Eliminar</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </section>
        ) : null}

        {!isLoading && activeTab === "shipments" ? (
          <section className="admin-grid admin-grid--form">
            <form className="admin-panel admin-form" onSubmit={handleShipmentSubmit}>
              <div className="admin-panel__header">
                <h2>{editingShipmentId ? "Editar envio" : "Crear envio"}</h2>
              </div>
              <label>
                Cliente
                <select name="userId" value={shipmentForm.userId} onChange={handleShipmentFormChange} required disabled={Boolean(editingShipmentId)}>
                  <option value="">Selecciona cliente</option>
                  {customerOptions.map((customer) => (
                    <option key={customer.id} value={customer.id}>{customer.fullName}</option>
                  ))}
                </select>
              </label>
              <label>
                Destino
                <input name="destination" value={shipmentForm.destination} onChange={handleShipmentFormChange} required />
              </label>
              <label>
                Region
                <input name="destinationRegion" value={shipmentForm.destinationRegion} onChange={handleShipmentFormChange} />
              </label>
              <label>
                Estado
                <select name="status" value={shipmentForm.status} onChange={handleShipmentFormChange}>
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>{STATUS_LABELS[status]}</option>
                  ))}
                </select>
              </label>
              <label>
                Peso kg
                <input name="weight" type="number" min="0.1" step="0.1" value={shipmentForm.weight} onChange={handleShipmentFormChange} />
              </label>
              <label>
                Costo estimado
                <input name="estimatedCost" type="number" min="0" step="0.01" value={shipmentForm.estimatedCost} onChange={handleShipmentFormChange} />
              </label>
              <label>
                Descripcion del evento
                <input name="eventDescription" value={shipmentForm.eventDescription} onChange={handleShipmentFormChange} placeholder="Paquete en ruta" />
              </label>
              <label>
                Ubicacion del evento
                <input name="eventLocation" value={shipmentForm.eventLocation} onChange={handleShipmentFormChange} placeholder="Centro de distribucion" />
              </label>
              <div className="admin-actions">
                <button className="ui-button-primary" type="submit" disabled={isSubmitting}>
                  {editingShipmentId ? "Guardar" : "Crear"}
                </button>
                {editingShipmentId ? <button type="button" className="admin-secondary-button" onClick={resetShipmentForm}>Cancelar</button> : null}
              </div>
            </form>

            <section className="admin-panel">
              <div className="admin-panel__header">
                <h2>Envios registrados</h2>
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Guia</th>
                      <th>Cliente</th>
                      <th>Destino</th>
                      <th>Fecha</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shipments.map((shipment) => (
                      <tr key={shipment.id}>
                        <td>{shipment.trackingCode}</td>
                        <td>{shipment.customerName}</td>
                        <td>{shipment.destination}</td>
                        <td>{formatDate(shipment.createdAt)}</td>
                        <td>{STATUS_LABELS[shipment.status] || shipment.status}</td>
                        <td>
                          <div className="admin-row-actions">
                            <button type="button" onClick={() => startEditingShipment(shipment)}>Editar</button>
                            <button type="button" onClick={() => handleDeleteShipment(shipment.id)}>Eliminar</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </section>
        ) : null}
      </section>
    </main>
  );
}
