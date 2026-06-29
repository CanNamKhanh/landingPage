import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as boosterService from "@/services/boosterService";
import type {
  Booster,
  CreateBoosterPayload,
  ListBoostersParams,
} from "@/types/booster.types";

interface BoosterState {
  items: Booster[];
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
}

const initialState: BoosterState = {
  items: [],
  isLoading: false,
  isCreating: false,
  error: null,
};

function extractErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: { data?: { message?: string } } }).response
      ?.data?.message === "string"
  ) {
    return (error as { response: { data: { message: string } } }).response.data
      .message;
  }
  return error instanceof Error ? error.message : "Đã có lỗi xảy ra";
}

export const fetchBoosters = createAsyncThunk(
  "booster/fetchBoosters",
  async (params: ListBoostersParams | undefined, { rejectWithValue }) => {
    try {
      return await boosterService.listBoosters(params ?? {});
    } catch (error) {
      console.error("[boosterSlice] fetchBoosters failed", error);
      return rejectWithValue(extractErrorMessage(error));
    }
  },
);

export const createBoosterThunk = createAsyncThunk(
  "booster/create",
  async (payload: CreateBoosterPayload, { rejectWithValue }) => {
    try {
      return await boosterService.createBooster(payload);
    } catch (error) {
      console.error("[boosterSlice] createBoosterThunk failed", error);
      return rejectWithValue(extractErrorMessage(error));
    }
  },
);

const boosterSlice = createSlice({
  name: "booster",
  initialState,
  reducers: {
    clearBoosterError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoosters.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBoosters.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchBoosters.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) ?? "Không tải được danh sách booster";
      })
      .addCase(createBoosterThunk.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createBoosterThunk.fulfilled, (state, action) => {
        state.isCreating = false;
        state.items.unshift(action.payload);
      })
      .addCase(createBoosterThunk.rejected, (state, action) => {
        state.isCreating = false;
        state.error = (action.payload as string) ?? "Tạo booster thất bại";
      });
  },
});

export const { clearBoosterError } = boosterSlice.actions;
export default boosterSlice;
