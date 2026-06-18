import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Clock, ReceiptText, UserRound } from "lucide-react";
import { useParams } from "react-router-dom";
import { getMyPaidInvoiceDetailApi } from "@/services/appointmentService";

function formatMoney(value) {
  if (!value) return "0 VND";
  return Number(value).toLocaleString("vi-VN") + " VND";
}

function formatTime(time) {
  if (!time) return "N/A";
  return String(time).slice(0, 5);
}

function formatDateTime(value) {
  if (!value) return "N/A";

  return new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function InvoiceDetailPage() {
  const { invoiceId } = useParams();

  const [invoice, setInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const details = invoice?.invoice_details || [];

  const total = useMemo(() => {
    return details.reduce(
      (sum, detail) => sum + Number(detail.subtotal || 0),
      0,
    );
  }, [details]);

  async function loadInvoice() {
    try {
      setIsLoading(true);
      setError("");

      const data = await getMyPaidInvoiceDetailApi(invoiceId);
      setInvoice(data);
    } catch (err) {
      setInvoice(null);
      setError(
        err.response?.data?.message ||
          "Unable to load invoice detail. This invoice may not be paid yet.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadInvoice();
  }, [invoiceId]);

  if (isLoading) {
    return (
      <section className="min-h-screen bg-[#FFFCF6] px-6 py-10">
        <div className="mx-auto max-w-5xl rounded-3xl border border-[#E8D7B3] bg-white p-8 text-[#7B684A] shadow-sm">
          Loading invoice detail...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen bg-[#FFFCF6] px-6 py-10">
        <div className="mx-auto max-w-5xl rounded-3xl border border-red-100 bg-red-50 p-8 text-red-600">
          {error}
        </div>
      </section>
    );
  }

  if (!invoice) return null;

  const staffName =
    invoice.staff?.users?.name || invoice.staff?.user?.name || "Not assigned";
  const customerName = invoice.customer?.user?.name || "Customer";

  return (
    <section className="min-h-screen bg-[#FFFCF6] px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 rounded-3xl border border-[#E8D7B3] bg-white p-8 shadow-sm">
          <ReceiptText className="h-10 w-10 text-[#B89555]" />

          <h1 className="mt-4 text-3xl font-bold text-[#2B2115]">
            Invoice Detail
          </h1>

          <p className="mt-2 text-[#7B684A]">Invoice #{invoice.id}</p>
        </div>

        <div className="rounded-3xl border border-[#E8D7B3] bg-white p-6 shadow-sm">
          <div className="grid gap-4 text-[#7B684A] md:grid-cols-2">
            <div className="flex items-center gap-3">
              <UserRound className="h-5 w-5 text-[#B89555]" />
              <span>
                <strong className="text-[#2B2115]">Customer:</strong>{" "}
                {customerName}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <UserRound className="h-5 w-5 text-[#B89555]" />
              <span>
                <strong className="text-[#2B2115]">Staff:</strong> {staffName}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <CalendarDays className="h-5 w-5 text-[#B89555]" />
              <span>
                <strong className="text-[#2B2115]">Appointment date:</strong>{" "}
                {invoice.appointment_date}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-[#B89555]" />
              <span>
                <strong className="text-[#2B2115]">Time:</strong>{" "}
                {formatTime(invoice.start_time)} -{" "}
                {formatTime(invoice.end_time)}
              </span>
            </div>

            <div>
              <strong className="text-[#2B2115]">Payment status:</strong>{" "}
              <span className="capitalize">
                {invoice.payment?.payment_status}
              </span>
            </div>

            <div>
              <strong className="text-[#2B2115]">Payment time:</strong>{" "}
              {formatDateTime(invoice.payment?.updated_at)}
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-[#FFF7E6] p-4">
            <h2 className="font-semibold text-[#2B2115]">Services</h2>

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

                    <p className="font-semibold text-[#2B2115]">
                      {formatMoney(detail.subtotal)}
                    </p>
                  </div>

                  <p className="mt-3 text-sm text-[#7B684A]">
                    Price: {formatMoney(detail.unit_price)} | Discount:{" "}
                    {detail.discount || 0}%
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-end">
              <div className="rounded-2xl bg-white px-5 py-4 text-right">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C2A26A]">
                  Total
                </p>

                <p className="mt-1 text-xl font-bold text-[#2B2115]">
                  {formatMoney(total)}
                </p>
              </div>
            </div>
          </div>

          {invoice.note && (
            <p className="mt-4 rounded-xl bg-[#FFF7E6] p-4 text-[#7B684A]">
              Note: {invoice.note}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default InvoiceDetailPage;
