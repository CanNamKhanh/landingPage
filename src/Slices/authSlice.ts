// authSlice.ts

import { createSlice } from "@reduxjs/toolkit";
import type { UserData } from "@/services/authService";
import {
  fetchRegister,
  fetchLogin,
  fetchLogout,
  fetchMe,
  fetchUpdateProfile,
  fetchRefreshToken,
  fetchForgotPassword,
  fetchChangePassword,
} from "@/middlewares/authMiddleware";

interface AuthState {
  user: UserData | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  status: "idle",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const setPending = (state: AuthState) => {
  state.loading = true;
  state.error = null;
  state.status = "loading";
};

const setError = (state: AuthState, message: string | undefined) => {
  state.loading = false;
  state.error = message ?? "Something went wrong.";
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearUser(state) {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(fetchRegister.pending, setPending)
      .addCase(fetchRegister.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchRegister.rejected, (state, action) => {
        setError(state, action.payload);
      });

    // Login
    builder
      .addCase(fetchLogin.pending, setPending)
      .addCase(fetchLogin.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchLogin.rejected, (state, action) => {
        setError(state, action.payload);
      });

    // Refresh Token
    builder
      .addCase(fetchRefreshToken.pending, setPending)
      .addCase(fetchRefreshToken.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchRefreshToken.rejected, (state, action) => {
        setError(state, action.payload);
        state.isAuthenticated = false;
        state.user = null;
      });

    // Forgot Password
    builder
      .addCase(fetchForgotPassword.pending, setPending)
      .addCase(fetchForgotPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchForgotPassword.rejected, (state, action) => {
        setError(state, action.payload);
      });

    // Logout
    builder
      .addCase(fetchLogout.pending, setPending)
      .addCase(fetchLogout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false; // ◄ Chuẩn
      })
      .addCase(fetchLogout.rejected, (state, action) => {
        setError(state, action.payload);
        state.isAuthenticated = false; // ◄ Chuẩn
        state.user = null;
      });

    // Get Me
    builder
      .addCase(fetchMe.pending, setPending)
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.user = action.payload.user;
        state.isAuthenticated = true; // ◄ Bắt buộc phải có để giữ phiên khi F5
      })
      .addCase(fetchMe.rejected, (state) => {
        // setError(state, action.payload);

        state.loading = false;
        state.status = "failed";
        state.isAuthenticated = false; // ◄ vẫn giữ, để biết chưa đăng nhập
        state.user = null;
        state.error = null;
      });

    // Update Profile
    builder
      .addCase(fetchUpdateProfile.pending, setPending)
      .addCase(fetchUpdateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(fetchUpdateProfile.rejected, (state, action) => {
        setError(state, action.payload);
      });

    // Change Password
    builder
      .addCase(fetchChangePassword.pending, setPending)
      .addCase(fetchChangePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchChangePassword.rejected, (state, action) => {
        setError(state, action.payload);
      });
  },
});

export const { clearError, clearUser } = authSlice.actions;
export default authSlice;
