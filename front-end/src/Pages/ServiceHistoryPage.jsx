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
            Service History
          </h1>
        </div>

        {isLoading && (
          <div className="mt-6 rounded-3xl border border-[#E8D7B3] bg-white p-6">
            Loading service history...
          </div>
        )}

        {!isLoading && items.length === 0 && (
          <div className="mt-6 rounded-3xl border border-[#E8D7B3] bg-white p-8 text-center shadow-sm">
            <Scissors className="mx-auto h-12 w-12 text-[#B89555]" />

            <h2 className="mt-4 text-xl font-bold text-[#2B2115]">
              No service history available
            </h2>

            <p className="mt-2 text-[#7B684A]">
              Completed appointments will appear here.
            </p>
          </div>
        )}

        <div className="mt-6 grid gap-5">
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
                      Service #{item.id}
                    </h2>

                    <p className="mt-1 text-sm capitalize text-[#8A6A35]">
                      Status: {item.status}
                    </p>
                  </div>

                  <span className="rounded-full bg-[#FFF2D8] px-4 py-2 text-sm font-semibold text-[#8A6A35]">
                    {item.appointment_date}
                  </span>
                </div>

                <p className="mt-4 text-sm text-[#7B684A]">
                  Time: {item.start_time} - {item.end_time}
                </p>

                {details.length > 0 && (
                  <div className="mt-5 grid gap-3">
                    {details.map((detail) => (
                      <div
                        key={detail.id}
                        className="rounded-2xl border border-[#E8D7B3] bg-[#FFFDF8] p-4"
                      >
                        <p className="font-semibold text-[#2B2115]">
                          {detail.service?.title || "Unknown service"}
                        </p>

                        <p className="mt-1 text-sm text-[#7B684A]">
                          Price: {formatMoney(detail.unit_price)} | Discount:{" "}
                          {detail.discount || 0}% | Subtotal:{" "}
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
