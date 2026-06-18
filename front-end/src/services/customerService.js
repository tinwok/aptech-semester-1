import api from "@/services/api";

function getAuthHeaders() {
  const token = localStorage.getItem("zenstyle_access_token");

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getDashboardCustomersApi() {
  const response = await api.get("/dashboard/customer-preferences", {
    headers: getAuthHeaders(),
  });

  return response.data;
}
