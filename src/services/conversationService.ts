// src/services/conversationService.ts
// Tất cả REST API calls liên quan đến conversation.
// Được dùng bởi conversationSlice (asyncThunks) và có thể gọi trực tiếp nếu cần.

import type { MessageResponse } from "@/lib/conversationSocket";
import axiosInstance from "@/utils/axios";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PaginatedMessages {
  messages: MessageResponse[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface ConversationSummary {
  id: string;
  type: "AI" | "ADMIN";
  userId: string;
  user: { id: string; username: string } | null;
  messages: MessageResponse[]; // 1 tin nhắn mới nhất (preview)
}

// ─── User APIs ────────────────────────────────────────────────────────────────

/**
 * GET /conversations/admin/messages
 * Lấy messages của conversation user ↔ admin (có cursor pagination).
 */
export async function getMyAdminMessages(params?: {
  cursor?: string;
  limit?: number;
}): Promise<PaginatedMessages> {
  const res = await axiosInstance.get<{
    success: boolean;
    data: PaginatedMessages;
  }>("/conversations/admin/messages", {
    params: { limit: 30, ...params },
  });
  return res.data.data;
}

/**
 * POST /conversations/admin/messages
 * Gửi tin nhắn lên admin qua REST (fallback khi socket không available).
 */
export async function sendMessageToAdmin(
  content: string,
): Promise<MessageResponse> {
  const res = await axiosInstance.post<{
    success: boolean;
    data: { message: MessageResponse };
  }>("/conversations/admin/messages", { content });
  return res.data.data.message;
}

/**
 * GET /conversations/ai/messages
 * Lấy messages của conversation user ↔ AI.
 */
export async function getMyAiMessages(params?: {
  cursor?: string;
  limit?: number;
}): Promise<PaginatedMessages> {
  const res = await axiosInstance.get<{
    success: boolean;
    data: PaginatedMessages;
  }>("/conversations/ai/messages", {
    params: { limit: 30, ...params },
  });
  return res.data.data;
}

/**
 * POST /conversations/ai/messages
 * Gửi tin nhắn cho AI.
 */
export async function sendMessageToAi(content: string): Promise<{
  userMessage: MessageResponse;
  aiMessage: MessageResponse;
}> {
  const res = await axiosInstance.post<{
    success: boolean;
    data: { userMessage: MessageResponse; aiMessage: MessageResponse };
  }>("/conversations/ai/messages", { content });
  return res.data.data;
}

/**
 * GET /conversations
 * Lấy tổng quan cả 2 conversation (AI + ADMIN) của user hiện tại.
 */
export async function getMyConversations(): Promise<ConversationSummary[]> {
  const res = await axiosInstance.get<{
    success: boolean;
    data: { conversations: ConversationSummary[] };
  }>("/conversations");
  return res.data.data.conversations;
}

// ─── Admin APIs ───────────────────────────────────────────────────────────────

/**
 * GET /conversations/admin-panel
 * [ADMIN] Lấy tất cả conversations có type=ADMIN.
 */
export async function adminGetAllConversations(): Promise<
  ConversationSummary[]
> {
  const res = await axiosInstance.get<{
    success: boolean;
    data: { conversations: ConversationSummary[] };
  }>("/conversations/admin-panel");
  return res.data.data.conversations;
}

/**
 * GET /conversations/admin-panel/:userId/messages
 * [ADMIN] Lấy messages của một user cụ thể.
 */
export async function adminGetUserMessages(
  targetUserId: string,
  params?: { cursor?: string; limit?: number },
): Promise<PaginatedMessages> {
  const res = await axiosInstance.get<{
    success: boolean;
    data: PaginatedMessages;
  }>(`/conversations/admin-panel/${targetUserId}/messages`, {
    params: { limit: 30, ...params },
  });
  return res.data.data;
}

/**
 * POST /conversations/admin-panel/:userId/reply
 * [ADMIN] Gửi reply cho user qua REST (fallback khi socket không available).
 */
export async function adminReplyToUser(
  targetUserId: string,
  content: string,
): Promise<MessageResponse> {
  const res = await axiosInstance.post<{
    success: boolean;
    data: { message: MessageResponse };
  }>(`/conversations/admin-panel/${targetUserId}/reply`, { content });
  return res.data.data.message;
}
