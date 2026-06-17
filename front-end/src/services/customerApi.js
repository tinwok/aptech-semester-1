import api from "./api";

export const getCustomers = (page = 1, search = "") => {
  return api.get("dashboard/customers", {
    params: {
      search,
      page,
    },
  });
};

export const getCustomer = (id) => {
  return api.get(`/dashboard/customers/${id}`);
};

export const createCustomer = (data) => {
  return api.post("/dashboard/customers", data);
};

export const updateCustomer = (id, data) => {
  return api.put(`/dashboard/customers/${id}`, data);
};

export const deleteCustomer = (id) => {
  return api.delete(`/dashboard/customers/${id}`);
};
