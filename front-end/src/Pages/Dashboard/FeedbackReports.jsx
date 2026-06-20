import { useEffect, useMemo, useState } from "react";
import { Search, Star } from "lucide-react";
import api from "@/services/api";

function normalizeFeedbacks(payload) {
  const data = payload?.data?.data || payload?.data || payload || [];
  return Array.isArray(data) ? data : [];
}

function renderStars(rating) {
  const value = Number(rating || 0);
  return "★".repeat(value) + "☆".repeat(5 - value);
}

function cleanComment(comment, preferredStaffName) {
  if (!comment) return "N/A";

  let text = String(comment).trim();

  if (preferredStaffName && preferredStaffName !== "N/A") {
    text = text.replace(`Preferred staff: ${preferredStaffName}`, "");
  }

  text = text.replace(/\s+/g, " ").trim();

  return text || "N/A";
}

function FeedbackReports() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadFeedbacks() {
      try {
        setIsLoading(true);
        setError("");

        const response = await api.get("/feedbacks");

        setFeedbacks(normalizeFeedbacks(response.data));
      } catch (err) {
        setFeedbacks([]);
        setError(
          err.response?.data?.message || "Unable to load feedback reports.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadFeedbacks();
  }, []);

  const filteredFeedbacks = useMemo(() => {
    const keyword = searchTerm.toLowerCase();

    return feedbacks.filter((feedback) => {
      const invoice = feedback.invoice || feedback.invoices || {};
      const customer = invoice.customer?.user || {};
      const services = invoice.invoice_details || [];

      const serviceText = services
        .map((detail) => detail.service?.title || "")
        .join(" ");

      return (
        String(customer.name || "")
          .toLowerCase()
          .includes(keyword) ||
        String(serviceText).toLowerCase().includes(keyword) ||
        String(feedback.comment || "")
          .toLowerCase()
          .includes(keyword)
      );
    });
  }, [feedbacks, searchTerm]);

  const averageRating =
    feedbacks.length > 0
      ? feedbacks.reduce((sum, item) => sum + Number(item.rating || 0), 0) /
        feedbacks.length
      : 0;

  return (
    <section className="min-h-screen bg-slate-100 p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">
            Feedback Reports
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Real feedback submitted by customers after completed services.
          </p>
        </div>

        <div className="rounded-xl bg-zinc-900 px-5 py-3 text-white shadow">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-[#C2A26A]" />

            <span className="font-semibold">
              Average: {averageRating.toFixed(1)} / 5
            </span>
          </div>
        </div>
      </div>

      <div className="mb-4 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by customer, service or comment..."
            className="w-full rounded-xl border border-slate-400 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-slate-900"
          />
        </div>
      </div>

      {isLoading && (
        <div className="rounded-xl bg-white p-5 text-slate-600 shadow">
          Loading feedback reports...
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-50 p-5 text-red-600">{error}</div>
      )}

      {!isLoading && !error && (
        <div className="overflow-hidden rounded-xl bg-zinc-900 shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-sm text-white">
              <thead className="bg-zinc-800 text-zinc-200">
                <tr>
                  <th className="px-5 py-4">Stt</th>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Preferred Staff</th>
                  <th className="px-5 py-4">Service</th>
                  <th className="px-5 py-4">Rating</th>
                  <th className="px-5 py-4">Comment</th>
                  <th className="px-5 py-4">Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-700">
                {filteredFeedbacks.map((feedback, index) => {
                  const invoice = feedback.invoice || feedback.invoices || {};
                  const customer = invoice.customer?.user || {};
                  const staff =
                    invoice.staff?.users || invoice.staff?.user || {};
                  const services = invoice.invoice_details || [];

                  const serviceNames =
                    services
                      .map((detail) => detail.service?.title)
                      .filter(Boolean)
                      .join(", ") || "N/A";

                  const preferredStaffName = staff.name || "N/A";

                  const commentText = cleanComment(
                    feedback.comment,
                    preferredStaffName,
                  );

                  return (
                    <tr key={feedback.id} className="hover:bg-zinc-800">
                      <td className="px-5 py-4">{index + 1}</td>

                      <td className="px-5 py-4 font-medium">
                        {customer.name || "N/A"}
                      </td>

                      <td className="px-5 py-4 text-[#C2A26A] font-medium">
                        {preferredStaffName}
                      </td>

                      <td className="px-5 py-4">{serviceNames}</td>

                      <td className="px-5 py-4 font-semibold text-[#C2A26A]">
                        {renderStars(feedback.rating)}
                      </td>

                      <td className="max-w-[400px] px-5 py-4 whitespace-normal break-words leading-relaxed">
                        {commentText}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        {feedback.created_at
                          ? new Date(feedback.created_at).toLocaleDateString(
                              "en-US",
                            )
                          : "N/A"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredFeedbacks.length === 0 && (
            <div className="p-8 text-center text-zinc-300">
              No feedback reports found.
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default FeedbackReports;
