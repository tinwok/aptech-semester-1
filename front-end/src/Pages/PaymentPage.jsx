import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Banknote,
  CheckCircle2,
  Clock,
  QrCode,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  getAppointmentDetailApi,
  payAppointmentApi,
} from "@/services/appointmentService";

function formatMoney(value) {
  if (!value) return "0 VND";
  return Number(value).toLocaleString("vi-VN") + " VND";
}

function formatTime(time) {
  if (!time) return "N/A";
  return String(time).slice(0, 5);
}

function PaymentPage() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState("");

  const totalAmount = useMemo(() => {
    const details = appointment?.invoice_details || [];
    return details.reduce(
      (sum, detail) => sum + Number(detail.subtotal || 0),
      0,
    );
  }, [appointment]);

  const qrContent = encodeURIComponent(
    `ZenStyle Payment | Appointment #${appointmentId} | Amount: ${totalAmount} VND`,
  );

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${qrContent}`;

  async function loadAppointment() {
    try {
      setIsLoading(true);
      setError("");

      const data = await getAppointmentDetailApi(appointmentId);
      setAppointment(data);
    } catch (err) {
      setAppointment(null);
      setError(
        err.response?.data?.message ||
          "Unable to load payment information. Please try again later.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePay() {
    const confirmed = window.confirm(
      "Payment is a demo action. Do you want to mark this appointment as paid and completed?",
    );

    if (!confirmed) return;

    try {
      setIsPaying(true);

      await payAppointmentApi(appointmentId);

      toast.success("Payment successful. Appointment completed!");
      navigate(`/user/invoices/${appointmentId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to process payment.");
    } finally {
      setIsPaying(false);
    }
  }

  useEffect(() => {
    loadAppointment();
  }, [appointmentId]);

  if (isLoading) {
    return (
      <section className="min-h-screen bg-[#FFFCF6] px-6 py-10">
        <div className="mx-auto max-w-4xl rounded-3xl border border-[#E8D7B3] bg-white p-8 text-[#7B684A] shadow-sm">
          Loading payment information...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen bg-[#FFFCF6] px-6 py-10">
        <div className="mx-auto max-w-4xl rounded-3xl border border-red-100 bg-red-50 p-8 text-red-600">
          {error}
        </div>
      </section>
    );
  }

  if (!appointment) {
    return null;
  }

  const details = appointment.invoice_details || [];
  const staffName =
    appointment.staff?.users?.name ||
    appointment.staff?.user?.name ||
    "Not assigned";

  return (
    <section className="min-h-screen bg-[#FFFCF6] px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 rounded-3xl border border-[#E8D7B3] bg-white p-8 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#B89555]">
            ZenStyle Payment
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#2B2115]">
            Appointment Payment
          </h1>

          <p className="mt-2 text-[#7B684A]">
            Appointment #{appointment.id} with {staffName}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded-3xl border border-[#E8D7B3] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#2B2115]">
              Payment Summary
            </h2>

            <div className="mt-5 grid gap-3 text-[#7B684A]">
              <p>
                <strong className="text-[#2B2115]">Date:</strong>{" "}
                {appointment.appointment_date}
              </p>

              <p>
                <strong className="text-[#2B2115]">Time:</strong>{" "}
                {formatTime(appointment.start_time)} -{" "}
                {formatTime(appointment.end_time)}
              </p>

              <p>
                <strong className="text-[#2B2115]">Staff:</strong> {staffName}
              </p>

              <p className="capitalize">
                <strong className="text-[#2B2115]">Status:</strong>{" "}
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
                    <div className="flex items-start justify-between gap-3">
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

                      <p className="font-semibold text-[#2B2115]">
                        {formatMoney(detail.subtotal)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex justify-end">
                <div className="rounded-2xl bg-white px-5 py-4 text-right">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C2A26A]">
                    Total
                  </p>

                  <p className="mt-1 text-xl font-bold text-[#2B2115]">
                    {formatMoney(totalAmount)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
              <AlertTriangle className="mt-1 h-5 w-5 shrink-0" />

              <p>
                For safety reasons, customers should only make payment after the
                service has been fully completed.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-[#E8D7B3] bg-white p-6 text-center shadow-sm">
            <QrCode className="mx-auto h-10 w-10 text-[#B89555]" />

            <h2 className="mt-3 text-xl font-bold text-[#2B2115]">
              ZenStyle QR Payment
            </h2>

            <div className="mt-5 flex justify-center">
              <img
                src={qrUrl}
                alt="ZenStyle QR Code"
                className="h-56 w-56 rounded-2xl border border-[#E8D7B3] bg-white p-3"
              />
            </div>

            <div className="mt-5 rounded-2xl bg-[#FFF7E6] p-4 text-left text-sm text-[#7B684A]">
              <div className="flex items-center gap-2 font-semibold text-[#2B2115]">
                <Banknote className="h-5 w-5 text-[#B89555]" />
                Bank Transfer Information
              </div>

              <p className="mt-3">
                <strong>Bank:</strong> Vietcombank
              </p>
              <p>
                <strong>Account name:</strong> ZenStyle Beauty Salon
              </p>
              <p>
                <strong>Account number:</strong> 0123456789
              </p>
              <p>
                <strong>Amount:</strong> {formatMoney(totalAmount)}
              </p>
              <p>
                <strong>Content:</strong> ZENSTYLE APPT {appointment.id}
              </p>
            </div>

            <button
              type="button"
              onClick={handlePay}
              disabled={isPaying || appointment.status === "completed"}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#B89555] px-5 py-3 font-semibold text-white transition hover:bg-[#9B7A3F] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {appointment.status === "completed" ? (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  Already Paid
                </>
              ) : isPaying ? (
                <>
                  <Clock className="h-5 w-5" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  Pay Now
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PaymentPage;
