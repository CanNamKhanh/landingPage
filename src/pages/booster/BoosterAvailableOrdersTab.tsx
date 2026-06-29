import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch, type RootState } from "@/stores/store";
import { fetchOrders } from "@/Slices/orderSlice";
import { Loader2, Lock, RefreshCw } from "lucide-react";

export default function BoosterAvailableOrdersTab() {
  const dispatch = useAppDispatch();
  const { items: orders, isLoading } = useSelector(
    (state: RootState) => state.order,
  );

  const load = () => {
    console.log("[BoosterAvailableOrdersTab] load claimable");
    dispatch(fetchOrders({ scope: "claimable", limit: 50 }));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold text-gray-800">Available Boosts</h2>
        <button
          onClick={load}
          className="p-2 rounded-lg cursor-pointer border border-gray-200 hover:bg-gray-50 text-gray-500"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      <p className="text-xs text-gray-400 mb-4 flex items-center gap-1.5">
        <Lock size={12} /> Auto-claim feature is temporarily disabled — the
        admin will assign boosts to you.
      </p>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <Loader2 className="animate-spin mr-2" size={18} /> Loading...
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">
          There are currently no open boosts.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border border-gray-100 rounded-xl p-4 flex items-center justify-between"
            >
              <div>
                <div className="font-mono text-xs text-gray-400">
                  {order.code}
                </div>
                <div className="font-semibold text-gray-800">
                  {order.game?.name ?? order.gameId} ·{" "}
                  {order.service?.name ?? order.serviceId}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  ${order.totalPrice}
                </div>
              </div>
              <button
                disabled
                title="Claim feature is temporarily disabled. Waiting for admin assignment."
                className="text-xs font-semibold px-3 py-2 rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed flex items-center gap-1.5"
              >
                <Lock size={12} /> Claim
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
