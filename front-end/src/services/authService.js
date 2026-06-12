import axiosClient from "@/api/axiosClient";

export async function loginApi(loginData) {
  const response = await axiosClient.post("/login", loginData);
  return response.data;
}

export async function registerApi(registerData) {
  const response = await axiosClient.post("/register", registerData);
  return response.data;
}

export async function getMeApi() {
  const response = await axiosClient.get("/me");
  return response.data;
}

export async function updateProfileApi(profileData) {
  const response = await axiosClient.post("/me/profile", profileData);
  return response.data;
}

export async function changePasswordApi(passwordData) {
  const response = await axiosClient.post("/me/change-password", passwordData);
  return response.data;
}

export async function logoutApi() {
  const response = await axiosClient.post("/me/logout");
  return response.data;
}

export async function deleteMeApi() {
  const response = await axiosClient.delete("/me/delete");
  return response.data;
}
