import type { FormData } from "@/components/booking-form";
import axiosInstance from "@/utils/axios";

export interface SubmitFormResponse {
  success: boolean;
  error?: string;
}

export async function submitContactForm(
  data: FormData,
): Promise<SubmitFormResponse> {
  const res = await axiosInstance.post<SubmitFormResponse>(
    "/api/submit-form",
    data,
  );
  return res.data;
}
