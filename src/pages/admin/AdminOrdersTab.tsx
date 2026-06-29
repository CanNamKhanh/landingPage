import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch, type RootState } from "@/stores/store";
import { fetchOrders, assignBoosterToOrder } from "@/Slices/orderSlice";
import { fetchBoosters } from "@/Slices/boosterSlice";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const STATUS_BADGE: Record<string, string> = {
  PENDING: "bg-gray-100 text-gray-600",
  CONFIRMED: "bg-blue-100 text-blue-600",
  IN_PROGRESS: "bg-amber-100 text-amber-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-rose-100 text-rose-600",
  REFUNDED: "bg-rose-100 text-rose-600",
};

export default function AdminOrdersTab() {
  const dispatch = useAppDispatch();
  const {
    items: orders,
    isLoading,
    isMutating,
  } = useSelector((state: RootState) => state.order);
  const { items: boosters } = useSelector((state: RootState) => state.booster);
  const [statusFilter, setStatusFilter] = useState<string>("");

  const loadOrders = () => {
    console.log("[AdminOrdersTab] loadOrders", { statusFilter });
    dispatch(
      fetchOrders({
        scope: "all",
        status: statusFilter ? (statusFilter as never) : undefined,
        limit: 50,
      }),
    );
  };

  useEffect(() => {
    loadOrders();
    dispatch(fetchBoosters({ isActive: true }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleAssign = async (orderId: string, boosterId: string) => {
    if (!boosterId) return;
    console.log("[AdminOrdersTab] assign booster", { orderId, boosterId });
    const result = await dispatch(
      assignBoosterToOrder({ orderId, boosterId: { boosterId } }),
    );
    if (assignBoosterToOrder.fulfilled.match(result)) {
      toast.success("Đã gán booster cho kèo");
    } else {
      toast.error((result.payload as string) ?? "Gán booster thất bại");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">Orders List</h2>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-[#B842F0]/50"
          >
            <option value="">All Statuses</option>
            {Object.keys(STATUS_BADGE).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            onClick={loadOrders}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500"
            title="Refresh"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <Loader2 className="animate-spin mr-2" size={18} /> Loading...
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">
          No orders available yet
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-100">
                <th className="py-2 pr-4 font-medium">Code</th>
                <th className="py-2 pr-4 font-medium">Game / Service</th>
                <th className="py-2 pr-4 font-medium">Customer</th>
                <th className="py-2 pr-4 font-medium">Price</th>
                <th className="py-2 pr-4 font-medium">Status</th>
                <th className="py-2 pr-4 font-medium">Progress</th>
                <th className="py-2 pr-4 font-medium">Booster</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-50 hover:bg-gray-50/60"
                >
                  <td className="py-3 pr-4 font-mono text-xs text-gray-600">
                    {order.code}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="font-medium text-gray-800">
                      {order.game?.name ?? order.gameId}
                    </div>
                    <div className="text-xs text-gray-400">
                      {order.service?.name ?? order.serviceId}
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="text-gray-700">{order.customerName}</div>
                    <div className="text-xs text-gray-400">
                      {order.customerEmail}
                    </div>
                  </td>
                  <td className="py-3 pr-4 font-semibold text-gray-700">
                    ${order.totalPrice}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_BADGE[order.status] ?? "bg-gray-100 text-gray-600"}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-gray-600">
                    {order.progressPct}%
                  </td>
                  <td className="py-3 pr-4">
                    <select
                      value={order.boosterId ?? ""}
                      disabled={isMutating}
                      onChange={(e) => handleAssign(order.id, e.target.value)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:ring-1 focus:ring-[#B842F0]/50 disabled:opacity-50 min-w-35"
                    >
                      <option value="">-- Unassigned --</option>
                      {boosters.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.displayName ?? b.username} (
                          {b._count?.boostedOrders ?? 0} order)
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
