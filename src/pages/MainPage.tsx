import { HeroSection } from "@/components/hero-section";
import { GameCarousel } from "@/components/game-carousel";
import { BookingForm } from "@/components/booking-form";
import { StatsSection } from "@/components/starts-section";

function MainPage() {
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
