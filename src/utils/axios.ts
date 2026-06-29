import axios from "axios";

const baseURL = import.meta.env.VITE_PUBLIC_API_URL;
// console.log("baseURL:", baseURL);

const axiosInstance = axios.create({ baseURL });

// ─── Request interceptor ──────────────────────────────────────────────────────
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Refresh queue ────────────────────────────────────────────────────────────
let isRefreshing = false;
let listeners: ((token: string) => void)[] = [];

function onRefreshed(newToken: string) {
  listeners.forEach((cb) => cb(newToken));
  listeners = [];
}

function onRefreshFailed() {
  listeners.forEach((cb) => cb(""));
  listeners = [];
}

// ─── Response interceptor ─────────────────────────────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = localStorage.getItem("refreshToken");
    const is401 = error.response?.status === 401; // fix error.status

    if (!is401 || !refreshToken || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Đưa request vào hàng chờ, resolve khi có token mới
      return new Promise((resolve, reject) => {
        listeners.push((newToken: string) => {
          if (!newToken) return reject(error);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(axiosInstance(originalRequest));
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const res = await axios.post(`${baseURL}/auth/refresh-token`, {
        refreshToken,
      });

      // Khớp với response shape: { data: { accessToken, refreshToken } }
      const { accessToken, refreshToken: newRefresh } = res.data.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", newRefresh);

      axiosInstance.defaults.headers.common["Authorization"] =
        `Bearer ${accessToken}`;

      onRefreshed(accessToken); // unblock tất cả request đang chờ
      isRefreshing = false;

      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return axiosInstance(originalRequest);
    } catch {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      onRefreshFailed(); // reject tất cả request đang chờ
      isRefreshing = false;

      return Promise.reject(error);
    }
  },
);

export default axiosInstance;
