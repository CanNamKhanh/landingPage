// authService.ts

import axiosInstance from "@/utils/axios";
import type { AxiosError } from "axios";

// ─── Payload Types ────────────────────────────────────────────────────────────

export interface RegisterPayload {
  email: string;
  username: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RefreshTokenPayload {
  refreshToken: string;
}

export interface ForgotPasswordPayload {
  email: string;
  newPassword: string;
}

export interface LogoutPayload {
  refreshToken: string;
}

export interface UpdateProfilePayload {
  username?: string;
  email?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

// ─── Response Types ───────────────────────────────────────────────────────────

export interface UserData {
  id: string;
  email: string;
  username: string;
  role: "USER" | "ADMIN" | "BOOSTER";
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResult<T = undefined> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

async function request<T>(
  method: "get" | "post" | "patch" | "delete",
  path: string,
  payload?: unknown,
): Promise<AuthResult<T>> {
  try {
    const res = await axiosInstance.request<AuthResult<T>>({
      method,
      url: `/auth${path}`,
      data: payload,
    });
    return res.data;
  } catch (err: unknown) {
    const axiosErr = err as AxiosError<{ message?: string }>;
    const message =
      axiosErr.response?.data?.message ?? axiosErr.message ?? "Request failed.";
    console.error("[AUTH ERROR DEBUG]", {
      code: axiosErr.code,
      message: axiosErr.message,
      hasResponse: !!axiosErr.response,
      status: axiosErr.response?.status,
      requestURL: axiosErr.config?.url,
      baseURL: axiosErr.config?.baseURL,
    });
    return { success: false, error: message };
  }
}

// ─── Auth Service ─────────────────────────────────────────────────────────────

export const authService = {
  /** POST /api/auth/register */
  register(payload: RegisterPayload) {
    return request<{ user: UserData }>("post", "/register", payload);
  },

  /** POST /api/auth/login */
  login(payload: LoginPayload) {
    return request<AuthTokens>("post", "/login", payload);
  },

  /** POST /api/auth/refresh-token */
  refreshToken(payload: RefreshTokenPayload) {
    return request<AuthTokens>("post", "/refresh-token", payload);
  },

  /** POST /api/auth/forgot-password */
  forgotPassword(payload: ForgotPasswordPayload) {
    return request("post", "/forgot-password", payload);
  },

  /** 🔒 POST /api/auth/logout */
  logout(payload: LogoutPayload) {
    return request("post", "/logout", payload);
  },

  /** 🔒 GET /api/auth/me */
  getMe() {
    return request<{ user: UserData }>("get", "/me");
  },

  /** 🔒 PATCH /api/auth/me */
  updateProfile(payload: UpdateProfilePayload) {
    return request<{ user: UserData }>("patch", "/me", payload);
  },

  /** 🔒 PATCH /api/auth/change-password */
  changePassword(payload: ChangePasswordPayload) {
    return request("patch", "/change-password", payload);
  },
};
