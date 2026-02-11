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
      name: "AJames K.",
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
    <div className="w-full items-center flex flex-col gap-8 py-25 reveal">
      <span className="flex flex-col items-center">
        <h2 className="text-5xl md:text-4xl font-bold mb-4 select-none">
          CUSTOMER{" "}
          <span className="text-accent text-shadow-[0_0_20px_rgba(236,72,153,0.8)]">
            REVIEWS
          </span>
        </h2>
        <span className="text-[16px] text-muted-foreground select-none">
          See what our clients say about their experience
        </span>
      </span>
      <div className="w-full justify-center flex flex-wrap gap-8">
        {customerReview.map((item, index) => (
          <div
            key={index}
            className="border-gray-800 hover:scale-105 bg-[#120a21] hover:border-pink-500 transform duration-300 cursor-pointer border w-100 p-7 gap-3 rounded-xl flex flex-col justify-start"
          >
            <div className="flex gap-1">
              {Array.from({ length: item.rated }).map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 text-pink-500 fill-pink-500 stroke-pink-500"
                />
              ))}
            </div>
            <span className="text-gray-400 text-[15px]">"{item.content}"</span>
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CustomerReview;
