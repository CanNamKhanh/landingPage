import axiosInstance from "@/utils/axios";

// ─── Base ─────────────────────────────────────────────────────────────────────

interface BasePayload {
  customerName: string;
  customerEmail: string;
  game: string;
  service: string;
  totalPrice: number;
}

// ─── Valorant ─────────────────────────────────────────────────────────────────

export interface ValorantRankBoostPayload extends BasePayload {
  game: "Valorant";
  service: "Rank Boosting";
  server: string;
  currentRank: string;
  desiredRank: string;
}

export interface ValorantPlacementPayload extends BasePayload {
  game: "Valorant";
  service: "Placement Matches";
  server: string;
  numberOfMatches: number;
  previousSeasonRank: string;
}

export interface ValorantNetWinsPayload extends BasePayload {
  game: "Valorant";
  service: "Net Wins";
  server: string;
  numberOfMatches: number;
  currentRank: string;
}

// ─── Arena Breakout: Infinite ─────────────────────────────────────────────────

export interface ABIKoensFarmingPayload extends BasePayload {
  game: "Arena Breakout: Infinite";
  service: "Koens Farming";
  amountM: number;
}

export interface ABIAccountLevelingPayload extends BasePayload {
  game: "Arena Breakout: Infinite";
  service: "Account Leveling";
  currentLevel: number;
  targetLevel: number;
}

export interface ABIRaidBoostPayload extends BasePayload {
  game: "Arena Breakout: Infinite";
  service: "Raid Boost";
  map: string;
  difficulty: string;
  runs: number;
}

export interface ABITitaniumCasePayload extends BasePayload {
  game: "Arena Breakout: Infinite";
  service: "Titanium Case";
  missions: number;
  totalMissions: number;
}

// ─── Delta Force ──────────────────────────────────────────────────────────────

export interface DFTekniqqAlloyyFarmingPayload extends BasePayload {
  game: "Delta Force";
  service: "Tekniq Alloy Farming";
  amountM: number;
}

export interface DFAccountLevelingPayload extends BasePayload {
  game: "Delta Force";
  service: "Account Leveling";
  selectedRanges: string[];
}

export interface DFHazardOperationPayload extends BasePayload {
  game: "Delta Force";
  service: "Hazard Operation";
  map: string;
  difficulty: string;
  runs: number;
}

export interface DFSeasonMissionPayload extends BasePayload {
  game: "Delta Force";
  service: "Season Mission";
}

export interface DFRankBoostingPayload extends BasePayload {
  game: "Delta Force";
  service: "Rank Boosting";
  currentRank: string;
  desiredRank: string;
}

// TFT
export const submitTFTRankBoost = (
  p: Omit<TFTRankBoostPayload, "game" | "service">,
) =>
  handleBooking({ game: "Teamfight Tactics", service: "Rank Boosting", ...p });

export const submitTFTPlacement = (
  p: Omit<TFTPlacementPayload, "game" | "service">,
) =>
  handleBooking({
    game: "Teamfight Tactics",
    service: "Placement Matches",
    ...p,
  });

// LoL
export const submitLOLRankBoost = (
  p: Omit<LOLRankBoostPayload, "game" | "service">,
) =>
  handleBooking({ game: "League of Legends", service: "Rank Boosting", ...p });

export const submitLOLPlacement = (
  p: Omit<LOLPlacementPayload, "game" | "service">,
) =>
  handleBooking({
    game: "League of Legends",
    service: "Placement Matches",
    ...p,
  });

// ─── Union ────────────────────────────────────────────────────────────────────

type BookingPayload =
  | ValorantRankBoostPayload
  | ValorantPlacementPayload
  | ValorantNetWinsPayload
  | ABIKoensFarmingPayload
  | ABIAccountLevelingPayload
  | ABIRaidBoostPayload
  | ABITitaniumCasePayload
  | DFTekniqqAlloyyFarmingPayload
  | DFAccountLevelingPayload
  | DFHazardOperationPayload
  | DFSeasonMissionPayload
  | DFRankBoostingPayload
  | TFTRankBoostPayload
  | TFTPlacementPayload
  | LOLRankBoostPayload
  | LOLPlacementPayload;

