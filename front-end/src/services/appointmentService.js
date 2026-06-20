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

export async function getAppointmentDetailApi(appointmentId) {
  const response = await api.get(`/appointments/${appointmentId}`, {
    headers: getAuthHeaders(),
  });

  return response.data;
}

export async function completeAppointmentApi(appointmentId) {
  const response = await api.post(
    `/appointments/${appointmentId}/complete`,
    {},
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
}

export async function cancelAppointmentApi(appointmentId) {
  const response = await api.delete(`/appointments/${appointmentId}`, {
    headers: getAuthHeaders(),
  });

  return response.data;
}
