import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  CreditCard,
  Scissors,
  Trash2,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  cancelAppointmentApi,
  getMyAppointmentsApi,
} from "@/services/appointmentService";
import { useAuth } from "@/context/AuthContext";

function formatMoney(value) {
  if (!value) return "0 VND";

  return Number(value).toLocaleString("vi-VN") + " VND";
}

function formatTime(time) {
  if (!time) return "N/A";

  return String(time).slice(0, 5);
}

function formatPosition(position) {
  const positionLabels = {
    stylist: "Stylist",
    baber: "Barber",
    barber: "Barber",
    receptionist: "Receptionist",
    manager: "Manager",
  };

  return positionLabels[position] || "Staff";
}

function getStaffName(appointment) {
  return (
    appointment.staff?.users?.name ||
    appointment.staff?.user?.name ||
    "Not assigned"
  );
}

function getCustomerName(appointment) {
  return appointment.customer?.user?.name || "Unknown customer";
}

function AppointmentsPage() {
  const navigate = useNavigate();
  const { user, role } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancellingId, setIsCancellingId] = useState(null);
  const [error, setError] = useState("");

  async function loadAppointments() {
    try {
      setIsLoading(true);
      setError("");

      const data = await getMyAppointmentsApi(role);
      const list = Array.isArray(data) ? data : [];

      setAppointments(
        list.filter(
          (appointment) =>
            appointment.status !== "completed" &&
            appointment.status !== "cancel",
        ),
      );
    } catch (err) {
      setAppointments([]);
      setError(
        err.response?.data?.message ||
          "Unable to load appointments. Please try again later.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCancelAppointment(appointmentId) {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?",
    );

    if (!confirmed) return;

    try {
      setIsCancellingId(appointmentId);
      setError("");

      await cancelAppointmentApi(appointmentId);
      await loadAppointments();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to cancel appointment. Please try again later.",
      );
    } finally {
      setIsCancellingId(null);
    }
  }

  useEffect(() => {
    loadAppointments();
  }, [role]);

  if (!user) {
    return <div className="p-8 text-[#8A6A35]">Please sign in first.</div>;
  }

  return (
    <section className="min-h-screen bg-[#FFFCF6] px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 rounded-3xl border border-[#E8D7B3] bg-white p-6 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#B89555]">
            ZenStyle Booking
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#2B2115]">
            Appointments
          </h1>

          <p className="mt-2 text-[#7B684A] capitalize">
            Role: {role || "customer"}
          </p>
        </div>

        {isLoading && (
          <div className="rounded-3xl border border-[#E8D7B3] bg-white p-6 text-[#7B684A]">
            Loading appointments...
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-3xl border border-red-100 bg-red-50 p-6 text-red-600">
            {error}
          </div>
        )}

        {!isLoading && appointments.length === 0 && (
          <div className="rounded-3xl border border-[#E8D7B3] bg-white p-8 text-center shadow-sm">
            <CalendarDays className="mx-auto h-12 w-12 text-[#B89555]" />

            <h2 className="mt-4 text-xl font-bold text-[#2B2115]">
              No appointments found
            </h2>

            <p className="mt-2 text-[#7B684A]">
              Your upcoming appointments will appear here.
            </p>
          </div>
        )}

        <div className="grid gap-5">
          {!isLoading &&
            appointments.map((appointment) => {
              const details = appointment.invoice_details || [];
              const staffPosition = formatPosition(appointment.staff?.position);
              const staffName = getStaffName(appointment);
              const customerName = getCustomerName(appointment);
              const total = details.reduce((sum, detail) => {
                return sum + Number(detail.subtotal || 0);
              }, 0);

              const canPay =
                role === "customer" && appointment.status !== "completed";

              const canCancel =
                role !== "staff" &&
                appointment.status !== "completed" &&
                appointment.status !== "cancel";

              return (
                <div
                  key={appointment.id}
                  className="rounded-3xl border border-[#E8D7B3] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-[#2B2115]">
                        Upcoming Appointment
                      </h2>

                      <p className="mt-1 text-sm capitalize text-[#8A6A35]">
                        Status: {appointment.status}
                      </p>
                    </div>

                    <span className="rounded-full bg-[#FFF2D8] px-4 py-2 text-sm font-semibold text-[#8A6A35]">
                      {appointment.appointment_date}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3 text-sm text-[#2B2115] md:grid-cols-3">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-[#B89555]" />
                      <span>
                        {formatTime(appointment.start_time)} -{" "}
                        {formatTime(appointment.end_time)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <UserRound className="h-5 w-5 text-[#B89555]" />
                      <span>
                        {role === "staff"
                          ? `Customer: ${customerName}`
                          : `${staffPosition}: ${staffName}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Scissors className="h-5 w-5 text-[#B89555]" />
                      <span>
                        {details.length} service{details.length > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  {details.length > 0 && (
                    <div className="mt-5 rounded-2xl bg-[#FFF7E6] p-4">
                      <h3 className="font-semibold text-[#2B2115]">
                        Appointment Services
                      </h3>

                      <div className="mt-3 grid gap-3">
                        {details.map((detail) => (
                          <div
                            key={detail.id}
                            className="rounded-xl border border-[#E8D7B3] bg-white p-4"
                          >
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div>
                                <p className="font-semibold text-[#2B2115]">
                                  {detail.service?.title || "Unknown service"}
                                </p>

                                {detail.service?.description && (
                                  <p className="mt-1 text-sm text-[#7B684A]">
                                    {detail.service.description}
                                  </p>
                                )}
                              </div>

                              {detail.service?.duration_minutes && (
                                <span className="rounded-full bg-[#FFF2D8] px-3 py-1 text-xs font-semibold text-[#8A6A35]">
                                  {detail.service.duration_minutes} minutes
                                </span>
                              )}
                            </div>

                            <p className="mt-3 text-sm text-[#7B684A]">
                              Price: {formatMoney(detail.unit_price)} |
                              Discount: {detail.discount || 0}% | Subtotal:{" "}
                              {formatMoney(detail.subtotal)}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 flex justify-end">
                        <div className="rounded-xl bg-white px-4 py-3 text-right">
                          <p className="text-xs uppercase tracking-[0.16em] text-[#B89555]">
                            Total
                          </p>
                          <p className="text-lg font-bold text-[#2B2115]">
                            {formatMoney(total)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {appointment.note && (
                    <p className="mt-4 rounded-xl bg-[#FFF7E6] p-4 text-[#7B684A]">
                      Note: {appointment.note}
                    </p>
                  )}

                  <div className="mt-5 flex flex-wrap justify-end gap-3">
                    {canCancel && (
                      <button
                        type="button"
                        onClick={() => handleCancelAppointment(appointment.id)}
                        disabled={isCancellingId === appointment.id}
                        className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Trash2 className="h-4 w-4" />
                        {isCancellingId === appointment.id
                          ? "Cancelling..."
                          : "Cancel Appointment"}
                      </button>
                    )}

                    {canPay && (
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/user/payment/${appointment.id}`)
                        }
                        className="inline-flex items-center gap-2 rounded-xl bg-[#B89555] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#9B7A3F]"
                      >
                        <CreditCard className="h-4 w-4" />
                        Pay Now
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}

export default AppointmentsPage;
