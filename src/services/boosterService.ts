import type { ApiResponse } from "@/types/common.types";
import type {
  Booster,
  CreateBoosterPayload,
  ListBoostersParams,
  UpdateBoosterPayload,
} from "@/types/booster.types";
import axiosInstance from "@/utils/axios";

const TAG = "[BoosterService]";

export async function listBoosters(
  params: ListBoostersParams = {},
): Promise<Booster[]> {
  console.log(TAG, "listBoosters:request", params);
  const res = await axiosInstance.get<ApiResponse<Booster[]>>("/boosters", {
    params,
  });
  console.log(TAG, "listBoosters:response", { count: res.data.data.length });
  return res.data.data;
}

export async function createBooster(
  payload: CreateBoosterPayload,
): Promise<Booster> {
  console.log(TAG, "createBooster:request", {
    ...payload,
    password: "***", // không log password thật ra console
  });
  const res = await axiosInstance.post<ApiResponse<Booster>>(
    "/boosters",
    payload,
  );
  console.log(TAG, "createBooster:response", res.data.data);
  return res.data.data;
}

export async function updateBooster(
  boosterId: string,
  payload: UpdateBoosterPayload,
): Promise<Booster> {
  console.log(TAG, "updateBooster:request", { boosterId, payload });
  const res = await axiosInstance.patch<ApiResponse<Booster>>(
    `/boosters/${boosterId}`,
    payload,
  );
  console.log(TAG, "updateBooster:response", res.data.data);
  return res.data.data;
}
