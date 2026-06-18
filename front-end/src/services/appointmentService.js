import api from "@/services/api";

function getAuthHeaders() {
  const token = localStorage.getItem("zenstyle_access_token");

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getMyAppointmentsApi(role) {
  const url = role === "staff" ? "/staff/appointments" : "/me/appointments";

  const response = await api.get(url, {
    headers: getAuthHeaders(),
  });

  return response.data;
}

export async function getMyAppointmentHistoryApi(role) {
  const url =
    role === "staff"
      ? "/staff/appointments/history"
      : "/me/appointments/history";

  const response = await api.get(url, {
    headers: getAuthHeaders(),
  });

  return response.data;
}

export async function cancelAppointmentApi(id) {
  const response = await api.delete(`/appointments/${id}`, {
    headers: getAuthHeaders(),
  });

  return response.data;
}

export async function getAppointmentDetailApi(id) {
  const response = await api.get(`/appointments/${id}`, {
    headers: getAuthHeaders(),
  });

  return response.data;
}

export async function payAppointmentApi(id) {
  const response = await api.post(
    `/appointments/${id}/pay`,
    {},
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
}

export async function getMyPaidInvoicesApi() {
  const response = await api.get("/me/invoices", {
    headers: getAuthHeaders(),
  });

  return response.data;
}

export async function getMyPaidInvoiceDetailApi(id) {
  const response = await api.get(`/me/invoices/${id}`, {
    headers: getAuthHeaders(),
  });

  return response.data;
}
