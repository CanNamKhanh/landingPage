import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  submitABIAccountLeveling,
  submitABIKoensFarming,
  submitABIRaidBoost,
  submitABITitaniumCase,
  type BookingResult,
} from "@/services/bookingService";
// import axiosInstance from "@/utils/axios";
import { ArrowLeft, CheckCircle, Loader2, X } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

type MapName =
  | "Farm"
  | "Valley"
  | "Amory"
  | "Northridge"
  | "TV Station"
  | "Airport";
type Difficulty = "Normal" | "Lockdown" | "Forbidden";

// ─── Pricing Data ─────────────────────────────────────────────────────────────

// Koens Farming: $1.8 per 1M Koens
const KOENS_OPTIONS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100] as const;
type KoensAmount = (typeof KOENS_OPTIONS)[number];
const KOENS_PRICE_PER_M = 1.8;

// Account Leveling: price per level (cumulative, level 1 = 0, 2-10 = 1.2 each, 11-20 = 1.8 each, 21-30 = 2.4 each)
const LEVEL_PRICE: Record<number, number> = {
  1: 0,
  2: 1.2,
  3: 1.2,
  4: 1.2,
  5: 1.2,
  6: 1.2,
  7: 1.2,
  8: 1.2,
  9: 1.2,
  10: 1.2,
  11: 1.8,
  12: 1.8,
  13: 1.8,
  14: 1.8,
  15: 1.8,
  16: 1.8,
  17: 1.8,
  18: 1.8,
  19: 1.8,
  20: 1.8,
  21: 2.4,
  22: 2.4,
  23: 2.4,
  24: 2.4,
  25: 2.4,
  26: 2.4,
  27: 2.4,
  28: 2.4,
  29: 2.4,
  30: 2.4,
};
const MAX_LEVEL = 30;

// Raid Boost price per run
// null = service not available for that combo
const RAID_PRICE: Record<MapName, Partial<Record<Difficulty, number>>> = {
  Farm: { Normal: 3, Lockdown: 3.5, Forbidden: undefined },
  Valley: { Normal: 3, Lockdown: 3.5, Forbidden: undefined },
  Amory: { Normal: undefined, Lockdown: 4, Forbidden: 5 },
  Northridge: { Normal: undefined, Lockdown: 4, Forbidden: 5 },
  "TV Station": { Normal: undefined, Lockdown: 4, Forbidden: 5 },
  Airport: { Normal: undefined, Lockdown: 4, Forbidden: 5 },
};

// Titanium Case: 60 missions = $100, so $100/60 per mission
const TITANIUM_TOTAL_MISSIONS = 60;
const TITANIUM_PRICE_PER_MISSION = 100 / 60; // ≈ $1.6667

// ─── Helpers ──────────────────────────────────────────────────────────────────

function round2(n: number): number {
  return parseFloat(n.toFixed(2));
}

function calcLevelingPrice(from: number, to: number): number {
  if (to <= from) return 0;
  let total = 0;
  for (let i = from + 1; i <= to; i++) {
    total += LEVEL_PRICE[i] ?? 0;
  }
  return round2(total);
}

function isValidEmail(val: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
}

// ─── Shared: PriceSummary ─────────────────────────────────────────────────────

function PriceSummary({ price, label }: { price: number; label: string }) {
  return (
    <div className="rounded-xl bg-[#0d1a0d] border border-[#00FF00]/20 p-4 flex items-start justify-between">
      <div>
        <p className="text-xs text-white/40 mb-1">Total Price</p>
        <p className="text-3xl font-extrabold text-[#00FF00]">
          ${price.toFixed(2)}
        </p>
        {price > 0 && <p className="text-xs text-white/40 mt-1">{label}</p>}
      </div>
      <div className="text-right text-xs text-white/40">
        <span className="text-base">🎉</span>
        <p className="font-semibold text-white/60">Grand Opening</p>
        <p>30% OFF — contact us</p>
      </div>
    </div>
  );
}

