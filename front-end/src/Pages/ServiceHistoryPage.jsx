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
import { getMyAppointmentHistoryApi } from "@/services/appointmentService";
import { createFeedbackApi } from "@/services/feedbackService";
import { useAuth } from "@/context/AuthContext";

function formatMoney(value) {
  if (!value) return "0 VND";
  return Number(value).toLocaleString("vi-VN") + " VND";
}

function getFeedback(item) {
  return item.feedbacks || item.feedback || null;
}

function ServiceHistoryPage() {
  const { role } = useAuth();

  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadHistory() {
    try {
      setIsLoading(true);

      const data = await getMyAppointmentHistoryApi(role);

      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error.response?.data || error);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (role) {
      loadHistory();
    }
  }, [role]);

  const openFeedbackForm = (invoice) => {
    setSelectedInvoice(invoice);
    setRating(5);
    setComment("");
  };

  const closeFeedbackForm = () => {
    setSelectedInvoice(null);
    setRating(5);
    setComment("");
  };

  const handleSubmitFeedback = async () => {
    if (!selectedInvoice) return;

    try {
      setIsSubmitting(true);

      await createFeedbackApi({
        invoice_id: selectedInvoice.id,
        rating,
        comment,
      });

      toast.success("Feedback submitted successfully!");
      closeFeedbackForm();
      await loadHistory();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to submit feedback.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#FFFCF6] px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-3xl border border-[#E8D7B3] bg-white p-8 shadow-sm">
          <History className="h-10 w-10 text-[#B89555]" />

          <h1 className="mt-4 text-3xl font-bold text-[#2B2115]">
            Service History
          </h1>

          <p className="mt-2 text-[#7B684A] capitalize">
            Role: {role || "Customer"}
          </p>
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
            const feedback = getFeedback(item);

            const total = details.reduce(
              (sum, detail) => sum + Number(detail.subtotal || 0),
              0,
            );

            return (
              <div
                key={item.id}
                className="rounded-3xl border border-[#E8D7B3] bg-white p-6 shadow-sm"
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
                    <span>{item.appointment_date}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-[#B89555]" />
                    <span>
                      {item.start_time} - {item.end_time}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <UserRound className="h-5 w-5 text-[#B89555]" />
                    <span>
                      {role === "staff"
                        ? item.customer?.user?.name || "Unknown customer"
                        : item.staff?.users?.name ||
                          item.staff?.user?.name ||
                          "Staff not assigned"}
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
                            Price: {formatMoney(detail.unit_price)} | Discount:{" "}
                            {detail.discount || 0}% | Subtotal:{" "}
                            {formatMoney(detail.subtotal)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex justify-end">
                      <div className="rounded-2xl bg-white px-5 py-4 text-right">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C2A26A]">
                          Total
                        </p>

                        <p className="mt-1 text-lg font-bold text-[#2B2115]">
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

                {role === "customer" && feedback && (
                  <div className="mt-4 rounded-2xl border border-[#E8D7B3] bg-[#FFFDF8] p-4">
                    <h4 className="font-semibold text-[#2B2115]">
                      Your Feedback
                    </h4>

                    <div className="mt-2 flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${
                            star <= Number(feedback.rating)
                              ? "fill-[#C2A26A] text-[#C2A26A]"
                              : "text-[#D8C6A3]"
                          }`}
                        />
                      ))}
                    </div>

                    <p className="mt-3 text-[#7B684A]">
                      {feedback.comment || "No comment provided."}
                    </p>
                  </div>
                )}

                {role === "customer" &&
                  item.status === "completed" &&
                  !feedback && (
                    <div className="mt-5 flex justify-end">
                      <button
                        type="button"
                        onClick={() => openFeedbackForm(item)}
                        className="rounded-full bg-[#C2A26A] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#9B7A3F]"
                      >
                        Leave Feedback
                      </button>
                    </div>
                  )}
              </div>
            );
          })}
        </div>
      </div>

      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-[#2B2115]">
              Leave Feedback
            </h2>

            <p className="mt-2 text-sm text-[#7B684A]">
              Service History #{selectedInvoice.id}
            </p>

            <p className="mt-1 text-sm text-[#7B684A]">
              Staff:{" "}
              {selectedInvoice.staff?.users?.name ||
                selectedInvoice.staff?.user?.name ||
                "Unknown"}
            </p>

            <div className="mt-6">
              <label className="block text-sm font-semibold text-[#2B2115]">
                Rating
              </label>

              <div className="mt-3 flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="transition hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= rating
                          ? "fill-[#C2A26A] text-[#C2A26A]"
                          : "text-[#D8C6A3]"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-semibold text-[#2B2115]">
                Comment
              </label>

              <textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                rows={4}
                maxLength={500}
                placeholder="Write your feedback..."
                className="mt-2 w-full rounded-2xl border border-[#E8D7B3] p-4 outline-none focus:border-[#C2A26A]"
              />

              <p className="mt-1 text-right text-xs text-[#9B7A3F]">
                {comment.length}/500
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeFeedbackForm}
                className="rounded-full border border-[#E8D7B3] px-5 py-2 text-sm font-semibold text-[#8A6A35] transition hover:bg-[#FFF7E6]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSubmitFeedback}
                disabled={isSubmitting}
                className="rounded-full bg-[#C2A26A] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#9B7A3F] disabled:opacity-60"
              >
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default ServiceHistoryPage;
