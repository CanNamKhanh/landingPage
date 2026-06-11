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
    <div className="bg-white/70 select-none w-full fixed top-0 left-0 right-0 z-99999 backdrop-blur-xl to-transparent">
      {/* Discount */}
      <div className="w-full bg-[#B842F0] py-2 flex justify-center text-center items-center text-white">
        <div>
          🎉 Grand Opening Sale - Get <span className="font-bold">30% Off</span>{" "}
          for all Boosting Services (Limited Time Only)
        </div>
      </div>
      {/* Discount */}

      <div className="via-[#0b0614]/80 from-[#0b0614]">
        <div className="ts-1st-line flex items-center justify-between h-21 px-20">
          <a href="#" className="flex items-center gap-3 cursor-pointer">
            <img src="/favicon.png" alt="" className="w-13 rounded-xl" />
            <div className="hidden items-center text-xl sm:flex">
              <span className="font-bold text-black">Rosie</span>
              <span className="font-bold text-[#B842F0]">Boost</span>
            </div>
          </a>

          <div className="text-gray-400 hidden items-center gap-15 md:flex">
            <span
              onClick={() => {
                document.querySelector(".ts-games")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
              className="cursor-pointer hover:text-[#C243E1]"
            >
              Order
            </span>

            <NavLink
              to={"service-policy"}
              className="cursor-pointer hover:text-[#C243E1]"
            >
              Policy
            </NavLink>

            <DropdownMenu>
              <DropdownMenuTrigger className="group flex items-center gap-1 p-0 bg-transparent hover:bg-transparent hover:text-[#C243E1] transition-all duration-200 cursor-pointer outline-none">
                <span>Contact Us</span>

                <ChevronUp className="transition-transform duration-300 group-data-[state=open]:rotate-180" />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="center"
                className="w-50 border border-white/10 bg-white text-black rounded-xl p-2"
              >
                <DropdownMenuItem
                  asChild
                  className="rounded-lg cursor-pointer outline-none transition-colors duration-200 data-highlighted:bg-[#F7EAF9] data-highlighted:text-[#B842F0]"
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
                  className="rounded-lg cursor-pointer outline-none transition-colors duration-200 data-highlighted:bg-[#F7EAF9] data-highlighted:text-[#B842F0]"
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
                  className="rounded-lg cursor-pointer outline-none transition-colors duration-200 data-highlighted:bg-[#F7EAF9] data-highlighted:text-[#B842F0]"
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
                  className="rounded-lg cursor-pointer outline-none transition-colors duration-200 data-highlighted:bg-[#F7EAF9] data-highlighted:text-[#B842F0]"
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
                  className="rounded-xl hover:bg-transparent cursor-pointer border border-[#C243E1]"
                >
                  <Menu className="text-black" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                onCloseAutoFocus={(e) => {
                  e.preventDefault();
                }}
                className="bg-white text-black"
              >
                <DropdownMenuGroup>
                  <DropdownMenuItem className="focus:bg-[#F8E9F7] data-highlighted:bg-[#F8E9F7] cursor-pointer focus:text-[#B842F0] data-highlighted:text-[#B842F0]">
                    <span
                      onClick={() => {
                        document.querySelector(".ts-games")?.scrollIntoView({
                          behavior: "smooth",
                        });
                      }}
                      className="cursor-pointer hover:text-[#C243E1]"
                    >
                      Order
                    </span>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="focus:bg-[#F8E9F7] data-highlighted:bg-[#F8E9F7] cursor-pointer focus:text-[#B842F0] data-highlighted:text-[#B842F0]">
                    <NavLink
                      to={"service-policy"}
                      className="cursor-pointer hover:text-[#C243E1]"
                    >
                      Policy
                    </NavLink>
                  </DropdownMenuItem>

                  <DropdownMenuSub>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="group text-[14px] py-1 hover:bg-[#F8E9F7] rounded-sm select-none px-2 active flex items-center gap-1 cursor-pointer hover:text-[#C243E1] p-0 focus:bg-[#F8E9F7] data-highlighted:bg-[#F8E9F7] focus:text-[#B842F0] data-highlighted:text-[#B842F0]">
                        <span>Contact Us</span>
                        <ChevronUp className="group-data-[state=open]:rotate-180" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        onCloseAutoFocus={(e) => {
                          e.preventDefault();
                        }}
                        className="w-50 text-black bg-white"
                      >
                        <DropdownMenuItem className="focus:bg-[#F8E9F7] data-highlighted:bg-[#F8E9F7] focus:text-[#B842F0] data-highlighted:text-[#B842F0]">
                          <NavLink
                            to={"https://discord.com/invite/9rWNTFA9y6"}
                            className="w-full"
                          >
                            Discord
                          </NavLink>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-[#F8E9F7] data-highlighted:bg-[#F8E9F7] focus:text-[#B842F0] data-highlighted:text-[#B842F0]">
                          <NavLink
                            to={"https://t.me/rosieboost"}
                            className="w-full"
                          >
                            Telegram
                          </NavLink>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-[#F8E9F7] data-highlighted:bg-[#F8E9F7] focus:text-[#B842F0] data-highlighted:text-[#B842F0]">
                          <NavLink
                            to={"https://www.facebook.com/rosieboostofficial/"}
                            className="w-full"
                          >
                            Facebook
                          </NavLink>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-[#F8E9F7] data-highlighted:bg-[#F8E9F7] focus:text-[#B842F0] data-highlighted:text-[#B842F0]">
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
            <button
              onClick={() => {
                document.querySelector(".ts-games")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
              className="text-white font-bold px-5 py-2.5 rounded-3xl transition-all duration-300 cursor-pointer border-none"
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
              GET STARTED
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
