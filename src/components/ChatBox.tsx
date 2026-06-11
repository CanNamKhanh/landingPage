import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MessageSquareMore } from "lucide-react";
import { useLocation } from "react-router-dom";

function ChatBox() {
  const location = useLocation();
  const hiddenChatBoxWhenInMsgPage =
    location.pathname === "/message" ? "hidden" : "";

  return (
    <>
      <Dialog modal={false}>
        <DialogTrigger
          asChild
          className={`w-55 h-12 ${hiddenChatBoxWhenInMsgPage}`}
        >
          <button className="fixed bottom-0 right-10 z-50 bg-[#120A21] border-[#B842F0] border border-b-0 flex items-center gap-3 shadow-[0_0_40px_rgba(0,0,0,0.20)] rounded-t-lg px-4 py-3 cursor-pointer justify-between">
            <div className="flex gap-3 items-center">
              <span className="font-medium text-white flex items-center gap-3">
                <MessageSquareMore />
                <span>Online</span>
              </span>
            </div>
          </button>
        </DialogTrigger>
        <DialogContent
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          className="fixed z-50 bottom-0 w-95 translate-x-90 translate-y-0 max-w-none left-1/2 rounded-2xl shadow-2xl transform duration-0 px-0"
        >
          <DialogHeader className="">
            <DialogTitle className="text-[16px] font-medium border-b-2 pb-5 pl-5 flex justify-between">
              Customer Support
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-5 ml-5 -mt-40"></div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ChatBox;
