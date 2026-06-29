// src/Slices/conversationSlice.ts
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  getMyAdminMessages,
  sendMessageToAdmin,
  adminGetAllConversations,
  adminGetUserMessages,
  adminReplyToUser,
} from "@/services/conversationService";
import type { MessageResponse } from "@/lib/conversationSocket";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ConversationSummary {
  id: string;
  type: "AI" | "ADMIN";
  userId: string;
  user: { id: string; username: string } | null;
  messages: MessageResponse[]; // chỉ 1 tin nhắn mới nhất (preview)
}

interface ConversationState {
  // ── User side ──────────────────────────────────────────────────────────────
  /** Danh sách tin nhắn trong conversation user ↔ admin */
  myMessages: MessageResponse[];
  myNextCursor: string | null;
  myHasMore: boolean;
  isLoadingMyMessages: boolean;
  isSendingMyMessage: boolean;
  isAdminTyping: boolean;

  // ── Admin side ─────────────────────────────────────────────────────────────
  /** Danh sách tất cả conversation có type=ADMIN */
  conversations: ConversationSummary[];
  isLoadingConversations: boolean;

  /** userId đang active (admin đang xem) */
  activeUserId: string | null;

  /** Messages của user đang được admin xem */
  adminMessages: MessageResponse[];
  adminNextCursor: string | null;
  adminHasMore: boolean;
  isLoadingAdminMessages: boolean;
  isSendingReply: boolean;

  /** Typing indicators: set of userId đang typing */
  typingUserIds: string[];
}

// ─── Initial state ────────────────────────────────────────────────────────────

const initialState: ConversationState = {
  myMessages: [],
  myNextCursor: null,
  myHasMore: false,
  isLoadingMyMessages: false,
  isSendingMyMessage: false,
  isAdminTyping: false,

  conversations: [],
  isLoadingConversations: false,

  activeUserId: null,
  adminMessages: [],
  adminNextCursor: null,
  adminHasMore: false,
  isLoadingAdminMessages: false,
  isSendingReply: false,

  typingUserIds: [],
};

// ─── Thunks ───────────────────────────────────────────────────────────────────

/** USER: Lấy messages của conversation với admin */
export const fetchMyAdminMessages = createAsyncThunk(
  "conversation/fetchMyAdminMessages",
  async (cursor?: string) => {
    return await getMyAdminMessages(cursor ? { cursor } : undefined);
  },
);

/**
 * USER: Gửi tin nhắn lên admin qua REST (fallback khi socket chưa sẵn).
 * Thông thường FE sẽ emit qua socket; thunk này vẫn cần để lạc quan update UI.
 */
export const sendMyMessageToAdmin = createAsyncThunk(
  "conversation/sendMyMessageToAdmin",
  async (content: string) => {
    return await sendMessageToAdmin(content);
  },
);

/** ADMIN: Lấy tất cả conversations có type=ADMIN */
export const fetchAdminConversations = createAsyncThunk(
  "conversation/fetchAdminConversations",
  async () => {
    return await adminGetAllConversations();
  },
);

/** ADMIN: Mở conversation của 1 user → load messages */
export const openUserConversation = createAsyncThunk(
  "conversation/openUserConversation",
  async (targetUserId: string) => {
    const data = await adminGetUserMessages(targetUserId);
    return { targetUserId, ...data };
  },
);

/** ADMIN: Load thêm messages cũ hơn (infinite scroll up) */
export const loadMoreAdminMessages = createAsyncThunk(
  "conversation/loadMoreAdminMessages",
  async ({
    targetUserId,
    cursor,
  }: {
    targetUserId: string;
    cursor: string;
  }) => {
    return await adminGetUserMessages(targetUserId, { cursor });
  },
);

/**
 * ADMIN: Gửi reply qua REST (fallback).
 * Khi dùng socket, gọi socket.emit("admin:send_to_user", ...) trực tiếp
 * rồi dispatch addAdminSentMessage để update local state.
 */
