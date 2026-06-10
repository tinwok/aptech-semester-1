export async function staffLoader() {
  const response = await fetch(
    "http://localhost:8000/api/dashboard/admin/staffs",
  );

  const data = await response.json();

  return data;
}
