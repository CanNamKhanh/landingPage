import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

function AboutUsPage() {
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
    <div className="h-screen">
      <div className="bg-[#0F0F17]/80 w-full fixed top-0 left-0 right-0 z-99999 backdrop-blur-md to-transparent via-[#0b0614]/80 from-[#0b0614]">
        <div className="ts-1st-line flex items-center justify-between h-21 border-y border-white/10 px-20">
          <NavLink to={"/"} className="flex items-center gap-3 cursor-pointer">
            <img src="/favicon.png" alt="" className="w-13 rounded-xl" />
            <div className="hidden items-center text-xl sm:flex">
              <span className="font-bold text-white">Rosie</span>
              <span className="font-bold text-[#B842F0]">Boost</span>
            </div>
          </NavLink>
          <NavLink
            to={"/"}
            className="flex gap-2 font-medium text-white/50 hover:text-[#B842F0] cursor-pointer"
          >
            <ArrowLeft />
            <span>Back To Home</span>
          </NavLink>
        </div>
      </div>

      <main className="px-90 mx-auto flex flex-col gap-10 py-30 bg-[#0F0F17]">
        <header className="flex flex-col gap-5">
          <h1 className="font-bold text-5xl text-white">
            About <span className="text-[#B842F0]">RosieBoost</span>
          </h1>
        </header>
        <div className="ts-terms flex flex-col gap-10">
          <div className="flex flex-col gap-7 border rounded-xl p-8 border-white/10 bg-[#17171F]">
            <div className="ts-term-content text-[#989CB3] text-lg flex flex-col gap-3 font-medium">
              RosieBoost is a professional gaming services platform dedicated to
              helping players achieve their competitive goals through reliable,
              secure, and customer-focused support.
            </div>
            <div className="ts-term-content text-[#989CB3] text-lg flex flex-col gap-3 font-medium">
              We provide progression assistance, gaming support services,
              performance improvement solutions, and personalized guidance
              across multiple competitive titles.
            </div>
            <div className="ts-term-content text-[#989CB3] text-lg flex flex-col gap-3 font-medium">
              Our platform emphasizes transparency, privacy protection,
              responsive customer support, and a seamless customer experience
              from order placement to completion.
            </div>
            <div className="ts-term-content text-[#989CB3] text-lg flex flex-col gap-3 font-medium">
              Whether players are looking to save time, improve performance, or
              reach specific in-game milestones, RosieBoost aims to deliver
              high-quality service through a trusted and structured process.
            </div>
          </div>
        </div>
        <NavLink
          to={"/"}
          className="flex gap-2 items-center font-semibold h-12 mx-auto w-45"
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
          bg-[#B842F0] hover:bg-[#1c1a1d]
        fixed right-8 bottom-8 z-50 rounded-full w-12 h-12
        transition-all duration-300 text-white cursor-pointer hover:scale-110
        ${visible ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"}
      `}
        >
          <ArrowUp />
        </Button>
      </main>
    </div>
  );
}

export default AboutUsPage;
