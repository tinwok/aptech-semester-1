import api from "@/services/api";

export async function getStaffsApi() {
  const response = await api.get("/staffs");
  return response.data;
}
