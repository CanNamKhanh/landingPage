"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function GameCarousel() {
  //   const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const games = [
    {
      id: 1,
      name: "Valorant",
      color: "from-red-600 to-orange-500",
      imgSrc: "/valorant.png",
    },
    {
      id: 2,
      name: "Arena Breakout: Infinite",
      color: "from-blue-600 to-cyan-500",
      imgSrc: "/arena-breakout.png",
    },
    {
      id: 3,
      name: "Teamfight Tactics",
      color: "from-purple-600 to-pink-500",
      imgSrc: "/tft.png",
    },
    {
      id: 4,
      name: "League of Legends",
      color: "from-yellow-600 to-orange-500",
      imgSrc: "/lol.png",
    },
    {
      id: 5,
      name: "Counter-Strike 2",
      color: "from-cyan-600 to-blue-500",
      imgSrc: "/counter-strike.png",
    },
    {
      id: 6,
      name: "Delta Force",
      color: "from-red-700 to-orange-600",
      imgSrc: "/delta-force.png",
    },
  ];

  const [selectedGame, setSelectedGame] = useState<null | (typeof games)[0]>(
    null,
  );
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
    <section className="ts-games reveal bg-background py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="text-white">SELECT YOUR </span>
            <span className="text-accent text-shadow-[0_0_20px_rgba(236,72,153,0.8)]">
              GAME
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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
            className="flex gap-7 px-5 overflow-x-scroll scrollbar-hide pt-10 pb-10"
            style={{ scrollBehavior: "smooth" }}
          >
            {games.map((game) => (
              <div
                key={game.id}
                onClick={() => {
                  setSelectedGame((prev) =>
                    prev?.id === game.id ? null : game,
                  );
                }}
                className={`shrink-0 w-64 h-80 rounded-2xl overflow-hidden relative cursor-pointer transition-all duration-300 ${selectedGame?.id === game.id ? "scale-110 shadow-[0_0_50px_#FF1A8Caa] ring-2 ring-pink-500/70" : "hover:scale-105 hover:shadow-[0_0_40px_#FF1A8C66]"}`}
              >
                {/* Card */}
                <div className="relative w-full h-full overflow-hidden">
                  {selectedGame?.id === game.id && (
                    <div className="absolute top-3 right-3 z-20">
                      <div className="w-7 h-7 rounded-full bg-pink-500 flex items-center justify-center shadow-[0_0_15px_#FF1A8C]">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                    </div>
                  )}

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
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          {canScrollLeft && (
            <Button
              size="icon"
              className="absolute cursor-pointer left-0 top-1/2 -translate-y-1/2 -translate-x-6 bg-accent hover:bg-pink-500 text-primary-foreground rounded-full shadow-lg"
              onClick={() => scroll("left")}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
          )}
          {canScrollRight && (
            <Button
              size="icon"
              className="absolute cursor-pointer right-0 top-1/2 -translate-y-1/2 translate-x-6 bg-accent hover:bg-pink-500 text-primary-foreground rounded-full shadow-lg"
              onClick={() => scroll("right")}
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          )}
        </div>
        {selectedGame && (
          <div className="mt-14 text-center animate-fade-in">
            <p className="text-lg text-muted-foreground mb-5">
              Selected:{" "}
              <span className="text-accent font-semibold">
                {selectedGame.name}
              </span>
            </p>

            <Button
              onClick={() => {
                document.querySelector(".ts-book-form")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
              size="lg"
              className="bg-accent cursor-pointer text-white font-bold px-10 py-7 rounded-xl shadow-[0_0_30px_8px_rgba(236,72,153,0.3)] hover:shadow-[0_0_30px_8px_rgba(236,72,153,0.7)] transition-all"
            >
              CONTINUE TO BOOKING
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
