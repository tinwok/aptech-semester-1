import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound } from "lucide-react";
import { changePasswordApi } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";

function ChangePasswordPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [formData, setFormData] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!user) {
    return <div className="p-8 text-[#8A6A35]">Please sign in first.</div>;
  }

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      await changePasswordApi(formData);

      setMessage("Password changed successfully. Please sign in again.");

      setTimeout(async () => {
        await logout();
        navigate("/");
      }, 1200);
    } catch (err) {
      setError(
        err.response?.data?.errors?.current_password?.[0] ||
          err.response?.data?.errors?.password?.[0] ||
          err.response?.data?.message ||
          "Failed to change password.",
      );
    }
  }

  return (
    <section className="min-h-screen bg-[#FFFCF6] px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl border border-[#E8D7B3] bg-white p-8 shadow-sm">
          <KeyRound className="h-10 w-10 text-[#B89555]" />

          <h1 className="mt-4 text-3xl font-bold text-[#2B2115]">
            Change Password
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-3xl border border-[#E8D7B3] bg-white p-8 shadow-sm"
        >
          <label className="grid gap-2">
            <span className="text-sm font-medium text-[#2B2115]">
              Current Password
            </span>

            <input
              name="current_password"
              type="password"
              value={formData.current_password}
              onChange={handleChange}
              className="rounded-xl border border-[#E8D7B3] px-4 py-3 outline-none focus:border-[#B89555]"
            />
          </label>

          <label className="mt-4 grid gap-2">
            <span className="text-sm font-medium text-[#2B2115]">
              New Password
            </span>

            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="rounded-xl border border-[#E8D7B3] px-4 py-3 outline-none focus:border-[#B89555]"
            />
          </label>

          <label className="mt-4 grid gap-2">
            <span className="text-sm font-medium text-[#2B2115]">
              Confirm Password
            </span>

            <input
              name="password_confirmation"
              type="password"
              value={formData.password_confirmation}
              onChange={handleChange}
              className="rounded-xl border border-[#E8D7B3] px-4 py-3 outline-none focus:border-[#B89555]"
            />
          </label>

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
            Update Password
          </button>
        </form>
      </div>
    </section>
  );
}

export default ChangePasswordPage;
