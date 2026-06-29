export interface Booster {
  id: string;
  email: string;
  username: string;
  displayName: string | null;
  isActive: boolean;
  createdAt: string;
  _count?: { boostedOrders: number };
}

export interface CreateBoosterPayload {
  email: string;
  username: string;
  password: string;
  displayName?: string;
}

export interface UpdateBoosterPayload {
  displayName?: string;
  isActive?: boolean;
}

export interface ListBoostersParams {
  isActive?: boolean;
}
