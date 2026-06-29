// src/components/AdminChatTab.tsx
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch, type RootState } from "@/stores/store";
import {
  fetchAdminConversations,
  openUserConversation,
  sendAdminReply,
  addAdminSentMessage,
} from "@/Slices/conversationSlice";
import { Loader2, Send } from "lucide-react";
import { getCurrentSocket } from "@/lib/conversationSocket";

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Typing debounce
const TYPING_THROTTLE = 2_000;

export default function AdminChatTab() {
  const dispatch = useAppDispatch();
  const {
    conversations,
    activeUserId,
    adminMessages,
    isLoadingConversations,
    isLoadingAdminMessages,
    isSendingReply,
    typingUserIds,
  } = useSelector((state: RootState) => state.conversation);

  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastTypingSentRef = useRef<number>(0);

  // ── Load danh sách conversations khi mount ────────────────────────────────
  useEffect(() => {
    dispatch(fetchAdminConversations());
  }, [dispatch]);

  // ── Auto scroll xuống cuối ────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [adminMessages]);

  // ── Notify server admin đang xem conversation nào ─────────────────────────
  useEffect(() => {
    if (!activeUserId) return;
    const socket = getCurrentSocket();
    socket?.emit("admin:open_conversation", { targetUserId: activeUserId });
  }, [activeUserId]);

  // ── Chọn conversation ─────────────────────────────────────────────────────
  const handleSelectConversation = (targetUserId?: string | null) => {
    if (!targetUserId) return;
    dispatch(openUserConversation(targetUserId));
  };

  // ── Gửi tin nhắn ─────────────────────────────────────────────────────────
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = input.trim();
    if (!content || !activeUserId || sending) return;

    const socket = getCurrentSocket();

    if (socket?.connected) {
      setSending(true);
      setInput("");
      socket.emit(
        "admin:send_to_user",
        { targetUserId: activeUserId, content },
        (res) => {
          setSending(false);
          if (res.ok && res.data) {
            // Server sẽ emit "admin:message_sent" về → hook xử lý
            // Thêm ngay qua ack để UI không delay
            dispatch(
              addAdminSentMessage({
                targetUserId: activeUserId,
                message: res.data,
              }),
            );
          }
        },
      );
    } else {
      // Fallback: REST
      setSending(true);
      setInput("");
      try {
        await dispatch(sendAdminReply({ targetUserId: activeUserId, content }));
      } finally {
        setSending(false);
      }
    }
  };

  // ── Typing indicator ──────────────────────────────────────────────────────
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (!activeUserId) return;

    const now = Date.now();
    if (now - lastTypingSentRef.current > TYPING_THROTTLE) {
      lastTypingSentRef.current = now;
      getCurrentSocket()?.emit("admin:typing", {
        targetUserId: activeUserId,
      });
    }
  };

  const isBusy = sending || isSendingReply;
  const isActiveUserTyping = activeUserId
    ? typingUserIds.includes(activeUserId)
    : false;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex h-150">
      {/* ── Sidebar: danh sách conversations ──────────────────────────────── */}
      <div className="w-72 border-r border-gray-100 flex flex-col">
        <div className="p-4 border-b border-gray-100 font-bold text-gray-800 text-sm shrink-0">
          Chat with Customers
        </div>

        <div className="overflow-y-auto flex-1">
          {isLoadingConversations && conversations.length === 0 ? (
            <div className="flex items-center justify-center py-10 text-gray-400">
              <Loader2 className="animate-spin" size={18} />
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-xs">
              No conversations yet
            </div>
          ) : (
            conversations.map((c) => {
              const lastMessage = c.messages[0];
              const isActive = c.userId === activeUserId;
              const isTyping = c.userId
                ? typingUserIds.includes(c.userId)
                : false;

              return (
                <button
                  key={c.id}
                  onClick={() => handleSelectConversation(c.userId)}
                  className={`w-full cursor-pointer text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition ${
                    isActive ? "bg-[#FAF5FC]" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-800 truncate">
                      {c.user?.username ?? c.userId ?? "(Unknown)"}
                    </span>
                    {isTyping && (
                      <span className="flex gap-0.5 items-center ml-2 shrink-0">
                        <span className="w-1 h-1 rounded-full bg-[#B842F0] animate-bounce [animation-delay:0ms]" />
                        <span className="w-1 h-1 rounded-full bg-[#B842F0] animate-bounce [animation-delay:150ms]" />
                        <span className="w-1 h-1 rounded-full bg-[#B842F0] animate-bounce [animation-delay:300ms]" />
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 truncate mt-0.5">
                    {lastMessage?.content ?? "No messages yet"}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ── Panel: messages ───────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {!activeUserId ? (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
            Select a conversation to view messages
          </div>
        ) : (
          <>
            {/* Header của conversation đang active */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2 shrink-0">
              <div className="w-7 h-7 rounded-full bg-[#F3E8FF] flex items-center justify-center text-[#B842F0] font-bold text-xs uppercase">
                {conversations.find((c) => c.userId === activeUserId)?.user
                  ?.username?.[0] ?? "?"}
              </div>
              <span className="text-sm font-semibold text-gray-800">
                {conversations.find((c) => c.userId === activeUserId)?.user
                  ?.username ?? activeUserId}
              </span>
              {isActiveUserTyping && (
                <span className="text-xs text-[#B842F0] italic">typing…</span>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-slate-50/60 space-y-3.5 flex flex-col">
              {isLoadingAdminMessages ? (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                  <Loader2 className="animate-spin" size={18} />
                </div>
              ) : adminMessages.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-gray-400 text-xs">
                  No messages yet
                </div>
              ) : (
                adminMessages.map((msg) => {
                  const isMine = msg.senderType === "ADMIN";
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col max-w-[70%] ${
                        isMine ? "self-end items-end" : "self-start items-start"
                      }`}
                    >
                      <div
                        className={`px-4 py-2.5 text-sm shadow-xs ${
                          isMine
                            ? "bg-[#B842F0] text-white rounded-2xl rounded-tr-none"
                            : "bg-white text-gray-800 rounded-2xl rounded-tl-none border border-gray-100"
                        }`}
                      >
                        {msg.content}
                      </div>
                      <span className="text-[10px] text-gray-400 mt-1 px-1">
                        {formatTime(msg.createdAt)}
                      </span>
                    </div>
                  );
                })
              )}

              {/* User typing indicator */}
              {isActiveUserTyping && (
                <div className="flex flex-col max-w-[70%] self-start items-start">
                  <div className="px-4 py-3 bg-white rounded-2xl rounded-tl-none border border-gray-100 shadow-xs">
                    <span className="flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSend}
              className="p-3 border-t border-gray-100 bg-white flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="Reply to customer..."
                className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:bg-gray-50 focus:ring-1 focus:ring-[#B842F0]/50 transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || isBusy}
                className={`p-2 rounded-full transition-all ${
                  input.trim() && !isBusy
                    ? "bg-[#B842F0] text-white cursor-pointer hover:scale-105"
                    : "text-gray-300 bg-gray-50 cursor-not-allowed"
                }`}
              >
                {isBusy ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
