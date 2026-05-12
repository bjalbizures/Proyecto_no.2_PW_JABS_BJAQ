const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

async function request(path, { token, ...options } = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

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
};
