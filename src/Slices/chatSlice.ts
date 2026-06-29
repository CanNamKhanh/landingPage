import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as chatService from "@/services/chatService";
import type {
  ChatMessage,
  ConversationOverview,
  ListMessagesParams,
} from "@/services/chatService";

interface ChatState {
  // ─── USER side (ConversationWindow) ──────────────────────────────────────
  myMessages: ChatMessage[];
  myHasMore: boolean;
  myNextCursor: string | null;
  isLoadingMyMessages: boolean;
  isSendingMyMessage: boolean;

  // ─── ADMIN side (AdminChatTab) ───────────────────────────────────────────
  conversations: ConversationOverview[];
  activeUserId: string | null;
  adminMessages: ChatMessage[];
  isLoadingConversations: boolean;
  isLoadingAdminMessages: boolean;
  isSendingReply: boolean;

  error: string | null;
}

const initialState: ChatState = {
  myMessages: [],
  myHasMore: false,
  myNextCursor: null,
  isLoadingMyMessages: false,
  isSendingMyMessage: false,

  conversations: [],
  activeUserId: null,
  adminMessages: [],
  isLoadingConversations: false,
  isLoadingAdminMessages: false,
  isSendingReply: false,

  error: null,
};

function extractErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: { data?: { message?: string } } }).response
      ?.data?.message === "string"
  ) {
    return (error as { response: { data: { message: string } } }).response.data
      .message;
  }
  return error instanceof Error ? error.message : "Đã có lỗi xảy ra";
}

// ─── USER thunks ──────────────────────────────────────────────────────────────

export const fetchMyAdminMessages = createAsyncThunk(
  "chat/fetchMyAdminMessages",
  async (params: ListMessagesParams | undefined, { rejectWithValue }) => {
    try {
      return await chatService.getAdminMessages(params);
    } catch (error) {
      console.error("[chatSlice] fetchMyAdminMessages failed", error);
      return rejectWithValue(extractErrorMessage(error));
    }
  },
);

export const sendMyMessageToAdmin = createAsyncThunk(
  "chat/sendMyMessageToAdmin",
  async (content: string, { rejectWithValue }) => {
    try {
      return await chatService.sendMessageToAdmin(content);
    } catch (error) {
      console.error("[chatSlice] sendMyMessageToAdmin failed", error);
      return rejectWithValue(extractErrorMessage(error));
    }
  },
);

// ─── ADMIN thunks ─────────────────────────────────────────────────────────────

export const fetchAdminConversations = createAsyncThunk(
  "chat/fetchAdminConversations",
  async (_: void, { rejectWithValue }) => {
    try {
      return await chatService.adminGetAllConversations();
    } catch (error) {
      console.error("[chatSlice] fetchAdminConversations failed", error);
      return rejectWithValue(extractErrorMessage(error));
    }
  },
);

export const openUserConversation = createAsyncThunk(
  "chat/openUserConversation",
  async (targetUserId: string, { rejectWithValue }) => {
    try {
      const result = await chatService.adminGetUserMessages(targetUserId);
      return { targetUserId, ...result };
    } catch (error) {
      console.error("[chatSlice] openUserConversation failed", error);
      return rejectWithValue(extractErrorMessage(error));
    }
  },
);

export const sendAdminReply = createAsyncThunk(
  "chat/sendAdminReply",
  async (
    payload: { targetUserId: string; content: string },
    { rejectWithValue },
  ) => {
    try {
      const message = await chatService.adminReply(
        payload.targetUserId,
        payload.content,
      );
      return message;
    } catch (error) {
      console.error("[chatSlice] sendAdminReply failed", error);
      return rejectWithValue(extractErrorMessage(error));
    }
  },
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    clearChatError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ─── USER ──────────────────────────────────────────────────────────────
      .addCase(fetchMyAdminMessages.pending, (state) => {
        state.isLoadingMyMessages = true;
        state.error = null;
      })
      .addCase(fetchMyAdminMessages.fulfilled, (state, action) => {
        state.isLoadingMyMessages = false;
        // BE trả desc (mới nhất trước) đã reverse sẵn trong service -> giữ nguyên thứ tự tăng dần
        state.myMessages = action.payload.messages;
        state.myHasMore = action.payload.hasMore;
        state.myNextCursor = action.payload.nextCursor;
      })
      .addCase(fetchMyAdminMessages.rejected, (state, action) => {
        state.isLoadingMyMessages = false;
        state.error =
          (action.payload as string) ?? "Không thể kết nối tới hỗ trợ viên";
      })
      .addCase(sendMyMessageToAdmin.pending, (state) => {
        state.isSendingMyMessage = true;
      })
      .addCase(sendMyMessageToAdmin.fulfilled, (state, action) => {
        state.isSendingMyMessage = false;
        state.myMessages.push(action.payload);
      })
      .addCase(sendMyMessageToAdmin.rejected, (state, action) => {
        state.isSendingMyMessage = false;
        state.error = (action.payload as string) ?? "Gửi tin nhắn thất bại";
      })

      // ─── ADMIN ─────────────────────────────────────────────────────────────
      .addCase(fetchAdminConversations.pending, (state) => {
        state.isLoadingConversations = true;
      })
      .addCase(fetchAdminConversations.fulfilled, (state, action) => {
        state.isLoadingConversations = false;
        state.conversations = action.payload;
      })
      .addCase(fetchAdminConversations.rejected, (state, action) => {
        state.isLoadingConversations = false;
        state.error =
          (action.payload as string) ?? "Không tải được danh sách chat";
      })
      .addCase(openUserConversation.pending, (state) => {
        state.isLoadingAdminMessages = true;
      })
      .addCase(openUserConversation.fulfilled, (state, action) => {
        state.isLoadingAdminMessages = false;
        state.activeUserId = action.payload.targetUserId;
        state.adminMessages = action.payload.messages;
      })
      .addCase(openUserConversation.rejected, (state, action) => {
        state.isLoadingAdminMessages = false;
        state.error =
          (action.payload as string) ?? "Không tải được nội dung chat";
      })
      .addCase(sendAdminReply.pending, (state) => {
        state.isSendingReply = true;
      })
      .addCase(sendAdminReply.fulfilled, (state, action) => {
        state.isSendingReply = false;
        state.adminMessages.push(action.payload);
      })
      .addCase(sendAdminReply.rejected, (state, action) => {
        state.isSendingReply = false;
        state.error = (action.payload as string) ?? "Gửi trả lời thất bại";
      });
  },
});

export const { clearChatError } = chatSlice.actions;
export default chatSlice;
