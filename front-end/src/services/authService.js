import api from "@/services/api";

function getAuthHeaders() {
  const token = localStorage.getItem("zenstyle_access_token");

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function registerApi(data) {
  const response = await api.post("/register", data);
  return response.data;
}

export async function loginApi(data) {
  const response = await api.post("/login", data);
  return response.data;
}

export async function getMeApi() {
  const response = await api.get("/me", {
    headers: getAuthHeaders(),
  });

  return response.data;
}

export async function updateProfileApi(data) {
  const response = await api.post("/me/profile", data, {
    headers: getAuthHeaders(),
  });

  return response.data;
}

export async function changePasswordApi(data) {
  const response = await api.post("/me/change-password", data, {
    headers: getAuthHeaders(),
  });

  return response.data;
}

export async function logoutApi() {
  const response = await api.post(
    "/me/logout",
    {},
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
}

export async function deleteMeApi() {
  const response = await api.delete("/me/delete", {
    headers: getAuthHeaders(),
  });

  return response.data;
}
