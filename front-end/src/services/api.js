import axios from "axios";

// ── Backend Laravel ──

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

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

const mapProduct = (item) => ({
  id: item.id,
  name: item.name,
  price: Number(item.retail_price),
  unit: item.unit,
  status: item.status,
  image: item.image_url ?? null,
});

export const getAllProducts = async () => {
  const res = await api.get("/products", { params: { per_page: 50 } });
  const items = res.data?.data?.data ?? [];
  return items.map(mapProduct);
};

export default api;
