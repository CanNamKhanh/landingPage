import { handleBooking } from "@/services/bookingService";
import type { BookingResult } from "@/services/bookingService";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Re-export các payload types để dùng ở nơi khác nếu cần
export type {
  ValorantRankBoostPayload,
  ValorantPlacementPayload,
  ValorantNetWinsPayload,
  ABIKoensFarmingPayload,
  ABIAccountLevelingPayload,
  ABIRaidBoostPayload,
  ABITitaniumCasePayload,
  DFTekniqqAlloyyFarmingPayload,
  DFAccountLevelingPayload,
  DFHazardOperationPayload,
  DFSeasonMissionPayload,
  DFRankBoostingPayload,
} from "@/services/bookingService";

// Dùng Parameters để lấy type argument của handleBooking — không duplicate
type BookingPayload = Parameters<typeof handleBooking>[0];

export const fetchBooking = createAsyncThunk<
  BookingResult, // fulfilled return type
  BookingPayload, // argument type
  { rejectValue: string }
>("booking/FetchBooking", async (data, { rejectWithValue }) => {
  try {
    const res = await handleBooking(data);
    if (!res.success) {
      return rejectWithValue(res.error ?? "Booking failed.");
    }
    return res;
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to submit booking.";
    return rejectWithValue(message);
  }
});
