import api from "@/services/api";

export async function createFeedbackApi(payload) {
  const response = await api.post("/feedbacks", payload);
  return response.data;
}
