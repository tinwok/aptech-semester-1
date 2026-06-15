import { redirect } from "react-router-dom";
import {
  getMeApi,
  updateProfileApi,
  changePasswordApi,
  logoutApi,
  deleteMeApi,
} from "@/services/authService";

function getUserFromResponse(response) {
  return response?.data || response?.user || response;
}

function getBasePathByRole(role) {
  if (role === "staff") return "/staff";
  if (role === "admin") return "/dashboard";
  return "/user";
}

export async function publicUserLoader() {
  const token = localStorage.getItem("zenstyle_access_token");

  if (!token) {
    return { user: null };
  }

  try {
    const response = await getMeApi();
    const user = getUserFromResponse(response);

    localStorage.setItem("zenstyle_user", JSON.stringify(user));

    return { user };
  } catch {
    localStorage.removeItem("zenstyle_access_token");
    localStorage.removeItem("zenstyle_user");

    return { user: null };
  }
}

export async function protectedUserLoader({ params }) {
  const token = localStorage.getItem("zenstyle_access_token");

  if (!token) {
    return redirect("/");
  }

  try {
    const response = await getMeApi();
    ç;
    const user = getUserFromResponse(response);

    localStorage.setItem("zenstyle_user", JSON.stringify(user));

    return {
      user,
      basePath: getBasePathByRole(user?.role),
      params,
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
    dob: formData.get("dob") || null,
    preferred_staff_id: formData.get("preferred_staff_id") || null,
    preferences: formData.get("preferences") || "",
    allergies: formData.get("allergies") || "",
  };

  try {
    await updateProfileApi(profileData);

    return {
      success: "Profile updated successfully.",
    };
  } catch (error) {
    return {
      error:
        error.response?.data?.message ||
        "Failed to update profile. Please try again.",
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
      // Still clear frontend auth state if backend logout fails.
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
        "Failed to change password. Please try again.",
    };
  }
}

export async function removeAccountAction() {
  try {
    await deleteMeApi();

    localStorage.removeItem("zenstyle_access_token");
    localStorage.removeItem("zenstyle_user");

    return redirect("/");
  } catch (error) {
    return {
      error:
        error.response?.data?.message ||
        "Failed to remove account. Please try again.",
    };
  }
}
