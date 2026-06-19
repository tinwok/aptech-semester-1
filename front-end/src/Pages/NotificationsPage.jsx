import { useEffect, useState } from "react";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import {
  deleteNotificationApi,
  getNotificationsApi,
  markAllNotificationsAsReadApi,
  markNotificationAsReadApi,
} from "@/services/notificationService";

function normalizeNotifications(response) {
  if (Array.isArray(response)) {
    return {
      items: response,
      pagination: null,
    };
  }

  if (Array.isArray(response?.data)) {
    return {
      items: response.data,
      pagination: response,
    };
  }

  return {
    items: [],
    pagination: null,
  };
}

function formatNotificationTime(value) {
  if (!value) return "Just now";

  const date = new Date(value);
  const now = new Date();

  if (Number.isNaN(date.getTime())) return "Just now";

  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);

  if (diffSeconds < 60) return "Just now";

  if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
  }

  if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  async function loadNotifications() {
    try {
      setIsLoading(true);

      const response = await getNotificationsApi(page);
      const normalized = normalizeNotifications(response);

      setNotifications(normalized.items);
      setPagination(normalized.pagination);
    } catch {
      setNotifications([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleMarkAsRead(notificationId) {
    await markNotificationAsReadApi(notificationId);
    await loadNotifications();
  }

  async function handleMarkAllRead() {
    await markAllNotificationsAsReadApi();
    await loadNotifications();
  }

  async function handleDeleteNotification(notificationId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this notification?",
    );

    if (!confirmed) return;

    await deleteNotificationApi(notificationId);
    await loadNotifications();
  }

  useEffect(() => {
    loadNotifications();
  }, [page]);

  return (
    <section className="min-h-screen bg-[#FFFCF6] px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#E8D7B3] bg-white p-8 shadow-sm">
          <div>
            <Bell className="h-10 w-10 text-[#B89555]" />

            <h1 className="mt-4 text-3xl font-bold text-[#2B2115]">
              Notifications
            </h1>

            <p className="mt-2 text-[#7B684A]">
              View your appointment reminders, booking updates, and system
              notifications.
            </p>
          </div>

          <button
            type="button"
            onClick={handleMarkAllRead}
            className="inline-flex items-center gap-2 rounded-xl bg-[#B89555] px-5 py-3 font-semibold text-white transition hover:bg-[#9B7A3F]"
          >
            <CheckCheck className="h-5 w-5" />
            Mark all as read
          </button>
        </div>

        {isLoading && (
          <div className="mt-6 rounded-3xl border border-[#E8D7B3] bg-white p-6 text-[#7B684A]">
            Loading notifications...
          </div>
        )}

        {!isLoading && notifications.length === 0 && (
          <div className="mt-6 rounded-3xl border border-[#E8D7B3] bg-white p-8 text-center shadow-sm">
            <Bell className="mx-auto h-12 w-12 text-[#B89555]" />
            <h2 className="mt-4 text-xl font-bold text-[#2B2115]">
              No notifications yet
            </h2>
            <p className="mt-2 text-[#7B684A]">
              Your updates will appear here.
            </p>
          </div>
        )}

        <div className="mt-6 grid gap-4">
          {notifications.map((notification) => (
            <article
              key={notification.id}
              className={`rounded-3xl border p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
                notification.is_read
                  ? "border-[#E8D7B3] bg-white"
                  : "border-[#C2A26A] bg-[#FFF7E6]"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-[#2B2115]">
                      {notification.title}
                    </h2>

                    {!notification.is_read && (
                      <span className="rounded-full bg-red-500 px-2 py-1 text-xs font-semibold text-white">
                        New
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-[#7B684A]">{notification.message}</p>

                  <p className="mt-3 text-sm text-[#8A6A35]">
                    {formatNotificationTime(
                      notification.created_at || notification.send_at,
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {!notification.is_read && (
                    <button
                      type="button"
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="rounded-xl border border-[#C2A26A] px-4 py-2 text-sm font-semibold text-[#9B7A3F] transition hover:bg-[#FFF2D8]"
                    >
                      Mark as read
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDeleteNotification(notification.id)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-red-100 text-red-500 transition hover:bg-red-50"
                    title="Delete notification"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {pagination && pagination.last_page > 1 && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="rounded-xl border border-[#E8D7B3] bg-white px-4 py-2 text-[#2B2115] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-sm font-medium text-[#8A6A35]">
              Page {pagination.current_page} / {pagination.last_page}
            </span>

            <button
              type="button"
              disabled={page >= pagination.last_page}
              onClick={() => setPage(page + 1)}
              className="rounded-xl border border-[#E8D7B3] bg-white px-4 py-2 text-[#2B2115] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default NotificationsPage;
