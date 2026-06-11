import axiosClient from "@/api/axiosClient";

export async function getServicesApi(page = 1) {
  const response = await axiosClient.get(`/services?page=${page}`);
  return response.data;
}

export async function getServiceDetailApi(serviceId) {
  const response = await axiosClient.get(`/services/${serviceId}`);
  return response.data;
}
