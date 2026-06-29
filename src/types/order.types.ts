import type { Role } from "./common.types";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "REFUNDED";

export type OrderScope = "all" | "mine" | "claimable" | "assignedToMe";

export interface OrderGame {
  id: string;
  code: string;
  name: string;
  iconUrl: string | null;
}

export interface OrderService {
  id: string;
  type: string;
  name: string;
}

export interface OrderBoosterSummary {
  id: string;
  username: string;
  email: string;
}

// `details` shape thay đổi theo serviceType -> giữ unknown, không dùng any
export type OrderDetails = Record<string, unknown>;

export interface Order {
  id: string;
  code: string;
  gameId: string;
  serviceId: string;
  details: OrderDetails;
  totalPrice: string; // Prisma Decimal -> JSON serialize ra string
  currency: string;
  customerName: string;
  customerEmail: string;
  userId: string | null;
  boosterId: string | null;
  status: OrderStatus;
  progressPct: number;
  createdAt: string;
  updatedAt: string;
  game?: OrderGame;
  service?: OrderService;
  booster?: OrderBoosterSummary | null;
}

export interface OrderProgressLog {
  id: string;
  orderId: string;
  updatedById: string;
  status: OrderStatus | null;
  progressPct: number | null;
  note: string | null;
  proofUrls: string[] | null;
  createdAt: string;
}

export interface OrderDetail extends Order {
  progressLogs: OrderProgressLog[];
}

export interface ListOrdersParams {
  scope?: OrderScope;
  status?: OrderStatus;
  gameId?: string;
  cursor?: string;
  limit?: number;
}

export interface AssignBoosterPayload {
  boosterId: string;
}

export interface UpdateOrderProgressPayload {
  status?: OrderStatus;
  progressPct?: number;
  note?: string;
  proofUrls?: string[];
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: Role;
}

export interface CreateOrderRequest {
  gameId: string;
  serviceId: string;
  details: OrderDetails;
  customerName: string;
  customerEmail: string;
  totalPrice: number;
}

export interface ConfirmPaymentRequest {
  paymentRef: string;
}
