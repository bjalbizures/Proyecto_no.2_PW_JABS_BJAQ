const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

async function request(path, { token, ...options } = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error("No se pudo conectar con la API. Verifica que el backend este encendido.");
  }

  const hasBody = response.status !== 204;
  const data = hasBody ? await response.json() : null;

  if (!response.ok) {
    throw new Error(data?.message || "No se pudo completar la solicitud");
  }

  return data;
}

export const api = {
  login(credentials) {
    return request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },
  register(user) {
    return request("/auth/register", {
      method: "POST",
      body: JSON.stringify(user),
    });
  },
  submitContactMessage(message) {
    return request("/contact", {
      method: "POST",
      body: JSON.stringify(message),
    });
  },
  getProfile(token) {
    return request("/auth/me", { token });
  },
  listMyShipments(token) {
    return request("/shipments", { token });
  },
  createShipment(token, shipment) {
    return request("/shipments", {
      token,
      method: "POST",
      body: JSON.stringify(shipment),
    });
  },
  trackShipment(trackingCode) {
    return request(`/tracking/${trackingCode}`);
  },
  getAdminDashboard(token) {
    return request("/admin/dashboard", { token });
  },
  listAdminUsers(token) {
    return request("/admin/users", { token });
  },
  createAdminUser(token, user) {
    return request("/admin/users", {
      token,
      method: "POST",
      body: JSON.stringify(user),
    });
  },
  updateAdminUser(token, userId, user) {
    return request(`/admin/users/${userId}`, {
      token,
      method: "PUT",
      body: JSON.stringify(user),
    });
  },
  deleteAdminUser(token, userId) {
    return request(`/admin/users/${userId}`, {
      token,
      method: "DELETE",
    });
  },
  listAdminShipments(token) {
    return request("/admin/shipments", { token });
  },
  createAdminShipment(token, shipment) {
    return request("/admin/shipments", {
      token,
      method: "POST",
      body: JSON.stringify(shipment),
    });
  },
  updateAdminShipment(token, shipmentId, shipment) {
    return request(`/admin/shipments/${shipmentId}`, {
      token,
      method: "PUT",
      body: JSON.stringify(shipment),
    });
  },
  deleteAdminShipment(token, shipmentId) {
    return request(`/admin/shipments/${shipmentId}`, {
      token,
      method: "DELETE",
    });
  },
};
