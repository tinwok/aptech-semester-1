import { useEffect, useMemo, useState } from "react";
import { Heart, Search, UserRound, UsersRound } from "lucide-react";
import { getDashboardCustomersApi } from "@/services/customerService";

function getCustomerName(customer) {
  return customer.user?.name || customer.users?.name || "Unknown customer";
}

function getCustomerPhone(customer) {
  return customer.user?.phone || customer.users?.phone || "No phone";
}

function getCustomerEmail(customer) {
  return customer.user?.email || customer.users?.email || "No email";
}

function getPreferredStaffName(customer) {
  return customer.preferred_staff_name || "No preferred staff";
}

function normalizeCustomers(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}

function CustomerPreferences() {
  const [customers, setCustomers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadCustomers() {
    try {
      setIsLoading(true);
      setError("");

      const response = await getDashboardCustomersApi();
      setCustomers(normalizeCustomers(response));
    } catch (err) {
      setCustomers([]);
      setError(
        err.response?.data?.message ||
          "Unable to load customer preferences. Please try again later.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();

    if (!keyword) return customers;

    return customers.filter((customer) => {
      const name = getCustomerName(customer).toLowerCase();
      const phone = getCustomerPhone(customer).toLowerCase();
      const email = getCustomerEmail(customer).toLowerCase();
      const preferences = String(customer.preferences || "").toLowerCase();
      const allergies = String(customer.allergies || "").toLowerCase();

      return (
        name.includes(keyword) ||
        phone.includes(keyword) ||
        email.includes(keyword) ||
        preferences.includes(keyword) ||
        allergies.includes(keyword)
      );
    });
  }, [customers, searchText]);

  return (
    <section className="min-h-screen bg-slate-50 p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">
            Customer Preferences
          </h1>

          <p className="mt-2 text-zinc-600">
            View customer preferences, allergies, and preferred staff.
          </p>
        </div>

        <div className="rounded-xl bg-white px-5 py-3 shadow-sm">
          <p className="text-sm text-zinc-500">Total customers</p>
          <p className="text-2xl font-bold text-zinc-900">
            {customers.length}
          </p>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm">
        <Search className="h-5 w-5 text-zinc-400" />

        <input
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="Search by customer name, phone, email, preferences, or allergies..."
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>

      {isLoading && (
        <div className="rounded-xl border border-zinc-200 bg-white p-6 text-zinc-600 shadow-sm">
          Loading customer preferences...
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-600 shadow-sm">
          {error}
        </div>
      )}

      {!isLoading && !error && filteredCustomers.length === 0 && (
        <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
          <Heart className="mx-auto h-12 w-12 text-zinc-400" />

          <h2 className="mt-4 text-xl font-bold text-zinc-900">
            No customer preferences found
          </h2>

          <p className="mt-2 text-zinc-600">
            Customer preferences will appear here after users update their
            profile.
          </p>
        </div>
      )}

      {!isLoading && !error && filteredCustomers.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-zinc-900 text-white">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Preferred Staff</th>
                <th className="px-4 py-3">Preferences</th>
                <th className="px-4 py-3">Allergies</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-t border-zinc-200 align-top hover:bg-zinc-50"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100">
                        <UserRound className="h-5 w-5 text-amber-700" />
                      </div>

                      <div>
                        <p className="font-semibold text-zinc-900">
                          {getCustomerName(customer)}
                        </p>

                        <p className="mt-1 text-xs text-zinc-500">
                          Customer #{customer.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-zinc-700">
                    <p>{getCustomerPhone(customer)}</p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {getCustomerEmail(customer)}
                    </p>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-zinc-700">
                      <UsersRound className="h-4 w-4 text-amber-700" />
                      <span>{getPreferredStaffName(customer)}</span>
                    </div>
                  </td>

                  <td className="max-w-xs px-4 py-4 text-zinc-700">
                    <p className="whitespace-pre-line">
                      {customer.preferences || "No preferences saved."}
                    </p>
                  </td>

                  <td className="max-w-xs px-4 py-4 text-zinc-700">
                    <p className="whitespace-pre-line">
                      {customer.allergies || "No allergies saved."}
                    </p>
                  </td>

                  <td className="px-4 py-4">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold capitalize text-green-700">
                      {customer.status || "active"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default CustomerPreferences;