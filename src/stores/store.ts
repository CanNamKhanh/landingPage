import { loggerMiddleware } from "@/middlewares/loggerMiddleware";
import authSlice from "@/Slices/authSlice";
import bookingSlice from "@/Slices/bookingSlice";
import boosterSlice from "@/Slices/boosterSlice";
import chatSlice from "@/Slices/chatSlice";
import orderSlice from "@/Slices/orderSlice";
import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

export const store = configureStore({
  reducer: {
    booking: bookingSlice.reducer,
    auth: authSlice.reducer,
    order: orderSlice.reducer,
    booster: boosterSlice.reducer,
    chat: chatSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loggerMiddleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

// Export custom hook để sử dụng thay cho useDispatch thuần
export const useAppDispatch = () => useDispatch<AppDispatch>();
