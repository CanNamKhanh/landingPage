import { HeroSection } from "@/components/hero-section";
import { GameCarousel } from "@/components/game-carousel";
// import { BookingForm } from "@/components/booking-form";
// import { StatsSection } from "@/components/starts-section";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import AcceptPaymentMethods from "@/components/payment-method";
import CustomerReview from "@/components/CustomerReview";

function MainPage() {
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
      {
        threshold: 0.2,
      },
    );

    reveals.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <main className="bg-[#F2E5F7] relative">
      <HeroSection />
      {/* <StatsSection /> */}
      <GameCarousel />
      {/* <BookingForm /> */}
      <CustomerReview />
      <AcceptPaymentMethods />

      <Button
        onClick={scrollToTop}
        className={`
          bg-[#B842F0] hover:bg-[#B842F0]
        fixed right-8 bottom-8 z-50 rounded-full w-12 h-12
        transition-all duration-300 text-white cursor-pointer hover:scale-110
        ${visible ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"}
      `}
      >
        <ArrowUp />
      </Button>
    </main>
  );
}

export default MainPage;
