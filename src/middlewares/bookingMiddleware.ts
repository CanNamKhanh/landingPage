import { handleBooking } from "@/services/bookingService";
import { createAsyncThunk } from "@reduxjs/toolkit";

interface BookingFormFields {
  name: string;
  email: string;
  contactMethod: string;
  contactInfo: string;
  game: string;
  paymentMethod: string;
  boostingRequirements: string;
}

export const fetchBooking = createAsyncThunk(
  "booking/FetchBooking",
  async (data: BookingFormFields, { rejectWithValue }) => {
    try {
      const res = await handleBooking(data);
      return res;
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue("Fail To Fetch");
      }
    }
  },
);
