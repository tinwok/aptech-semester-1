import { useState } from "react";

export default function Customers() {
  const [customers] = useState([
    {
      id: 1,
      name: "Nguyen Van A",
      email: "a@gmail.com",
      phone: "0123456789",
    },
    {
      id: 2,
      name: "Tran Van B",
      email: "b@gmail.com",
      phone: "0987654321",
    },
  ]);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Customers</h1>

        <button className="rounded-lg bg-green-600 px-4 py-2 text-white transition hover:bg-green-700">
          + Add Customer
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 shadow-lg">
        <table className="w-full">
          <thead className="bg-zinc-800">
            <tr>
              <th className="p-4 text-left text-zinc-300">ID</th>
              <th className="p-4 text-left text-zinc-300">Name</th>
              <th className="p-4 text-left text-zinc-300">Email</th>
              <th className="p-4 text-left text-zinc-300">Phone</th>
              <th className="p-4 text-center text-zinc-300">Action</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="border-t border-zinc-700 transition hover:bg-zinc-800"
              >
                <td className="p-4 text-white">{customer.id}</td>
                <td className="p-4 text-white">{customer.name}</td>
                <td className="p-4 text-white">{customer.email}</td>
                <td className="p-4 text-white">{customer.phone}</td>

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
    </div>
  );
}
