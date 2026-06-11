"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { games } from "@/services/gameService";
import { NavLink } from "react-router-dom";

export function GameCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <section className="ts-games reveal py-20 px-4 select-none bg-[#F2E5F7] relative">
      <div
        className="absolute top-0 left-0 w-full h-32 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, #F2E5F7 0%, #f5ecfa 20%, transparent 100%)",
        }}
      />
      <div className="max-w-296 mx-auto">
        {/* Section Header */}
        <div className="text-center">
          <h2 className="text-5xl md:text-4xl font-bold mb-4">
            <span className="text-black">SELECT YOUR </span>
            <span className="text-[#B642F0] text-shadow-[0_0_40px_rgba(182,66,240,0.8)]">
              GAME
            </span>
          </h2>
          <p className="text-[16px] max-w-2xl text-black/50 mx-auto">
            Choose your game and let our professional boosters carry you to
            glory
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Scroll Container */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="flex gap-7 px-10 overflow-x-scroll scrollbar-hide py-15"
            style={{ scrollBehavior: "smooth" }}
          >
            {games.map((game) => (
              <NavLink
                to={game.href}
                key={game.id}
                className={`shrink-0 w-64 h-80 rounded-2xl overflow-hidden relative cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(240,96,138,0.9)]`}
              >
                {/* Card */}
                <div className="relative w-full h-full overflow-hidden">
                  {/* Image */}
                  <img
                    src={game.imgSrc}
                    alt={game.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 group-hover:opacity-70" />

                  {/* Game Name */}
                  <div className="absolute inset-0 flex items-end justify-center pb-6 z-10">
                    <h3 className="text-white text-lg font-bold transition-colors duration-300 group-hover:text-[#FF1A8C] drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                      {game.name}
                    </h3>
                  </div>
                </div>
              </NavLink>
            ))}
          </div>

          {/* Navigation Buttons */}
          {canScrollLeft && (
            <Button
              size="icon"
              className="absolute hover:scale-105 h-12 w-12 cursor-pointer left-0 top-1/2 -translate-y-1/2 -translate-x-6 bg-[white] hover:bg-[white] text-primary-foreground rounded-full shadow-lg"
              onClick={() => scroll("left")}
            >
              <ChevronLeft />
            </Button>
          )}
          {canScrollRight && (
            <Button
              size="icon"
              className="absolute hover:scale-105 h-12 w-12 cursor-pointer right-0 top-1/2 -translate-y-1/2 translate-x-6 bg-[white] hover:bg-[white] text-primary-foreground rounded-full shadow-lg"
              onClick={() => scroll("right")}
            >
              <ChevronRight />
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
