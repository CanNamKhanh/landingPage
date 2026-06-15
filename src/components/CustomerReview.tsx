import { MessageCircle, Star } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

interface CustomerType {
  name: string;
  content: string;
  rated: number;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  bgColor: string;
}

export function DiscordLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill="currentColor"
        d="M19.54 5.32A18.3 18.3 0 0 0 15.1 3.96l-.55 1.1a16.2 16.2 0 0 0-5.1 0l-.55-1.1a18.3 18.3 0 0 0-4.44 1.36C1.65 9.08.88 12.72 1.25 16.3a18.5 18.5 0 0 0 5.46 2.76l1.2-1.64c-.66-.24-1.28-.56-1.86-.95.16.12.33.24.5.35a12.7 12.7 0 0 0 10.9 0c.17-.11.34-.23.5-.35-.58.39-1.2.71-1.86.95l1.2 1.64a18.5 18.5 0 0 0 5.46-2.76c.42-4.15-.7-7.75-2.81-10.98ZM8.75 14.52c-1.05 0-1.92-.96-1.92-2.14 0-1.18.85-2.14 1.92-2.14s1.93.96 1.92 2.14c0 1.18-.85 2.14-1.92 2.14Zm6.5 0c-1.05 0-1.92-.96-1.92-2.14 0-1.18.85-2.14 1.92-2.14s1.93.96 1.92 2.14c0 1.18-.85 2.14-1.92 2.14Z"
      />
    </svg>
  );
}

function CustomerReview() {
  const customerReview: CustomerType[] = [
    {
      rated: 5,
      content:
        "Got my Valorant account from Gold to Diamond in just 2 days. Super professional and kept me updated the whole time. Highly recommend!",
      name: "ale******",
      icon: DiscordLogo,
      bgColor: "#5765EB",
    },
    {
      rated: 5,
      content:
        "Best boosting service I've used. My League account went from Silver to Platinum smoothly. No issues at all, very trustworthy team.",
      name: "sar*****",
      icon: DiscordLogo,
      bgColor: "#5765EB",
    },
    {
      rated: 5,
      content:
        "Fast delivery and great communication through Discord. They finished my CS2 boost ahead of schedule. Will definitely come back!",
      name: "jay_k******",
      icon: DiscordLogo,
      bgColor: "#5765EB",
    },
    {
      rated: 5,
      content:
        "I was skeptical at first but RosieBoost proved me wrong. Account was safe, boost was done manually, and the price was fair.",
      name: "min*****",
      icon: MessageCircle,
      bgColor: "#229ED9",
    },
    {
      rated: 5,
      content:
        "Amazing service for TFT ranked boost! They explained everything clearly and delivered exactly what was promised. 10/10!",
      name: "luna******",
      icon: DiscordLogo,
      bgColor: "#5765EB",
    },
    {
      rated: 5,
      content:
        "Used their service for Arena Breakout. Very smooth process from payment to completion. The booster was skilled and efficient.",
      name: "chr*****",
      icon: DiscordLogo,
      bgColor: "#5765EB",
    },
  ];

  return (
    <div className="w-full items-center flex flex-col gap-8 pb-25 reveal">
      <span className="flex flex-col items-center text-center">
        <h2 className="text-5xl md:text-4xl font-bold mb-4 select-none text-black">
          CUSTOMER{" "}
          <span className="text-[#B642F0] text-shadow-[0_0_40px_rgba(182,66,240,0.8)]">
            REVIEWS
          </span>
        </h2>
        <span className="text-[16px] text-black/50 select-none">
          See what our clients say about their experience
        </span>
      </span>
      <div className="w-[83%] justify-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {customerReview.map((item, index) => (
          <div
            key={index}
            className="h-50 hover:scale-105 border border-white bg-white hover:border-[#B642F0] transform duration-300 cursor-pointer w-full p-7 gap-3 rounded-xl flex flex-col justify-between"
          >
            <div className="flex flex-col justify-start gap-3">
              <div className="flex gap-1">
                {Array.from({ length: item.rated }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-[#B642F0] fill-[#B642F0] stroke-[#B642F0]"
                  />
                ))}
              </div>
              <span className="text-black text-[15px]">"{item.content}"</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                style={{ backgroundColor: item.bgColor }}
                className={`flex items-center justify-center w-5 h-5 rounded-full`}
              >
                <item.icon className="text-white" width={10} height={10} />
              </div>
              <span className="text-black font-bold">{item.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CustomerReview;
