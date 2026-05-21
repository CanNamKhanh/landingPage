import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axiosInstance from "@/utils/axios";
import { ArrowLeft, CheckCircle, Loader2, X } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { toast } from "sonner";

// ─── Pricing Data ─────────────────────────────────────────────────────────────

// Tekniq Alloy: $4 per 1M
const TEKNIQ_OPTIONS = [1, 2, 3, 4, 5, 10, 20, 50, 100] as const;
type TekniqqAmount = (typeof TEKNIQ_OPTIONS)[number];
const TEKNIQ_PRICE_PER_M = 4;

// Account Leveling: flat price per range
type LevelRange =
  | "Level 1-10"
  | "Level 10-20"
  | "Level 20-30"
  | "Level 30-40"
  | "Level 40-50"
  | "Level 50-60";
const LEVEL_RANGE_PRICE: Record<LevelRange, number> = {
  "Level 1-10": 4,
  "Level 10-20": 8,
  "Level 20-30": 12,
  "Level 30-40": 25,
  "Level 40-50": 40,
  "Level 50-60": 60,
};
const ALL_LEVEL_RANGES: LevelRange[] = [
  "Level 1-10",
  "Level 10-20",
  "Level 20-30",
  "Level 30-40",
  "Level 40-50",
  "Level 50-60",
];

// Hazard Operation
type HazardMap =
  | "Zero Dam"
  | "Layali Grove"
  | "Brakkesh"
  | "Space City"
  | "Tide Prison";
type HazardDifficulty = "Easy" | "Normal" | "Hard";

const HAZARD_PRICE: Record<
  HazardMap,
  Partial<Record<HazardDifficulty, number>>
> = {
  "Zero Dam": { Easy: 6.5, Normal: 7, Hard: undefined },
  "Layali Grove": { Easy: 6.5, Normal: 7, Hard: undefined },
  Brakkesh: { Easy: undefined, Normal: 11, Hard: 12 },
  "Space City": { Easy: undefined, Normal: 12, Hard: 15 },
  "Tide Prison": { Easy: undefined, Normal: 15, Hard: 20 },
};
const ALL_HAZARD_MAPS: HazardMap[] = [
  "Zero Dam",
  "Layali Grove",
  "Brakkesh",
  "Space City",
  "Tide Prison",
];
const ALL_HAZARD_DIFFICULTIES: HazardDifficulty[] = ["Easy", "Normal", "Hard"];

// Season Mission: flat $200
const SEASON_MISSION_PRICE = 200;

// Rank Boosting — price per division step (from that rank upward)
// Bronze 3 = 0 (start), then each step costs the listed price
const DF_RANK_ORDER = [
  "Bronze 3",
  "Bronze 2",
  "Bronze 1",
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
  "Diamond 5",
  "Diamond 4",
  "Diamond 3",
  "Diamond 2",
  "Diamond 1",
  "Black Hawk 5",
  "Black Hawk 4",
  "Black Hawk 3",
  "Black Hawk 2",
  "Black Hawk 1",
  "DF Pinnacle",
] as const;
type DFRankName = (typeof DF_RANK_ORDER)[number];

