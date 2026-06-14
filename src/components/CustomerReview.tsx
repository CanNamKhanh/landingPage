import { Star } from "lucide-react";

function CustomerReview() {
  const customerReview = [
    {
      rated: 5,
      content:
        "Got my Valorant account from Gold to Diamond in just 2 days. Super professional and kept me updated the whole time. Highly recommend!",
      name: "Alex T.",
    },
    {
      rated: 5,
      content:
        "Best boosting service I've used. My League account went from Silver to Platinum smoothly. No issues at all, very trustworthy team.",
      name: "Sarah M.",
    },
    {
      rated: 5,
      content:
        "Fast delivery and great communication through Discord. They finished my CS2 boost ahead of schedule. Will definitely come back!",
      name: "James K.",
    },
    {
      rated: 5,
      content:
        "I was skeptical at first but RosieBoost proved me wrong. Account was safe, boost was done manually, and the price was fair.",
      name: "Minh D.",
    },
    {
      rated: 5,
      content:
        "Amazing service for TFT ranked boost! They explained everything clearly and delivered exactly what was promised. 10/10!",
      name: "Luna W.",
    },
    {
      rated: 5,
      content:
        "Used their service for Arena Breakout. Very smooth process from payment to completion. The booster was skilled and efficient.",
      name: "Chris P.",
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
            <span className="text-black font-bold">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CustomerReview;
