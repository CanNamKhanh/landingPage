import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  submitLOLPlacement,
  submitLOLRankBoost,
} from "@/services/bookingService";
import { games, gameServers } from "@/services/gameService";
// import axiosInstance from "@/utils/axios";
import { ArrowLeft, CheckCircle, Loader2, X } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

type ServerName = "AP" | "EU" | "KR" | "NA" | "LATAM" | "BR";

interface ServerInfo {
  id: number;
  name: ServerName;
  price: number;
}

// ─── Pricing Data ─────────────────────────────────────────────────────────────

const RANK_ORDER = [
  "Iron 1",
  "Iron 2",
  "Iron 3",
  "Iron 4",
  "Bronze 4",
  "Bronze 3",
  "Bronze 2",
  "Bronze 1",
  "Silver 4",
  "Silver 3",
  "Silver 2",
  "Silver 1",
  "Gold 4",
  "Gold 3",
  "Gold 2",
  "Gold 1",
  "Platinum 4",
  "Platinum 3",
  "Platinum 2",
  "Platinum 1",
  "Emerald 4",
  "Emerald 3",
  "Emerald 2",
  "Emerald 1",
  "Diamond 4",
  "Diamond 3",
  "Diamond 2",
  "Diamond 1",
  "Master",
  "Grandmaster",
  "Challenger",
] as const;

type RankName = (typeof RANK_ORDER)[number];

type RankPrice = number | string;

const RANK_STEP_PRICE_AP: Record<RankName, RankPrice> = {
  "Iron 4": 6.4,
  "Iron 3": 6.4,
  "Iron 2": 6.4,
  "Iron 1": 6.4,
  "Bronze 4": 8,
  "Bronze 3": 8,
  "Bronze 2": 8,
  "Bronze 1": 8,
  "Silver 4": 9.6,
  "Silver 3": 9.6,
  "Silver 2": 9.6,
  "Silver 1": 9.6,
  "Gold 4": 12.8,
  "Gold 3": 12.8,
  "Gold 2": 12.8,
  "Gold 1": 12.8,
  "Platinum 4": 16,
  "Platinum 3": 16,
  "Platinum 2": 16,
  "Platinum 1": 16,
  "Emerald 4": 19.2,
  "Emerald 3": 20.8,
  "Emerald 2": 22.4,
  "Emerald 1": 24,
  "Diamond 4": 32,
  "Diamond 3": 35.2,
  "Diamond 2": 38.4,
  "Diamond 1": 43.2,
  Master: 64,
  Grandmaster: "To be decided",
  Challenger: "To be decided",
};

const PLACEMENT_RANKS = [
  "Unranked",
  "Iron",
  "Bronze",
  "Silver",
  "Gold",
  "Platinum",
  "Emerald",
  "Diamond",
  "Master",
  "Grandmaster",
  "Challenger",
] as const;

type PlacementRankName = (typeof PLACEMENT_RANKS)[number];

const PLACEMENT_PRICE_AP: Record<PlacementRankName, number> = {
  Unranked: 4.5,
  Iron: 4.5,
  Bronze: 4.5,
  Silver: 5.4,
  Gold: 6,
  Platinum: 7.5,
  Emerald: 9,
  Diamond: 10.5,
  Master: 15,
  Grandmaster: 22.5,
  Challenger: 30,
};

const MATCH_OPTIONS = [1, 2, 3, 4, 5] as const;
type MatchCount = (typeof MATCH_OPTIONS)[number];

