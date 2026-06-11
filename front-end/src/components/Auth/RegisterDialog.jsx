import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerApi } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";

function RegisterDialog({ isOpen, onClose, onOpenLogin }) {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

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

      await login(formData.email, "12345678");

      onClose();

      // Sau khi đăng ký xong, user vào portal luôn.
      // Nhưng khi bấm sửa/xem thông tin cá nhân thì sẽ bị bắt đổi mật khẩu.
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.errors?.email?.[0] ||
          err.response?.data?.errors?.phone?.[0] ||
          "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-xl rounded-3xl border border-[#E8D7B3] bg-[#FFFDF8] p-8 shadow-2xl">
        <h2 className="text-3xl font-bold text-[#2B2115]">Đăng ký</h2>

        <p className="mt-2 text-[#7B684A]">
          Tạo tài khoản khách hàng mới. Sau khi đăng ký, bạn cần đổi mật khẩu
          trước khi cập nhật hoặc xem thông tin cá nhân.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="grid gap-2">
            <span className="font-medium text-[#2B2115]">Email</span>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập email"
              className="rounded-xl border border-[#E8D7B3] px-4 py-3 outline-none focus:border-[#B89555]"
            />
          </label>

          <label className="grid gap-2">
            <span className="font-medium text-[#2B2115]">Số điện thoại</span>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Nhập số điện thoại"
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
              className="rounded-xl border border-gray-200 bg-white px-5 py-3 font-semibold text-[#2B2115]"
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-[#B89555] px-5 py-3 font-semibold text-white hover:bg-[#9B7A3F] disabled:opacity-60"
            >
              {isSubmitting ? "Đang xử lý..." : "Đăng ký"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-[#7B684A]">
          Đã có tài khoản?{" "}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenLogin();
            }}
            className="font-bold text-[#B89555]"
          >
            Đăng nhập
          </button>
        </p>
      </div>
    </div>
  );
}

export default RegisterDialog;
