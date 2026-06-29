export type ConversationType = "AI" | "ADMIN";
export type MessageSenderType = "USER" | "ADMIN" | "AI";

export interface ChatUserSummary {
  id: string;
  username: string;
  email?: string;
  role?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  userId: string | null;
  senderType: MessageSenderType;
  content: string | null;
  createdAt: string;
  user?: ChatUserSummary | null;
}

export interface Conversation {
  id: string;
  userId: string;
  type: ConversationType;
  createdAt: string;
  updatedAt: string;
  user?: ChatUserSummary;
  messages?: Message[]; // chỉ có khi BE trả preview (vd listAdminConversations)
}

export interface ListMessagesParams {
  cursor?: string;
  limit?: number;
}

export interface SendMessagePayload {
  content: string;
}
