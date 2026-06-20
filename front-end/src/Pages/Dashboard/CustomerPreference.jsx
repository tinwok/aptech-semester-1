import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import api from "@/services/api";

function normalizeCustomers(payload) {
  const data = payload?.data?.data || payload?.data || payload || [];
  return Array.isArray(data) ? data : [];
}

function CustomerPreference() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCustomers() {
      try {
        setIsLoading(true);
        setError("");

        const response = await api.get("/dashboard/customers");
        setCustomers(normalizeCustomers(response.data));
      } catch (err) {
        setCustomers([]);
        setError(
          err.response?.data?.message || "Unable to load customer preferences.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const keyword = searchTerm.toLowerCase();

    return customers.filter((customer) => {
      const user = customer.user || customer.users || {};
      

      return (
        String(user.name || "")
          .toLowerCase()
          .includes(keyword) ||
        String(user.email || "")
          .toLowerCase()
          .includes(keyword) ||
        String(user.phone || "")
          .toLowerCase()
          .includes(keyword) ||
        String(customer.preferences || "")
          .toLowerCase()
          .includes(keyword) ||
        String(customer.allergies || "")
          .toLowerCase()
          .includes(keyword) 
        
      );
    });
  }, [customers, searchTerm]);

  return (
    <section className="min-h-screen bg-slate-100 p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">
            Customer Preference
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Real customer preferences, allergies.
          </p>
        </div>
      </div>

      <div className="mb-4 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by name, phone, email or preference..."
            className="w-full rounded-xl border border-slate-400 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-slate-900"
          />
        </div>
      </div>

      {isLoading && (
        <div className="rounded-xl bg-white p-5 text-slate-600 shadow">
          Loading customer preferences...
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-50 p-5 text-red-600">{error}</div>
      )}

      {!isLoading && !error && (
        <div className="overflow-hidden rounded-xl bg-zinc-900 shadow-lg">
          <table className="w-full min-w-[1000px] text-left text-sm text-white">
            <thead className="bg-zinc-800 text-zinc-200">
              <tr>
                <th className="px-5 py-4">Stt</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Phone</th>
                <th className="px-5 py-4">Preferences</th>
                <th className="px-5 py-4">Allergies</th>
                
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-700">
              {filteredCustomers.map((customer, index) => {
                const user = customer.user || customer.users || {};
                
                return (
                  <tr key={customer.id} className="hover:bg-zinc-800">
                    <td className="px-5 py-4">{index + 1}</td>
                    <td className="px-5 py-4 font-medium">
                      {user.name || "N/A"}
                    </td>
                    <td className="px-5 py-4">{user.email || "N/A"}</td>
                    <td className="px-5 py-4">{user.phone || "N/A"}</td>
                    <td className="px-5 py-4">
                      {customer.preferences || "N/A"}
                    </td>
                    <td className="px-5 py-4">{customer.allergies || "N/A"}</td>
                    
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredCustomers.length === 0 && (
            <div className="p-8 text-center text-zinc-300">
              No customer preferences found.
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default CustomerPreference;
