import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import api from "@/services/api";

function getAuthHeaders() {
  const token = localStorage.getItem("zenstyle_access_token");

  return {
    Authorization: `Bearer ${token}`,
  };
}

function formatDate(value) {
  if (!value) return "N/A";

  return new Date(value).toLocaleDateString("vi-VN");
}

function Feedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadFeedbacks(page = 1) {
    try {
      setIsLoading(true);
      setError("");

      const response = await api.get(`/dashboard/feedbacks?page=${page}`, {
        headers: getAuthHeaders(),
      });

      setFeedbacks(response.data.data || []);
      setPagination({
        currentPage: response.data.current_page,
        lastPage: response.data.last_page,
        total: response.data.total,
      });
    } catch (err) {
      setFeedbacks([]);
      setError(
        err.response?.data?.message ||
          "Unable to load feedback reports. Please try again later.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadFeedbacks();
  }, []);

  return (
    <section className="min-h-screen bg-slate-50 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-zinc-900">Feedback Reports</h1>

        <p className="mt-2 text-zinc-500">
          Review customer ratings and service comments.
        </p>
      </div>

      {isLoading && (
        <div className="rounded-xl border bg-white p-6 shadow">
          Loading feedback reports...
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-600">
          {error}
        </div>
      )}

      {!isLoading && !error && feedbacks.length === 0 && (
        <div className="rounded-xl border bg-white p-8 text-center shadow">
          <h2 className="text-xl font-bold text-zinc-900">No feedback found</h2>

          <p className="mt-2 text-zinc-500">
            Customer feedback will appear here after completed services are
            reviewed.
          </p>
        </div>
      )}

      {!isLoading && !error && feedbacks.length > 0 && (
        <div className="overflow-hidden rounded-xl border bg-white shadow">
          <table className="w-full">
            <thead className="bg-zinc-900 text-white">
              <tr>
                <th className="p-4 text-left">Customer</th>
                <th className="p-4 text-left">Staff</th>
                <th className="p-4 text-left">Service</th>
                <th className="p-4 text-left">Rating</th>
                <th className="p-4 text-left">Comment</th>
                <th className="p-4 text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {feedbacks.map((feedback) => {
                const invoice = feedback.invoice;
                const customerName =
                  invoice?.customer?.user?.name || "Unknown customer";
                const staffName =
                  invoice?.staff?.users?.name ||
                  invoice?.staff?.user?.name ||
                  "Unknown staff";
                const services = invoice?.invoice_details || [];

                return (
                  <tr
                    key={feedback.id}
                    className="border-gray-300 border-b  transition hover:bg-slate-50"
                  >
                    <td className="p-4 font-medium text-zinc-900">
                      {customerName}
                    </td>

                    <td className="p-4 text-zinc-700">{staffName}</td>

                    <td className="p-4 text-zinc-700">
                      {services.length > 0
                        ? services
                            .map(
                              (detail) =>
                                detail.service?.title || "Unknown service",
                            )
                            .join(", ")
                        : "No service"}
                    </td>

                    <td className="p-4">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-5 w-5 ${
                              star <= Number(feedback.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-zinc-300"
                            }`}
                          />
                        ))}
                      </div>
                    </td>

                    <td className="max-w-xs p-4 text-zinc-700">
                      {feedback.comment || "No comment"}
                    </td>

                    <td className="p-4 text-zinc-500">
                      {formatDate(feedback.created_at)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {pagination && pagination.lastPage > 1 && (
            <div className="flex items-center justify-end gap-2 p-4">
              <button
                type="button"
                disabled={pagination.currentPage <= 1}
                onClick={() => loadFeedbacks(pagination.currentPage - 1)}
                className="rounded border px-3 py-1 disabled:opacity-50"
              >
                Prev
              </button>

              <span className="text-sm text-zinc-500">
                Page {pagination.currentPage} of {pagination.lastPage}
              </span>

              <button
                type="button"
                disabled={pagination.currentPage >= pagination.lastPage}
                onClick={() => loadFeedbacks(pagination.currentPage + 1)}
                className="rounded border px-3 py-1 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default Feedbacks;
