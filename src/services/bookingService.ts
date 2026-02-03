import axiosInstance from "@/utils/axios";

interface BookingFormFields {
  name: string;
  email: string;
  contactMethod: string;
  contactInfo: string;
  game: string;
  paymentMethod: string;
  boostingRequirements: string;
}

export const handleBooking = async (data: BookingFormFields) => {
  const res = await axiosInstance.post("api/submit-form", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data;
};
