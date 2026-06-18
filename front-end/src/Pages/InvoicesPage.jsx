import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Clock, Eye, ReceiptText, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getMyPaidInvoicesApi } from "@/services/appointmentService";

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

function getInvoiceTotal(invoice) {
  const details = invoice.invoice_details || [];

  return details.reduce(
    (total, detail) => total + Number(detail.subtotal || 0),
    0,
  );
}

function InvoicesPage() {
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const totalPaidAmount = useMemo(() => {
    return invoices.reduce((sum, invoice) => sum + getInvoiceTotal(invoice), 0);
  }, [invoices]);

  async function loadInvoices() {
    try {
      setIsLoading(true);
      setError("");

      const data = await getMyPaidInvoicesApi();

      setInvoices(Array.isArray(data) ? data : []);
    } catch (err) {
      setInvoices([]);
      setError(
        err.response?.data?.message ||
          "Unable to load invoices. Please try again later.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadInvoices();
  }, []);

  return (
    <section className="min-h-screen bg-[#FFFCF6] px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 rounded-3xl border border-[#E8D7B3] bg-white p-8 shadow-sm">
          <ReceiptText className="h-10 w-10 text-[#B89555]" />

          <h1 className="mt-4 text-3xl font-bold text-[#2B2115]">
            Receipt
          </h1>

          <p className="mt-2 text-[#7B684A]">
            Only paid and completed appointments are shown here.
          </p>
        </div>

        {isLoading && (
          <div className="rounded-3xl border border-[#E8D7B3] bg-white p-6 text-[#7B684A]">
            Loading invoices...
          </div>
        )}

        {error && (
          <div className="rounded-3xl border border-red-100 bg-red-50 p-6 text-red-600">
            {error}
          </div>
        )}

        {!isLoading && !error && invoices.length === 0 && (
          <div className="rounded-3xl border border-[#E8D7B3] bg-white p-8 text-center shadow-sm">
            <ReceiptText className="mx-auto h-12 w-12 text-[#B89555]" />

            <h2 className="mt-4 text-xl font-bold text-[#2B2115]">
              No paid invoices found
            </h2>

            <p className="mt-2 text-[#7B684A]">
              Paid appointment invoices will appear here.
            </p>
          </div>
        )}

        <div className="grid gap-5">
          {!isLoading &&
            !error &&
            invoices.map((invoice) => {
              const staffName =
                invoice.staff?.users?.name ||
                invoice.staff?.user?.name ||
                "Not assigned";
              const details = invoice.invoice_details || [];
              const total = getInvoiceTotal(invoice);

              return (
                <article
                  key={invoice.id}
                  className="rounded-3xl border border-[#E8D7B3] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-[#2B2115]">
                        Invoice #{invoice.id}
                      </h2>

                      <p className="mt-1 text-sm capitalize text-[#8A6A35]">
                        Payment status:{" "}
                        {invoice.payment?.payment_status || "paid"}
                      </p>
                    </div>

                    <span className="rounded-full bg-[#FFF2D8] px-4 py-2 text-sm font-semibold text-[#8A6A35]">
                      {formatMoney(total)}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3 text-sm text-[#2B2115] md:grid-cols-3">
                    <div className="flex items-center gap-3">
                      <CalendarDays className="h-5 w-5 text-[#B89555]" />
                      <span>{invoice.appointment_date}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-[#B89555]" />
                      <span>
                        {formatTime(invoice.start_time)} -{" "}
                        {formatTime(invoice.end_time)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <UserRound className="h-5 w-5 text-[#B89555]" />
                      <span>Staff: {staffName}</span>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl bg-[#FFF7E6] p-4">
                    <p className="font-semibold text-[#2B2115]">Services</p>

                    <p className="mt-2 text-sm text-[#7B684A]">
                      {details.length > 0
                        ? details
                            .map(
                              (detail) =>
                                detail.service?.title || "Unknown service",
                            )
                            .join(", ")
                        : "No services"}
                    </p>

                    <p className="mt-3 text-sm text-[#8A6A35]">
                      Payment time:{" "}
                      {formatDateTime(invoice.payment?.updated_at)}
                    </p>
                  </div>

                  <div className="mt-5 flex justify-end">
                    <button
                      type="button"
                      onClick={() => navigate(`/user/invoices/${invoice.id}`)}
                      className="inline-flex items-center gap-2 rounded-full bg-[#B89555] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#9B7A3F]"
                    >
                      <Eye className="h-4 w-4" />
                      View Detail
                    </button>
                  </div>
                </article>
              );
            })}
        </div>
      </div>
    </section>
  );
}

export default InvoicesPage;
