import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, CreditCard, ShieldCheck } from "lucide-react";
import {
  completeAppointmentApi,
  getAppointmentDetailApi,
} from "@/services/appointmentService";

function formatMoney(value) {
  if (!value) return "0 VND";
  return Number(value).toLocaleString("vi-VN") + " VND";
}

function formatTime(time) {
  if (!time) return "N/A";
  return String(time).slice(0, 5);
}

function getStaffName(appointment) {
  return (
    appointment.staff?.users?.name ||
    appointment.staff?.user?.name ||
    "Not assigned"
  );
}

function ZenStyleQrCode() {
  const cells = [
    [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1],
    [0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0],
    [1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1],
    [1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0],
    [0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0],
    [1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1],
    [0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0],
    [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0],
  ];

  const size = 230;
  const padding = 14;
  const cellSize = (size - padding * 2) / cells.length;

  return (
    <div className="flex justify-center">
      <div className="rounded-2xl border border-[#E8D7B3] bg-white p-4 shadow-sm">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <rect width={size} height={size} fill="#ffffff" />

          {cells.map((row, rowIndex) =>
            row.map((cell, colIndex) =>
              cell ? (
                <rect
                  key={`${rowIndex}-${colIndex}`}
                  x={padding + colIndex * cellSize}
                  y={padding + rowIndex * cellSize}
                  width={cellSize}
                  height={cellSize}
                  fill="#111111"
                />
              ) : null,
            ),
          )}
        </svg>
      </div>
    </div>
  );
}

function PaymentPage() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const details = appointment?.invoice_details || [];
  const total = details.reduce((sum, detail) => {
    return sum + Number(detail.subtotal || 0);
  }, 0);

  useEffect(() => {
    async function loadAppointment() {
      try {
        setIsLoading(true);
        setError("");

        const data = await getAppointmentDetailApi(appointmentId);
        setAppointment(data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load payment information. Please try again later.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadAppointment();
  }, [appointmentId]);

  async function handlePayNow() {
    try {
      setIsPaying(true);
      setError("");
      setSuccessMessage("");

      await completeAppointmentApi(appointmentId);

      setSuccessMessage(
        "Payment successful. Your appointment has been marked as completed.",
      );

      setTimeout(() => {
        navigate("/user/service-history");
      }, 1200);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to complete payment. Please try again.",
      );
    } finally {
      setIsPaying(false);
    }
  }

  return (
    <section className="min-h-screen bg-[#FFFCF6] px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-3xl border border-[#E8D7B3] bg-white p-8 shadow-sm">
          <CreditCard className="h-10 w-10 text-[#B89555]" />

          <h1 className="mt-4 text-3xl font-bold text-[#2B2115]">Payment</h1>

          <p className="mt-2 text-[#7B684A]">
            Please only make payment after your service has been completed for
            your safety.
          </p>
        </div>

        {isLoading && (
          <div className="mt-6 rounded-3xl border border-[#E8D7B3] bg-white p-6 text-[#7B684A]">
            Loading payment details...
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-3xl border border-red-100 bg-red-50 p-6 text-red-600">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mt-6 flex items-center gap-3 rounded-3xl border border-green-100 bg-green-50 p-6 text-green-700">
            <CheckCircle2 className="h-6 w-6" />
            <p>{successMessage}</p>
          </div>
        )}

        {!isLoading && appointment && (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-[#E8D7B3] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-[#2B2115]">
                Appointment #{appointment.id}
              </h2>

              <div className="mt-5 grid gap-3 text-sm text-[#7B684A]">
                <p>
                  <span className="font-semibold text-[#2B2115]">Date:</span>{" "}
                  {appointment.appointment_date}
                </p>

                <p>
                  <span className="font-semibold text-[#2B2115]">Time:</span>{" "}
                  {formatTime(appointment.start_time)} -{" "}
                  {formatTime(appointment.end_time)}
                </p>

                <p>
                  <span className="font-semibold text-[#2B2115]">Staff:</span>{" "}
                  {getStaffName(appointment)}
                </p>

                <p className="capitalize">
                  <span className="font-semibold text-[#2B2115]">Status:</span>{" "}
                  {appointment.status}
                </p>
              </div>

              <div className="mt-6 rounded-2xl bg-[#FFF7E6] p-4">
                <h3 className="font-semibold text-[#2B2115]">Services</h3>

                <div className="mt-3 grid gap-3">
                  {details.map((detail) => (
                    <div
                      key={detail.id}
                      className="rounded-xl border border-[#E8D7B3] bg-white p-4"
                    >
                      <div className="flex justify-between gap-4">
                        <div>
                          <p className="font-semibold text-[#2B2115]">
                            {detail.service?.title || "Unknown service"}
                          </p>

                          <p className="mt-1 text-sm text-[#7B684A]">
                            Discount: {detail.discount || 0}%
                          </p>
                        </div>

                        <p className="font-semibold text-[#2B2115]">
                          {formatMoney(detail.subtotal)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-end">
                  <div className="rounded-xl bg-white px-4 py-3 text-right">
                    <p className="text-xs uppercase tracking-[0.16em] text-[#B89555]">
                      Total
                    </p>
                    <p className="text-xl font-bold text-[#2B2115]">
                      {formatMoney(total)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-[#E8D7B3] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-[#2B2115]">
                ZenStyle QR Payment
              </h2>

              <div className="mt-6 rounded-3xl bg-[#FFF7E6] p-5">
                <ZenStyleQrCode />
              </div>

              <div className="mt-6 rounded-2xl bg-[#FFF7E6] p-4 text-sm text-[#7B684A]">
                <p>
                  <span className="font-semibold text-[#2B2115]">
                    Bank Name:
                  </span>{" "}
                  ZenStyle Bank
                </p>

                <p className="mt-2">
                  <span className="font-semibold text-[#2B2115]">
                    Account Number:
                  </span>{" "}
                  123456789
                </p>

                <p className="mt-2">
                  <span className="font-semibold text-[#2B2115]">
                    Account Holder:
                  </span>{" "}
                  ZENSTYLE SALON
                </p>

                <p className="mt-2">
                  <span className="font-semibold text-[#2B2115]">
                    Transfer Content:
                  </span>{" "}
                  ZENSTYLE APPOINTMENT {appointment.id}
                </p>
              </div>

              <div className="mt-6 flex gap-3 rounded-2xl border border-[#E8D7B3] bg-white p-4 text-sm text-[#7B684A]">
                <ShieldCheck className="h-5 w-5 shrink-0 text-[#B89555]" />
                <p>
                  For safety, please only pay after your service has been fully
                  completed.
                </p>
              </div>

              <button
                type="button"
                onClick={handlePayNow}
                disabled={isPaying || appointment.status === "completed"}
                className="mt-6 w-full rounded-xl bg-[#B89555] px-5 py-3 font-semibold text-white transition hover:bg-[#9B7A3F] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {appointment.status === "completed"
                  ? "Already Completed"
                  : isPaying
                    ? "Processing..."
                    : "I Have Paid"}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default PaymentPage;
