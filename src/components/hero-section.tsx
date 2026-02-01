"use client";

import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pb-20 pt-25 bg-[#0b0614]">
      {/* Center glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,26,140,0.25)_0%,rgba(88,28,135,0.25)_35%,rgba(11,6,20,1)_70%)]" />

      {/* Side glows */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,26,140,0.15),transparent_40%),radial-gradient(circle_at_80%_50%,rgba(168,85,247,0.15),transparent_40%)]" />

      {/* Glow background effect */}
      <div className="absolute inset-0 bg-linear-to-b from-pink-950/20 via-background to-background opacity-60" />

      <div className="relative z-10 text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="animate-float w-55 drop-shadow-[0_0_20px_#FF1A8Caa] h-55 bg-linear-to-br from-pink-500 via-pink-600 to-purple-600 rounded-lg flex items-center justify-center shadow-2xl shadow-pink-500/50">
            <img src="/logo-DGwPK51i.png" alt="" />
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-text-pretty leading-tight">
          <span className="text-white">YOUR </span>
          <span className="text-accent text-shadow-[0_0_20px_rgba(236,72,153,0.8)]">
            LIGHT
          </span>
          <br />
          <span className="text-white">AT THE END OF THE TUNNEL</span>
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto flex flex-col">
          <span>
            Professional game boosting service. We carry your rank while you
            relax.
          </span>
          <span className="text-accent font-semibold">
            Fast, safe, and reliable.
          </span>
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button
            onClick={() => {
              document.querySelector(".ts-games")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
            size="lg"
            className="bg-accent cursor-pointer text-white hover:bg-pink-500 font-semibold px-8 py-7 text-lg rounded-xl shadow-lg shadow-pink-500/50 transition-all hover:shadow-[0_0_30px_8px_rgba(236,72,153,0.7)]"
          >
            VIEW GAMES
          </Button>
          <Button
            onClick={() => {
              document.querySelector(".ts-book-form")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
            variant="outline"
            size="lg"
            className="border-2 cursor-pointer text-white hover:bg-accent/10 font-semibold px-8 py-7 text-lg rounded-xl bg-transparent"
          >
            BOOK NOW
          </Button>
        </div>
      </div>
    </section>
  );
}
