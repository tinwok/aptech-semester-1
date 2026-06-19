import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  History,
  Scissors,
  Star,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import api from "@/services/api";
import { getMyAppointmentHistoryApi } from "@/services/appointmentService";
import { createFeedbackApi } from "@/services/feedbackService";
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

function ServiceHistoryPage() {
  const { role } = useAuth();

  const [items, setItems] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [error, setError] = useState("");

  const [activeFeedbackId, setActiveFeedbackId] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [preferredStaffId, setPreferredStaffId] = useState("");

  async function loadHistory() {
    try {
      setIsLoading(true);
      setError("");

      const data = await getMyAppointmentHistoryApi(role);

      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setItems([]);
      setError(
        err.response?.data?.message ||
          "Unable to load service history. Please try again later.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function loadStaffs() {
    try {
      const response = await api.get("/staffs");
      const data = response.data?.data || response.data || [];

      setStaffs(Array.isArray(data) ? data : []);
    } catch {
      setStaffs([]);
    }
  }

  useEffect(() => {
    loadHistory();
    loadStaffs();
  }, [role]);

  function openFeedbackForm(item) {
    setActiveFeedbackId(item.id);
    setRating(5);
    setComment("");
    setPreferredStaffId(item.staff_id ? String(item.staff_id) : "");
  }

  function closeFeedbackForm() {
    setActiveFeedbackId(null);
    setRating(5);
    setComment("");
    setPreferredStaffId("");
  }

  function getPreferredStaffName() {
    const selectedStaff = staffs.find(
      (staff) => String(staff.id) === String(preferredStaffId),
    );

    return (
      selectedStaff?.users?.name ||
      selectedStaff?.user?.name ||
      selectedStaff?.name ||
      ""
    );
  }

  async function handleSubmitFeedback(invoiceId) {
    try {
      setIsSubmittingFeedback(true);

      const preferredStaffName = getPreferredStaffName();

      const finalComment = preferredStaffName
        ? `Preferred staff: ${preferredStaffName}\n${comment || ""}`.trim()
        : comment;

      await createFeedbackApi({
        invoice_id: invoiceId,
        rating,
        comment: finalComment || null,
      });

      toast.success("Feedback submitted successfully.");
      closeFeedbackForm();
      await loadHistory();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Unable to submit feedback. Please try again.",
      );
    } finally {
      setIsSubmittingFeedback(false);
    }
  }

  return (
    <section className="min-h-screen bg-[#FFFCF6] px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-3xl border border-[#E8D7B3] bg-white p-8 shadow-sm">
          <History className="h-10 w-10 text-[#B89555]" />

          <h1 className="mt-4 text-3xl font-bold text-[#2B2115]">
            Service History
          </h1>

          <p className="mt-2 text-[#7B684A] capitalize">
            Role: {role || "customer"}
          </p>
        </div>

        {isLoading && (
          <div className="mt-6 rounded-3xl border border-[#E8D7B3] bg-white p-6 text-[#7B684A]">
            Loading service history...
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-3xl border border-red-100 bg-red-50 p-6 text-red-600">
            {error}
          </div>
        )}

        {!isLoading && !error && items.length === 0 && (
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
          {!isLoading &&
            !error &&
            items.map((item) => {
              const details = item.invoice_details || [];
              const total = details.reduce((sum, detail) => {
                return sum + Number(detail.subtotal || 0);
              }, 0);

              const canLeaveFeedback =
                role === "customer" && item.status === "completed";

              return (
                <div
                  key={item.id}
                  className="rounded-3xl border border-[#E8D7B3] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-[#2B2115]">
                        Service History #{item.id}
                      </h2>

                      <p className="mt-1 text-sm capitalize text-[#8A6A35]">
                        Status: {item.status}
                      </p>
                    </div>

                    <span className="rounded-full bg-[#FFF2D8] px-4 py-2 text-sm font-semibold text-[#8A6A35]">
                      {item.appointment_date}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3 text-sm text-[#7B684A] md:grid-cols-3">
                    <div className="flex items-center gap-3">
                      <CalendarDays className="h-5 w-5 text-[#B89555]" />
                      <span>{item.appointment_date || "N/A"}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-[#B89555]" />
                      <span>
                        {formatTime(item.start_time)} -{" "}
                        {formatTime(item.end_time)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <UserRound className="h-5 w-5 text-[#B89555]" />
                      <span>
                        {role === "staff"
                          ? getCustomerName(item)
                          : getStaffName(item)}
                      </span>
                    </div>
                  </div>

                  {details.length > 0 && (
                    <div className="mt-5 rounded-2xl bg-[#FFF7E6] p-4">
                      <h3 className="font-semibold text-[#2B2115]">
                        Completed Services
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

                  {item.note && (
                    <p className="mt-4 rounded-xl bg-[#FFF7E6] p-4 text-[#7B684A]">
                      Note: {item.note}
                    </p>
                  )}

                  {canLeaveFeedback && activeFeedbackId !== item.id && (
                    <div className="mt-5 flex justify-end">
                      <button
                        type="button"
                        onClick={() => openFeedbackForm(item)}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#B89555] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#9B7A3F]"
                      >
                        <Star className="h-4 w-4" />
                        Leave Feedback
                      </button>
                    </div>
                  )}

                  {canLeaveFeedback && activeFeedbackId === item.id && (
                    <div className="mt-5 rounded-2xl border border-[#E8D7B3] bg-[#FFFDF8] p-5">
                      <h3 className="text-lg font-bold text-[#2B2115]">
                        Leave Feedback
                      </h3>

                      <div className="mt-4 grid gap-4">
                        <label className="grid gap-2">
                          <span className="text-sm font-semibold text-[#2B2115]">
                            Rating
                          </span>

                          <select
                            value={rating}
                            onChange={(event) =>
                              setRating(Number(event.target.value))
                            }
                            className="rounded-xl border border-[#E8D7B3] bg-white px-4 py-3 text-[#2B2115] outline-none focus:border-[#B89555]"
                          >
                            <option value={5}>5 - Excellent</option>
                            <option value={4}>4 - Good</option>
                            <option value={3}>3 - Average</option>
                            <option value={2}>2 - Poor</option>
                            <option value={1}>1 - Very Poor</option>
                          </select>
                        </label>

                        <label className="grid gap-2">
                          <span className="text-sm font-semibold text-[#2B2115]">
                            Preferred Staff
                          </span>

                          <select
                            value={preferredStaffId}
                            onChange={(event) =>
                              setPreferredStaffId(event.target.value)
                            }
                            className="rounded-xl border border-[#E8D7B3] bg-white px-4 py-3 text-[#2B2115] outline-none focus:border-[#B89555]"
                          >
                            <option value="">No preferred staff</option>

                            {staffs.map((staff) => (
                              <option key={staff.id} value={String(staff.id)}>
                                {staff.users?.name ||
                                  staff.user?.name ||
                                  staff.name ||
                                  `Staff #${staff.id}`}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label className="grid gap-2">
                          <span className="text-sm font-semibold text-[#2B2115]">
                            Comment
                          </span>

                          <textarea
                            value={comment}
                            onChange={(event) => setComment(event.target.value)}
                            className="min-h-28 rounded-xl border border-[#E8D7B3] bg-white px-4 py-3 text-[#2B2115] outline-none focus:border-[#B89555]"
                            placeholder="Share your experience..."
                          />
                        </label>
                      </div>

                      <div className="mt-5 flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={closeFeedbackForm}
                          className="rounded-xl border border-[#E8D7B3] px-5 py-3 text-sm font-semibold text-[#8A6A35] transition hover:bg-[#FFF7E6]"
                        >
                          Cancel
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSubmitFeedback(item.id)}
                          disabled={isSubmittingFeedback}
                          className="rounded-xl bg-[#B89555] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#9B7A3F] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isSubmittingFeedback
                            ? "Submitting..."
                            : "Submit Feedback"}
                        </button>
                      </div>
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
