"use client";

import { Button } from "@/components/ui/button";
import { Mouse } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative reveal min-h-screen flex flex-col items-center justify-center px-4 pb-20 pt-25 bg-[#0b0614] overflow-hidden">
      <div className="absolute inset-0 w-full rounded-2xl overflow-hidden bg-[url('/bg.jpg')] bg-contain bg-center mt-20">
        {/* Layer 1: làm ảnh chìm xuống */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Layer 2: vignette mạnh 4 cạnh */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_35%,rgba(0,0,0,0.9)_100%)]" />

        {/* Layer 3: gradient chéo giống ảnh */}
        <div className="absolute inset-0 bg-linear-to-br from-black/90 via-black/30 to-black/90" />

        {/* Layer 4: nối liền background với section bên dưới */}
        <div className="absolute bottom-0 left-0 w-full h-40 bg-[linear-gradient(to_bottom,transparent,#110a20)]" />
      </div>

      <div className="relative z-10 text-center">
        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-text-pretty leading-tight animate-slide-down delay-100 select-none">
          <span className="text-white">YOUR </span>
          <span className="text-[#00FF00] text-shadow-[0_0_20px_rgba(34,197,94,0.5)]">
            LIGHT
          </span>
          <br />
          <span className="text-white">AT THE END OF THE TUNNEL</span>
        </h1>

        {/* Description */}
        <p className="text-lg select-none font-semibold md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto flex flex-col animate-slide-down delay-200">
          <span>
            Professional game boosting service. We carry your rank while you
            relax.
          </span>
          <span className="text-[#00FF00] font-semibold">
            Fast, safe, and reliable.
          </span>
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col select-none sm:flex-row gap-4 justify-center mb-16 animate-slide-down delay-300">
          <Button
            onClick={() => {
              document.querySelector(".ts-games")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
            size="lg"
            className="bg-[#00FF00] cursor-pointer text-black hover:bg-[#00FF00] font-semibold px-8 py-7 text-lg rounded-xl shadow-lg shadow-[#00FF00]/50 transition-all hover:shadow-[0_0_30px_8px_rgba(236,72,153,0.7)]"
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
            className="border-2 select-none cursor-pointer text-white hover:bg-accent/10 font-semibold px-8 py-7 text-lg rounded-xl bg-transparent hover:border-[#00FF00]"
          >
            ORDER
          </Button>
        </div>
        <div className="border rounded-xl border-[#00FF00] select-none text-gray-400 w-fit bg-[#260925] mx-auto -mt-10 text-[14px] px-5 py-3">
          🔥 <span className="text-[#00FF00]">30% OFF</span> Grand Opening —
          Limited Time Only
        </div>
      </div>
      <Mouse
        strokeWidth={0.75}
        className="scale-200 text-[#00FF00] animate-bounce mt-10 -mb-15"
      />
    </section>
  );
}
