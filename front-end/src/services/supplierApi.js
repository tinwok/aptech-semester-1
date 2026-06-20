import axiosClient from "@/api/axiosClient";

export const supplierApi = {
  getAll(params) {
    return axiosClient.get("/dashboard/suppliers", { params });
  },

  getById(id) {
    return axiosClient.get(`/dashboard/suppliers/${id}`);
  },

  create(data) {
    return axiosClient.post("/dashboard/suppliers", data);
  },

  update(id, data) {
    return axiosClient.put(`/dashboard/suppliers/${id}`, data);
  },

  delete(id) {
    return axiosClient.delete(`/dashboard/suppliers/${id}`);
  },
};
