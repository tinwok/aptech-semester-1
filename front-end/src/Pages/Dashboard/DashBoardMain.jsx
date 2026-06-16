import { useEffect, useState } from "react";
import api from "@/services/api";

export default function DashBoardMain() {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await api.get("/dashboard");
        setDashboardData(res.data);
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Loading dashboard...</h1>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="p-6">
        <h1 className="text-red-500">Failed to load dashboard</h1>
      </div>
    );
  }

  const stats = [
    {
      title: "Staffs",
      value: dashboardData.staffs?.total ?? 0,
    },
    {
      title: "Customers",
      value: dashboardData.customers?.total ?? 0,
    },
    {
      title: "Appointments",
      value: dashboardData.appointments?.total ?? 0,
    },
  ];

  const recentAppointments = dashboardData.recentAppointments ?? [];

  return (
    <div className="p-6">
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-4 gap-4">
        {stats.map((item) => (
          <div
            key={item.title}
            className="rounded-xl border bg-white p-5 shadow transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <p className="text-gray-500">{item.title}</p>
            <h2 className="mt-2 text-3xl font-bold">{item.value}</h2>
          </div>
        ))}
      </div>

      {/* Recent */}
      <div className="rounded-xl border bg-white p-5 shadow">
        <h2 className="mb-4 text-xl font-bold">Recent Appointments</h2>

        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Service</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {recentAppointments.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="p-3">{item.id}</td>
                <td className="p-3">{item.customer}</td>
                <td className="p-3">{item.service}</td>
                <td className="p-3">
                  <span
                    className={`rounded-full px-3 py-1 text-sm ${
                      item.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : item.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination (fake UI) */}
        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            className="rounded border px-3 py-1 disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </button>

          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`rounded border px-3 py-1 ${
                currentPage === page ? "bg-zinc-900 text-white" : ""
              }`}
            >
              {page}
            </button>
          ))}

          <button
            className="rounded border px-3 py-1 disabled:opacity-50"
            disabled={currentPage === 5}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
