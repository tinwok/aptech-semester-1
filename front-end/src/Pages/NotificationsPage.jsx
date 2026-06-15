import { useEffect, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import {
  getNotificationsApi,
  markAllNotificationsAsReadApi,
  markNotificationAsReadApi,
} from "@/services/notificationService";

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  async function loadNotifications() {
    try {
      setIsLoading(true);

      const response = await getNotificationsApi(page);

      setNotifications(response.data || []);
      setPagination(response);
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
                <div>
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

                  <p className="mt-3 text-sm capitalize text-[#8A6A35]">
                    Type: {notification.type?.replaceAll("_", " ")}
                  </p>
                </div>

                {!notification.is_read && (
                  <button
                    type="button"
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="rounded-xl border border-[#C2A26A] px-4 py-2 text-sm font-semibold text-[#9B7A3F] transition hover:bg-[#FFF2D8]"
                  >
                    Mark as read
                  </button>
                )}
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
