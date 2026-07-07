import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

function RefundPolicyPage() {
  const terms = [
    {
      id: 1,
      title: "Eligible Refund Cases",
      content: [
        "Order not started for a long time",
        "Duplicate payment",
        "Technical issue preventing delivery",
      ],
    },
    {
      id: 2,
      title: "Partial Refund Cases",
      content: [
        "Customer requests cancellation after work has begun",
        "Partial completion of order",
      ],
    },
    {
      id: 3,
      title: "Non-Refundable Cases",
      content: [
        "Completed orders",
        "Customer changes mind after completion",
        "Account restrictions caused by customer actions",
      ],
    },

    {
      id: 4,
      title: "Contact For Refund Requests",
      content: [
        "Discord: https://discord.gg/9rWNTFA9y6",
        "Telegram: https://t.me/rosieboost",
        "Facebook: https://www.facebook.com/rosieboostofficial/",
        "Instagram: https://www.instagram.com/rosieboostservice/",
      ],
    },
  ];

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div className="bg-[#0F0F17]/80 w-full fixed top-0 left-0 right-0 z-99999 backdrop-blur-md to-transparent via-[#0b0614]/80 from-[#0b0614]">
        <div className="ts-1st-line flex items-center justify-between h-16 sm:h-18 md:h-21 border-y border-white/10 px-4 sm:px-8 md:px-20">
          <NavLink to={"/"} className="flex items-center gap-3 cursor-pointer">
            <img
              src="/favicon.png"
              alt=""
              className="w-10 sm:w-13 rounded-xl"
            />
            <div className="hidden items-center text-xl sm:flex">
              <span className="font-bold text-white">Rosie</span>
              <span className="font-bold text-[#B842F0]">Boost</span>
            </div>
          </NavLink>
          <NavLink
            to={"/"}
            className="flex gap-2 font-medium text-sm sm:text-base text-white/50 hover:text-[#B842F0] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden xs:inline">Back To Home</span>
          </NavLink>
        </div>
      </div>

      <main className="px-4 sm:px-8 md:px-16 lg:px-32 xl:px-90 mx-auto flex flex-col gap-6 sm:gap-8 md:gap-10 py-20 sm:py-24 md:py-30 bg-[#0F0F17] max-w-[1600px]">
        <header className="flex flex-col gap-3 sm:gap-5">
          <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl text-white">
            Refund <span className="text-[#B842F0]">Policy</span>
          </h1>
          <p className="font-medium text-sm sm:text-base text-white/50">
            Fair, transparent and case-by-case.
          </p>
        </header>
        <div className="ts-terms flex flex-col gap-6 sm:gap-8 md:gap-10">
          {terms.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 sm:gap-5 md:gap-7 border border-white/10 rounded-xl p-5 sm:p-6 md:p-8 bg-[#17171F]"
            >
              <div className="ts-term-title flex items-center gap-3">
                <div className="id-wrapper w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-full flex justify-center items-center bg-[#B842F0]/15">
                  <span className="text-[#B842F0] font-bold text-sm sm:text-base">
                    {item.id}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl text-white font-bold">
                  {item.title}
                </h2>
              </div>
              <div className="ts-term-content flex flex-col gap-3 font-medium">
                {item.content.map((item, index) => (
                  <span key={index} className="flex gap-3">
                    <span className="text-[#B842F0] shrink-0">●</span>
                    <span className="text-white/80 text-sm sm:text-base break-words">
                      {item}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <NavLink
          to={"/"}
          className="flex gap-2 items-center font-semibold h-12 mx-auto w-full max-w-45"
        >
          <Button
            className="text-white w-full mx-auto font-bold h-full rounded-3xl transition-all duration-300 cursor-pointer border-none"
            style={{
              background:
                "linear-gradient(90deg, #e05cd5 0%, #f0608a 50%, #f8855a 100%)",
              boxShadow: "0 4px 20px rgba(224,92,213,0.3)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 6px 28px rgba(224,92,213,0.5)";
              (e.currentTarget as HTMLButtonElement).style.transform =
                "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 4px 20px rgba(224,92,213,0.3)";
              (e.currentTarget as HTMLButtonElement).style.transform =
                "translateY(0)";
            }}
          >
            <ArrowLeft />
            <span>Back To Home</span>
          </Button>
        </NavLink>

        <Button
          onClick={scrollToTop}
          className={`
          bg-[#B842F0] hover:bg-[#B842F0]
        fixed right-4 sm:right-8 bottom-4 sm:bottom-8 z-50 rounded-full w-10 h-10 sm:w-12 sm:h-12
        transition-all duration-300 text-white cursor-pointer hover:scale-110
        ${visible ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"}
      `}
        >
          <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
      </main>
    </>
  );
}

export default RefundPolicyPage;
