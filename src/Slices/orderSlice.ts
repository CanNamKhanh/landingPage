import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as orderService from "@/services/orderService";
import type {
  AssignBoosterPayload,
  ListOrdersParams,
  Order,
  UpdateOrderProgressPayload,
} from "@/types/order.types";

interface OrderState {
  items: Order[];
  isLoading: boolean;
  isMutating: boolean;
  error: string | null;
}

const initialState: OrderState = {
  items: [],
  isLoading: false,
  isMutating: false,
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

export const fetchOrders = createAsyncThunk(
  "order/fetchOrders",
  async (params: ListOrdersParams, { rejectWithValue }) => {
    try {
      return await orderService.listOrders(params);
    } catch (error) {
      console.error("[orderSlice] fetchOrders failed", error);
      return rejectWithValue(extractErrorMessage(error));
    }
  },
);

export const assignBoosterToOrder = createAsyncThunk(
  "order/assignBooster",
  async (
    payload: { orderId: string; boosterId: AssignBoosterPayload },
    { rejectWithValue },
  ) => {
    try {
      return await orderService.assignBooster(
        payload.orderId,
        payload.boosterId,
      );
    } catch (error) {
      console.error("[orderSlice] assignBoosterToOrder failed", error);
      return rejectWithValue(extractErrorMessage(error));
    }
  },
);

export const updateOrderProgressThunk = createAsyncThunk(
  "order/updateProgress",
  async (
    payload: { orderId: string; data: UpdateOrderProgressPayload },
    { rejectWithValue },
  ) => {
    try {
      return await orderService.updateOrderProgress(
        payload.orderId,
        payload.data,
      );
    } catch (error) {
      console.error("[orderSlice] updateOrderProgressThunk failed", error);
      return rejectWithValue(extractErrorMessage(error));
    }
  },
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearOrderError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) ?? "Không tải được danh sách kèo";
      })
      .addCase(assignBoosterToOrder.pending, (state) => {
        state.isMutating = true;
      })
      .addCase(assignBoosterToOrder.fulfilled, (state, action) => {
        state.isMutating = false;
        const idx = state.items.findIndex((o) => o.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(assignBoosterToOrder.rejected, (state, action) => {
        state.isMutating = false;
        state.error = (action.payload as string) ?? "Gán booster thất bại";
      })
      .addCase(updateOrderProgressThunk.pending, (state) => {
        state.isMutating = true;
      })
      .addCase(updateOrderProgressThunk.fulfilled, (state, action) => {
        state.isMutating = false;
        const idx = state.items.findIndex((o) => o.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateOrderProgressThunk.rejected, (state, action) => {
        state.isMutating = false;
        state.error = (action.payload as string) ?? "Cập nhật tiến độ thất bại";
      });
  },
});

export const { clearOrderError } = orderSlice.actions;
export default orderSlice;
