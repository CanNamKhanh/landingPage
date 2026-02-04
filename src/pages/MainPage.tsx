import { HeroSection } from "@/components/hero-section";
import { GameCarousel } from "@/components/game-carousel";
import { BookingForm } from "@/components/booking-form";
import { StatsSection } from "@/components/starts-section";
import { useEffect } from "react";

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

  return (
    <main className="bg-background">
      <HeroSection />
      <StatsSection />
      <GameCarousel />
      <BookingForm />
    </main>
  );
}

export default MainPage;
