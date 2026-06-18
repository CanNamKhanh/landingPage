import { Headphones, Lock, Star, Trophy } from "lucide-react";

const stats = [
  { id: 1, icon: Trophy, stat: "1000+", title: "Completed Orders" },
  { id: 2, icon: Star, stat: "4.9/5", title: "Customer Rating" },
  { id: 3, icon: Headphones, stat: "24/7", title: "Support" },
  { id: 4, icon: Lock, stat: "VPN", title: "Protection Available" },
];

function StartSection() {
  return (
    <div className="reveal py-20 px-4 select-none relative flex mx-auto w-full flex-wrap gap-5 justify-center">
      {stats.map((item) => (
        <div
          key={item.id}
          className="rounded-xl bg-white p-5 w-60 flex flex-col items-center gap-2"
        >
          <span
            className="shrink-0 rounded-xl flex items-center justify-center w-10 h-10"
            style={{
              background: "linear-gradient(135deg, #d42d82 0%, #f55a6a 100%)",
            }}
          >
            <item.icon size={20} />
          </span>

          <span className="text-[#F447A0] text-3xl font-bold">{item.stat}</span>

          <span className="text-black/60">{item.title}</span>
        </div>
      ))}
    </div>
  );
}

export default StartSection;