export const sendAdminReply = createAsyncThunk(
  "conversation/sendAdminReply",
  async ({
    targetUserId,
    content,
  }: {
    targetUserId: string;
    content: string;
  }) => {
    return await adminReplyToUser(targetUserId, content);
  },
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    // ── Socket-driven actions ─────────────────────────────────────────────────

    /** USER nhận tin mới từ admin qua socket */
    addMyMessage(state, action: PayloadAction<MessageResponse>) {
      const exists = state.myMessages.some((m) => m.id === action.payload.id);
      if (!exists) state.myMessages.push(action.payload);
    },

    /**
     * ADMIN nhận tin mới từ user qua socket.
     * - Cập nhật preview trong danh sách conversations
     * - Nếu user đó đang active → append vào adminMessages
     */
    addIncomingUserMessage(
      state,
      action: PayloadAction<{
        userId: string;
        username: string;
        message: MessageResponse;
      }>,
    ) {
      const { userId, message } = action.payload;

      // Cập nhật preview (tin mới nhất) trong sidebar
      const conv = state.conversations.find((c) => c.userId === userId);
      if (conv) {
        conv.messages = [message];
      } else {
        // User mới chưa có trong danh sách → thêm vào
        state.conversations.unshift({
          id: message.conversationId,
          type: "ADMIN",
          userId,
          user: { id: userId, username: action.payload.username },
          messages: [message],
        });
      }

      // Nếu đang xem conversation của user đó → append
      if (state.activeUserId === userId) {
        const exists = state.adminMessages.some((m) => m.id === message.id);
        if (!exists) state.adminMessages.push(message);
      }
    },

    /** ADMIN: tin nhắn vừa gửi được confirm qua socket */
    addAdminSentMessage(
      state,
      action: PayloadAction<{ targetUserId: string; message: MessageResponse }>,
    ) {
      const { targetUserId, message } = action.payload;
      if (state.activeUserId === targetUserId) {
        const exists = state.adminMessages.some((m) => m.id === message.id);
        if (!exists) state.adminMessages.push(message);
      }
    },

    /** Typing indicators */
    setAdminTyping(state, action: PayloadAction<boolean>) {
      state.isAdminTyping = action.payload;
    },

    addTypingUser(state, action: PayloadAction<string>) {
      if (!state.typingUserIds.includes(action.payload)) {
        state.typingUserIds.push(action.payload);
      }
    },

    removeTypingUser(state, action: PayloadAction<string>) {
      state.typingUserIds = state.typingUserIds.filter(
        (id) => id !== action.payload,
      );
    },

    /** Reset toàn bộ khi logout */
    resetConversation() {
      return initialState;
    },
  },

  extraReducers: (builder) => {
    // ── fetchMyAdminMessages ──────────────────────────────────────────────────
    builder
      .addCase(fetchMyAdminMessages.pending, (state) => {
        state.isLoadingMyMessages = true;
      })
      .addCase(fetchMyAdminMessages.fulfilled, (state, action) => {
        state.isLoadingMyMessages = false;
        // Nếu load thêm (có cursor) → prepend; ngược lại replace
        if (action.meta.arg) {
          // có cursor → load older messages
          state.myMessages = [...action.payload.messages, ...state.myMessages];
        } else {
          state.myMessages = action.payload.messages;
        }
        state.myNextCursor = action.payload.nextCursor;
        state.myHasMore = action.payload.hasMore;
      })
      .addCase(fetchMyAdminMessages.rejected, (state) => {
        state.isLoadingMyMessages = false;
      });

    // ── sendMyMessageToAdmin ──────────────────────────────────────────────────
    builder
      .addCase(sendMyMessageToAdmin.pending, (state) => {
        state.isSendingMyMessage = true;
      })
      .addCase(sendMyMessageToAdmin.fulfilled, (state, action) => {
        state.isSendingMyMessage = false;
        const exists = state.myMessages.some((m) => m.id === action.payload.id);
        if (!exists) state.myMessages.push(action.payload);
      })
      .addCase(sendMyMessageToAdmin.rejected, (state) => {
        state.isSendingMyMessage = false;
      });

    // ── fetchAdminConversations ───────────────────────────────────────────────
    builder
      .addCase(fetchAdminConversations.pending, (state) => {
        state.isLoadingConversations = true;
      })
      .addCase(fetchAdminConversations.fulfilled, (state, action) => {
        state.isLoadingConversations = false;
        state.conversations = action.payload;
      })
      .addCase(fetchAdminConversations.rejected, (state) => {
        state.isLoadingConversations = false;
      });

    // ── openUserConversation ──────────────────────────────────────────────────
    builder
      .addCase(openUserConversation.pending, (state) => {
        state.isLoadingAdminMessages = true;
      })
      .addCase(openUserConversation.fulfilled, (state, action) => {
        state.isLoadingAdminMessages = false;
        state.activeUserId = action.payload.targetUserId;
        state.adminMessages = action.payload.messages;
        state.adminNextCursor = action.payload.nextCursor;
        state.adminHasMore = action.payload.hasMore;
      })
      .addCase(openUserConversation.rejected, (state) => {
        state.isLoadingAdminMessages = false;
      });

    // ── loadMoreAdminMessages ─────────────────────────────────────────────────
    builder.addCase(loadMoreAdminMessages.fulfilled, (state, action) => {
      state.adminMessages = [
        ...action.payload.messages,
        ...state.adminMessages,
      ];
      state.adminNextCursor = action.payload.nextCursor;
      state.adminHasMore = action.payload.hasMore;
    });

    // ── sendAdminReply (REST fallback) ────────────────────────────────────────
    builder
      .addCase(sendAdminReply.pending, (state) => {
        state.isSendingReply = true;
      })
      .addCase(sendAdminReply.fulfilled, (state, action) => {
        state.isSendingReply = false;
        const exists = state.adminMessages.some(
          (m) => m.id === action.payload.id,
        );
        if (!exists) state.adminMessages.push(action.payload);
      })
      .addCase(sendAdminReply.rejected, (state) => {
        state.isSendingReply = false;
      });
  },
});

export const {
  addMyMessage,
  addIncomingUserMessage,
  addAdminSentMessage,
  setAdminTyping,
  addTypingUser,
  removeTypingUser,
  resetConversation,
} = conversationSlice.actions;

export default conversationSlice;
