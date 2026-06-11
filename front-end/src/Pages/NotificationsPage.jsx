import { Bell } from "lucide-react";

function NotificationsPage() {
  return (
    <section className="min-h-screen bg-[#FFFCF6] px-6 py-10">
      <div className="mx-auto max-w-5xl rounded-3xl border border-[#E8D7B3] bg-white p-8 shadow-sm">
        <Bell className="h-10 w-10 text-[#B89555]" />
        <h1 className="mt-4 text-3xl font-bold text-[#2B2115]">Thông báo</h1>
        <p className="mt-2 text-[#7B684A]">
          Backend hiện chưa có route notification trong `route:list`, nên trang
          này là UI chờ API.
        </p>
      </div>
    </section>
  );
}

export default NotificationsPage;
