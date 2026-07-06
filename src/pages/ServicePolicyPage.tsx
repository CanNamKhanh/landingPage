import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

function ServicePolicyPage() {
  const terms = [
    {
      id: 1,
      title: "Account Requirements",
      content: [
        "The client's account must be the exact rank and status as initially reported to us before the boosting process starts.",
        "The client must provide accurate login information and any additional details required to access the account.",
      ],
    },
    {
      id: 2,
      title: "Payment & Refunds",
      content: [
        "Payment is made in full before the boosting begins.",
        "If cheating, hacking, or any unauthorized software is detected on the account during our service, a full refund will be issued.",
        "If the account is banned due to smurfing, account sharing, or boosting (which violates the game's terms of service), no refund will be given.",
      ],
    },
    {
      id: 3,
      title: "Ban & Risk Policy",
      content: [
        "Boosting is against the rules of most games, and there is always a risk of penalty or ban. By purchasing our services, you acknowledge and accept this risk.",
        "We will not be held responsible for any bans caused by smurfing, past violations, or the game's automated detection systems outside of our direct actions.",
      ],
    },
    {
      id: 4,
      title: "Service Conduct",
      content: [
        "We will not use any cheats, hacks, or third-party software.",
        "Progress will be handled manually by our boosters, ensuring legitimate gameplay.",
      ],
    },
    {
      id: 5,
      title: "Communication",
      content: [
        "Clients can contact us via Discord, Telegram, or WhatsApp for updates and support.",
        "Regular progress updates will be provided if requested.",
      ],
    },
    {
      id: 6,
      title: "Confidentiality",
      content: [
        "All account information is kept strictly confidential and will be deleted after the service is completed.",
      ],
    },
    {
      id: 7,
      title: "Compensation",
      content: [
        "In cases where the account is banned due to our use of cheats/hacks, we will issue a full refund plus compensation for the inconvenience.",
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
            Terms of <span className="text-[#B842F0]">Service</span>
          </h1>
          <p className="font-medium text-white/50">
            *Please read carefully before ordering. We are not responsible for
            any problems caused by not following these policies
          </p>
        </header>
        <div className="ts-terms flex flex-col gap-10">
          {terms.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-7 border rounded-xl p-8 border-white/10 bg-[#17171F]"
            >
              <div className="ts-term-title flex items-center gap-3">
                <div className="id-wrapper w-8 h-8 rounded-full flex justify-center items-center bg-[#B842F0]/15">
                  <span className="text-[#B842F0] font-bold">{item.id}</span>
                </div>
                <h2 className="text-xl text-white font-bold">{item.title}</h2>
              </div>
              <div className="ts-term-content flex flex-col gap-3 font-medium">
                {item.content.map((item, index) => (
                  <span key={index} className="flex gap-3">
                    <span className="text-[#B842F0]">●</span>
                    <span className="text-white/80">{item}</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
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
    </>
  );
}

export default ServicePolicyPage;