const SERVER_MULTIPLIER: Record<ServerName, number> = {
  AP: 1,
  EU: 1.1,
  KR: 1.1,
  NA: 1.5,
  LATAM: 1.5,
  BR: 1.5,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function round2(n: number): number {
  return parseFloat(n.toFixed(2));
}

type BoostPriceResult = number | "Contact us for a custom quote.";

function calcRankBoostPrice(
  from: RankName,
  to: RankName,
  server: ServerName,
): BoostPriceResult {
  const fromIdx = RANK_ORDER.indexOf(from);
  const toIdx = RANK_ORDER.indexOf(to);
  if (fromIdx < 0 || toIdx <= fromIdx) return 0;

  let apSum = 0;
  for (let i = fromIdx + 1; i <= toIdx; i++) {
    const price = RANK_STEP_PRICE_AP[RANK_ORDER[i]];

    if (typeof price !== "number") {
      return "Contact us for a custom quote.";
    }

    apSum += price;
  }
  return round2(apSum * SERVER_MULTIPLIER[server]);
}

function calcPlacementPrice(
  matches: number,
  rank: PlacementRankName,
  server: ServerName,
): number {
  return round2(PLACEMENT_PRICE_AP[rank] * SERVER_MULTIPLIER[server] * matches);
}

function isValidEmail(val: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
}

// ─── SelectField ──────────────────────────────────────────────────────────────

interface SelectFieldProps<T extends string> {
  label: string;
  required?: boolean;
  value: T | null;
  options: readonly T[];
  placeholder?: string;
  onChange: (v: T) => void;
}

function SelectField<T extends string>({
  label,
  required,
  value,
  options,
  placeholder = "Select",
  onChange,
}: SelectFieldProps<T>) {
  const [open, setOpen] = useState(false);
  const isSelected = value !== null;
  const showGreen = open || isSelected;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="text-sm font-medium text-black/80">
        {label} {required && <span className="text-[#B842F0]">*</span>}
      </div>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          {/*
            KEY FIX: shadcn Button applies focus-visible:ring-* which renders as
            the pink/magenta ring after click. We override it completely here.
          */}
          <Button
            className={[
              "w-full cursor-pointer flex justify-between items-center text-sm font-medium transition-colors",

              // kill all default focus styles
              "outline-none! ring-0! shadow-none!",
              "focus:outline-none! focus:ring-0! focus:shadow-none!",
              "focus-visible:outline-none! focus-visible:ring-0! focus-visible:shadow-none!",

              // custom green focus
              "focus:border-[#B842F0] focus-visible:border-[#B842F0]",

              showGreen
                ? "bg-[#F9F2FD]/10 border border-[#B842F0] text-black hover:bg-[#F9F2FD]/15"
                : "bg-[#F9F2FD] border border-[#B842F0] text-black/50 hover:bg-[#F9F2FD]",
            ].join(" ")}
          >
            <span className={value ? "text-black" : "text-black/50"}>
              {value ?? placeholder}
            </span>
            <svg
              className={`w-4 h-4 opacity-60 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="bg-[white] border border-[#B842F0] z-50 max-h-64 overflow-y-auto"
          style={{ width: "var(--radix-dropdown-menu-trigger-width)" }}
        >
          {options.map((opt) => (
            <DropdownMenuItem
              key={opt}
              className={[
                "cursor-pointer text-sm transition-colors px-3 py-2",
                "outline-none focus:outline-none",
                value === opt
                  ? "text-[#B842F0] bg-[#B842F0]/10 focus:text-[#B842F0] focus:bg-[#B842F0]/10"
                  : "text-black/80 focus:text-[#B842F0] focus:bg-[#B842F0]/10",
              ].join(" ")}
              onSelect={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              {opt}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// ─── PriceSummary ─────────────────────────────────────────────────────────────

function PriceSummary({
  price,
  label,
}: {
  price: number | string;
  label: string;
}) {
  return (
    <div className="rounded-xl bg-[#F9F2FD] border border-[#B842F0]/20 p-4 flex items-start justify-between">
      <div>
        <p className="text-xs text-black/40 mb-1">Total Price</p>
        <p className="text-3xl font-extrabold text-[#B842F0]">
          {typeof price === "number" ? `$${price.toFixed(2)}` : price}
        </p>
        <p className="text-xs text-black/40 mt-1">{label}</p>
      </div>
      <div className="text-right text-xs text-black/40">
        <span className="text-base">🎉</span>
        <p className="font-semibold text-black/60">Grand Opening</p>
        <p>30% OFF — contact us</p>
      </div>
    </div>
  );
}

// ─── CustomerFields ───────────────────────────────────────────────────────────

interface CustomerFieldsProps {
  name: string;
  email: string;
  nameError: string;
  emailError: string;
  onNameChange: (v: string) => void;
  onEmailChange: (v: string) => void;
}

function CustomerFields({
  name,
  email,
  nameError,
  emailError,
  onNameChange,
  onEmailChange,
}: CustomerFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-black/80">
          Your Name <span className="text-[#B842F0]">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Full name"
          className={`bg-[#F9F2FD] border rounded-md px-3 py-2 text-sm text-black placeholder:text-black/30 focus:outline-none transition-colors
            ${nameError ? "border-red-500 focus:border-red-500" : "border-black/10 focus:border-[#B842F0]/60"}`}
        />
        {nameError && <p className="text-xs text-red-500">{nameError}</p>}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-black/80">
          Email <span className="text-[#B842F0]">*</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="you@example.com"
          className={`bg-[#F9F2FD] border rounded-md px-3 py-2 text-sm text-black placeholder:text-black/30 focus:outline-none transition-colors
            ${emailError ? "border-red-500 focus:border-red-500" : "border-black/10 focus:border-[#B842F0]/60"}`}
        />
        {emailError && <p className="text-xs text-red-500">{emailError}</p>}
      </div>
    </div>
  );
}

// ─── PayButton ────────────────────────────────────────────────────────────────

interface PayButtonProps {
  price: BoostPriceResult;
  loading: boolean;
  onPay: () => void;
  disabled?: boolean;
}

function PayButton({ loading, onPay }: PayButtonProps) {
  const disabled = loading;
  return (
    <button
      onClick={onPay}
      disabled={disabled}
      className={`w-full py-4 rounded-xl font-extrabold text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-2
        ${
          disabled
            ? "bg-[#B842F0]/30 text-white/40 cursor-not-allowed"
            : "bg-[#B842F0] text-white hover:brightness-110 active:scale-[0.98] cursor-pointer"
        }`}
    >
      {loading ? (
        <>
          <Loader2 size={16} className="animate-spin text-white/70" />
          <span>Creating invoice...</span>
        </>
      ) : (
        "CHECKOUT"
      )}
    </button>
  );
}

// ─── TermsLine ────────────────────────────────────────────────────────────────

function TermsLine() {
  return (
    <p className="text-center text-xs text-black/40">
      By making a payment, you agree to the{" "}
      <NavLink
        to="/service-policy"
        className="text-[#B842F0] hover:underline cursor-pointer"
      >
        Terms &amp; Policies.
      </NavLink>
    </p>
  );
}

// ─── ContactModal ─────────────────────────────────────────────────────────────

function ContactModal({ onClose }: { onClose: () => void }) {
  const contactLinks: { label: string; href: string }[] = [
    { label: "Discord", href: "https://discord.gg/9rWNTFA9y6" },
    { label: "WhatsApp", href: "https://wa.me/84775602756" },
    { label: "Telegram", href: "https://t.me/rosieboost" },
    {
      label: "Instagram",
      href: "https://www.instagram.com/rosieboostservice/",
    },
    { label: "Facebook", href: "https://www.facebook.com/rosieboostofficial/" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative bg-[white] border border-black/10 rounded-2xl p-8 w-full max-w-sm mx-4 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black/40 hover:text-black transition-colors"
        >
          <X size={18} />
        </button>
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-14 h-14 rounded-full border-2 border-[#B842F0] flex items-center justify-center">
            <CheckCircle className="text-[#B842F0]" size={32} />
          </div>
          <h2 className="text-2xl font-extrabold text-black">
            Order placed successfully!
          </h2>
          <p className="text-sm text-black/50">
            We have receiced your information. Your invoice will be shortly
            created and sent to your email. Please check your inbox (and Spam
            folder) to complete the payment.
          </p>
          <p className="text-sm text-black/60 font-medium">
            Contact us to get started right away:
          </p>
          <div className="grid grid-cols-2 gap-2 w-full">
            {contactLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="bg-[white] hover:bg-[#969696] border border-black/10 text-black/80 hover:text-black text-sm font-medium py-2 px-4 rounded-lg transition-colors text-center"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const tftGameObj = games.find((g) => g.name === "Teamfight Tactics");

function LOLBookingPage() {
  const [curServer, setCurServer] = useState<ServerName>("AP");

  // Rank Boosting
  const [currentRank, setCurrentRank] = useState<RankName | null>(null);
  const [desiredRank, setDesiredRank] = useState<RankName | null>(null);

  // Placement Matches
  const [placementMatches, setPlacementMatches] = useState<MatchCount | null>(
    null,
  );
  const [placementRank, setPlacementRank] = useState<PlacementRankName | null>(
    null,
  );

  // Form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");

  // UI
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // TABS
  const [activeTab, setActiveTab] = useState<
    "Rank Boosting" | "Placement Matches"
  >("Rank Boosting");

  // Derived prices
  const rankBoostPrice =
    currentRank && desiredRank
      ? calcRankBoostPrice(currentRank, desiredRank, curServer)
      : 0;

  const placementPrice =
    placementMatches && placementRank
      ? calcPlacementPrice(placementMatches, placementRank, curServer)
      : 0;

  const desiredRankOptions: RankName[] =
    currentRank !== null
      ? RANK_ORDER.filter(
          (r) => RANK_ORDER.indexOf(r) > RANK_ORDER.indexOf(currentRank!),
        )
      : [];

  function handleServerChange(s: ServerName) {
    setCurServer(s);
    setDesiredRank(null);
  }

  function handleCurrentRankChange(rank: RankName) {
    setCurrentRank(rank);
    setDesiredRank(null);
  }

  // Clear errors as user types
  function handleNameChange(v: string) {
    setName(v);
    if (nameError) setNameError("");
  }

  function handleEmailChange(v: string) {
    setEmail(v);
    if (emailError) setEmailError("");
  }

  function validate(): boolean {
    let valid = true;
    if (!name.trim()) {
      setNameError("Full name is required.");
      valid = false;
    }
    if (!email.trim()) {
      setEmailError("Email is required.");
      valid = false;
    } else if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    }
    return valid;
  }

  //PAYPAL COMMENTED TO FIX
  // async function handlePay() {
  //   if (!validate()) return;

  //   const isRankTab = activeTab === "Rank Boosting";
  //   const price = isRankTab ? rankBoostPrice : placementPrice;
  //   const label = isRankTab
  //     ? `LoL Rank Boost · ${curServer} · ${currentRank} → ${desiredRank}`
  //     : `LoL Placement · ${curServer} · ${placementMatches} match · ${placementRank}`;

  //   if (price <= 0) return;

  //   setLoading(true);
  //   try {
  //     const { data } = await axiosInstance.post("/paypal/create-invoice", {
  //       customerName: name,
  //       customerEmail: email,
  //       serviceLabel: label,
  //       amount: price,
  //     });

  //     console.log("Invoice created:", data);
  //     setShowSuccess(true);
  //     toast.success("Invoice created successfully");
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Failed to create invoice. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  async function handlePay() {
    if (!validate()) return;

    const isRankTab = activeTab === "Rank Boosting";
    const price = isRankTab ? rankBoostPrice : placementPrice;

    if (price === 0) return;

    setLoading(true);
    try {
      if (isRankTab) {
        await submitLOLRankBoost({
          customerName: name,
          customerEmail: email,
          totalPrice: price,
          server: curServer,
          currentRank: currentRank!,
          desiredRank: desiredRank!,
        });
      } else {
        await submitLOLPlacement({
          customerName: name,
          customerEmail: email,
          totalPrice: price as number,
          server: curServer,
          numberOfMatches: placementMatches!,
          previousSeasonRank: placementRank!,
        });
      }

      setShowSuccess(true);
      toast.success("Order submitted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit order. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const serverOptions = (gameServers as ServerInfo[]).map((s) => s.name);

  // Shared form section for each tab
  const formSection = (price: BoostPriceResult, label: string) => (
    <>
      <PriceSummary price={price} label={label} />
      <CustomerFields
        name={name}
        email={email}
        nameError={nameError}
        emailError={emailError}
        onNameChange={handleNameChange}
        onEmailChange={handleEmailChange}
      />
      <PayButton price={price} loading={loading} onPay={handlePay} />
      <TermsLine />
    </>
  );

  return (
    <div className="min-h-screen bg-[#FCFBFE] text-black">
      {/* HEADER */}
      <div className="bg-[#FCFBFE] w-full fixed top-0 left-0 right-0 z-99999 backdrop-blur-md">
        <div className="flex items-center justify-between h-21 border-y border-black/10 px-6 md:px-20">
          <NavLink to={"/"} className="flex items-center gap-3 cursor-pointer">
            <img src="/favicon.png" alt="" className="w-13 rounded-xl" />
            <div className="hidden items-center text-xl sm:flex">
              <span className="font-bold text-black">Rosie</span>
              <span className="font-bold text-[#B842F0]">Boost</span>
            </div>
          </NavLink>
          <NavLink
            to={"/"}
            className="flex gap-2 font-medium text-gray-500 hover:text-[#B842F0] cursor-pointer transition-colors"
          >
            <ArrowLeft />
            <span>Back To Home</span>
          </NavLink>
        </div>
      </div>
      {/* CONTENT */}
      <div className="pt-29 pb-20 mx-auto max-w-2xl px-4">
        {/* Game Info */}
        <div className="flex items-center gap-7 mb-10">
          <img
            className="w-28 md:w-35 rounded-xl shadow-[0_0_50px_rgba(240,96,138,0.25)] drop-shadow-[0_0_20px_rgba(240,96,138,0.6)]"
            src="/lol.png"
            alt="Lol"
          />
          <div className="flex flex-col gap-2">
            <h1 className="text-[#B842F0] text-xs tracking-widest uppercase font-semibold">
              Select Service
            </h1>
            <h2 className="text-5xl font-extrabold">League of Legends</h2>
            <p className="text-black/50 text-sm">Choose a service tab below.</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          defaultValue="Rank Boosting"
          onValueChange={(v) => setActiveTab(v as typeof activeTab)}
          className="w-full flex flex-col gap-5"
        >
          <TabsList className="bg-[#F8F7FA] w-full text-black">
            {tftGameObj?.services.map((item, index) => (
              <TabsTrigger
                key={index}
                className="cursor-pointer flex-1 text-black hover:text-black data-[state=active]:text-black"
                value={item}
              >
                {item}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ── Rank Boosting ── */}
          <TabsContent
            value="Rank Boosting"
            className="border border-[#B842F0]/30 rounded-xl w-full p-5 flex flex-col gap-5 bg-[#F8F7FA]"
          >
            <SelectField<ServerName>
              label="Server"
              required
              value={curServer}
              options={serverOptions as ServerName[]}
              onChange={handleServerChange}
            />
            <div className="grid grid-cols-2 gap-4">
              <SelectField<RankName>
                label="Current Rank"
                required
                value={currentRank}
                options={RANK_ORDER}
                placeholder="Select rank"
                onChange={handleCurrentRankChange}
              />
              <SelectField<RankName>
                label="Desired Rank"
                required
                value={desiredRank}
                options={desiredRankOptions}
                placeholder="Select rank"
                onChange={setDesiredRank}
              />
            </div>
            {formSection(
              rankBoostPrice,
              `Lol Rank Boost · ${curServer} · ${currentRank ?? "?"} → ${desiredRank ?? "?"}`,
            )}
          </TabsContent>

          {/* ── Placement Matches ── */}
          <TabsContent
            value="Placement Matches"
            className="border border-[#B842F0]/30 rounded-xl w-full p-5 flex flex-col gap-5 bg-[#F8F7FA]"
          >
            <SelectField<ServerName>
              label="Server"
              required
              value={curServer}
              options={serverOptions as ServerName[]}
              onChange={handleServerChange}
            />
            <div className="grid grid-cols-2 gap-4">
              <SelectField<string>
                label="Number of Matches"
                required
                value={
                  placementMatches !== null ? String(placementMatches) : null
                }
                options={MATCH_OPTIONS.map(String)}
                placeholder="Select"
                onChange={(v) => setPlacementMatches(Number(v) as MatchCount)}
              />
              <SelectField<PlacementRankName>
                label="Previous Season Rank"
                required
                value={placementRank}
                options={PLACEMENT_RANKS}
                placeholder="Select rank"
                onChange={setPlacementRank}
              />
            </div>
            {formSection(
              placementPrice,
              `Lol Placement · ${curServer} · ${placementMatches ?? 0} match · ${placementRank ?? "?"}`,
            )}
          </TabsContent>
        </Tabs>
      </div>
      {/* Success modal */}
      {showSuccess && <ContactModal onClose={() => setShowSuccess(false)} />}
    </div>
  );
}

export default LOLBookingPage;
