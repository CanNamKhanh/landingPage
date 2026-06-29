// authMiddleware.ts

import { createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "@/services/authService";
import type {
  RegisterPayload,
  LoginPayload,
  RefreshTokenPayload,
  ForgotPasswordPayload,
  LogoutPayload,
  UpdateProfilePayload,
  ChangePasswordPayload,
  UserData,
  AuthTokens,
} from "@/services/authService";

// Re-export payload types nếu cần dùng ở nơi khác
export type {
  RegisterPayload,
  LoginPayload,
  RefreshTokenPayload,
  ForgotPasswordPayload,
  LogoutPayload,
  UpdateProfilePayload,
  ChangePasswordPayload,
};

// ─── Register ─────────────────────────────────────────────────────────────────

export const fetchRegister = createAsyncThunk<
  { user: UserData },
  RegisterPayload,
  { rejectValue: string }
>("auth/fetchRegister", async (data, { rejectWithValue }) => {
  try {
    const res = await authService.register(data);
    if (!res.success || !res.data) {
      return rejectWithValue(res.error ?? "Registration failed.");
    }
    return res.data;
  } catch (err: unknown) {
    return rejectWithValue(
      err instanceof Error ? err.message : "Registration failed.",
    );
  }
});

// ─── Login ────────────────────────────────────────────────────────────────────

export const fetchLogin = createAsyncThunk<
  AuthTokens,
  LoginPayload,
  { rejectValue: string }
>("auth/fetchLogin", async (data, { rejectWithValue }) => {
  try {
    const res = await authService.login(data);
    if (!res.success || !res.data) {
      return rejectWithValue(res.error ?? "Login failed.");
    }
    // Lưu tokens vào localStorage
    localStorage.setItem("accessToken", res.data.accessToken);
    localStorage.setItem("refreshToken", res.data.refreshToken);
    return res.data;
  } catch (err: unknown) {
    return rejectWithValue(
      err instanceof Error ? err.message : "Login failed.",
    );
  }
});

// ─── Refresh Token ────────────────────────────────────────────────────────────

export const fetchRefreshToken = createAsyncThunk<
  AuthTokens,
  RefreshTokenPayload,
  { rejectValue: string }
>("auth/fetchRefreshToken", async (data, { rejectWithValue }) => {
  try {
    const res = await authService.refreshToken(data);
    if (!res.success || !res.data) {
      return rejectWithValue(res.error ?? "Token refresh failed.");
    }
    // Rotation: cập nhật tokens mới
    localStorage.setItem("accessToken", res.data.accessToken);
    localStorage.setItem("refreshToken", res.data.refreshToken);
    return res.data;
  } catch (err: unknown) {
    return rejectWithValue(
      err instanceof Error ? err.message : "Token refresh failed.",
    );
  }
});

// ─── Forgot Password ──────────────────────────────────────────────────────────

export const fetchForgotPassword = createAsyncThunk<
  void,
  ForgotPasswordPayload,
  { rejectValue: string }
>("auth/fetchForgotPassword", async (data, { rejectWithValue }) => {
  try {
    const res = await authService.forgotPassword(data);
    if (!res.success) {
      return rejectWithValue(res.error ?? "Password reset failed.");
    }
  } catch (err: unknown) {
    return rejectWithValue(
      err instanceof Error ? err.message : "Password reset failed.",
    );
  }
});

// ─── Logout ───────────────────────────────────────────────────────────────────

export const fetchLogout = createAsyncThunk<
  void,
  LogoutPayload,
  { rejectValue: string }
>("auth/fetchLogout", async (data, { rejectWithValue }) => {
  try {
    const res = await authService.logout(data);
    if (!res.success) {
      return rejectWithValue(res.error ?? "Logout failed.");
    }
    // Xóa tokens khỏi localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  } catch (err: unknown) {
    return rejectWithValue(
      err instanceof Error ? err.message : "Logout failed.",
    );
  }
});

// ─── Get Me ───────────────────────────────────────────────────────────────────

export const fetchMe = createAsyncThunk<
  { user: UserData },
  void,
  { rejectValue: string }
>("auth/fetchMe", async (_, { rejectWithValue }) => {
  try {
    const res = await authService.getMe();
    if (!res.success || !res.data) {
      return rejectWithValue(res.error ?? "Failed to fetch user.");
    }
    return res.data;
  } catch (err: unknown) {
    return rejectWithValue(
      err instanceof Error ? err.message : "Failed to fetch user.",
    );
  }
});

// ─── Update Profile ───────────────────────────────────────────────────────────

export const fetchUpdateProfile = createAsyncThunk<
  { user: UserData },
  UpdateProfilePayload,
  { rejectValue: string }
>("auth/fetchUpdateProfile", async (data, { rejectWithValue }) => {
  try {
    const res = await authService.updateProfile(data);
    if (!res.success || !res.data) {
      return rejectWithValue(res.error ?? "Profile update failed.");
    }
    return res.data;
  } catch (err: unknown) {
    return rejectWithValue(
      err instanceof Error ? err.message : "Profile update failed.",
    );
  }
});

// ─── Change Password ──────────────────────────────────────────────────────────

export const fetchChangePassword = createAsyncThunk<
  void,
  ChangePasswordPayload,
  { rejectValue: string }
>("auth/fetchChangePassword", async (data, { rejectWithValue }) => {
  try {
    const res = await authService.changePassword(data);
    if (!res.success) {
      return rejectWithValue(res.error ?? "Password change failed.");
    }
  } catch (err: unknown) {
    return rejectWithValue(
      err instanceof Error ? err.message : "Password change failed.",
    );
  }
});

// ─── fetchAuth (alias dùng trong authSlice extraReducers) ─────────────────────
export const fetchAuth = fetchMe;
