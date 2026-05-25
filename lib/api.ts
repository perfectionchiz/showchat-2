import { useAuthStore } from "@/store/authStore";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { router } from "expo-router";

interface ErrorData {
  error?: string;
  message?: string;
  detail?: string;
  msg?: string;
  details?: { field: string; message: string }[];
}

interface RefreshResponse {
  message: string;
  success: boolean;
  status: number;
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

const BASE_URL = process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

let isRefreshing = false;
let failedQueue: {
  resolve: (token?: string) => void;
  reject: (error?: any) => void;
}[] = [];

const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = useAuthStore.getState().session?.access_token;

    const isPublicRoute = config.url?.match(
      /\/(login|signup|auth-login|auth-signup|auth-password|auth-refresh)/i,
    );

    if (accessToken && !isPublicRoute && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ErrorData>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!error.response) {
      console.error("[API] Network Error / Timeout:", error.config?.url);
      return Promise.reject(error);
    }

    const status = error.response.status;
    const url = error.config?.url;

    if (url?.includes("/auth-refresh")) {
      isRefreshing = false;
      console.error("[Auth] Refresh token endpoint failed. Logging out.");
      handleLogout();
      return Promise.reject(error);
    }
    const data = error.response?.data;
    if (data) {
      error.message =
        data.details && Array.isArray(data.details)
          ? `${data.error ?? "Validation failed"}: ${data.details
              .map((d) => `${d.field}: ${d.message}`)
              .join(", ")}`
          : (data.message ??
            data.error ??
            data.detail ??
            data.msg ??
            "Request failed");
    }

    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = useAuthStore.getState().session?.refresh_token;
      if (!refreshToken) {
        handleLogout();
        return Promise.reject(error);
      }

      try {
        const { data: refreshData } = await axios.post<RefreshResponse>(
          `${BASE_URL}/auth-refresh`,
          { refresh_token: refreshToken },
          { headers: { "Content-Type": "application/json" } },
        );

        const { access_token, refresh_token, expires_at } = refreshData;

        useAuthStore.getState().setSession({
          access_token,
          refresh_token,
          expires_at,
        });

        processQueue(null, access_token);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        handleLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

const handleLogout = () => {
  console.warn("[Auth] Session expired or invalid. Clearing state.");
  const { clearAll } = useAuthStore.getState();
  clearAll();
  router.dismissAll();
  router.replace("/sign-in");
};

export default api;
