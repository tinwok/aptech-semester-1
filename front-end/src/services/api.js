import axios from "axios";

// ── Backend Laravel ──
const api = axios.create({
  baseURL: "/api",
});

// ── Helper: map fields backend → frontend ──
const mapService = (item) => ({
  id: item.id,
  name: item.name,
  description: item.description,
  duration_minutes: item.duration_minutes,
  price: item.price,
  status: item.status,
  image: item.image_url,
});

// ── Services ──
export const getServices = async (params = {}) => {
  const res = await api.get("/services", { params });
  const payload = res.data ?? {};
  const items = Array.isArray(payload.data)
    ? payload.data
    : Array.isArray(payload)
      ? payload
      : [];

  return {
    ...(Array.isArray(payload) ? {} : payload),
    data: items.map(mapService),
  };
};

export const getAllServices = () => getServices();

export default api;
