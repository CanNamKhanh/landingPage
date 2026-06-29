import { HeroSection } from "@/components/hero-section";
import { GameCarousel } from "@/components/game-carousel";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, MessageCircleMore } from "lucide-react";
import AcceptPaymentMethods from "@/components/payment-method";
import CustomerReview from "@/components/CustomerReview";
import FAQ from "@/components/FAQ";
import WhyChoose from "@/components/WhyChoose";
import StartSection from "@/components/StartSection";

import ConversationWindow from "@/components/ConversationWindow";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Import AuthDialog và các middleware cần thiết từ file Header của bạn
import { AuthDialog } from "@/components/Header";
import { useAppDispatch, type RootState } from "@/stores/store";
import { useSelector } from "react-redux";
import {
  fetchLogin,
  fetchRegister,
  fetchMe,
} from "@/middlewares/authMiddleware";

function MainPage() {
  const dispatch = useAppDispatch();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.2 },
    );
    reveals.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const [visible, setVisible] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  // Quản lý state mở Dialog đăng nhập tại đây
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Các hàm xử lý Auth đồng bộ chuẩn chỉ
  const handleLogin = async (email: string, password: string) => {
    const result = await dispatch(fetchLogin({ email, password }));
    if (fetchLogin.fulfilled.match(result)) {
      dispatch(fetchMe());
      setAuthDialogOpen(false);
    }
  };

  const handleRegister = async (
    username: string,
    email: string,
    password: string,
  ) => {
    const result = await dispatch(fetchRegister({ username, email, password }));
    if (fetchRegister.fulfilled.match(result)) {
      await handleLogin(email, password);
    }
  };

  // Khi trong Chat bấm "Sign In", ta đóng chat và mở Dialog lên
  const handleTriggerAuth = () => {
    setIsChatOpen(false);
    setAuthDialogOpen(true);
  };

  return (
    <main className="bg-linear-to-b from-[#F2E5F7] to-[#FAF5FC] relative font-medium! overflow-hidden">
      <HeroSection />
      <StartSection />
      <GameCarousel />
      <WhyChoose />
      <CustomerReview />
      <AcceptPaymentMethods />
      <FAQ />

      <Popover open={isChatOpen} onOpenChange={setIsChatOpen}>
        <PopoverTrigger asChild>
          <Button
            className={`
              bg-[#B842F0] hover:bg-[#a12fd4] shadow-xl
              fixed right-8 bottom-8 z-50 rounded-full w-12 h-12
              transition-all duration-300 text-white cursor-pointer hover:scale-110
              ${visible ? "-translate-y-16" : "translate-y-0"} opacity-100 scale-100
            `}
          >
            <MessageCircleMore className="w-6 h-6" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          side="top"
          sideOffset={12}
          className="w-80 sm:w-85 p-0 border-0 bg-transparent shadow-none z-999999 translate-y-15"
        >
          {/* Truyền callback kích hoạt Auth sang cho ConversationWindow */}
          <ConversationWindow onAuthTrigger={handleTriggerAuth} />
        </PopoverContent>
      </Popover>

      <Button
        onClick={scrollToTop}
        className={`
          bg-[#B842F0] hover:bg-[#a12fd4] shadow-md
          fixed right-8 bottom-8 z-50 rounded-full w-12 h-12
          transition-all duration-300 text-white cursor-pointer hover:scale-110
          ${visible ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"}
        `}
      >
        <ArrowUp className="w-5 h-5" />
      </Button>

      {/* Đặt AuthDialog ở đây để nó không bị unmount khi Popover chat đóng */}
      <AuthDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        onLogin={handleLogin}
        onRegister={handleRegister}
        loading={loading}
        error={error}
      />
    </main>
  );
}

export default MainPage;
