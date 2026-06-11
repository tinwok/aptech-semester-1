export async function dashboardLoader() {
  const [staffs, customers, appointments] = await Promise.all([
    fetch("http://localhost:8000/api/dashboard/admin/staffs"),
    fetch("http://localhost:8000/api/dashboard/admin/customers"),
    fetch("http://localhost:8000/api/dashboard/admin/appointments"),
  ]);

  return {
    staffs: await staffs.json(),
    customers: await customers.json(),
    appointments: await appointments.json(),
  };
}
