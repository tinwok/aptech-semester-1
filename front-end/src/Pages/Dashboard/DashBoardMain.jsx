export default function DashBoardMain() {
  const stats = [
    {
      title: "Staffs",
      value: 12,
    },
    {
      title: "Customers",
      value: 150,
    },
    {
      title: "Appointments",
      value: 45,
    },
    {
      title: "Services",
      value: 10,
    },
  ];

  const recentAppointments = [
    {
      id: 1,
      customer: "Nguyen Van A",
      service: "Hair Cut",
      status: "Completed",
    },
    {
      id: 2,
      customer: "Tran Thi B",
      service: "Hair Wash",
      status: "Pending",
    },
    {
      id: 3,
      customer: "Le Van C",
      service: "Hair Color",
      status: "Confirmed",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map((item) => (
          <div
            key={item.title}
            className="rounded-xl border bg-white p-5 shadow transition-all hover:shadow-lg"
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

                <td className="p-3">{item.customer}</td>

                <td className="p-3">{item.service}</td>

                <td className="p-3">
                  <span
                    className={`rounded-full px-3 py-1 text-sm
      ${
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
      </div>
    </div>
  );
}
