import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getMeApi, loginApi, logoutApi } from "@/services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    return localStorage.getItem("zenstyle_access_token");
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("zenstyle_user");

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch {
      localStorage.removeItem("zenstyle_user");
      return null;
    }
  });

  const [isLoadingUser, setIsLoadingUser] = useState(Boolean(token));

  const isAuthenticated = Boolean(token && user);

  async function login(email, password) {
    const data = await loginApi({
      email,
      password,
    });

    const accessToken = data.access_token;
    const loggedInUser = data.user;

    localStorage.setItem("zenstyle_access_token", accessToken);
    localStorage.setItem("zenstyle_user", JSON.stringify(loggedInUser));

    setToken(accessToken);
    setUser(loggedInUser);

    return loggedInUser;
  }

  async function refreshUser() {
    const savedToken = localStorage.getItem("zenstyle_access_token");

    if (!savedToken) {
      setToken(null);
      setUser(null);
      setIsLoadingUser(false);
      return null;
    }

    try {
      const data = await getMeApi();
      const currentUser = data.data;

      localStorage.setItem("zenstyle_user", JSON.stringify(currentUser));

      setToken(savedToken);
      setUser(currentUser);

      return currentUser;
    } catch {
      localStorage.removeItem("zenstyle_access_token");
      localStorage.removeItem("zenstyle_user");

      setToken(null);
      setUser(null);

      return null;
    } finally {
      setIsLoadingUser(false);
    }
  }

  async function logout() {
    try {
      await logoutApi();
    } catch {
      // Nếu token hết hạn hoặc backend lỗi, frontend vẫn logout khỏi máy.
    } finally {
      localStorage.removeItem("zenstyle_access_token");
      localStorage.removeItem("zenstyle_user");

      setToken(null);
      setUser(null);
    }
  }

  useEffect(() => {
    refreshUser();
  }, []);

  const value = useMemo(() => {
    return {
      token,
      user,
      role: user?.role,
      isAuthenticated,
      isLoadingUser,
      login,
      logout,
      refreshUser,
      setUser,
    };
  }, [token, user, isAuthenticated, isLoadingUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
