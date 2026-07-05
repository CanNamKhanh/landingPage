import { NavLink } from "react-router-dom";

function Footer() {
  return (
    <div className="w-full bg-[#090B1A] select-none text-white font-medium">
      <div className="ts-1st-line grid py-10 grid-cols-4 gap-5 border-y border-[#222434] px-20">
        <div className="flex flex-col items-start gap-5">
          <a href="#" className="flex items-center gap-3 cursor-pointer">
            <img src="/favicon.png" alt="" className="w-10 rounded-xl" />
            <div className="hidden items-center text-xl sm:flex">
              <span className="font-bold text-white">Rosie</span>
              <span className="font-bold text-[#B842F0]">Boost</span>
            </div>
          </a>
          <div className="text-white/60 md:block hidden text-sm">
            Your trusted partner in game boosting. Fast, safe, and reliable
            service.
          </div>
        </div>
        <div className="flex flex-col items-start text-sm gap-5 text-white/60">
          <h2 className="font-bold text-white">COMPANY</h2>
          <div className="flex flex-col items-start gap-3">
            <a href="#about" className="cursor-pointer hover:text-[#B842F0]">
              About RosieBoost
            </a>
            <NavLink to={"/"} className="cursor-pointer hover:text-[#B842F0]">
              Contact Us
            </NavLink>
            <a href="#faq" className="cursor-pointer hover:text-[#B842F0]">
              FAQ
            </a>
          </div>
        </div>
        <div className="flex flex-col items-start text-sm gap-5 text-white/60">
          <h2 className="font-bold text-white">LEGAL</h2>
          <div className="flex flex-col items-start gap-3">
            <NavLink
              to={"/privacy-policy"}
              className={"cursor-pointer hover:text-[#B842F0]"}
            >
              Privacy Policy
            </NavLink>
            <NavLink
              to={"/refund-policy"}
              className={"cursor-pointer hover:text-[#B842F0]"}
            >
              Refund Policy
            </NavLink>
            <NavLink
              to={"/service-policy"}
              className={"cursor-pointer hover:text-[#B842F0]"}
            >
              Terms of Service
            </NavLink>
          </div>
        </div>
        <div className="flex flex-col items-start text-sm gap-5 text-white/60">
          <h2 className="text-white font-bold">COMMUNITY</h2>
          <div className="flex flex-col items-start gap-3">
            <NavLink
              className={"cursor-pointer hover:text-[#B842F0]"}
              to={"https://discord.com/invite/9rWNTFA9y6"}
            >
              Discord
            </NavLink>
            <NavLink
              className={"cursor-pointer hover:text-[#B842F0]"}
              to={"https://t.me/rosieboost"}
            >
              Telegram
            </NavLink>
            <NavLink
              className={"cursor-pointer hover:text-[#B842F0]"}
              to={"https://wa.me/84775602756"}
            >
              Whatsapp
            </NavLink>
            <NavLink
              className={"cursor-pointer hover:text-[#B842F0]"}
              to={"https://www.facebook.com/rosieboostofficial/"}
            >
              Facebook
            </NavLink>
            <NavLink
              className={"cursor-pointer hover:text-[#B842F0]"}
              to={"https://www.instagram.com/rosieboostservice/"}
            >
              Instagram
            </NavLink>
          </div>
        </div>
      </div>
      {/* End 1St Line */}
      <div className="ts-2nd-line text-sm text-white/60 text-center flex items-center justify-center h-20">
        © 2026 RosieBoost. All rights reserved.
      </div>
      {/* End 2Nd Line */}
    </div>
  );
}

export default Footer;
