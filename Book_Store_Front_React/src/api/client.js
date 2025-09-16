// يقرأ VITE_API_URL من .env، أو استخدم Proxy Vite (خليه فارغ: '')
const BASE_URL = import.meta.env.VITE_API_URL || "";

// دالة للتحقق من صحة التوكن
function isTokenValid(token) {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  } catch {
    return false;
  }
}

// طلب موحّد: يضيف JSON + Authorization تلقائيًا
export async function apiFetch(path, options = {}) {
  const stored = localStorage.getItem("auth_user");
  let token = null;
  if (stored) {
    try { 
      const parsed = JSON.parse(stored);
      token = parsed.token;
      // التحقق من صحة التوكن
      if (token && !isTokenValid(token)) {
        console.log("🔄 Token expired, removing from storage");
        localStorage.removeItem("auth_user");
        token = null;
      }
    } catch {}
  }

  // إعداد الهيدرز - لا نضع Content-Type للـ FormData
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
    // إن كان الباك يعتمد كوكيز بدِّل "omit" إلى "include" واضبط CORS في الباك
    credentials: "omit",
  });

  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!res.ok) {
    // إذا كان الخطأ 401 (Unauthorized)، امسح التوكن
    if (res.status === 401) {
      localStorage.removeItem("auth_user");
    }
    const msg = (data && (data.message || data.error)) || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data;
}
