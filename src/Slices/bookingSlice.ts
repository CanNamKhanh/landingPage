import { fetchBooking } from "@/middlewares/bookingMiddleware";
import { createSlice } from "@reduxjs/toolkit";

interface BookingState {
  loading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  loading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooking.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchBooking.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch";
      });
  },
});

export default bookingSlice;
