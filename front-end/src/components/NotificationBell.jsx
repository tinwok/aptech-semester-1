import { useEffect, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getNotificationsApi,
  getUnreadNotificationCountApi,
  markAllNotificationsAsReadApi,
  markNotificationAsReadApi,
} from "@/services/notificationService";

function NotificationBell() {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  async function loadNotifications() {
    try {
      setIsLoading(true);

      const notificationResponse = await getNotificationsApi();
      const unreadResponse = await getUnreadNotificationCountApi();

      setNotifications(notificationResponse.data || []);
      setUnreadCount(unreadResponse.count || 0);
    } catch {
      setNotifications([]);
      setUnreadCount(0);
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
  }, []);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          setIsOpen((current) => !current);
          loadNotifications();
        }}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#E8D7B3] bg-[#FFFDF8] text-[#B89555] shadow-sm transition hover:bg-[#FFF7E6] hover:text-[#9B7A3F]"
      >
        <Bell className="h-5 w-5" />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-[9999] mt-3 w-80 rounded-2xl border border-[#E8D7B3] bg-[#FFFDF8] p-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#E8D7B3] pb-3">
            <div>
              <h3 className="font-bold text-[#2B2115]">Notifications</h3>
              <p className="text-xs text-[#8A6A35]">
                {unreadCount} unread notification{unreadCount > 1 ? "s" : ""}
              </p>
            </div>

            <button
              type="button"
              onClick={handleMarkAllRead}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-[#B89555] hover:bg-[#FFF7E6]"
            >
              <CheckCheck className="h-4 w-4" />
              Read all
            </button>
          </div>

          <div className="mt-3 max-h-80 space-y-2 overflow-y-auto">
            {isLoading && (
              <p className="rounded-xl bg-[#FFF7E6] px-3 py-3 text-sm text-[#8A6A35]">
                Loading notifications...
              </p>
            )}

            {!isLoading && notifications.length === 0 && (
              <p className="rounded-xl bg-[#FFF7E6] px-3 py-3 text-sm text-[#8A6A35]">
                No notifications yet.
              </p>
            )}

            {!isLoading &&
              notifications.slice(0, 5).map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => handleMarkAsRead(notification.id)}
                  className={`w-full rounded-xl border px-3 py-3 text-left transition hover:bg-[#FFF7E6] ${
                    notification.is_read
                      ? "border-[#E8D7B3] bg-white"
                      : "border-[#C2A26A] bg-[#FFF7E6]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-semibold text-[#2B2115]">
                      {notification.title}
                    </p>

                    {!notification.is_read && (
                      <span className="mt-1 h-2 w-2 rounded-full bg-red-500" />
                    )}
                  </div>

                  <p className="mt-1 line-clamp-2 text-sm text-[#7B684A]">
                    {notification.message}
                  </p>
                </button>
              ))}
          </div>

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              navigate("/user/notifications");
            }}
            className="mt-3 w-full rounded-xl bg-[#B89555] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#9B7A3F]"
          >
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
