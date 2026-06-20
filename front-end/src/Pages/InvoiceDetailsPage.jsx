import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  FileText,
  Scissors,
  UserRound,
} from "lucide-react";
import { getMyAppointmentHistoryApi } from "@/services/appointmentService";
import { useAuth } from "@/context/AuthContext";

function formatMoney(value) {
  if (!value) return "0 VND";
  return Number(value).toLocaleString("vi-VN") + " VND";
}

function formatTime(time) {
  if (!time) return "N/A";
  return String(time).slice(0, 5);
}

function getStaffName(item) {
  return item.staff?.users?.name || item.staff?.user?.name || "Not assigned";
}

function getCustomerName(item) {
  return item.customer?.user?.name || "Unknown customer";
}

function InvoiceDetailsPage() {
  const { role } = useAuth();

  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadInvoices() {
      try {
        setIsLoading(true);
        setError("");

        const data = await getMyAppointmentHistoryApi(role);

        setInvoices(Array.isArray(data) ? data : []);
      } catch (err) {
        setInvoices([]);
        setError(
          err.response?.data?.message ||
            "Unable to load invoice details. Please try again later.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadInvoices();
  }, [role]);

  return (
    <section className="min-h-screen bg-[#FFFCF6] px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-3xl border border-[#E8D7B3] bg-white p-8 shadow-sm">
          <FileText className="h-10 w-10 text-[#B89555]" />

          <h1 className="mt-4 text-3xl font-bold text-[#2B2115]">
            Invoice Details
          </h1>

          <p className="mt-2 text-[#7B684A]">
            View paid invoices for completed appointments.
          </p>
        </div>

        {isLoading && (
          <div className="mt-6 rounded-3xl border border-[#E8D7B3] bg-white p-6 text-[#7B684A]">
            Loading invoice details...
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-3xl border border-red-100 bg-red-50 p-6 text-red-600">
            {error}
          </div>
        )}

        {!isLoading && !error && invoices.length === 0 && (
          <div className="mt-6 rounded-3xl border border-[#E8D7B3] bg-white p-8 text-center shadow-sm">
            <FileText className="mx-auto h-12 w-12 text-[#B89555]" />
            <h2 className="mt-4 text-xl font-bold text-[#2B2115]">
              No paid invoices yet
            </h2>
            <p className="mt-2 text-[#7B684A]">
              Completed and paid appointments will appear here.
            </p>
          </div>
        )}

        <div className="mt-6 grid gap-5">
          {!isLoading &&
            !error &&
            invoices.map((invoice) => {
              const details = invoice.invoice_details || [];
              const total = details.reduce((sum, detail) => {
                return sum + Number(detail.subtotal || 0);
              }, 0);

              return (
                <article
                  key={invoice.id}
                  className="rounded-3xl border border-[#E8D7B3] bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-[#2B2115]">
                        Invoice #{invoice.id}
                      </h2>

                      <p className="mt-1 text-sm capitalize text-[#8A6A35]">
                        Status: {invoice.status}
                      </p>
                    </div>

                    <span className="rounded-full bg-[#FFF2D8] px-4 py-2 text-sm font-semibold text-[#8A6A35]">
                      Paid
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3 text-sm text-[#7B684A] md:grid-cols-3">
                    <div className="flex items-center gap-3">
                      <CalendarDays className="h-5 w-5 text-[#B89555]" />
                      <span>{invoice.appointment_date || "N/A"}</span>
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
                      <span>
                        {role === "staff"
                          ? getCustomerName(invoice)
                          : getStaffName(invoice)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl bg-[#FFF7E6] p-4">
                    <h3 className="font-semibold text-[#2B2115]">
                      Invoice Services
                    </h3>

                    <div className="mt-3 grid gap-3">
                      {details.map((detail) => (
                        <div
                          key={detail.id}
                          className="rounded-2xl border border-[#E8D7B3] bg-white p-4"
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

                            <div className="text-right">
                              <p className="font-semibold text-[#2B2115]">
                                {formatMoney(detail.subtotal)}
                              </p>

                              <p className="mt-1 text-xs text-[#8A6A35]">
                                Discount: {detail.discount || 0}%
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex justify-end">
                      <div className="rounded-xl bg-white px-4 py-3 text-right">
                        <p className="text-xs uppercase tracking-[0.16em] text-[#B89555]">
                          Total Paid
                        </p>
                        <p className="text-xl font-bold text-[#2B2115]">
                          {formatMoney(total)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-[#E8D7B3] bg-white p-4 text-sm text-[#7B684A]">
                    <p>
                      <span className="font-semibold text-[#2B2115]">
                        Payment Method:
                      </span>{" "}
                      QR / Banking
                    </p>

                    <p className="mt-2">
                      <span className="font-semibold text-[#2B2115]">
                        Payment Time:
                      </span>{" "}
                      {invoice.updated_at
                        ? new Date(invoice.updated_at).toLocaleString("en-US")
                        : "N/A"}
                    </p>
                  </div>
                </article>
              );
            })}
        </div>
      </div>
    </section>
  );
}

export default InvoiceDetailsPage;
