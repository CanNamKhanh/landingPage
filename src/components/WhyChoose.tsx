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
        <h2 className="text-5xl md:text-4xl font-bold mb-4 select-none text-black">
          WHY CHOOSE{" "}
          <span className="text-[#B642F0] text-shadow-[0_0_40px_rgba(182,66,240,0.8)]">
            ROSIEBOOST?
          </span>
        </h2>
        <span className="text-[16px] text-black/50 select-none">
          What makes us the trusted choice for thousands of gamers worldwide
        </span>
      </span>

      <div className="grid gap-5 grid-cols-4 mt-5">
        {chooseReason.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl hover:scale-105 border border-white hover:border-[#B642F0] transform duration-300 p-5 w-70 h-50 cursor-pointer flex flex-col gap-2 text-black"
          >
            <item.icon />
            <h2 className="font-bold">{item.title}</h2>
            <span className="text-black/50 text-sm">{item.content}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WhyChoose;
