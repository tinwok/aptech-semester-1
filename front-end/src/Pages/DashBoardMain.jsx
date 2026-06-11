import { useState } from "react";

export default function DashBoardMain() {
  const [stats] = useState({
    staffs: 15,
    customers: 120,
    appointments: 45,
    users: 135,
  });

  return (
    <div className="p-6">
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-lg border p-4 shadow">
          <h3>Staffs</h3>
          <p className="text-3xl font-bold">{stats.staffs}</p>
        </div>

        <div className="rounded-lg border p-4 shadow">
          <h3>Customers</h3>
          <p className="text-3xl font-bold">{stats.customers}</p>
        </div>

        <div className="rounded-lg border p-4 shadow">
          <h3>Appointments</h3>
          <p className="text-3xl font-bold">{stats.appointments}</p>
        </div>

        <div className="rounded-lg border p-4 shadow">
          <h3>Users</h3>
          <p className="text-3xl font-bold">{stats.users}</p>
        </div>
      </div>
    </div>
  );
}
