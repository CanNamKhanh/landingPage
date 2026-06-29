import type { ApiResponse } from "@/types/common.types";
import type {
  AssignBoosterPayload,
  ConfirmPaymentRequest,
  CreateOrderRequest,
  ListOrdersParams,
  Order,
  OrderDetail,
  UpdateOrderProgressPayload,
} from "@/types/order.types";
import axiosInstance from "@/utils/axios";

// NOTE: import path "@/lib/axiosInstance" là MÌNH GIẢ ĐỊNH theo cấu trúc thường gặp.
// Nếu file axiosInstance bạn gửi đang nằm ở path khác (vd "@/Apis/axiosInstance",
// "@/configs/axios"...), đổi lại import này cho khớp.

// const TAG = "[OrderService]";

export async function createOrder(payload: CreateOrderRequest): Promise<Order> {
  // console.log(TAG, "createOrder:request", payload);
  const res = await axiosInstance.post<ApiResponse<Order>>("/orders", payload);
  // console.log(TAG, "createOrder:response", res.data.data);
  return res.data.data;
}

export async function confirmPayment(
  orderId: string,
  payload: ConfirmPaymentRequest,
): Promise<Order> {
  // console.log(TAG, "confirmPayment:request", { orderId, payload });
  const res = await axiosInstance.post<ApiResponse<Order>>(
    `/orders/${orderId}/confirm-payment`,
    payload,
  );
  // console.log(TAG, "confirmPayment:response", res.data.data);
  return res.data.data;
}

export async function listOrders(params: ListOrdersParams): Promise<Order[]> {
  // console.log(TAG, "listOrders:request", params);
  const res = await axiosInstance.get<ApiResponse<Order[]>>("/orders", {
    params,
  });
  // console.log(TAG, "listOrders:response", { count: res.data.data.length });
  return res.data.data;
}

export async function getOrder(orderId: string): Promise<OrderDetail> {
  // console.log(TAG, "getOrder:request", { orderId });
  const res = await axiosInstance.get<ApiResponse<OrderDetail>>(
    `/orders/${orderId}`,
  );
  // console.log(TAG, "getOrder:response", res.data.data);
  return res.data.data;
}

export async function assignBooster(
  orderId: string,
  payload: AssignBoosterPayload,
): Promise<Order> {
  // console.log(TAG, "assignBooster:request", { orderId, payload });
  const res = await axiosInstance.post<ApiResponse<Order>>(
    `/orders/${orderId}/assign-booster`,
    payload,
  );
  // console.log(TAG, "assignBooster:response", res.data.data);
  return res.data.data;
}

export async function updateOrderProgress(
  orderId: string,
  payload: UpdateOrderProgressPayload,
): Promise<Order> {
  // console.log(TAG, "updateOrderProgress:request", { orderId, payload });
  const res = await axiosInstance.patch<ApiResponse<Order>>(
    `/orders/${orderId}/progress`,
    payload,
  );
  // console.log(TAG, "updateOrderProgress:response", res.data.data);
  return res.data.data;
}

// Giữ sẵn cho lúc bạn enable lại tính năng claim cho booster
export async function claimOrder(orderId: string): Promise<Order> {
  // console.log(TAG, "claimOrder:request", { orderId });
  const res = await axiosInstance.post<ApiResponse<Order>>(
    `/orders/${orderId}/claim`,
  );
  // console.log(TAG, "claimOrder:response", res.data.data);
  return res.data.data;
}
