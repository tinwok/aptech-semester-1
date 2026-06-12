import { useEffect, useState } from "react";
import api from "../../services/api";
export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });
  const [error, setError] = useState("");
  const fetchAppointments = async (page = 1) => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get(`dashboard/appointments?page=${page}`);
      setAppointments(res.data.data);

      setPagination({
        current_page: res.data.current_page,
        last_page: res.data.last_page,
        total: res.data.total,
      });
    } catch (err) {
      console.error("Fetch appointments failed:", err);

      if (err.response) {
        setError(err.response.data.message || "Server error");
      } else if (err.request) {
        setError("Không thể kết nối tới server");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Appointments</h1>

        <button className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700">
          + Add Appointment
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 shadow-lg">
        <table className="w-full">
          <thead className="bg-zinc-800">
            <tr>
              <th className="p-4 text-left text-zinc-300">Customer</th>
              <th className="p-4 text-left text-zinc-300">Staff</th>
              <th className="p-4 text-left text-zinc-300">Service</th>
              <th className="p-4 text-left text-zinc-300">Status</th>
              <th className="p-4 text-center text-zinc-300">Action</th>
            </tr>
          </thead>

          <tbody>
            {appointments.map((item) => (
              <tr
                key={item.id}
                className="border-t border-zinc-700 hover:bg-zinc-800"
              >
                <td className="p-4 text-white">{item.customer}</td>
                <td className="p-4 text-white">{item.staff}</td>
                <td className="p-4 text-white">{item.service}</td>

                <td className="p-4">
                  <span className="rounded bg-yellow-600 px-3 py-1 text-white">
                    {item.status}
                  </span>
                </td>

                <td className="space-x-2 p-4 text-center">
                  <button className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700">
                    Edit
                  </button>

                  <button className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}

      <div className="mt-4 flex justify-center gap-2">
        <button
          disabled={pagination.current_page === 1}
          onClick={() => fetchAppointments(pagination.current_page - 1)}
          className="rounded bg-zinc-700 px-3 py-2 text-white disabled:opacity-50"
        >
          Prev
        </button>

        <span className="px-4 py-2 text-white">
          {pagination.current_page} / {pagination.last_page}
        </span>

        <button
          disabled={pagination.current_page === pagination.last_page}
          onClick={() => fetchAppointments(pagination.current_page + 1)}
          className="rounded bg-zinc-700 px-3 py-2 text-white disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
