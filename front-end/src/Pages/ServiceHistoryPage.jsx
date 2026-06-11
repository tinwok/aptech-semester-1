import { useEffect, useState } from "react";
import { History, Scissors } from "lucide-react";
import { getMyAppointmentHistoryApi } from "@/services/appointmentService";

function formatMoney(value) {
  if (!value) return "0 VND";
  return Number(value).toLocaleString("vi-VN") + " VND";
}

function ServiceHistoryPage() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await getMyAppointmentHistoryApi();
        setItems(Array.isArray(data) ? data : []);
      } catch {
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadHistory();
  }, []);

  return (
    <section className="min-h-screen bg-[#FFFCF6] px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-3xl border border-[#E8D7B3] bg-white p-8 shadow-sm">
          <History className="h-10 w-10 text-[#B89555]" />

          <h1 className="mt-4 text-3xl font-bold text-[#2B2115]">
            Lịch sử dịch vụ
          </h1>

          <p className="mt-2 text-[#7B684A]">
            Hiển thị lịch hẹn đã hoàn thành từ API{" "}
            <strong>/api/me/appointments/history</strong>.
          </p>
        </div>

        {isLoading && (
          <div className="mt-6 rounded-3xl border border-[#E8D7B3] bg-white p-6">
            Đang tải lịch sử...
          </div>
        )}

        {!isLoading && items.length === 0 && (
          <div className="mt-6 rounded-3xl border border-[#E8D7B3] bg-white p-8 text-center shadow-sm">
            <Scissors className="mx-auto h-12 w-12 text-[#B89555]" />
            <h2 className="mt-4 text-xl font-bold text-[#2B2115]">
              Chưa có lịch sử dịch vụ
            </h2>
            <p className="mt-2 text-[#7B684A]">
              Khi lịch hẹn completed, lịch sử sẽ hiển thị ở đây.
            </p>
          </div>
        )}

        <div className="mt-6 grid gap-4">
          {items.map((item) => {
            const details = item.invoice_details || [];

            return (
              <div
                key={item.id}
                className="rounded-3xl border border-[#E8D7B3] bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-[#2B2115]">
                      Dịch vụ #{item.id}
                    </h2>
                    <p className="mt-1 text-sm capitalize text-[#8A6A35]">
                      Trạng thái: {item.status}
                    </p>
                  </div>

                  <span className="rounded-full bg-[#FFF2D8] px-4 py-2 text-sm font-semibold text-[#8A6A35]">
                    {item.appointment_date}
                  </span>
                </div>

                <p className="mt-4 text-sm text-[#7B684A]">
                  Thời gian: {item.start_time} - {item.end_time}
                </p>

                {details.length > 0 && (
                  <div className="mt-5 grid gap-3">
                    {details.map((detail) => (
                      <div
                        key={detail.id}
                        className="rounded-2xl border border-[#E8D7B3] bg-[#FFFDF8] p-4"
                      >
                        <p className="font-semibold text-[#2B2115]">
                          {detail.service?.title || "Dịch vụ chưa rõ"}
                        </p>

                        <p className="mt-1 text-sm text-[#7B684A]">
                          Giá: {formatMoney(detail.unit_price)} | Giảm:{" "}
                          {detail.discount || 0}% | Thành tiền:{" "}
                          {formatMoney(detail.subtotal)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ServiceHistoryPage;