// ─── Shared: CustomerFields ───────────────────────────────────────────────────

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
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-white/80">
          Your Name <span className="text-[#00FF00]">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Full name"
          className={`bg-[#25272D] border rounded-md px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none transition-colors
            ${nameError ? "border-red-500" : "border-white/10 focus:border-[#00FF00]/60"}`}
        />
        {nameError && <p className="text-xs text-red-500">{nameError}</p>}
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-white/80">
          Email <span className="text-[#00FF00]">*</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="you@example.com"
          className={`bg-[#25272D] border rounded-md px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none transition-colors
            ${emailError ? "border-red-500" : "border-white/10 focus:border-[#00FF00]/60"}`}
        />
        {emailError && <p className="text-xs text-red-500">{emailError}</p>}
      </div>
    </div>
  );
}

// ─── Shared: CheckoutButton ───────────────────────────────────────────────────

function CheckoutButton({
  price,
  loading,
  onPay,
}: {
  price: number;
  loading: boolean;
  onPay: () => void;
}) {
  const disabled = loading || price <= 0;
  return (
    <button
      onClick={onPay}
      disabled={disabled}
      className={`w-full py-4 rounded-xl font-extrabold text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-2
        ${disabled ? "bg-[#00FF00]/30 text-black/40 cursor-not-allowed" : "bg-[#00FF00] text-black hover:brightness-110 active:scale-[0.98] cursor-pointer"}`}
    >
      {loading ? (
        <>
          <Loader2 size={16} className="animate-spin text-black/70" />
          <span>Creating invoice...</span>
        </>
      ) : (
        "CHECKOUT"
      )}
    </button>
  );
}

// ─── Shared: TermsLine ────────────────────────────────────────────────────────

function TermsLine() {
  return (
    <p className="text-center text-xs text-white/40">
      By proceeding, you agree to our{" "}
      <NavLink
        to="/service-policy"
        className="text-[#00FF00] hover:underline cursor-pointer"
      >
        Terms &amp; Policy.
      </NavLink>
    </p>
  );
}

// ─── Shared: SelectDropdown ───────────────────────────────────────────────────

interface SelectDropdownProps<T extends string | number> {
  label: string;
  required?: boolean;
  value: T | null;
  options: readonly T[];
  placeholder?: string;
  onChange: (v: T) => void;
  formatOption?: (v: T) => string;
}

