import { useEffect, useState } from "react";
import { CalendarDays, Clock, Scissors, UserRound } from "lucide-react";
import { getMyAppointmentsApi } from "@/services/appointmentService";
import { useAuth } from "@/context/AuthContext";

function formatMoney(value) {
  if (!value) return "0 VND";
  return Number(value).toLocaleString("vi-VN") + " VND";
}

function AppointmentsPage() {
  const { user, role } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAppointments() {
      try {
        const data = await getMyAppointmentsApi();
        setAppointments(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Không thể tải lịch hẹn. Có thể user chưa có customer/staff profile.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadAppointments();
  }, []);

  if (!user) {
    return <div className="p-8 text-[#8A6A35]">Bạn cần đăng nhập.</div>;
  }

  return (
    <section className="min-h-screen bg-[#FFFCF6] px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 rounded-3xl border border-[#E8D7B3] bg-white p-6 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#B89555]">
            Appointment
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[#2B2115]">Lịch hẹn</h1>
          <p className="mt-2 text-[#7B684A]">
            Đường dẫn chung: <strong>/appointments</strong>. Role hiện tại:{" "}
            <strong>{role}</strong>.
          </p>
        </div>

        {isLoading && (
          <div className="rounded-3xl border border-[#E8D7B3] bg-white p-6">
            Đang tải lịch hẹn...
          </div>
        )}

        {error && (
          <div className="rounded-3xl border border-red-100 bg-red-50 p-6 text-red-600">
            {error}
          </div>
        )}

        {!isLoading && !error && appointments.length === 0 && (
          <div className="rounded-3xl border border-[#E8D7B3] bg-white p-8 text-center shadow-sm">
            <CalendarDays className="mx-auto h-12 w-12 text-[#B89555]" />
            <h2 className="mt-4 text-xl font-bold text-[#2B2115]">
              Chưa có lịch hẹn
            </h2>
            <p className="mt-2 text-[#7B684A]">
              Khi có lịch hẹn pending, dữ liệu sẽ hiển thị ở đây.
            </p>
          </div>
        )}

        <div className="grid gap-4">
          {appointments.map((appointment) => {
            const details = appointment.invoice_details || [];

            return (
              <div
                key={appointment.id}
                className="rounded-3xl border border-[#E8D7B3] bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-[#2B2115]">
                      Lịch hẹn #{appointment.id}
                    </h2>
                    <p className="mt-1 text-sm capitalize text-[#8A6A35]">
                      Trạng thái: {appointment.status}
                    </p>
                  </div>

                  <span className="rounded-full bg-[#FFF2D8] px-4 py-2 text-sm font-semibold text-[#8A6A35]">
                    {appointment.appointment_date}
                  </span>
                </div>

                <div className="mt-5 grid gap-3 text-sm md:grid-cols-3">
                  <div className="flex gap-3">
                    <Clock className="h-5 w-5 text-[#B89555]" />
                    <span>
                      {appointment.start_time} - {appointment.end_time}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <UserRound className="h-5 w-5 text-[#B89555]" />
                    <span>Staff ID: {appointment.staff_id || "Chưa có"}</span>
                  </div>

                  <div className="flex gap-3">
                    <Scissors className="h-5 w-5 text-[#B89555]" />
                    <span>{details.length} dịch vụ</span>
                  </div>
                </div>

                {details.length > 0 && (
                  <div className="mt-5 rounded-2xl bg-[#FFF7E6] p-4">
                    <h3 className="font-semibold text-[#2B2115]">
                      Dịch vụ trong lịch hẹn
                    </h3>

                    <div className="mt-3 grid gap-3">
                      {details.map((detail) => (
                        <div
                          key={detail.id}
                          className="rounded-xl border border-[#E8D7B3] bg-white p-4"
                        >
                          <p className="font-semibold text-[#2B2115]">
                            {detail.service?.title || "Dịch vụ chưa rõ"}
                          </p>

                          <p className="mt-1 text-sm text-[#7B684A]">
                            Giá: {formatMoney(detail.unit_price)} | Giảm:{" "}
                            {detail.discount || 0}% | Thành tiền:{" "}
                            {formatMoney(detail.subtotal)}
                          </p>

                          {detail.service?.duration_minutes && (
                            <p className="mt-1 text-sm text-[#7B684A]">
                              Thời lượng: {detail.service.duration_minutes} phút
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {appointment.note && (
                  <p className="mt-4 rounded-xl bg-[#FFF7E6] p-4 text-[#7B684A]">
                    Ghi chú: {appointment.note}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default AppointmentsPage;
