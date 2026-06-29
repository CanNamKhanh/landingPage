import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch, type RootState } from "@/stores/store";
import {
  fetchAdminConversations,
  openUserConversation,
  sendAdminReply,
} from "@/Slices/chatSlice";
import { Loader2, Send } from "lucide-react";

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminChatTab() {
  const dispatch = useAppDispatch();
  const {
    conversations,
    activeUserId,
    adminMessages,
    isLoadingConversations,
    isLoadingAdminMessages,
    isSendingReply,
  } = useSelector((state: RootState) => state.chat);

  const [input, setInput] = useState("");

  useEffect(() => {
    dispatch(fetchAdminConversations());
  }, [dispatch]);

  const handleSelectConversation = (targetUserId?: string) => {
    if (!targetUserId) {
      // console.warn(
      //   "[AdminChatTab] conversation thiếu userId - BE cần bổ sung select userId/user ở adminGetAllConversationsService",
      // );
      return;
    }
    // console.log("[AdminChatTab] open user conversation", targetUserId);
    dispatch(openUserConversation(targetUserId));
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeUserId) return;
    dispatch(sendAdminReply({ targetUserId: activeUserId, content: input }));
    setInput("");
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex h-150">
      {/* List conversation */}
      <div className="w-72 border-r border-gray-100 overflow-y-auto">
        <div className="p-4 border-b border-gray-100 font-bold text-gray-800 text-sm">
          Chat with Customer
        </div>
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
            return (
              <button
                key={c.id}
                onClick={() => handleSelectConversation(c.userId)}
                className={`w-full cursor-pointer text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition ${
                  isActive ? "bg-[#FAF5FC]" : ""
                }`}
              >
                <div className="text-sm font-semibold text-gray-800">
                  {c.user?.username ?? c.userId ?? "(Missing userId)"}
                </div>
                <div className="text-xs text-gray-400 truncate">
                  {lastMessage?.content ?? "No messages yet"}
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Message panel */}
      <div className="flex-1 flex flex-col">
        {!activeUserId ? (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
            Select a conversation to view messages
          </div>
        ) : (
          <>
            <div className="flex-1 p-4 overflow-y-auto bg-slate-50/60 space-y-3.5 flex flex-col">
              {isLoadingAdminMessages ? (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                  <Loader2 className="animate-spin" size={18} />
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
            </div>

            <form
              onSubmit={handleSend}
              className="p-3 border-t border-gray-100 bg-white flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Reply to customer..."
                className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:bg-gray-50 focus:ring-1 focus:ring-[#B842F0]/50 transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || isSendingReply}
                className={`p-2 rounded-full transition-all ${
                  input.trim()
                    ? "bg-[#B842F0] text-white cursor-pointer hover:scale-105"
                    : "text-gray-300 bg-gray-50 cursor-not-allowed"
                }`}
              >
                <Send size={16} />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
