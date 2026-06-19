import api from "@/services/api";

function getAuthHeaders() {
  const token = localStorage.getItem("zenstyle_access_token");

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function createFeedbackApi(payload) {
  const response = await api.post("/feedbacks", payload, {
    headers: getAuthHeaders(),
  });

  return response.data;
}
