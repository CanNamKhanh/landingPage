import { useState } from "react";
import { ChevronUp, Menu, LogOut, User, Settings } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  fetchLogin,
  fetchRegister,
  fetchLogout,
  fetchMe,
} from "@/middlewares/authMiddleware";
import { useEffect } from "react";
import { useAppDispatch, type RootState } from "@/stores/store";

// ─── Gradient button style (reuse từ GET STARTED) ────────────────────────────
const gradientStyle = {
  background: "linear-gradient(90deg, #e05cd5 0%, #f0608a 50%, #f8855a 100%)",
  boxShadow: "0 4px 20px rgba(224,92,213,0.3)",
};

const gradientHover = {
  boxShadow: "0 6px 28px rgba(224,92,213,0.5)",
  transform: "translateY(-1px)",
};

const gradientLeave = {
  boxShadow: "0 4px 20px rgba(224,92,213,0.3)",
  transform: "translateY(0)",
};

function GradientButton({
  children,
  onClick,
  className = "",
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`text-white font-bold px-5 py-2.5 rounded-3xl transition-all duration-300 border-none ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"} ${className}`}
      style={gradientStyle}
      onMouseEnter={(e) =>
        !disabled &&
        Object.assign(
          (e.currentTarget as HTMLButtonElement).style,
          gradientHover,
        )
      }
      onMouseLeave={(e) =>
        !disabled &&
        Object.assign(
          (e.currentTarget as HTMLButtonElement).style,
          gradientLeave,
        )
      }
    >
      {children}
    </button>
  );
}

