import {
  CircleDollarSign,
  Lock,
  MessageCircle,
  Rocket,
  Shield,
  SquareCheck,
  Star,
  Trophy,
} from "lucide-react";

const chooseReason = [
  {
    id: 1,
    icon: Rocket,
    title: "Delivery",
    content:
      "Our experienced boosters complete orders quickly while maintaining high-quality performance.",
  },
  {
    id: 2,
    icon: Lock,
    title: "VPN & Privacy Protection",
    content:
      "Your account security is our top priority. VPN protection is available upon request to ensure maximum privacy.",
  },
  {
    id: 3,
    icon: Star,
    title: "Verified High-Rank Boosters",
    content:
      "Every booster is carefully selected based on rank, performance, and professionalism.",
  },
  {
    id: 4,
    icon: MessageCircle,
    title: "24/7 Customer Support",
    content:
      "Stay updated throughout your order via Discord, Telegram, or live chat support.",
  },
  {
    id: 5,
    icon: Shield,
    title: "Manual Boosting Only",
    content:
      "We never use bots, scripts, or automation tools. Every order is completed by a real player.",
  },
  {
    id: 6,
    icon: CircleDollarSign,
    title: "Fair Pricing",
    content: "Competitive rates with transparent pricing and no hidden fees.",
  },
  {
    id: 7,
    icon: Trophy,
    title: "Thousands of Games Completed",
    content:
      "Trusted by players across multiple competitive games and regions.",
  },
  {
    id: 8,
    icon: SquareCheck,
    title: "Satisfaction Guarantee",
    content:
      "We strive to deliver exactly what was promised and maintain a high level of customer satisfaction.",
  },
];

function WhyChoose() {
  return (
    <div
      className="w-full mb-5 items-center flex flex-col gap-8 pb-25 reveal"
      id="about"
    >
      <span className="flex flex-col items-center text-center">
        <h2 className="text-5xl md:text-4xl font-bold mb-4 select-none text-white">
          WHY CHOOSE{" "}
          <span className="text-[#B642F0] text-shadow-[0_0_40px_rgba(182,66,240,0.8)]">
            ROSIEBOOST?
          </span>
        </h2>
        <span className="text-[16px] text-white/50 select-none">
          What makes us the trusted choice for thousands of gamers worldwide
        </span>
      </span>

      <div className="grid shadow-[0_4px_20px_rgba(184,66,240,0.15)] grid-cols-1 border sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-5 w-[80%] bg-[#151728] p-10 rounded-xl">
        {chooseReason.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className="text-white w-full min-w-0 h-40 flex flex-col items-start gap-3"
            >
              <Icon className="w-7 h-7 shrink-0" />
              <h2 className="font-bold text-base">{item.title}</h2>
              <span className="text-white/50 text-sm wrap-break-word">
                {item.content}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WhyChoose;
