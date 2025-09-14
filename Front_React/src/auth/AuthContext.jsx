import React, { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "../api/client";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

// Helpers لاستخراج الدور من أشكال مختلفة
const asLower = (v) => (v == null ? "" : String(v).toLowerCase());
const normalizeRoleString = (val) => {
  const v = asLower(val);
  if (["admin", "administrator", "superadmin", "super_admin", "owner", "root"].includes(v)) return "admin";
  return "user";
};
const decodeJwt = (token) => {
  try {
    const p = token.split(".")[1];
    const json = JSON.parse(atob(p.replace(/-/g, "+").replace(/_/g, "/")));
    return json || {};
  } catch { return {}; }
};
const deriveRole = (user, token) => {
  if (!user) return "user";
  if (user.isAdmin === true || user.is_admin === true || user.admin === true) return "admin";
  if (user.roleId === 1 || user.role_id === 1) return "admin";
  if (Array.isArray(user.roles)) {
    if (user.roles.some((r) => asLower(typeof r === "object" ? (r.name || r.role || r.id) : r).includes("admin"))) return "admin";
  }
  if (user.role) return normalizeRoleString(user.role);
  if (token) {
    const p = decodeJwt(token);
    if (p.isAdmin === true) return "admin";
    if (p.roleId === 1) return "admin";
    if (Array.isArray(p.roles) && p.roles.some((r) => asLower(r).includes("admin"))) return "admin";
    if (p.role) return normalizeRoleString(p.role);
  }
  return "user";
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { ... , role: 'admin'|'user', token }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("auth_user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // التحقق من صحة التوكن
        if (parsed?.token) {
          const payload = JSON.parse(atob(parsed.token.split('.')[1]));
          const now = Math.floor(Date.now() / 1000);
          if (payload.exp > now) {
            const role = deriveRole(parsed, parsed?.token);
            setUser({ ...parsed, role });
          } else {
            // التوكن منتهي الصلاحية
            localStorage.removeItem("auth_user");
          }
        }
      } catch (err) {
        // بيانات غير صحيحة
        localStorage.removeItem("auth_user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const data = await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    const token = data?.token;
    const role = deriveRole(data?.user, token);
    const authUser = { ...data.user, token, role };
    setUser(authUser);
    localStorage.setItem("auth_user", JSON.stringify(authUser));
    return authUser;
  };

  const register = async (formData) => {
    const data = await apiFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(formData),
    });
    if (data?.user && data?.token) {
      const token = data.token;
      const role = deriveRole(data.user, token);
      const authUser = { ...data.user, token, role };
      setUser(authUser);
      localStorage.setItem("auth_user", JSON.stringify(authUser));
      return { autoLoggedIn: true, role };
    }
    return { autoLoggedIn: false };
  };

  const logout = async () => {
    try { await apiFetch("/api/auth/logout", { method: "POST" }); } catch {}
    setUser(null);
    localStorage.removeItem("auth_user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
