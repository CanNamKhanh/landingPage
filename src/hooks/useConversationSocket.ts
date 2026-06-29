// src/hooks/useConversationSocket.ts
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/stores/store";
import { useAppDispatch } from "@/stores/store";

import {
  addMyMessage,
  addIncomingUserMessage,
  addAdminSentMessage,
  setAdminTyping,
  addTypingUser,
  removeTypingUser,
} from "@/Slices/conversationSlice";
import {
  disconnectConversationSocket,
  getConversationSocket,
} from "@/lib/conversationSocket";

export function useConversationSocket() {
  const dispatch = useAppDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const adminTypingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userTypingTimers = useRef<
    Record<string, ReturnType<typeof setTimeout>>
  >({});

  useEffect(() => {
    if (!user) return;

    // Đọc token bên trong effect — đảm bảo luôn lấy giá trị mới nhất
    const token =
      localStorage.getItem("accessToken") ?? localStorage.getItem("token");
    if (!token) {
      console.warn(
        "[Socket] user có nhưng không tìm thấy token trong localStorage",
      );
      return;
    }

    // console.log("[Socket] Đang kết nối với token của user:", user.id);
    const socket = getConversationSocket(token);

    socket.on("conversation:new_message", ({ message }) => {
      dispatch(addMyMessage(message));
    });

    socket.on("admin:new_user_message", ({ userId, username, message }) => {
      dispatch(addIncomingUserMessage({ userId, username, message }));
    });

    socket.on("admin:message_sent", ({ targetUserId, message }) => {
      dispatch(addAdminSentMessage({ targetUserId, message }));
    });

    socket.on("conversation:admin_typing", () => {
      dispatch(setAdminTyping(true));
      if (adminTypingTimer.current) clearTimeout(adminTypingTimer.current);
      adminTypingTimer.current = setTimeout(() => {
        dispatch(setAdminTyping(false));
      }, 3_000);
    });

    socket.on("admin:user_typing", ({ userId }) => {
      dispatch(addTypingUser(userId));
      if (userTypingTimers.current[userId]) {
        clearTimeout(userTypingTimers.current[userId]);
      }
      userTypingTimers.current[userId] = setTimeout(() => {
        dispatch(removeTypingUser(userId));
      }, 3_000);
    });

    return () => {
      socket.off("conversation:new_message");
      socket.off("admin:new_user_message");
      socket.off("admin:message_sent");
      socket.off("conversation:admin_typing");
      socket.off("admin:user_typing");
    };
  }, [user?.id, dispatch]); // bỏ token khỏi deps — đọc trực tiếp trong effect

  useEffect(() => {
    if (!user) {
      disconnectConversationSocket();
    }
  }, [user]);
}
