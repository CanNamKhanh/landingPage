import { Star } from "lucide-react";

function CustomerReview() {
  const customerReview = [
    {
      rated: 5,
      content:
        "Great players, good communication, followed all instructions. Completed boost in less than 3 days. Highly recommend.",
      name: "zzc**",
    },
    {
      rated: 5,
      content:
        "Is a very nice person fast and secure and very kind love u roosie 😃",
      name: "dar*******",
    },
    {
      rated: 5,
      content:
        "Greatest TFT booster in the game. Fast, efficient and very good communication. If you're looking for a booster then look no further, this guy is the best!",
      name: "sin*****",
    },
    {
      rated: 5,
      content: "Very fast completed immo 1 to rad boost in 4 days",
      name: "mira**********",
    },
    {
      rated: 5,
      content:
        "Delivered within 2 days even though I gave him the wrong log in the first time ❤️❤️❤️",
      name: "fond*****",
    },
    {
      rated: 5,
      content:
        "Again used Rosie to help me reach immo 1. Best booster in the market ❤",
      name: "head*******",
    },
  ];

  return (
    <div className="w-full items-center flex flex-col gap-8 py-25 reveal">
      <span className="flex flex-col items-center text-center">
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
      <div className="w-[83%] justify-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {customerReview.map((item, index) => (
          <div
            key={index}
            className="border-gray-800 h-50 hover:scale-105 bg-[#120a21] hover:border-pink-500 transform duration-300 cursor-pointer border w-full p-7 gap-3 rounded-xl flex flex-col justify-between"
          >
            <div className="flex flex-col justify-start gap-3">
              <div className="flex gap-1">
                {Array.from({ length: item.rated }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-pink-500 fill-pink-500 stroke-pink-500"
                  />
                ))}
              </div>
              <span className="text-gray-400 text-[15px]">
                "{item.content}"
              </span>
            </div>
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CustomerReview;
