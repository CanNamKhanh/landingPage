"use client";

import { useEffect, useRef, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { games } from "@/services/gameService";
import { useNavigate } from "react-router-dom";

export function HeroSection() {
  const [openSearch, setOpenSearch] = useState(false);
  const commandRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const header = document.querySelector("header") as HTMLElement;
    if (header) {
      document.documentElement.style.setProperty(
        "--header-height",
        `${header.offsetHeight}px`,
      );
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        commandRef.current &&
        !commandRef.current.contains(event.target as Node)
      ) {
        setOpenSearch(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <section
      className="relative w-full overflow-visible pb-20 pt-60 sm:pt-55 md:pt-44 lg:pt-40"
      style={{
        background:
          "linear-gradient(135deg, #f9eefb 0%, #f4e8f9 30%, #eedff6 60%, #f5ecfa 100%)",
      }}
    >
      {/* bg.jpg - dùng cover để không bị méo/lặp ở mọi tỉ lệ màn hình */}
      <div
        className="
    absolute inset-0 pointer-events-none
    bg-no-repeat
    bg-size-cover
    bg-position-[center_top] sm:bg-position-[center_top]
    md:bg-position-center lg:bg-position-center
  "
        style={{
          backgroundImage: "url('/bg.jpg')",
        }}
      />

      {/* Overlay làm mờ 2 góc dưới, blend ảnh vào nền section */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
      radial-gradient(circle at 0% 100%, rgba(245,236,250,0.9) 0%, rgba(245,236,250,0.45) 22%, transparent 48%),
      radial-gradient(circle at 100% 100%, rgba(245,236,250,0.9) 0%, rgba(245,236,250,0.45) 22%, transparent 48%)
    `,
        }}
      />

      {/* Fade overlay ngang (giữ nguyên) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, #f4e8f9 28%, rgba(244,232,249,0.6) 50%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex items-center min-h-130 px-12 md:px-18 lg:px-22">
        <div className="w-full max-w-160">
          {/* Headline */}
          <h1 className="leading-[1.05] tracking-tight mb-5 select-none -mt-10 font-extrabold text-[50px]">
            <span className="block text-[#12082a]">ESCAPE STUCK.</span>
            <span
              className="block bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #a21caf 0%, #db2777 35%, #f43f5e 65%, #fb923c 100%)",
              }}
            >
              BREAK YOUR LIMITS.
            </span>
          </h1>

          {/* Description */}
          <p className="mb-10 mt-8 leading-relaxed text-[0.95rem] text-[#5a4a6a] max-w-140">
            RosieBoost — the most trusted, safe and effective game boosting
            service. We carry your account so you can enjoy the rank you
            deserve.
          </p>

          {/* Feature cards — 3 in ONE row */}
          <div className="flex gap-3 mb-10 flex-wrap max-w-200">
            {/* Total Privacy */}
            <div
              className="flex items-center gap-2.5 rounded-2xl px-3.5 py-3 w-50 min-w-0"
              style={{
                background: "rgba(255,255,255,0.88)",
                boxShadow: "0 2px 10px rgba(180,80,180,0.08)",
              }}
            >
              <span
                className="shrink-0 rounded-xl flex items-center justify-center w-8.5 h-8.5"
                style={{
                  background:
                    "linear-gradient(135deg, #d42d82 0%, #f55a6a 100%)",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </span>
              <div className="min-w-0">
                <div className="font-bold leading-tight text-[11.5px] text-[#12082a]">
                  TOTAL PRIVACY
                </div>
                <div className="text-[11px] text-[#8a7a9a]">
                  Your info stays safe
                </div>
              </div>
            </div>

            {/* Trusted Boosters */}
            <div
              className="flex items-center gap-2.5 rounded-2xl px-3.5 py-3 w-50 min-w-0"
              style={{
                background: "rgba(255,255,255,0.88)",
                boxShadow: "0 2px 10px rgba(180,80,180,0.08)",
              }}
            >
              <span
                className="shrink-0 rounded-xl flex items-center justify-center w-8.5 h-8.5"
                style={{
                  background:
                    "linear-gradient(135deg, #d42d82 0%, #f55a6a 100%)",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                  <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                  <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                  <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                </svg>
              </span>
              <div className="min-w-0">
                <div className="font-bold leading-tight text-[11.5px] text-[#12082a]">
                  TRUSTED BOOSTERS
                </div>
                <div className="text-[11px] text-[#8a7a9a]">
                  1000+ happy clients
                </div>
              </div>
            </div>

            {/* Fast Delivery */}
            <div
              className="flex items-center gap-2.5 rounded-2xl px-3.5 py-3 w-50 min-w-0"
              style={{
                background: "rgba(255,255,255,0.88)",
                boxShadow: "0 2px 10px rgba(180,80,180,0.08)",
              }}
            >
              <span
                className="shrink-0 rounded-xl flex items-center justify-center w-8.5 h-8.5"
                style={{
                  background:
                    "linear-gradient(135deg, #d42d82 0%, #f55a6a 100%)",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </span>
              <div className="min-w-0">
                <div className="font-bold leading-tight text-[11.5px] text-[#12082a]">
                  FAST DELIVERY
                </div>
                <div className="text-[11px] text-[#8a7a9a]">
                  Right rank, guaranteed
                </div>
              </div>
            </div>

            {/* Vpn Protection */}
            <div
              className="flex items-center gap-2.5 rounded-2xl px-3.5 py-3 w-50 min-w-0"
              style={{
                background: "rgba(255,255,255,0.88)",
                boxShadow: "0 2px 10px rgba(180,80,180,0.08)",
              }}
            >
              <span
                className="shrink-0 rounded-xl flex items-center justify-center w-8.5 h-8.5"
                style={{
                  background:
                    "linear-gradient(135deg, #d42d82 0%, #f55a6a 100%)",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="5" y="10" width="14" height="11" rx="2" />
                  <path d="M8 10V7C8 4.2 9.8 2 12 2C14.2 2 16 4.2 16 7V10" />
                </svg>
              </span>
              <div className="min-w-0">
                <div className="font-bold leading-tight text-[11.5px] text-[#12082a]">
                  VPN Protection
                </div>
                <div className="text-[11px] text-[#8a7a9a]">
                  Available upon request
                </div>
              </div>
            </div>

            {/* 1000+ Order */}
            <div
              className="flex items-center gap-2.5 rounded-2xl px-3.5 py-3 w-50 min-w-0"
              style={{
                background: "rgba(255,255,255,0.88)",
                boxShadow: "0 2px 10px rgba(180,80,180,0.08)",
              }}
            >
              <span
                className="shrink-0 rounded-xl flex items-center justify-center w-8.5 h-8.5"
                style={{
                  background:
                    "linear-gradient(135deg, #d42d82 0%, #f55a6a 100%)",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8 4H16V10C16 12.8 14.2 15 12 15C9.8 15 8 12.8 8 10V4Z" />
                  <path d="M8 6H5C5 9.3 6.2 11 9 11" />
                  <path d="M16 6H19C19 9.3 17.8 11 15 11" />
                  <path d="M12 15V19" />
                  <path d="M9 22H15" />
                </svg>
              </span>
              <div className="min-w-0">
                <div className="font-bold leading-tight text-[11.5px] text-[#12082a]">
                  1000+ ORDERS
                </div>
                <div className="text-[11px] text-[#8a7a9a]">
                  Completed worldwide
                </div>
              </div>
            </div>

            {/* 24/7 Discord */}
            <div
              className="flex items-center gap-2.5 rounded-2xl px-3.5 py-3 w-50 min-w-0"
              style={{
                background: "rgba(255,255,255,0.88)",
                boxShadow: "0 2px 10px rgba(180,80,180,0.08)",
              }}
            >
              <span
                className="shrink-0 rounded-xl flex items-center justify-center w-8.5 h-8.5"
                style={{
                  background:
                    "linear-gradient(135deg, #d42d82 0%, #f55a6a 100%)",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 14V12C4 7.6 7.6 4 12 4C16.4 4 20 7.6 20 12V14" />
                  <path d="M6 14H5C3.9 14 3 14.9 3 16V18C3 19.1 3.9 20 5 20H6V14Z" />
                  <path d="M18 14H19C20.1 14 21 14.9 21 16V18C21 19.1 20.1 20 19 20H18V14Z" />
                </svg>
              </span>
              <div className="min-w-0">
                <div className="font-bold leading-tight text-[11.5px] text-[#12082a]">
                  24/7 DISCORD
                </div>
                <div className="text-[11px] text-[#8a7a9a]">
                  Always here to help
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-start md:items-center gap-3 mb-5 flex-col md:flex-row">
            {/* VIEW SERVICES */}
            <button
              onClick={() => {
                document
                  .querySelector(".ts-games")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="select-none cursor-pointer transition-all duration-200 font-bold text-[13.5px] tracking-[0.05em] text-white rounded-full px-6 py-3.5 border-none"
              style={{
                background:
                  "linear-gradient(90deg, #d42d82 0%, #ed3f6a 60%, #f55a50 100%)",
                boxShadow: "0 4px 18px rgba(212,45,130,0.32)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 6px 24px rgba(212,45,130,0.52)";
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 4px 18px rgba(212,45,130,0.32)";
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "translateY(0)";
              }}
            >
              VIEW SERVICES &nbsp;→
            </button>
            <div className="relative" ref={commandRef}>
              <Command className="rounded-full bg-white border-gray-400 border w-85 text-black hover:border-[#B642F0]">
                <CommandInput
                  onFocus={() => {
                    setOpenSearch(true);
                  }}
                  placeholder="Search a game..."
                  className="outline-red-500"
                />

                {openSearch && (
                  <CommandList className="absolute border border-gray-400 w-full translate-y-15 rounded-2xl! bg-white text-black p-3 flex flex-col">
                    <CommandEmpty>No game found.</CommandEmpty>

                    {games.map((game) => (
                      <CommandItem
                        onSelect={() => {
                          navigate(game.href);
                          setOpenSearch(false);
                        }}
                        key={game.id}
                        className="cursor-pointer hover:text-[#FF1493]! data-[selected=true]:text-[#FF1493] data-[selected=true]:bg-[#F2E5F7] hover:bg-[#F2E5F7]!"
                      >
                        <img
                          src={game.imgSrc}
                          alt="img"
                          className="w-10 h-10 rounded-md"
                        />
                        <span>{game.name}</span>
                      </CommandItem>
                    ))}
                  </CommandList>
                )}
              </Command>
            </div>
          </div>

          {/* Promo badge */}
          <div
            className="inline-flex bg-[#FAE0F1] items-center gap-2 select-none rounded-full px-4.5 py-2 text-[13px] text-[#6a5a7a]"
            style={{
              background: "rgba(255,255,255,0.72)",
              border: "1.5px solid rgba(212,45,130,0.2)",
            }}
          >
            <span>🔥</span>
            <span
              className="font-bold bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #d42d82 0%, #f55a50 100%)",
              }}
            >
              30% OFF
            </span>
            <span>Grand Opening — Limited Time</span>
          </div>
        </div>
      </div>
    </section>
  );
}
