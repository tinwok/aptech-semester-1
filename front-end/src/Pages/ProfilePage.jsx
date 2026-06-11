import { useState } from "react";
import { UserRound, Mail, Phone, Calendar, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { updateProfileApi } from "@/services/authService";

function ProfilePage() {
  const { user, role, refreshUser } = useAuth();

  const [dob, setDob] = useState(user?.dob || "");
  const [preferences, setPreferences] = useState("");
  const [allergies, setAllergies] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      await updateProfileApi({
        dob,
        preferences,
        allergies,
      });

      await refreshUser();
      setMessage("Cập nhật hồ sơ thành công.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Cập nhật thất bại. Vui lòng kiểm tra lại thông tin.",
      );
    }
  }

  if (!user) {
    return <div className="p-8 text-[#8A6A35]">Bạn cần đăng nhập.</div>;
  }

  return (
    <section className="min-h-screen bg-[#FFFCF6] px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 rounded-3xl border border-[#E8D7B3] bg-white p-6 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#B89555]">
            ZenStyle Account
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[#2B2115]">
            Hồ sơ cá nhân
          </h1>
          <p className="mt-2 text-[#7B684A]">
            Trang này dùng chung cho customer và staff. Nội dung sẽ thay đổi dựa
            theo role hiện tại.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <div className="rounded-3xl border border-[#E8D7B3] bg-white p-6 shadow-sm">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#FFF2D8]">
              <UserRound className="h-10 w-10 text-[#B89555]" />
            </div>

            <h2 className="mt-4 text-xl font-bold text-[#2B2115]">
              {user.name || "Chưa cập nhật tên"}
            </h2>
            <p className="mt-1 text-sm capitalize text-[#8A6A35]">
              Role: {role || "customer"}
            </p>

            <div className="mt-6 space-y-4 text-sm">
              <div className="flex gap-3">
                <Mail className="h-5 w-5 text-[#B89555]" />
                <span>{user.email || "Chưa có email"}</span>
              </div>

              <div className="flex gap-3">
                <Phone className="h-5 w-5 text-[#B89555]" />
                <span>{user.phone || "Chưa có số điện thoại"}</span>
              </div>

              <div className="flex gap-3">
                <Calendar className="h-5 w-5 text-[#B89555]" />
                <span>{user.dob || "Chưa có ngày sinh"}</span>
              </div>

              <div className="flex gap-3">
                <ShieldCheck className="h-5 w-5 text-[#B89555]" />
                <span>{user.status || "active"}</span>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-[#E8D7B3] bg-white p-6 shadow-sm"
          >
            <h2 className="text-xl font-bold text-[#2B2115]">
              Cập nhật thông tin
            </h2>

            <div className="mt-6 grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm font-medium text-[#2B2115]">
                  Ngày sinh
                </span>
                <input
                  type="date"
                  value={dob}
                  onChange={(event) => setDob(event.target.value)}
                  className="rounded-xl border border-[#E8D7B3] px-4 py-3 outline-none focus:border-[#B89555]"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-[#2B2115]">
                  Sở thích / Preferences
                </span>
                <textarea
                  value={preferences}
                  onChange={(event) => setPreferences(event.target.value)}
                  className="min-h-24 rounded-xl border border-[#E8D7B3] px-4 py-3 outline-none focus:border-[#B89555]"
                  placeholder="Ví dụ: thích kiểu tóc tự nhiên, ưu tiên nhân viên nữ..."
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-[#2B2115]">
                  Dị ứng / Allergies
                </span>
                <textarea
                  value={allergies}
                  onChange={(event) => setAllergies(event.target.value)}
                  className="min-h-24 rounded-xl border border-[#E8D7B3] px-4 py-3 outline-none focus:border-[#B89555]"
                  placeholder="Ví dụ: dị ứng thuốc nhuộm, da nhạy cảm..."
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
              Lưu thay đổi
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ProfilePage;
