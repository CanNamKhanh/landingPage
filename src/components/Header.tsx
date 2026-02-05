import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavLink } from "react-router-dom";

function Header() {
  return (
    <div className="bg-[#09071631] w-full fixed top-0 left-0 right-0 z-99999 backdrop-blur-md to-transparent via-[#0b0614]/80 from-[#0b0614]">
      <div className="ts-1st-line flex items-center justify-between h-21 border-y border-gray-800 px-20">
        <NavLink to={"/"} className="flex items-center gap-3 cursor-pointer">
          <img src="/logo-DGwPK51i.png" alt="" className="w-13" />
          <div className="hidden items-center text-xl sm:flex">
            <span className="font-bold text-white">Rosie</span>
            <span className="font-bold text-[#FF1A8C]">Boost</span>
          </div>
        </NavLink>

        <div className="text-gray-400 hidden items-center gap-15 md:flex">
          <span
            onClick={() => {
              document.querySelector(".ts-games")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
            className="cursor-pointer hover:text-[#FF1A8C] font-bold hover:scale-110"
          >
            Games
          </span>
          <span
            onClick={() => {
              document.querySelector(".ts-book-form")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
            className="cursor-pointer hover:text-[#FF1A8C] font-bold hover:scale-110"
          >
            Order
          </span>
          <NavLink
            to={"service-policy"}
            className="cursor-pointer hover:text-[#FF1A8C] font-bold hover:scale-110"
          >
            About
          </NavLink>
        </div>
        <div className="flex gap-3 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="block md:hidden">
              <Button variant="outline" className="rounded-xl cursor-pointer">
                <Menu />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="">
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <span
                    onClick={() => {
                      document.querySelector(".ts-games")?.scrollIntoView({
                        behavior: "smooth",
                      });
                    }}
                    className="cursor-pointer"
                  >
                    Games
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span
                    onClick={() => {
                      document.querySelector(".ts-book-form")?.scrollIntoView({
                        behavior: "smooth",
                      });
                    }}
                    className="cursor-pointer"
                  >
                    Book Now
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <NavLink to={"service-policy"} className="cursor-pointer">
                    About
                  </NavLink>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
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
