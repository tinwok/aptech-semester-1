import { useLoaderData } from "react-router-dom";

export default function Staffs() {
  const data = useLoaderData();

  return (
    <div className="p-6">
      <h1 className="mb-6 text-3xl font-bold">Staffs</h1>

      <div className="rounded-xl border bg-white p-5 shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Position</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {data.data?.map((staff) => (
              <tr key={staff.id} className="border-b">
                <td className="p-3">{staff.id}</td>

                <td className="p-3">{staff.users?.name}</td>

                <td className="p-3">{staff.users?.email}</td>

                <td className="p-3">{staff.position}</td>

                <td className="p-3">{staff.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