// Price to go FROM each rank to next
const DF_RANK_STEP_PRICE: Record<DFRankName, number> = {
  "Bronze 3": 0,
  "Bronze 2": 5,
  "Bronze 1": 5,
  "Silver 3": 7,
  "Silver 2": 7,
  "Silver 1": 7,
  "Gold 4": 10,
  "Gold 3": 10,
  "Gold 2": 10,
  "Gold 1": 10,
  "Platinum 4": 15,
  "Platinum 3": 15,
  "Platinum 2": 15,
  "Platinum 1": 15,
  "Diamond 5": 20,
  "Diamond 4": 20,
  "Diamond 3": 20,
  "Diamond 2": 20,
  "Diamond 1": 20,
  "Black Hawk 5": 30,
  "Black Hawk 4": 30,
  "Black Hawk 3": 30,
  "Black Hawk 2": 30,
  "Black Hawk 1": 30,
  "DF Pinnacle": 30,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function round2(n: number): number {
  return parseFloat(n.toFixed(2));
}

function calcDFRankPrice(from: DFRankName, to: DFRankName): number {
  const fi = DF_RANK_ORDER.indexOf(from);
  const ti = DF_RANK_ORDER.indexOf(to);
  if (fi < 0 || ti <= fi) return 0;
  let sum = 0;
  for (let i = fi + 1; i <= ti; i++)
    sum += DF_RANK_STEP_PRICE[DF_RANK_ORDER[i]];
  return round2(sum);
}

function isValidEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

// ─── Shared UI Components ─────────────────────────────────────────────────────

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

// Dropdown with cursor-pointer on trigger
interface SelectDropdownProps<T extends string | number> {
  label: string;
  required?: boolean;
  value: T | null;
  options: readonly T[];
  placeholder?: string;
  onChange: (v: T) => void;
  formatOption?: (v: T) => string;
  disabled?: boolean;
}
function SelectDropdown<T extends string | number>({
  label,
  required,
  value,
  options,
  placeholder = "Select",
  onChange,
  formatOption,
  disabled = false,
}: SelectDropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const showGreen = !disabled && (open || value !== null);
  const display =
    value !== null
      ? formatOption
        ? formatOption(value)
        : String(value)
      : null;

  return (
    <div className="flex flex-col gap-1.5 relative">
      {label && (
        <div className="text-sm font-medium text-white/80">
          {label} {required && <span className="text-[#00FF00]">*</span>}
        </div>
      )}
      <button
        onClick={() => !disabled && setOpen((o) => !o)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className={`w-full flex justify-between items-center px-3 py-2 rounded-md text-sm font-medium transition-colors outline-none
          ${
            disabled
              ? "bg-[#1e1e1e] border border-white/5 text-white/20 cursor-not-allowed"
              : showGreen
                ? "bg-[#00FF00]/10 border border-[#00FF00] text-white cursor-pointer"
                : "bg-[#25272D] border border-white/10 text-white/50 cursor-pointer hover:border-white/30"
          }`}
      >
        <span
          className={
            value !== null && !disabled
              ? "text-white"
              : disabled
                ? "text-white/20"
                : "text-white/50"
          }
        >
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
      {open && !disabled && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1c22] border border-[#333] rounded-md z-50 max-h-56 overflow-y-auto">
          {options.map((opt) => {
            const lbl = formatOption ? formatOption(opt) : String(opt);
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
                {lbl}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ContactModal({ onClose }: { onClose: () => void }) {
  const links = [
    { label: "Discord", href: "#" },
    { label: "WhatsApp", href: "#" },
    { label: "Telegram", href: "#" },
    { label: "Instagram", href: "#" },
    { label: "Facebook", href: "#" },
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
            An invoice has been created and sent to your email. Please check
            your inbox (including Spam) and complete the payment via PayPal.
          </p>
          <p className="text-sm text-white/60 font-medium">
            Contact our booster to get started:
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

// ─── useBookingForm ───────────────────────────────────────────────────────────

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

  // ← nhận price và label từ mỗi tab
  async function handlePay(price: number, label: string) {
    if (!validate()) return;
    if (price <= 0) return;

    setLoading(true);
    try {
      const { data } = await axiosInstance.post("/paypal/create-invoice", {
        customerName: name,
        customerEmail: email,
        serviceLabel: label,
        amount: price,
      });
      console.log("Invoice created:", data);
      setShowSuccess(true);
      toast.success("Invoice created successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create invoice. Please try again.");
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

// ─── Tab: Tekniq Alloy Farming ────────────────────────────────────────────────

function TekniqqAlloyyFarmingTab() {
  const [amount, setAmount] = useState<TekniqqAmount | null>(null);
  const form = useBookingForm();
  const price = amount !== null ? round2(amount * TEKNIQ_PRICE_PER_M) : 0;

  return (
    <>
      <SelectDropdown<TekniqqAmount>
        label="Amount of Tekniq Alloy"
        required
        value={amount}
        options={TEKNIQ_OPTIONS}
        placeholder="Select quantity"
        formatOption={(v) => `${v}M Tekniq Alloy`}
        onChange={setAmount}
      />
      <PriceSummary
        price={price}
        label={`Delta Force Tekniq Alloy · ${amount ?? "?"}M`}
      />
      <CustomerFields
        name={form.name}
        email={form.email}
        nameError={form.nameError}
        emailError={form.emailError}
        onNameChange={form.handleNameChange}
        onEmailChange={form.handleEmailChange}
      />
      <CheckoutButton
        price={price}
        loading={form.loading}
        onPay={() =>
          form.handlePay(price, `Delta Force Tekniq Alloy · ${amount ?? "?"}M`)
        }
      />
      <TermsLine />
      {form.showSuccess && (
        <ContactModal onClose={() => form.setShowSuccess(false)} />
      )}
    </>
  );
}

// ─── Tab: Account Leveling ────────────────────────────────────────────────────

function DFAccountLevelingTab() {
  const [selected, setSelected] = useState<Set<LevelRange>>(new Set());
  const form = useBookingForm();

  function toggleRange(range: LevelRange) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(range)) next.delete(range);
      else next.add(range);
      return next;
    });
  }

  const price = Array.from(selected).reduce(
    (sum, r) => sum + LEVEL_RANGE_PRICE[r],
    0,
  );
  const selectedLabel =
    ALL_LEVEL_RANGES.filter((r) => selected.has(r)).join(", ") || "?";

  return (
    <>
      <div className="flex flex-col gap-1.5">
        <div className="text-sm font-medium text-white/80">
          Select level ranges <span className="text-[#00FF00]">*</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {ALL_LEVEL_RANGES.map((range) => (
            <button
              key={range}
              onClick={() => toggleRange(range)}
              className={`py-2.5 px-3 rounded-lg border text-sm font-semibold transition-all cursor-pointer
                ${
                  selected.has(range)
                    ? "bg-[#00FF00]/15 border-[#00FF00] text-[#00FF00]"
                    : "bg-[#25272D] border-white/10 text-white/70 hover:border-white/30 hover:text-white"
                }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
      <PriceSummary
        price={price}
        label={`Delta Force Account Leveling · ${selectedLabel}`}
      />
      <CustomerFields
        name={form.name}
        email={form.email}
        nameError={form.nameError}
        emailError={form.emailError}
        onNameChange={form.handleNameChange}
        onEmailChange={form.handleEmailChange}
      />
      <CheckoutButton
        price={price}
        loading={form.loading}
        onPay={() =>
          form.handlePay(
            price,
            `Delta Force Account Leveling · ${selectedLabel}`,
          )
        }
      />
      <TermsLine />
      {form.showSuccess && (
        <ContactModal onClose={() => form.setShowSuccess(false)} />
      )}
    </>
  );
}

// ─── Tab: Hazard Operation ────────────────────────────────────────────────────

function HazardOperationTab() {
  const [selectedMap, setSelectedMap] = useState<HazardMap | null>(null);
  const [selectedDiff, setSelectedDiff] = useState<HazardDifficulty | null>(
    null,
  );
  const [runs, setRuns] = useState("");
  const form = useBookingForm();

  function handleMapChange(m: HazardMap) {
    setSelectedMap(m);
    setSelectedDiff(null);
  }

  const runsNum = parseInt(runs, 10);
  const pricePerRun =
    selectedMap && selectedDiff
      ? (HAZARD_PRICE[selectedMap][selectedDiff] ?? 0)
      : 0;
  const price =
    pricePerRun > 0 && !isNaN(runsNum) && runsNum > 0
      ? round2(pricePerRun * runsNum)
      : 0;

  return (
    <>
      {/* Map */}
      <div className="flex flex-col gap-1.5">
        <div className="text-sm font-medium text-white/80">
          Map <span className="text-[#00FF00]">*</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {ALL_HAZARD_MAPS.map((map) => (
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

      {/* Difficulty */}
      <div className="flex flex-col gap-1.5">
        <div className="text-sm font-medium text-white/80">
          Difficulty <span className="text-[#00FF00]">*</span>
        </div>
        <div className="flex gap-2">
          {ALL_HAZARD_DIFFICULTIES.map((diff) => {
            const available = selectedMap
              ? HAZARD_PRICE[selectedMap][diff] !== undefined
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

      {/* Runs */}
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
        label={`Delta Force Hazard Op · ${selectedMap ?? "?"} · ${selectedDiff ?? "?"} · ${runsNum > 0 ? runsNum : "?"} runs`}
      />
      <CustomerFields
        name={form.name}
        email={form.email}
        nameError={form.nameError}
        emailError={form.emailError}
        onNameChange={form.handleNameChange}
        onEmailChange={form.handleEmailChange}
      />
      <CheckoutButton
        price={price}
        loading={form.loading}
        onPay={() =>
          form.handlePay(
            price,
            `Delta Force Hazard Op · ${selectedMap ?? "?"} · ${selectedDiff ?? "?"} · ${runsNum > 0 ? runsNum : "?"} runs`,
          )
        }
      />
      <TermsLine />
      {form.showSuccess && (
        <ContactModal onClose={() => form.setShowSuccess(false)} />
      )}
    </>
  );
}

// ─── Tab: Season Mission ──────────────────────────────────────────────────────

function SeasonMissionTab() {
  const form = useBookingForm();

  return (
    <>
      {/* Info card */}
      <div className="rounded-xl bg-[#25272D] border border-white/10 p-4">
        <p className="text-base font-bold text-white">
          Safebox — Full Completion
        </p>
        <p className="text-sm text-white/50 mt-1">
          All season missions completed to unlock the Safebox reward. Flat
          price.
        </p>
      </div>

      <PriceSummary
        price={SEASON_MISSION_PRICE}
        label="Delta Force Season Mission — Safebox (Full)"
      />
      <CustomerFields
        name={form.name}
        email={form.email}
        nameError={form.nameError}
        emailError={form.emailError}
        onNameChange={form.handleNameChange}
        onEmailChange={form.handleEmailChange}
      />
      <CheckoutButton
        price={SEASON_MISSION_PRICE}
        loading={form.loading}
        onPay={() =>
          form.handlePay(
            SEASON_MISSION_PRICE,
            "Delta Force Season Mission — Safebox (Full)",
          )
        }
      />
      <TermsLine />
      {form.showSuccess && (
        <ContactModal onClose={() => form.setShowSuccess(false)} />
      )}
    </>
  );
}

// ─── Tab: Rank Boosting ───────────────────────────────────────────────────────

function DFRankBoostingTab() {
  const [currentRank, setCurrentRank] = useState<DFRankName | null>(null);
  const [desiredRank, setDesiredRank] = useState<DFRankName | null>(null);
  const form = useBookingForm();

  const desiredOptions: DFRankName[] =
    currentRank !== null
      ? DF_RANK_ORDER.filter(
          (r) => DF_RANK_ORDER.indexOf(r) > DF_RANK_ORDER.indexOf(currentRank!),
        )
      : [];

  function handleCurrentChange(rank: DFRankName) {
    setCurrentRank(rank);
    setDesiredRank(null);
  }

  const price =
    currentRank && desiredRank ? calcDFRankPrice(currentRank, desiredRank) : 0;

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <SelectDropdown<DFRankName>
          label="Current Rank"
          required
          value={currentRank}
          options={DF_RANK_ORDER}
          placeholder="Select current rank"
          onChange={handleCurrentChange}
        />
        <SelectDropdown<DFRankName>
          label="Desired Rank"
          required
          value={desiredRank}
          options={desiredOptions}
          placeholder={
            currentRank ? "Select desired rank" : "Select current first"
          }
          disabled={currentRank === null}
          onChange={setDesiredRank}
        />
      </div>
      <PriceSummary
        price={price}
        label={`Delta Force Rank Boost · ${currentRank ?? "?"} → ${desiredRank ?? "?"}`}
      />
      <CustomerFields
        name={form.name}
        email={form.email}
        nameError={form.nameError}
        emailError={form.emailError}
        onNameChange={form.handleNameChange}
        onEmailChange={form.handleEmailChange}
      />
      <CheckoutButton
        price={price}
        loading={form.loading}
        onPay={() =>
          form.handlePay(
            price,
            `Delta Force Rank Boost · ${currentRank ?? "?"} → ${desiredRank ?? "?"}`,
          )
        }
      />
      <TermsLine />
      {form.showSuccess && (
        <ContactModal onClose={() => form.setShowSuccess(false)} />
      )}
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const DF_SERVICES = [
  "Tekniq Alloy Farming",
  "Account Leveling",
  "Hazard Operation",
  "Season Mission",
  "Rank Boosting",
] as const;

function DeltaForceBookingPage() {
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
      <div className="pt-36 pb-20 mx-auto max-w-2xl px-4">
        {/* Game Info */}
        <div className="flex items-center gap-7 mb-10">
          <img
            className="w-28 md:w-35 rounded-xl shadow-[0_0_50px_rgba(0,255,120,0.25)] drop-shadow-[0_0_20px_rgba(0,255,120,0.6)]"
            src="/delta-force.jpg"
            alt="Delta Force"
          />
          <div className="flex flex-col gap-2">
            <h1 className="text-[#00FF00] text-xs tracking-widest uppercase font-semibold">
              Select Service
            </h1>
            <h2 className="text-5xl font-extrabold">Delta Force</h2>
            <p className="text-white/50 text-sm">Choose a service tab below.</p>
          </div>
        </div>

        {/* Tabs — 5 services wrap to 2 rows on small screens */}
        <Tabs
          defaultValue="Tekniq Alloy Farming"
          className="w-full flex flex-col gap-5"
        >
          <TabsList className="bg-[#191B1F] w-full h-auto! grid grid-cols-3 gap-1 p-1">
            {DF_SERVICES.map((s) => (
              <TabsTrigger
                key={s}
                value={s}
                className="cursor-pointer text-xs md:text-sm py-2"
              >
                {s}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent
            value="Tekniq Alloy Farming"
            className="border border-[#00FF00]/30 rounded-xl w-full p-5 flex flex-col gap-5 bg-[#0f1117]"
          >
            <TekniqqAlloyyFarmingTab />
          </TabsContent>

          <TabsContent
            value="Account Leveling"
            className="border border-[#00FF00]/30 rounded-xl w-full p-5 flex flex-col gap-5 bg-[#0f1117]"
          >
            <DFAccountLevelingTab />
          </TabsContent>

          <TabsContent
            value="Hazard Operation"
            className="border border-[#00FF00]/30 rounded-xl w-full p-5 flex flex-col gap-5 bg-[#0f1117]"
          >
            <HazardOperationTab />
          </TabsContent>

          <TabsContent
            value="Season Mission"
            className="border border-[#00FF00]/30 rounded-xl w-full p-5 flex flex-col gap-5 bg-[#0f1117]"
          >
            <SeasonMissionTab />
          </TabsContent>

          <TabsContent
            value="Rank Boosting"
            className="border border-[#00FF00]/30 rounded-xl w-full p-5 flex flex-col gap-5 bg-[#0f1117]"
          >
            <DFRankBoostingTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default DeltaForceBookingPage;
