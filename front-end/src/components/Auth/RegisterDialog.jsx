import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerApi } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";

function RegisterDialog({ open, onClose, onOpenLogin }) {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await registerApi(formData);
      await login(formData.email, formData.password);

      onClose();
      navigate("/user");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.errors?.name?.[0] ||
          err.response?.data?.errors?.email?.[0] ||
          err.response?.data?.errors?.phone?.[0] ||
          err.response?.data?.errors?.password?.[0] ||
          "Sign up failed. Please check your information.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-4 py-6">
      <div className="w-full max-w-lg rounded-3xl border border-[#E8D7B3] bg-[#FFFDF8] p-6 shadow-2xl">
        <h2 className="text-3xl font-bold text-[#2B2115]">Sign Up</h2>

        <p className="mt-1 text-sm text-[#7B684A]">
          Create account to manage your profile and appointments.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-[#2B2115]">
              Full Name
            </span>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="rounded-xl border border-[#E8D7B3] px-4 py-2.5 outline-none focus:border-[#B89555]"
            />
          </label>

          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-[#2B2115]">Email</span>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="rounded-xl border border-[#E8D7B3] px-4 py-2.5 outline-none focus:border-[#B89555]"
            />
          </label>

          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-[#2B2115]">Phone</span>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="rounded-xl border border-[#E8D7B3] px-4 py-2.5 outline-none focus:border-[#B89555]"
            />
          </label>

          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-[#2B2115]">Password</span>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              className="rounded-xl border border-[#E8D7B3] px-4 py-2.5 outline-none focus:border-[#B89555]"
            />
          </label>

          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-[#2B2115]">
              Confirm Password
            </span>
            <input
              name="password_confirmation"
              type="password"
              value={formData.password_confirmation}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="rounded-xl border border-[#E8D7B3] px-4 py-2.5 outline-none focus:border-[#B89555]"
            />
          </label>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 font-semibold text-[#2B2115] hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-[#B89555] px-5 py-2.5 font-semibold text-white hover:bg-[#9B7A3F] disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? "Creating..." : "Sign Up"}
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-sm text-[#7B684A]">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenLogin();
            }}
            className="font-bold text-[#B89555] transition hover:text-[#9B7A3F] hover:underline cursor-pointer"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}

export default RegisterDialog;
