import axiosClient from "@/api/axiosClient";

export async function getMyAppointmentsApi() {
  const response = await axiosClient.get("/me/appointments");
  return response.data;
}

export async function getMyAppointmentHistoryApi() {
  const response = await axiosClient.get("/me/appointments/history");
  return response.data;
}