function SelectDropdown<T extends string | number>({
  label,
  required,
  value,
  options,
  placeholder = "Select",
  onChange,
  formatOption,
}: SelectDropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const showGreen = open || value !== null;
  const display =
    value !== null
      ? formatOption
        ? formatOption(value)
        : String(value)
      : null;

  return (
    <div className="flex flex-col gap-1.5 relative">
      <div className="text-sm font-medium text-white/80">
        {label} {required && <span className="text-[#00FF00]">*</span>}
      </div>
      <button
        onClick={() => setOpen((o) => !o)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className={`w-full cursor-pointer flex justify-between items-center px-3 py-2 rounded-md text-sm font-medium transition-colors outline-none
          ${
            showGreen
              ? "bg-[#00FF00]/10 border border-[#00FF00] text-white"
              : "bg-[#25272D] border border-white/10 text-white/50"
          }`}
      >
        <span className={value !== null ? "text-white" : "text-white/50"}>
          {display ?? placeholder}
        </span>
        <svg
          className={`w-4 h-4 opacity-60 transition-transform ${open ? "rotate-180" : ""}`}
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
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1c22] border border-[#333] rounded-md z-50 max-h-56 overflow-y-auto">
          {options.map((opt) => {
            const label2 = formatOption ? formatOption(opt) : String(opt);
            return (
              <div
                key={String(opt)}
                onMouseDown={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={`px-3 py-2 text-sm cursor-pointer transition-colors
                  ${value === opt ? "text-[#00FF00] bg-[#00FF00]/10" : "text-white/80 hover:text-[#00FF00] hover:bg-[#00FF00]/10"}`}
              >
                {label2}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Shared: ContactModal ─────────────────────────────────────────────────────

function ContactModal({ onClose }: { onClose: () => void }) {
  const links = [
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
      <div className="relative bg-[#14161c] border border-white/10 rounded-2xl p-8 w-full max-w-sm mx-4 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-14 h-14 rounded-full border-2 border-[#00FF00] flex items-center justify-center">
            <CheckCircle className="text-[#00FF00]" size={32} />
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            Order placed successfully!
          </h2>
          <p className="text-sm text-white/50">
            We have receiced your information. Your invoice will be shortly
            created and sent to your email. Please check your inbox (and Spam
            folder) to complete the payment.
          </p>
          <p className="text-sm text-white/60 font-medium">
            Contact us to get started right away:
          </p>
          <div className="grid grid-cols-2 gap-2 w-full">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="bg-[#25272D] hover:bg-[#2f3137] border border-white/10 text-white/80 hover:text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors text-center"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── useBookingForm hook ──────────────────────────────────────────────────────

function useBookingForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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

  //PAYPAL COMMENT TO FIX
  // async function handlePay(price: number, label: string) {
  //   if (!validate()) return;
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
  async function handlePay(
    price: number,
    submitFn: () => Promise<BookingResult>,
  ) {
    if (!validate()) return;
    if (price <= 0) return;

    setLoading(true);
    try {
      await submitFn();
      setShowSuccess(true);
      toast.success("Order submitted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit order. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return {
    name,
    email,
    nameError,
    emailError,
    loading,
    showSuccess,
    handleNameChange,
    handleEmailChange,
    handlePay,
    setShowSuccess,
  };
}

// ─── Tab: Koens Farming ───────────────────────────────────────────────────────

function KoensFarmingTab() {
  const [amount, setAmount] = useState<KoensAmount | null>(null);
  const {
    name,
    email,
    nameError,
    emailError,
    loading,
    showSuccess,
    handleNameChange,
    handleEmailChange,
    handlePay,
    setShowSuccess,
  } = useBookingForm();

  const price = amount !== null ? round2(amount * KOENS_PRICE_PER_M) : 0;

  return (
    <>
      <SelectDropdown<KoensAmount>
        label="Amount of Koens"
        required
        value={amount}
        options={KOENS_OPTIONS}
        placeholder="Select quantity"
        formatOption={(v) => `${v}M Koens`}
        onChange={setAmount}
      />
      <PriceSummary
        price={price}
        label={`ABI Koens Farming · ${amount ?? "?"}M Koens`}
      />
      <CustomerFields
        name={name}
        email={email}
        nameError={nameError}
        emailError={emailError}
        onNameChange={handleNameChange}
        onEmailChange={handleEmailChange}
      />
      <CheckoutButton
        price={price}
        loading={loading}
        // onPay={() =>
        //   handlePay(price, `ABI Koens Farming · ${amount ?? "?"}M Koens`)
        // }
        onPay={() =>
          handlePay(price, () =>
            submitABIKoensFarming({
              customerName: name,
              customerEmail: email,
              totalPrice: price,
              amountM: amount!,
            }),
          )
        }
      />
      <TermsLine />
      {showSuccess && <ContactModal onClose={() => setShowSuccess(false)} />}
    </>
  );
}

// ─── Tab: Account Leveling ────────────────────────────────────────────────────

function AccountLevelingTab() {
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [targetLevel, setTargetLevel] = useState<number | null>(null);
  const {
    name,
    email,
    nameError,
    emailError,
    loading,
    showSuccess,
    handleNameChange,
    handleEmailChange,
    handlePay,
    setShowSuccess,
  } = useBookingForm();

  const targetOptions = Array.from(
    { length: MAX_LEVEL - currentLevel },
    (_, i) => currentLevel + i + 1,
  );
  const price =
    targetLevel !== null ? calcLevelingPrice(currentLevel, targetLevel) : 0;

  function handleCurrentChange(v: number) {
    setCurrentLevel(v);
    setTargetLevel(null);
  }

  const allLevels = Array.from({ length: MAX_LEVEL }, (_, i) => i + 1);

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-white/80">
            Current Level <span className="text-[#00FF00]">*</span>
          </label>
          <SelectDropdown<number>
            label=""
            value={currentLevel}
            options={allLevels.slice(0, MAX_LEVEL - 1)}
            onChange={handleCurrentChange}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-white/80">
            Target Level <span className="text-[#00FF00]">*</span>
          </label>
          <SelectDropdown<number>
            label=""
            value={targetLevel}
            options={targetOptions}
            placeholder={`up to ${MAX_LEVEL}`}
            formatOption={(v) => `up to ${v}`}
            onChange={setTargetLevel}
          />
        </div>
      </div>
      <PriceSummary
        price={price}
        label={`ABI Account Leveling · Lv ${currentLevel} → Lv ${targetLevel ?? "?"}`}
      />
      <CustomerFields
        name={name}
        email={email}
        nameError={nameError}
        emailError={emailError}
        onNameChange={handleNameChange}
        onEmailChange={handleEmailChange}
      />
      <CheckoutButton
        price={price}
        loading={loading}
        // onPay={() =>
        //   handlePay(
        //     price,
        //     `ABI Account Leveling · Lv ${currentLevel} → Lv ${targetLevel ?? "?"}`,
        //   )
        // }
        onPay={() =>
          handlePay(price, () =>
            submitABIAccountLeveling({
              customerName: name,
              customerEmail: email,
              totalPrice: price,
              currentLevel,
              targetLevel: targetLevel!,
            }),
          )
        }
      />
      <TermsLine />
      {showSuccess && <ContactModal onClose={() => setShowSuccess(false)} />}
    </>
  );
}

// ─── Tab: Raid Boost ──────────────────────────────────────────────────────────

const ALL_MAPS: MapName[] = [
  "Farm",
  "Valley",
  "Amory",
  "Northridge",
  "TV Station",
  "Airport",
];
const ALL_DIFFICULTIES: Difficulty[] = ["Normal", "Lockdown", "Forbidden"];

function RaidBoostTab() {
  const [selectedMap, setSelectedMap] = useState<MapName | null>(null);
  const [selectedDiff, setSelectedDiff] = useState<Difficulty | null>(null);
  const [runs, setRuns] = useState<string>("");
  const {
    name,
    email,
    nameError,
    emailError,
    loading,
    showSuccess,
    handleNameChange,
    handleEmailChange,
    handlePay,
    setShowSuccess,
  } = useBookingForm();

  function handleMapChange(m: MapName) {
    setSelectedMap(m);
    setSelectedDiff(null);
  }

  const runsNum = parseInt(runs, 10);
  const pricePerRun =
    selectedMap && selectedDiff
      ? (RAID_PRICE[selectedMap][selectedDiff] ?? 0)
      : 0;
  const price =
    pricePerRun > 0 && !isNaN(runsNum) && runsNum > 0
      ? round2(pricePerRun * runsNum)
      : 0;

  return (
    <>
      {/* Map selector */}
      <div className="flex flex-col gap-1.5">
        <div className="text-sm font-medium text-white/80">
          Map <span className="text-[#00FF00]">*</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {ALL_MAPS.map((map) => (
            <button
              key={map}
              onClick={() => handleMapChange(map)}
              className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all cursor-pointer
                ${
                  selectedMap === map
                    ? "bg-[#00FF00]/15 border-[#00FF00] text-[#00FF00]"
                    : "bg-[#25272D] border-white/10 text-white/70 hover:border-white/30 hover:text-white"
                }`}
            >
              {map}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty selector */}
      <div className="flex flex-col gap-1.5">
        <div className="text-sm font-medium text-white/80">
          Difficulty <span className="text-[#00FF00]">*</span>
        </div>
        <div className="flex gap-2">
          {ALL_DIFFICULTIES.map((diff) => {
            const available = selectedMap
              ? RAID_PRICE[selectedMap][diff] !== undefined
              : true;
            const isSelected = selectedDiff === diff;
            return (
              <button
                key={diff}
                disabled={!available}
                onClick={() => available && setSelectedDiff(diff)}
                className={`py-2 px-4 rounded-lg border text-sm font-medium transition-all
                  ${
                    !available
                      ? "bg-[#1a1a1a] border-white/5 text-white/20 cursor-not-allowed"
                      : isSelected
                        ? "bg-[#00FF00]/15 border-[#00FF00] text-[#00FF00] cursor-pointer"
                        : "bg-[#25272D] border-white/10 text-white/70 hover:border-white/30 hover:text-white cursor-pointer"
                  }`}
              >
                {diff}
              </button>
            );
          })}
        </div>
      </div>

      {/* Runs input */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-white/80">
          Quantity (runs) <span className="text-[#00FF00]">*</span>
        </label>
        <input
          type="number"
          min={1}
          value={runs}
          onChange={(e) => setRuns(e.target.value)}
          placeholder="Enter number of runs"
          className="bg-[#25272D] border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#00FF00]/60 transition-colors"
        />
      </div>

      <PriceSummary
        price={price}
        label={`ABI Raid Boost · ${selectedMap ?? "?"} · ${selectedDiff ?? "?"} · ${runsNum > 0 ? runsNum : "?"} runs`}
      />
      <CustomerFields
        name={name}
        email={email}
        nameError={nameError}
        emailError={emailError}
        onNameChange={handleNameChange}
        onEmailChange={handleEmailChange}
      />
      <CheckoutButton
        price={price}
        loading={loading}
        // onPay={() =>
        //   handlePay(
        //     price,
        //     `ABI Raid Boost · ${selectedMap ?? "?"} · ${selectedDiff ?? "?"} · ${runsNum > 0 ? runsNum : "?"} runs`,
        //   )
        // }
        onPay={() =>
          handlePay(price, () =>
            submitABIRaidBoost({
              customerName: name,
              customerEmail: email,
              totalPrice: price,
              map: selectedMap!,
              difficulty: selectedDiff!,
              runs: runsNum,
            }),
          )
        }
      />
      <TermsLine />
      {showSuccess && <ContactModal onClose={() => setShowSuccess(false)} />}
    </>
  );
}

// ─── Tab: Titanium Case ───────────────────────────────────────────────────────

function TitaniumCaseTab() {
  const [missions, setMissions] = useState<number>(TITANIUM_TOTAL_MISSIONS);
  const {
    name,
    email,
    nameError,
    emailError,
    loading,
    showSuccess,
    handleNameChange,
    handleEmailChange,
    handlePay,
    setShowSuccess,
  } = useBookingForm();

  const price = round2(missions * TITANIUM_PRICE_PER_MISSION);
  const pct = (missions / TITANIUM_TOTAL_MISSIONS) * 100;

  return (
    <>
      {/* Range slider */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-white/80">
            Missions to complete <span className="text-[#00FF00]">*</span>
          </span>
          <span className="text-sm font-bold text-[#00FF00]">
            {missions} / {TITANIUM_TOTAL_MISSIONS}
          </span>
        </div>
        <div className="relative">
          <input
            type="range"
            min={1}
            max={TITANIUM_TOTAL_MISSIONS}
            value={missions}
            onChange={(e) => setMissions(Number(e.target.value))}
            style={{
              background: `linear-gradient(to right, #00FF00 ${pct}%, #25272D ${pct}%)`,
            }}
            className="w-full h-2 rounded-full appearance-none cursor-pointer outline-none
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#00FF00]
              [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#0b0614]
              [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(0,255,0,0.6)]
              [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-[#00FF00] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#0b0614]
              [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none"
          />
        </div>
        <div className="flex justify-between text-xs text-white/40">
          <span>1 mission</span>
          <span>Full set ({TITANIUM_TOTAL_MISSIONS})</span>
        </div>
      </div>

      <PriceSummary
        price={price}
        label={`ABI Titanium Case · ${missions}/${TITANIUM_TOTAL_MISSIONS} missions`}
      />
      <CustomerFields
        name={name}
        email={email}
        nameError={nameError}
        emailError={emailError}
        onNameChange={handleNameChange}
        onEmailChange={handleEmailChange}
      />
      <CheckoutButton
        price={price}
        loading={loading}
        // onPay={() =>
        //   handlePay(
        //     price,
        //     `ABI Titanium Case · ${missions}/${TITANIUM_TOTAL_MISSIONS} missions`,
        //   )
        // }
        onPay={() =>
          handlePay(price, () =>
            submitABITitaniumCase({
              customerName: name,
              customerEmail: email,
              totalPrice: price,
              missions,
              totalMissions: TITANIUM_TOTAL_MISSIONS,
            }),
          )
        }
      />
      <TermsLine />
      {showSuccess && <ContactModal onClose={() => setShowSuccess(false)} />}
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const SERVICES = [
  "Koens Farming",
  "Account Leveling",
  "Raid Boost",
  "Titanium Case",
] as const;

function ArenaBreakoutBookingPage() {
  return (
    <div className="min-h-screen bg-[#0b0614] text-white">
      {/* HEADER */}
      <div className="bg-[#09071631] w-full fixed top-0 left-0 right-0 z-99999 backdrop-blur-md">
        <div className="flex items-center justify-between h-21 border-y border-gray-800 px-6 md:px-20">
          <NavLink to={"/"} className="flex items-center gap-3 cursor-pointer">
            <img src="/favicon.png" alt="" className="w-13 rounded-xl" />
            <div className="hidden items-center text-xl sm:flex">
              <span className="font-bold text-white">Rosie</span>
              <span className="font-bold text-[#00FF00]">Boost</span>
            </div>
          </NavLink>
          <NavLink
            to={"/"}
            className="flex gap-2 font-medium text-gray-500 hover:text-[#00FF00] cursor-pointer transition-colors"
          >
            <ArrowLeft />
            <span>Back To Home</span>
          </NavLink>
        </div>
      </div>

      {/* CONTENT */}
      <div className="pt-32 pb-20 mx-auto max-w-2xl px-4">
        {/* Game Info */}
        <div className="flex items-center gap-7 mb-10">
          <img
            className="w-28 md:w-35 rounded-xl shadow-[0_0_50px_rgba(0,255,120,0.25)] drop-shadow-[0_0_20px_rgba(0,255,120,0.6)]"
            src="/arena-breakout.png"
            alt="Arena Breakout: Infinite"
          />
          <div className="flex flex-col gap-2">
            <h1 className="text-[#00FF00] text-xs tracking-widest uppercase font-semibold">
              Select Service
            </h1>
            <h2 className="text-5xl font-extrabold leading-tight">
              Arena Breakout:
              <br />
              Infinite
            </h2>
            <p className="text-white/50 text-sm">Choose a service tab below.</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          defaultValue="Koens Farming"
          className="w-full flex flex-col gap-5"
        >
          <TabsList className="bg-[#191B1F] w-full">
            {SERVICES.map((s) => (
              <TabsTrigger
                key={s}
                value={s}
                className="cursor-pointer flex-1 text-xs md:text-sm"
              >
                {s}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent
            value="Koens Farming"
            className="border border-[#00FF00]/30 rounded-xl w-full p-5 flex flex-col gap-5 bg-[#0f1117]"
          >
            <KoensFarmingTab />
          </TabsContent>

          <TabsContent
            value="Account Leveling"
            className="border border-[#00FF00]/30 rounded-xl w-full p-5 flex flex-col gap-5 bg-[#0f1117]"
          >
            <AccountLevelingTab />
          </TabsContent>

          <TabsContent
            value="Raid Boost"
            className="border border-[#00FF00]/30 rounded-xl w-full p-5 flex flex-col gap-5 bg-[#0f1117]"
          >
            <RaidBoostTab />
          </TabsContent>

          <TabsContent
            value="Titanium Case"
            className="border border-[#00FF00]/30 rounded-xl w-full p-5 flex flex-col gap-5 bg-[#0f1117]"
          >
            <TitaniumCaseTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default ArenaBreakoutBookingPage;
