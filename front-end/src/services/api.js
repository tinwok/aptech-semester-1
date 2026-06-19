import axios from "axios";

// ── Backend Laravel ──

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: "application/json",
  },
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("zenstyle_access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Helper: map fields backend → frontend ──
const mapService = (item) => ({
  id: item.id,
  name: item.title,
  description: item.description,
  duration_minutes: item.duration_minutes,
  price: Number(item.price),
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

export const getAllServices = () => getServices({ per_page: 50 });

// ── Products ──

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

// ── Staffs ──
const mapStaff = (item) => ({
  id: item.id,
  name: item.users.name,
  phone: item.users.phone,
  email: item.users.email,
  position: item.position === "baber" ? "baber" : item.position,
  shift: item.shift,
  status: item.status,
  image: item.image_url ?? null,
});

export const getAllStaffs = async () => {
  const res = await api.get("/staffs", { params: { per_page: 50 } });
  const items = res.data?.data ?? [];
  return items.map(mapStaff);
};
export default api;
