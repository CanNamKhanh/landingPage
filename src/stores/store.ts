import bookingSlice from "@/Slices/bookingSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: { booking: bookingSlice.reducer },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
