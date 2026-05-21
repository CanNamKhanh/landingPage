import { ChevronUp, Menu } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavLink } from "react-router-dom";

function Header() {
  return (
    <div className="bg-[#09071631] select-none w-full fixed top-0 left-0 right-0 z-99999 backdrop-blur-xl to-transparent">
      {/* Discount */}
      <div className="w-full bg-[#00FF00] py-2 flex justify-center text-center items-center text-black">
        <div>
          🎉 Grand Opening Sale - Get <span className="font-bold">30% Off</span>{" "}
          for all Boosting Services (Limited Time Only)
        </div>
      </div>
      {/* Discount */}

      <div className="via-[#0b0614]/80 from-[#0b0614]">
        <div className="ts-1st-line flex items-center justify-between h-21 border-y border-gray-800 px-20">
          <a href="#" className="flex items-center gap-3 cursor-pointer">
            <img src="/favicon.png" alt="" className="w-13 rounded-xl" />
            <div className="hidden items-center text-xl sm:flex">
              <span className="font-bold text-white">Rosie</span>
              <span className="font-bold text-[#00FF00]">Boost</span>
            </div>
          </a>

          <div className="text-gray-400 hidden items-center gap-15 md:flex">
            <span
              onClick={() => {
                document.querySelector(".ts-games")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
              className="cursor-pointer hover:text-[#00FF00] hover:scale-110"
            >
              Order
            </span>

            <NavLink
              to={"service-policy"}
              className="cursor-pointer hover:text-[#00FF00] hover:scale-110"
            >
              Policy
            </NavLink>

            <DropdownMenu>
              <DropdownMenuTrigger className="group flex items-center gap-1 p-0 bg-transparent hover:bg-transparent hover:text-[#00FF00] hover:scale-110 transition-all duration-200 cursor-pointer outline-none">
                <span>Contact Us</span>

                <ChevronUp className="transition-transform duration-300 group-data-[state=open]:rotate-180" />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="center"
                className="w-50 border border-white/10 bg-[#140022] text-gray-300 rounded-xl p-2"
              >
                <DropdownMenuItem
                  asChild
                  className="rounded-lg cursor-pointer outline-none transition-colors duration-200 data-highlighted:bg-[#00FF00] data-highlighted:text-black"
                >
                  <a
                    href="https://discord.com/invite/9rWNTFA9y6"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full"
                  >
                    Discord
                  </a>
                </DropdownMenuItem>

                <DropdownMenuItem
                  asChild
                  className="rounded-lg cursor-pointer outline-none transition-colors duration-200 data-highlighted:bg-[#00FF00] data-highlighted:text-black"
                >
                  <a
                    href="https://t.me/rosieboost"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full"
                  >
                    Telegram
                  </a>
                </DropdownMenuItem>

                <DropdownMenuItem
                  asChild
                  className="rounded-lg cursor-pointer outline-none transition-colors duration-200 data-highlighted:bg-[#00FF00] data-highlighted:text-black"
                >
                  <a
                    href="https://www.facebook.com/rosieboostofficial/"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full"
                  >
                    Facebook
                  </a>
                </DropdownMenuItem>

                <DropdownMenuItem
                  asChild
                  className="rounded-lg cursor-pointer outline-none transition-colors duration-200 data-highlighted:bg-[#00FF00] data-highlighted:text-black"
                >
                  <a
                    href="https://www.instagram.com/rosieboostservice/"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full"
                  >
                    Instagram
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex gap-3 items-center">
            <DropdownMenu>
              <DropdownMenuTrigger
                asChild
                className="block md:hidden shadow-none outline-none"
              >
                <Button
                  variant="ghost"
                  className="rounded-xl hover:bg-transparent cursor-pointer border border-[#00FF00]"
                >
                  <Menu />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                onCloseAutoFocus={(e) => {
                  e.preventDefault();
                }}
                className=""
              >
                <DropdownMenuGroup>
                  <DropdownMenuItem className="focus:bg-transparent data-highlighted:bg-transparent cursor-pointer">
                    <span
                      onClick={() => {
                        document.querySelector(".ts-games")?.scrollIntoView({
                          behavior: "smooth",
                        });
                      }}
                      className="cursor-pointer hover:text-[#00FF00] hover:scale-110"
                    >
                      Order
                    </span>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="focus:bg-transparent data-highlighted:bg-transparent cursor-pointer">
                    <NavLink
                      to={"service-policy"}
                      className="cursor-pointer hover:text-[#00FF00] hover:scale-110"
                    >
                      Policy
                    </NavLink>
                  </DropdownMenuItem>

                  <DropdownMenuSub>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="group text-[14px] py-1 select-none px-2 active bg-transparent flex items-center gap-1 hover:bg-transparent cursor-pointer hover:text-[#00FF00] hover:scale-110 p-0">
                        <span>Contact Us</span>
                        <ChevronUp className="group-data-[state=open]:rotate-180" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        onCloseAutoFocus={(e) => {
                          e.preventDefault();
                        }}
                        className="w-50"
                      >
                        <DropdownMenuItem className="focus:bg-[#00FF00] data-highlighted:bg-[#00FF00]">
                          <NavLink
                            to={"https://discord.com/invite/9rWNTFA9y6"}
                            className="w-full"
                          >
                            Discord
                          </NavLink>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-[#00FF00] data-highlighted:bg-[#00FF00]">
                          <NavLink
                            to={"https://t.me/rosieboost"}
                            className="w-full"
                          >
                            Telegram
                          </NavLink>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-[#00FF00] data-highlighted:bg-[#00FF00]">
                          <NavLink
                            to={"https://www.facebook.com/rosieboostofficial/"}
                            className="w-full"
                          >
                            Facebook
                          </NavLink>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-[#00FF00] data-highlighted:bg-[#00FF00]">
                          <NavLink
                            to={"https://www.instagram.com/rosieboostservice/"}
                            className="w-full"
                          >
                            Instagram
                          </NavLink>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              onClick={() => {
                document.querySelector(".ts-games")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
              className="bg-[#00FF00] text-black font-bold px-6 rounded-xl transition-all duration-300 hover:shadow-[0_0_25px_6px_rgba(0,255,0,0.35)] cursor-pointer hover:bg-[#00FF00]"
            >
              GET STARTED
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
