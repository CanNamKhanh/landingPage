import { useEffect, useState } from "react";
import { Send, Smile, Paperclip, Lock, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { useAppDispatch, type RootState } from "@/stores/store";
import { fetchMyAdminMessages, sendMyMessageToAdmin } from "@/Slices/chatSlice";

interface ConversationWindowProps {
  onAuthTrigger?: () => void;
}

const gradientStyle = {
  background: "linear-gradient(90deg, #e05cd5 0%, #f0608a 50%, #f8855a 100%)",
  boxShadow: "0 4px 20px rgba(224,92,213,0.3)",
};

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ConversationWindow({
  onAuthTrigger,
}: ConversationWindowProps) {
  const dispatch = useAppDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { myMessages, isLoadingMyMessages, isSendingMyMessage } = useSelector(
    (state: RootState) => state.chat,
  );

  const [inputValue, setInputValue] = useState("");
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);

  // BE tự getOrCreate conversation ADMIN ngay trong GET /conversations/admin/messages
  // -> chỉ cần gọi 1 lần khi mở box chat, không cần bước "tạo conversation" riêng
  useEffect(() => {
    if (user && !hasFetchedOnce) {
      console.log("[ConversationWindow] load admin messages cho user", user.id);
      dispatch(fetchMyAdminMessages());
      setHasFetchedOnce(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    console.log("[ConversationWindow] send message to admin", inputValue);
    dispatch(sendMyMessageToAdmin(inputValue));
    setInputValue("");
  };

  return (
    <div className="w-full h-130 rounded-2xl overflow-hidden bg-white shadow-2xl flex flex-col font-sans text-black border border-gray-100">
      {user ? (
        <>
          {/* Header */}
          <div
            className="p-4 text-white flex items-center gap-3 relative"
            style={{
              background:
                "linear-gradient(90deg, #e05cd5 0%, #f0608a 50%, #f8855a 100%)",
            }}
          >
            <div className="relative">
              <img
                src="/favicon.png"
                alt="Rosie logo"
                className="w-10 h-10 rounded-xl border border-white/20 bg-white p-1 object-contain"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide flex items-center gap-1">
                Rosie <span>Boost</span>
              </h3>
              <p className="text-xs text-white/80 font-normal">
                We typically reply in minutes
              </p>
            </div>
          </div>

          {isLoadingMyMessages ? (
            <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/60 text-gray-400 gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-[#B842F0]" />
              <span className="text-xs font-normal text-gray-500">
                Connecting to supporter...
              </span>
            </div>
          ) : (
            <>
              {/* Messages Body */}
              <div className="flex-1 p-4 overflow-y-auto bg-slate-50/60 space-y-3.5 flex flex-col">
                {myMessages.length === 0 ? (
                  <div className="flex flex-col max-w-[80%] self-start items-start">
                    <div className="px-4 py-2.5 text-sm shadow-xs bg-white text-gray-800 rounded-2xl rounded-tl-none border border-gray-100">
                      👋 Hi there! Welcome to RosieBoost. How can i help you?
                    </div>
                  </div>
                ) : (
                  myMessages.map((msg) => {
                    // senderType ADMIN hiển thị bên trái (như bot/support), USER bên phải
                    const isUserMessage = msg.senderType === "USER";
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col max-w-[80%] ${
                          isUserMessage
                            ? "self-end items-end"
                            : "self-start items-start"
                        }`}
                      >
                        <div
                          className={`px-4 py-2.5 text-sm shadow-xs ${
                            isUserMessage
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

              {/* Input Footer */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 border-t border-gray-100 bg-white flex items-center gap-2"
              >
                <div className="flex gap-1 text-gray-400">
                  <button
                    type="button"
                    className="p-1.5 hover:text-gray-600 cursor-pointer rounded-lg hover:bg-gray-50"
                  >
                    <Paperclip size={18} />
                  </button>
                  <button
                    type="button"
                    className="p-1.5 hover:text-gray-600 cursor-pointer rounded-lg hover:bg-gray-50"
                  >
                    <Smile size={18} />
                  </button>
                </div>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Write a message..."
                  className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:bg-gray-50 focus:ring-1 focus:ring-[#B842F0]/50 transition-all"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isSendingMyMessage}
                  className={`p-2 rounded-full transition-all ${inputValue.trim() ? "bg-[#B842F0] text-white cursor-pointer hover:scale-105" : "text-gray-300 bg-gray-50 cursor-not-allowed"}`}
                >
                  <Send size={16} />
                </button>
              </form>
            </>
          )}
        </>
      ) : (
        <>
          {/* UI CHƯA LOGIN (Giữ nguyên font sans mượt mà) */}
          <div
            className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-linear-to-b from-white to-[#FAF5FC] font-sans"
            style={{ fontFamily: "sans-serif" }}
          >
            <div className="w-16 h-16 rounded-full bg-[#F7EAF9] flex items-center justify-center text-[#B842F0] mb-4">
              <Lock size={28} />
            </div>

            <h3 className="text-2xl font-extrabold tracking-tight text-black mb-2">
              Join the conversation
            </h3>

            <p className="text-xs text-black/50 max-w-60 mb-6 leading-relaxed font-normal">
              Please sign in to start a direct live chat with our professional
              boosting supporters.
            </p>

            <button
              onClick={onAuthTrigger}
              className="text-white font-bold px-8 py-3 rounded-full transition-all duration-300 shadow-lg hover:scale-102 cursor-pointer active:scale-98 text-sm tracking-wide"
              style={gradientStyle}
            >
              Sign In
            </button>

            <span className="text-xs text-black/50 mt-4 font-normal">
              Don't have an account?{" "}
              <span
                className="text-[#B842F0] font-semibold cursor-pointer hover:underline"
                onClick={onAuthTrigger}
              >
                Create one
              </span>
            </span>
          </div>
        </>
      )}
    </div>
  );
}
