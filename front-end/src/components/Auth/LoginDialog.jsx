import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

function LoginDialog({ open, onClose, onOpenRegister }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [phone, setPhone] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phone: "",
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
      const loggedInUser = await login(formData.email, formData.password);

      onClose();

      if (loggedInUser?.role === "staff") {
        navigate("/staff");
      } else {
        navigate("/user");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Sign in failed. Please check your email and password.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-4 py-6">
      <div className="w-full max-w-lg rounded-3xl border border-[#E8D7B3] bg-[#FFFDF8] p-8 shadow-2xl">
        <h2 className="text-3xl font-bold text-[#2B2115]">Sign In</h2>

        <p className="mt-2 text-[#7B684A]">
          Sign in to access your account and personal services.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {phone ? (
            <label className="grid gap-2 ">
              <div className="flex gap-2">
                {" "}
                <span className="font-medium text-[#2B2115]">Email</span>
                <p
                  className="text-xs text-blue-800 cursor-pointer"
                  onClick={() => setPhone(!phone)}
                >
                  Signin with your phone ?
                </p>
              </div>

              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="rounded-xl border border-[#E8D7B3] px-4 py-3 outline-none focus:border-[#B89555]"
              />
            </label>
          ) : (
            <label className="grid gap-2">
              <div className="flex gap-2">
                {" "}
                <span className="font-medium text-[#2B2115]">Phone</span>
                <p
                  className="text-xs text-blue-800 cursor-pointer"
                  onClick={() => setPhone(!phone)}
                >
                  {" "}
                  Signin with your email ?
                </p>
              </div>

              <input
                name="phone"
                type="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone"
                className="rounded-xl border border-[#E8D7B3] px-4 py-3 outline-none focus:border-[#B89555]"
              />
            </label>
          )}

          <label className="grid gap-2">
            <span className="font-medium text-[#2B2115]">Password</span>

            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="rounded-xl border border-[#E8D7B3] px-4 py-3 outline-none focus:border-[#B89555]"
            />
          </label>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-red-600">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 bg-white px-5 py-3 font-semibold text-[#2B2115] hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-[#B89555] px-5 py-3 font-semibold text-white hover:bg-[#9B7A3F] disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-[#7B684A]  ">
          Do not have an account?{" "}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenRegister();
            }}
            className="font-bold text-[#B89555] transition hover:text-[#9B7A3F] hover:no-underline cursor-pointer "
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginDialog;
