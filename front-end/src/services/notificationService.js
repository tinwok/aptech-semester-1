import api from "@/services/api";

function getAuthHeaders() {
  const token = localStorage.getItem("zenstyle_access_token");

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getNotificationsApi(page = 1) {
  const response = await api.get(`/notifications?page=${page}`, {
    headers: getAuthHeaders(),
  });

  return response.data;
}

export async function getUnreadNotificationCountApi() {
  const response = await api.get("/notifications/unread-count", {
    headers: getAuthHeaders(),
  });

  return response.data;
}

export async function markNotificationAsReadApi(notificationId) {
  const response = await api.put(
    `/notifications/${notificationId}/read`,
    {},
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
}

export async function markAllNotificationsAsReadApi() {
  const response = await api.put(
    "/notifications/read-all",
    {},
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
}
