import type { Middleware } from "@reduxjs/toolkit";

/**
 * Log mọi action đi qua store + state sau khi update.
 * Chỉ bật ở development để tránh log rác lên console production.
 */
export const loggerMiddleware: Middleware =
  (storeApi) => (next) => (action) => {
    if (import.meta.env.MODE === "production") {
      return next(action);
    }

    const actionType =
      typeof action === "object" && action !== null && "type" in action
        ? (action as { type: unknown }).type
        : "UNKNOWN_ACTION";

    console.groupCollapsed(`%c[Redux] ${String(actionType)}`, "color: #B842F0");
    console.log("payload:", action);
    console.log("prev state:", storeApi.getState());

    const result = next(action);

    console.log("next state:", storeApi.getState());
    console.groupEnd();

    return result;
  };
