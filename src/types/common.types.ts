export type Role = "USER" | "ADMIN" | "BOOSTER";

export interface ApiResponse<T> {
  data: T;
}

export interface ApiErrorResponse {
  error?: string;
  message: string;
  issues?: unknown;
}
