import { useEffect, useState } from "react";
import api from "@/services/api";

function getCustomerName(item) {
  return item.customer?.user?.name || item.customer?.user?.phone || "N/A";
}

function getServiceNames(item) {
  const details = item.invoice_details || item.invoiceDetails || [];

  if (!details.length) return "N/A";

  return details
    .map((detail) => detail.service?.title)
    .filter(Boolean)
    .join(", ");
}

export default function DashBoardMain() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const res = await api.get("/dashboard/appointments");

        setDashboardData({
          appointments: {
            total: res.data.total ?? 0,
          },
          recentAppointments: res.data.data ?? [],
        });
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
      title: "Appointments",
      value: dashboardData.appointments?.total ?? 0,
    },
  ];

  const recentAppointments = dashboardData.recentAppointments ?? [];

  return (
    <div className="p-6">
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>

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
                <td className="p-3">{getCustomerName(item)}</td>
                <td className="p-3">{getServiceNames(item)}</td>
                <td className="p-3">
                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-700">
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
