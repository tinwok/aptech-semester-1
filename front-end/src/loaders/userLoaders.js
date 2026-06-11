import { redirect } from "react-router-dom";
import {
  getMeApi,
  updateProfileApi,
  changePasswordApi,
  logoutApi,
} from "@/services/authService";

function getUserFromResponse(response) {
  return response?.data || response?.user || response;
}

export async function publicUserLoader() {
  const token = localStorage.getItem("zenstyle_access_token");

  if (!token) {
    return {
      user: null,
    };
  }

  try {
    const response = await getMeApi();
    const user = getUserFromResponse(response);

    localStorage.setItem("zenstyle_user", JSON.stringify(user));

    return {
      user,
    };
  } catch {
    localStorage.removeItem("zenstyle_access_token");
    localStorage.removeItem("zenstyle_user");

    return {
      user: null,
    };
  }
}

export async function protectedUserLoader() {
  const token = localStorage.getItem("zenstyle_access_token");

  if (!token) {
    return redirect("/");
  }

  try {
    const response = await getMeApi();
    const user = getUserFromResponse(response);

    localStorage.setItem("zenstyle_user", JSON.stringify(user));

    if (user?.must_change_password) {
      return redirect("/change-password");
    }

    return {
      user,
    };
  } catch {
    localStorage.removeItem("zenstyle_access_token");
    localStorage.removeItem("zenstyle_user");

    return redirect("/");
  }
}

export async function updateProfileAction({ request }) {
  const formData = await request.formData();

  const profileData = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    dob: formData.get("dob"),
    preferred_staff_id: formData.get("preferred_staff_id") || null,
    preferences: formData.get("preferences"),
    allergies: formData.get("allergies"),
  };

  try {
    await updateProfileApi(profileData);

    return {
      success: "Cập nhật hồ sơ thành công.",
    };
  } catch (error) {
    if (error.response?.data?.must_change_password) {
      return redirect("/change-password");
    }

    return {
      error:
        error.response?.data?.message ||
        "Cập nhật hồ sơ thất bại. Vui lòng thử lại.",
    };
  }
}

export async function changePasswordAction({ request }) {
  const formData = await request.formData();

  const passwordData = {
    current_password: formData.get("current_password"),
    password: formData.get("password"),
    password_confirmation: formData.get("password_confirmation"),
  };

  try {
    await changePasswordApi(passwordData);

    try {
      await logoutApi();
    } catch {
      // Nếu logout API lỗi thì vẫn xóa token frontend.
    }

    localStorage.removeItem("zenstyle_access_token");
    localStorage.removeItem("zenstyle_user");

    return redirect("/");
  } catch (error) {
    return {
      error:
        error.response?.data?.errors?.current_password?.[0] ||
        error.response?.data?.errors?.password?.[0] ||
        error.response?.data?.message ||
        "Đổi mật khẩu thất bại. Vui lòng thử lại.",
    };
  }
}