// ─── Auth Dialog ──────────────────────────────────────────────────────────────
export function AuthDialog({
  open,
  onOpenChange,
  onLogin,
  onRegister,
  loading,
  error,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onLogin: (email: string, password: string) => void;
  onRegister: (username: string, email: string, password: string) => void;
  loading: boolean;
  error: string | null;
}) {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");

  // State mới cho checkbox điều khoản
  const [agreed, setAgreed] = useState(false);
  const [policyError, setPolicyError] = useState("");

  // Hàm xử lý khi nhấn Đăng ký hoặc Enter
  const handleRegisterSubmit = () => {
    if (/\s/.test(regUsername)) {
      setUsernameError("Username không được chứa dấu cách");
      return;
    }

    // Kiểm tra xem đã tích chọn điều khoản chưa
    if (!agreed) {
      setPolicyError(
        "You must agree to the Terms of Service and Privacy Policy",
      );
      return;
    }

    setPolicyError("");
    onRegister(regUsername, regEmail, regPassword);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 text-black z-99999999999 overflow-hidden bg-white rounded-2xl border-0 shadow-2xl">
        <div className="px-8 pb-8 pt-5">
          <DialogHeader className="mb-6 items-center">
            <div className="flex items-center gap-2 mb-1">
              <img src="/favicon.png" alt="" className="w-8 rounded-lg" />
              <span className="font-bold text-lg text-black">Rosie</span>
              <span className="font-bold text-lg text-[#B842F0] -ml-1.5">
                Boost
              </span>
            </div>
            <DialogTitle className="text-gray-500 font-normal text-sm hidden"></DialogTitle>
          </DialogHeader>

          {/* Error banner */}
          {error && (
            <div className="mb-4 px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="w-full mb-6 h-13! bg-gray-100 rounded-full p-1">
              <TabsTrigger
                value="login"
                className="flex-1 data-[state=inactive]:text-black/50 rounded-full py-2 text-sm font-semibold cursor-pointer data-[state=active]:bg-white data-[state=active]:text-[#B842F0] data-[state=active]:shadow-sm transition-all"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="flex-1 data-[state=inactive]:text-black/50 rounded-full py-2 text-sm font-semibold cursor-pointer data-[state=active]:bg-white data-[state=active]:text-[#B842F0] data-[state=active]:shadow-sm transition-all"
              >
                Create Account
              </TabsTrigger>
            </TabsList>

            {/* ── Login ── */}
            <TabsContent value="login" className="mt-0 space-y-4">
              <div className="flex flex-col pb-4 gap-2">
                <span className="font-extrabold text-2xl">Welcome Back</span>
                <span className="text-xs text-black/50">
                  Sign in to continue your climb to the top.
                </span>
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="login-email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email
                </Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="rounded-xl border-gray-200 focus-visible:ring-[#B842F0] focus-visible:border-[#B842F0]"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label
                    htmlFor="login-pass"
                    className="text-sm font-medium text-gray-700"
                  >
                    Password
                  </Label>
                  <button className="text-xs text-[#B842F0] hover:underline cursor-pointer bg-transparent border-none p-0">
                    Forgot password?
                  </button>
                </div>
                <Input
                  id="login-pass"
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && onLogin(loginEmail, loginPassword)
                  }
                  className="rounded-xl border-gray-200 focus-visible:ring-[#B842F0] focus-visible:border-[#B842F0]"
                />
              </div>
              <GradientButton
                className="w-full mt-2"
                onClick={() => onLogin(loginEmail, loginPassword)}
                disabled={loading}
              >
                {loading ? "Signing in…" : "Sign In"}
              </GradientButton>
            </TabsContent>

            {/* ── Register ── */}
            <TabsContent value="register" className="mt-0 space-y-4">
              <div className="flex flex-col pb-4 gap-2">
                <span className="font-extrabold text-2xl">
                  Unlock Your Potential
                </span>
                <span className="text-xs text-black/50">
                  Join thousands of players already climbing with RosieBoost.
                </span>
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="reg-username"
                  className="text-sm font-medium text-gray-700"
                >
                  Username
                </Label>
                <Input
                  id="reg-username"
                  placeholder="your_username"
                  value={regUsername}
                  onChange={(e) => {
                    setRegUsername(e.target.value.replace(/\s/g, ""));
                    setUsernameError("");
                  }}
                  className="rounded-xl border-gray-200 focus-visible:ring-[#B842F0] focus-visible:border-[#B842F0]"
                />
                {usernameError && (
                  <p className="text-xs text-red-500">{usernameError}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="reg-email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email
                </Label>
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="you@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="rounded-xl border-gray-200 focus-visible:ring-[#B842F0] focus-visible:border-[#B842F0]"
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="reg-pass"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </Label>
                <Input
                  id="reg-pass"
                  type="password"
                  placeholder="Min. 6 characters"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleRegisterSubmit()}
                  className="rounded-xl border-gray-200 focus-visible:ring-[#B842F0] focus-visible:border-[#B842F0]"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 pt-1 select-none">
                  <input
                    type="checkbox"
                    id="reg-[#B842F0]"
                    checked={agreed}
                    onChange={(e) => {
                      setAgreed(e.target.checked);
                      if (e.target.checked) setPolicyError("");
                    }}
                    className="w-4 h-4 mt-0.5 rounded border-gray-300 text-[#B842F0] focus:ring-[#B842F0] cursor-pointer"
                  />
                  <label
                    htmlFor="reg-[#B842F0]"
                    className="text-xs text-gray-500 cursor-pointer leading-tight"
                  >
                    I agree to the{" "}
                    <NavLink
                      to="/service-policy"
                      className="text-[#B842F0] hover:underline font-medium"
                    >
                      Terms of Service
                    </NavLink>{" "}
                    and{" "}
                    <NavLink
                      to="/privacy-policy"
                      className="text-[#B842F0] hover:underline font-medium"
                    >
                      Privacy Policy
                    </NavLink>
                  </label>
                </div>
                {policyError && (
                  <p className="text-xs text-red-500 pl-6">{policyError}</p>
                )}
              </div>

              <GradientButton
                className="w-full mt-2"
                onClick={handleRegisterSubmit}
                disabled={loading}
              >
                {loading ? "Creating account…" : "Create Account"}
              </GradientButton>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Avatar dropdown (logged-in state) ───────────────────────────────────────
export function UserAvatar({
  onLogout,
  username,
}: {
  onLogout: () => void;
  username: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="cursor-pointer rounded-full p-0 border-2 border-[#B842F0] hover:border-[#e05cd5] transition-colors outline-none">
          <img
            src="/bg.jpg"
            alt="avatar"
            className="w-9 h-9 rounded-full object-cover"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-44 rounded-xl border border-white/10 bg-white text-black p-1.5 shadow-xl"
      >
        <div className="px-2 py-1.5 mb-1 border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-800 truncate">
            @{username}
          </p>
        </div>
        <DropdownMenuItem className="rounded-lg cursor-pointer gap-2 data-highlighted:bg-[#F7EAF9] data-highlighted:text-[#B842F0]">
          <User size={14} />
          My Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="rounded-lg cursor-pointer gap-2 data-highlighted:bg-[#F7EAF9] data-highlighted:text-[#B842F0]">
          <Settings size={14} />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onLogout}
          className="rounded-lg cursor-pointer gap-2 text-red-500 data-highlighted:bg-red-50 data-highlighted:text-red-500"
        >
          <LogOut size={14} />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
function Header() {
  const dispatch = useAppDispatch();
  const { user, loading, error } = useSelector(
    (state: RootState) => state.auth,
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  // Khôi phục session khi reload trang
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token && !user) {
      dispatch(fetchMe());
    }
  }, []);

  const scrollToGames = () => {
    document.querySelector(".ts-games")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLogin = async (email: string, password: string) => {
    const result = await dispatch(fetchLogin({ email, password }));
    if (fetchLogin.fulfilled.match(result)) {
      dispatch(fetchMe());
      setDialogOpen(false);
    }
  };

  const handleRegister = async (
    username: string,
    email: string,
    password: string,
  ) => {
    const result = await dispatch(fetchRegister({ username, email, password }));
    if (fetchRegister.fulfilled.match(result)) {
      await handleLogin(email, password);
    }
  };

  const handleLogout = () => {
    const refreshToken = localStorage.getItem("refreshToken") ?? "";
    dispatch(fetchLogout({ refreshToken }));
  };

  return (
    <>
      <div className="bg-white/70 select-none w-full fixed top-0 left-0 right-0 z-99999 backdrop-blur-xl to-transparent">
        {/* Discount bar */}
        <div className="w-full bg-[#B842F0] py-2 flex justify-center text-center items-center text-white">
          <div>
            🎉 Grand Opening Sale - Get{" "}
            <span className="font-bold">30% Off</span> for all Boosting Services
            (Limited Time Only)
          </div>
        </div>

        <div className="via-[#0b0614]/80 from-[#0b0614]">
          <div className="ts-1st-line flex items-center justify-between h-21 px-20">
            {/* Logo */}
            <a href="#" className="flex items-center gap-3 cursor-pointer">
              <img src="/favicon.png" alt="" className="w-13 rounded-xl" />
              <div className="hidden items-center text-xl sm:flex">
                <span className="font-bold text-black">Rosie</span>
                <span className="font-bold text-[#B842F0]">Boost</span>
              </div>
            </a>

            {/* Desktop nav */}
            <div className="text-gray-400 hidden items-center gap-15 md:flex">
              <span
                onClick={scrollToGames}
                className="cursor-pointer hover:text-[#C243E1]"
              >
                Order
              </span>
              <NavLink
                to="service-policy"
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
                  {[
                    {
                      label: "Discord",
                      href: "https://discord.com/invite/9rWNTFA9y6",
                    },
                    { label: "Telegram", href: "https://t.me/rosieboost" },
                    {
                      label: "Facebook",
                      href: "https://www.facebook.com/rosieboostofficial/",
                    },
                    {
                      label: "Instagram",
                      href: "https://www.instagram.com/rosieboostservice/",
                    },
                  ].map((item) => (
                    <DropdownMenuItem
                      key={item.label}
                      asChild
                      className="rounded-lg cursor-pointer outline-none transition-colors duration-200 data-highlighted:bg-[#F7EAF9] data-highlighted:text-[#B842F0]"
                    >
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full"
                      >
                        {item.label}
                      </a>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Right side actions */}
            <div className="flex gap-3 items-center">
              {/* Mobile menu */}
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
                  onCloseAutoFocus={(e) => e.preventDefault()}
                  className="bg-white text-black"
                >
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="focus:bg-[#F8E9F7] data-highlighted:bg-[#F8E9F7] cursor-pointer focus:text-[#B842F0] data-highlighted:text-[#B842F0]">
                      <span onClick={scrollToGames} className="cursor-pointer">
                        Order
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-[#F8E9F7] data-highlighted:bg-[#F8E9F7] cursor-pointer focus:text-[#B842F0] data-highlighted:text-[#B842F0]">
                      <NavLink to="service-policy">Policy</NavLink>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Auth area */}
              {user ? (
                <>
                  <GradientButton onClick={scrollToGames}>
                    GET STARTED
                  </GradientButton>
                  <UserAvatar
                    onLogout={handleLogout}
                    username={user.username}
                  />
                </>
              ) : (
                <>
                  <GradientButton onClick={scrollToGames}>
                    GET STARTED
                  </GradientButton>
                  <button
                    onClick={() => setDialogOpen(true)}
                    className="cursor-pointer font-semibold px-5 py-2.5 rounded-3xl border-2 border-[#B842F0] text-[#B842F0] bg-transparent hover:bg-[#F7EAF9] transition-all duration-200 text-sm"
                  >
                    Sign In
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <AuthDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onLogin={handleLogin}
        onRegister={handleRegister}
        loading={loading}
        error={error}
      />
    </>
  );
}

export default Header;
