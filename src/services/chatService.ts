// ─── Types (khớp 100% với MessageResponse / ConversationWithMessages / PaginatedMessages thật) ──

import axiosInstance from "@/utils/axios";

export type MessageSenderType = "USER" | "ADMIN" | "AI";

export interface ChatMessageUser {
  id: string;
  username: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderType: MessageSenderType;
  content: string;
  createdAt: string;
  user: ChatMessageUser | null;
}

export interface ConversationOverview {
  id: string;
  type: "AI" | "ADMIN";
  // userId/user CẦN BE bổ sung vào select của adminGetAllConversationsService
  // (xem hướng dẫn sửa conversation.service.ts) - nếu chưa sửa, field này sẽ undefined.
  userId?: string;
  user?: ChatMessageUser;
  messages: ChatMessage[]; // chỉ chứa 1 tin nhắn cuối (preview)
}

export interface PaginatedMessages {
  messages: ChatMessage[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface ListMessagesParams {
  cursor?: string;
  limit?: number;
}

// Response của BE luôn có dạng { success: boolean, data: T }
interface BackendResponse<T> {
  success: boolean;
  data: T;
}

const TAG = "[ChatService]";

// ─── USER: chat với Admin (dùng trong ConversationWindow) ────────────────────
// Endpoint tự getOrCreate conversation ADMIN, không cần gọi tạo riêng.

export async function getAdminMessages(
  params: ListMessagesParams = {},
): Promise<PaginatedMessages> {
  console.log(TAG, "getAdminMessages:request", params);
  const res = await axiosInstance.get<BackendResponse<PaginatedMessages>>(
    "/conversations/admin/messages",
    { params },
  );
  console.log(TAG, "getAdminMessages:response", {
    count: res.data.data.messages.length,
    hasMore: res.data.data.hasMore,
  });
  return res.data.data;
}

export async function sendMessageToAdmin(
  content: string,
): Promise<ChatMessage> {
  console.log(TAG, "sendMessageToAdmin:request", { content });
  const res = await axiosInstance.post<
    BackendResponse<{ message: ChatMessage }>
  >("/conversations/admin/messages", { content });
  console.log(TAG, "sendMessageToAdmin:response", res.data.data.message);
  return res.data.data.message;
}

// ─── ADMIN: panel quản lý toàn bộ chat với user ──────────────────────────────

export async function adminGetAllConversations(): Promise<
  ConversationOverview[]
> {
  console.log(TAG, "adminGetAllConversations:request");
  const res = await axiosInstance.get<
    BackendResponse<{ conversations: ConversationOverview[] }>
  >("/conversations/admin-panel");
  console.log(TAG, "adminGetAllConversations:response", {
    count: res.data.data.conversations.length,
  });
  return res.data.data.conversations;
}

export async function adminGetUserMessages(
  targetUserId: string,
  params: ListMessagesParams = {},
): Promise<PaginatedMessages> {
  console.log(TAG, "adminGetUserMessages:request", { targetUserId, params });
  const res = await axiosInstance.get<BackendResponse<PaginatedMessages>>(
    `/conversations/admin-panel/${targetUserId}/messages`,
    { params },
  );
  console.log(TAG, "adminGetUserMessages:response", {
    count: res.data.data.messages.length,
  });
  return res.data.data;
}

export async function adminReply(
  targetUserId: string,
  content: string,
): Promise<ChatMessage> {
  console.log(TAG, "adminReply:request", { targetUserId, content });
  const res = await axiosInstance.post<
    BackendResponse<{ message: ChatMessage }>
  >(`/conversations/admin-panel/${targetUserId}/reply`, { content });
  console.log(TAG, "adminReply:response", res.data.data.message);
  return res.data.data.message;
}
