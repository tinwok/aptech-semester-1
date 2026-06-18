import { useEffect, useState } from "react";
import {
  Calendar,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { updateProfileApi } from "@/services/authService";
import { getStaffsApi } from "@/services/staffService";

function ProfilePage() {
  const { user, role, refreshUser } = useAuth();

  const [staffs, setStaffs] = useState([]);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [dob, setDob] = useState(user?.dob || "");
  const [preferredStaffId, setPreferredStaffId] = useState(
    user?.customer?.preferred_staff_id || "",
  );
  const [preferences, setPreferences] = useState(
    user?.customer?.preferences || "",
  );
  const [allergies, setAllergies] = useState(user?.customer?.allergies || "");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStaffs() {
      try {
        const data = await getStaffsApi();
        setStaffs(Array.isArray(data) ? data : data.data || []);
      } catch {
        setStaffs([]);
      }
    }

    if (role === "customer") {
      loadStaffs();
    }
  }, [role]);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      await updateProfileApi({
        name,
        phone,
        dob,
        preferred_staff_id: preferredStaffId || null,
        preferences,
        allergies,
      });

      await refreshUser();
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.errors?.name?.[0] ||
          err.response?.data?.errors?.phone?.[0] ||
          "Failed to update profile. Please check your information.",
      );
    }
  }

  if (!user) {
    return <div className="p-8 text-[#8A6A35]">Please sign in first.</div>;
  }

  return (
    <section className="min-h-screen bg-[#FFFCF6] px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 rounded-3xl border border-[#E8D7B3] bg-white p-6 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#B89555]">
            ZenStyle Account
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#2B2115]">Profile</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
          <div className="rounded-3xl border border-[#E8D7B3] bg-white p-8 shadow-sm">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#FFF2D8]">
              <UserRound className="h-10 w-10 text-[#B89555]" />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-[#2B2115]">
              {user.name || "No name provided"}
            </h2>

            <p className="mt-2 text-sm capitalize text-[#8A6A35]">
              Role: {role || "customer"}
            </p>

            <div className="mt-8 space-y-5 text-sm text-[#2B2115]">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-[#B89555]" />
                <span>{user.email || "No email provided"}</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-[#B89555]" />
                <span>{user.phone || "No phone provided"}</span>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-[#B89555]" />
                <span>{user.dob || "No date of birth provided"}</span>
              </div>

              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-[#B89555]" />
                <span>{user.status || "active"}</span>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-[#E8D7B3] bg-white p-8 shadow-sm"
          >
            <h2 className="text-2xl font-bold text-[#2B2115]">
              Update Information
            </h2>

            <div className="mt-6 grid gap-5">
              <label className="grid gap-2">
                <span className="text-sm font-medium text-[#2B2115]">
                  Full Name
                </span>

                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="rounded-xl border border-[#E8D7B3] px-4 py-3 outline-none focus:border-[#B89555]"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-[#2B2115]">
                  Phone
                </span>

                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="rounded-xl border border-[#E8D7B3] px-4 py-3 outline-none focus:border-[#B89555]"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-[#2B2115]">
                  Date of Birth
                </span>

                <input
                  type="date"
                  value={dob}
                  onChange={(event) => setDob(event.target.value)}
                  className="rounded-xl border border-[#E8D7B3] px-4 py-3 outline-none focus:border-[#B89555]"
                />
              </label>

              {role === "customer" && (
                <label className="grid gap-2">
                  <span className="flex items-center gap-2 text-sm font-medium text-[#2B2115]">
                    <UsersRound className="h-4 w-4 text-[#B89555]" />
                    Preferred Staff
                  </span>

                  <select
                    value={preferredStaffId}
                    onChange={(event) =>
                      setPreferredStaffId(event.target.value)
                    }
                    className="rounded-xl border border-[#E8D7B3] bg-white px-4 py-3 outline-none focus:border-[#B89555]"
                  >
                    <option value="">No preferred staff</option>

                    {staffs.map((staff) => (
                      <option key={staff.id} value={staff.id}>
                        {staff.users?.name ||
                          staff.user?.name ||
                          `Staff #${staff.id}`}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <label className="grid gap-2">
                <span className="text-sm font-medium text-[#2B2115]">
                  Preferences
                </span>

                <textarea
                  value={preferences}
                  onChange={(event) => setPreferences(event.target.value)}
                  className="min-h-28 rounded-xl border border-[#E8D7B3] px-4 py-3 outline-none focus:border-[#B89555]"
                  placeholder="Example: Natural hairstyles, prefer female staff..."
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-[#2B2115]">
                  Allergies
                </span>

                <textarea
                  value={allergies}
                  onChange={(event) => setAllergies(event.target.value)}
                  className="min-h-28 rounded-xl border border-[#E8D7B3] px-4 py-3 outline-none focus:border-[#B89555]"
                  placeholder="Example: Hair dye allergy, sensitive skin..."
                />
              </label>
            </div>

            {message && (
              <p className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-green-700">
                {message}
              </p>
            )}

            {error && (
              <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="mt-6 rounded-xl bg-[#B89555] px-6 py-3 font-semibold text-white hover:bg-[#9B7A3F]"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ProfilePage;
