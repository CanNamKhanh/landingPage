// src/libs/conversationSocket.ts
// Singleton Socket.IO client cho conversation (user ↔ admin)

import { io, Socket } from "socket.io-client";

// ─── Types (mirror từ BE) ─────────────────────────────────────────────────────

export interface MessageResponse {
  id: string;
  conversationId: string;
  senderType: "USER" | "ADMIN" | "AI";
  content: string;
  createdAt: string; // ISO string
  user: { id: string; username: string } | null;
}

// Events mà CLIENT lắng nghe (server → client)
export interface ServerToClientEvents {
  /** User nhận tin mới (cả confirm gửi lẫn admin reply) */
  "conversation:new_message": (payload: { message: MessageResponse }) => void;
  /** Admin nhận tin mới từ một user */
  "admin:new_user_message": (payload: {
    userId: string;
    username: string;
    message: MessageResponse;
  }) => void;
  /** Admin nhận confirm sau khi gửi thành công */
  "admin:message_sent": (payload: {
    targetUserId: string;
    message: MessageResponse;
  }) => void;
  /** Typing indicators */
  "admin:user_typing": (payload: { userId: string }) => void;
  "conversation:admin_typing": () => void;
}

// Events mà CLIENT emit (client → server)
export interface ClientToServerEvents {
  "user:send_to_admin": (
    payload: { content: string },
    ack: (res: { ok: boolean; data?: MessageResponse; error?: string }) => void,
  ) => void;
  "admin:send_to_user": (
    payload: { targetUserId: string; content: string },
    ack: (res: { ok: boolean; data?: MessageResponse; error?: string }) => void,
  ) => void;
  "admin:open_conversation": (payload: { targetUserId: string }) => void;
  "user:typing": () => void;
  "admin:typing": (payload: { targetUserId: string }) => void;
}

// ─── Singleton ────────────────────────────────────────────────────────────────

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

const SOCKET_URL =
  (import.meta as unknown as { env: Record<string, string> }).env
    .VITE_PUBLIC_API_URL ?? "http://localhost:3000";

/**
 * Khởi tạo hoặc trả về socket hiện có.
 * Gọi sau khi user đã login và có JWT token.
 */
export function getConversationSocket(
  token: string,
): Socket<ServerToClientEvents, ClientToServerEvents> {
  if (socket?.connected) return socket;

  // Nếu socket cũ tồn tại nhưng disconnected → disconnect hẳn rồi tạo mới
  if (socket) {
    socket.disconnect();
    socket = null;
  }

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ["polling", "websocket"],
    upgrade: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2_000,
  });

  socket.on("connect", () => {
    // console.log("[Socket] Connected:", socket?.id);
  });

  socket.on("connect_error", (err) => {
    console.error("[Socket] Connection error:", err.message);
  });

  socket.on("disconnect", (reason) => {
    console.log("[Socket] Disconnected:", reason);
  });

  return socket;
}

/**
 * Disconnect và huỷ socket — gọi khi user logout.
 */
export function disconnectConversationSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("[Socket] Manually disconnected");
  }
}

/**
 * Trả về socket hiện tại (có thể null nếu chưa init).
 */
export function getCurrentSocket(): Socket<
  ServerToClientEvents,
  ClientToServerEvents
> | null {
  return socket;
}
