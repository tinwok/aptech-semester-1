import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import api from "@/services/api";

import { Link, useNavigate } from "react-router";
function AuthPage() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const emptyData = {
    name: "",
    phone: "",
    password: "",
    password_confirmation: "",
  };
  const [formData, setFormData] = useState(emptyData);

  const validateLogin = () => {
    if (!formData.phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại");
      return false;
    }

    if (!formData.password.trim()) {
      toast.error("Vui lòng nhập mật khẩu");
      return false;
    }

    return true;
  };

  const validateRegister = () => {
    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập họ tên");
      return false;
    }

    if (!formData.phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại");
      return false;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error("Số điện thoại phải gồm 10 chữ số");
      return false;
    }

    if (formData.password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return false;
    }

    if (formData.password !== formData.password_confirmation) {
      toast.error("Mật khẩu xác nhận không khớp");
      return false;
    }

    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;

    try {
      const res = await api.post("/login", {
        phone: formData.phone,
        password: formData.password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");

      toast.success("Đăng nhập thành công");
    } catch (err) {
      console.log(err.response?.data);
      toast.error(err.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateRegister()) return;

    try {
      await api.post("/register", formData);

      toast.success("Login successfully");

      setIsLogin(true);

      setFormData(emptyData);
    } catch (err) {
      console.log(err.response?.data);
      toast.error(err.response?.data?.message || "Register failed!");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-bold">
          {isLogin ? "Login" : "Register"}
        </h1>

        <form
          onSubmit={isLogin ? handleLogin : handleRegister}
          className="space-y-4"
        >
          {!isLogin && (
            <Field>
              <FieldLabel htmlFor="fieldgroup-name">Name</FieldLabel>
              <Input
                id="fieldgroup-name"
                type="text"
                placeholder="Full name"
                className="w-full rounded border p-3"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,

                    name: e.target.value,
                  })
                }
              />
            </Field>
          )}

          <Field>
            <FieldLabel htmlFor="fieldgroup-phone">Phone</FieldLabel>
            <Input
              id="fieldgroup-phone"
              type="text"
              placeholder="Phone number"
              className="w-full rounded border p-3"
              value={formData.phone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  phone: e.target.value,
                })
              }
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="fieldgroup-phone">Pass word</FieldLabel>
            <Input
              type="password"
              placeholder="Password"
              className="w-full rounded border p-3"
              value={formData.password}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password: e.target.value,
                })
              }
            />
          </Field>
          {!isLogin && (
            <Field>
              <FieldLabel htmlFor="fieldgroup-password">
                Confirm Password
              </FieldLabel>
              <Input
                id="fieldgroup-password"
                type="password"
                placeholder="Confirm Password"
                className="w-full rounded border p-3"
                value={formData.password_confirmation}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password_confirmation: e.target.value,
                  })
                }
              />
            </Field>
          )}

          <Button
            type="submit"
            className={`w-full rounded p-3 text-white cursor-pointer ${
              isLogin
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isLogin ? "Login" : "Register"}
          </Button>
        </form>

        <div className="mt-5 text-center">
          {isLogin ? (
            <p>
              Chưa có tài khoản?
              <button
                onClick={() => (setIsLogin(false), setFormData(emptyData))}
                className="ml-2 text-blue-600 font-semibold hover:text-red-500 cursor-pointer"
              >
                Register
              </button>
            </p>
          ) : (
            <p>
              Đã có tài khoản?
              <button
                onClick={() => (setIsLogin(true), setFormData(emptyData))}
                className="ml-2 text-blue-600 font-semibold hover:text-red-500 cursor-pointer"
              >
                Login
              </button>
            </p>
          )}
        </div>
        <div className="text-center mt-5">
          <Link
            className="flex justify-center text-blue-600 hover:text-red-500 cursor-pointer"
            to="/"
          >
            <ArrowLeft></ArrowLeft>
            <span>Back to home page</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
