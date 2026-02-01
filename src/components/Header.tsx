import { Button } from "./ui/button";

function Header() {
  return (
    <div className="bg-[#09071631] w-full fixed top-0 left-0 right-0 z-99999 backdrop-blur-md to-transparent via-[#0b0614]/80 from-[#0b0614]">
      <div className="ts-1st-line flex items-center justify-between h-21 border-y border-gray-800 px-20">
        <div className="flex items-center gap-3 cursor-pointer">
          <img src="/logo-DGwPK51i.png" alt="" className="w-13" />
          <div className="flex items-center text-xl">
            <span className="font-bold text-white">Rosie</span>
            <span className="font-bold text-[#FF1A8C]">Boost</span>
          </div>
        </div>
        <div className="text-gray-400 flex items-center gap-10">
          <span
            onClick={() => {
              document.querySelector(".ts-games")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
            className="cursor-pointer hover:text-[#FF1A8C]"
          >
            Games
          </span>
          <span
            onClick={() => {
              document.querySelector(".ts-book-form")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
            className="cursor-pointer hover:text-[#FF1A8C]"
          >
            Book Now
          </span>
          <span className="cursor-pointer hover:text-[#FF1A8C]">About</span>
        </div>
        <div>
          <Button
            onClick={() => {
              document.querySelector(".ts-book-form")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
            className="bg-[#FF1A8C] text-white font-bold px-6 rounded-xl transition-all duration-300 hover:shadow-[0_0_25px_6px_rgba(255,26,140,0.6)] cursor-pointer hover:bg-[#f7288f]"
          >
            GET STARTED
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Header;