export interface BookingResult {
  success: boolean;
  error?: string;
}

export interface TFTRankBoostPayload extends BasePayload {
  game: "Teamfight Tactics";
  service: "Rank Boosting";
  server: string;
  currentRank: string;
  desiredRank: string;
}
export interface TFTPlacementPayload extends BasePayload {
  game: "Teamfight Tactics";
  service: "Placement Matches";
  server: string;
  numberOfMatches: number;
  previousSeasonRank: string;
}

export interface LOLRankBoostPayload extends BasePayload {
  game: "League of Legends";
  service: "Rank Boosting";
  server: string;
  currentRank: string;
  desiredRank: string;
}
export interface LOLPlacementPayload extends BasePayload {
  game: "League of Legends";
  service: "Placement Matches";
  server: string;
  numberOfMatches: number;
  previousSeasonRank: string;
}

// ─── Core handler (giữ pattern axiosInstance như cũ) ─────────────────────────

export const handleBooking = async (
  data: BookingPayload,
): Promise<BookingResult> => {
  const res = await axiosInstance.post("/api/submit-form", data, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data as BookingResult;
};

// ─── Typed helpers cho từng service ──────────────────────────────────────────

// Valorant
export const submitValorantRankBoost = (
  p: Omit<ValorantRankBoostPayload, "game" | "service">,
) => handleBooking({ game: "Valorant", service: "Rank Boosting", ...p });

export const submitValorantPlacement = (
  p: Omit<ValorantPlacementPayload, "game" | "service">,
) => handleBooking({ game: "Valorant", service: "Placement Matches", ...p });

export const submitValorantNetWins = (
  p: Omit<ValorantNetWinsPayload, "game" | "service">,
) => handleBooking({ game: "Valorant", service: "Net Wins", ...p });

// Arena Breakout: Infinite
export const submitABIKoensFarming = (
  p: Omit<ABIKoensFarmingPayload, "game" | "service">,
) =>
  handleBooking({
    game: "Arena Breakout: Infinite",
    service: "Koens Farming",
    ...p,
  });

export const submitABIAccountLeveling = (
  p: Omit<ABIAccountLevelingPayload, "game" | "service">,
) =>
  handleBooking({
    game: "Arena Breakout: Infinite",
    service: "Account Leveling",
    ...p,
  });

export const submitABIRaidBoost = (
  p: Omit<ABIRaidBoostPayload, "game" | "service">,
) =>
  handleBooking({
    game: "Arena Breakout: Infinite",
    service: "Raid Boost",
    ...p,
  });

export const submitABITitaniumCase = (
  p: Omit<ABITitaniumCasePayload, "game" | "service">,
) =>
  handleBooking({
    game: "Arena Breakout: Infinite",
    service: "Titanium Case",
    ...p,
  });

// Delta Force
export const submitDFTekniqqAlloyyFarming = (
  p: Omit<DFTekniqqAlloyyFarmingPayload, "game" | "service">,
) =>
  handleBooking({ game: "Delta Force", service: "Tekniq Alloy Farming", ...p });

export const submitDFAccountLeveling = (
  p: Omit<DFAccountLevelingPayload, "game" | "service">,
) => handleBooking({ game: "Delta Force", service: "Account Leveling", ...p });

export const submitDFHazardOperation = (
  p: Omit<DFHazardOperationPayload, "game" | "service">,
) => handleBooking({ game: "Delta Force", service: "Hazard Operation", ...p });

export const submitDFSeasonMission = (
  p: Omit<DFSeasonMissionPayload, "game" | "service">,
) => handleBooking({ game: "Delta Force", service: "Season Mission", ...p });

export const submitDFRankBoosting = (
  p: Omit<DFRankBoostingPayload, "game" | "service">,
) => handleBooking({ game: "Delta Force", service: "Rank Boosting", ...p });
