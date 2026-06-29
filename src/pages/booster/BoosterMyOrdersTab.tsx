import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch, type RootState } from "@/stores/store";
import { fetchOrders, updateOrderProgressThunk } from "@/Slices/orderSlice";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import type { Order, OrderStatus } from "@/types/order.types";

const NEXT_STATUS_OPTIONS: OrderStatus[] = [
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];

function ProgressRow({ order }: { order: Order }) {
  const dispatch = useAppDispatch();
  const { isMutating } = useSelector((state: RootState) => state.order);
  const [progressPct, setProgressPct] = useState(order.progressPct);
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [note, setNote] = useState("");

  const handleSubmit = async () => {
    console.log("[BoosterMyOrdersTab] update progress", {
      orderId: order.id,
      status,
      progressPct,
      note,
    });

    const result = await dispatch(
      updateOrderProgressThunk({
        orderId: order.id,
        data: { status, progressPct, note: note || undefined },
      }),
    );

    if (updateOrderProgressThunk.fulfilled.match(result)) {
      toast.success("Progress updated");
      setNote("");
    } else {
      toast.error((result.payload as string) ?? "Update failed");
    }
  };

  return (
    <div className="border border-gray-100 rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-mono text-xs text-gray-400">{order.code}</div>
          <div className="font-semibold text-gray-800">
            {order.game?.name ?? order.gameId} ·{" "}
            {order.service?.name ?? order.serviceId}
          </div>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
          {order.status}
        </span>
      </div>

      <div className="text-xs space-y-0.5 border-t border-dashed border-gray-100 pt-2 text-gray-700">
        {Object.entries(order.details || {}).map(([key, value]) => {
          if (value === undefined || value === null || value === "")
            return null;

          const friendlyKey = key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase());

          return (
            <div key={key} className="flex gap-1">
              <span className="text-gray-400 font-medium">{friendlyKey}:</span>
              <span className="text-gray-900 font-semibold">
                {String(value)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-500 font-medium">
            Progress (%)
          </label>
          <input
            type="number"
            min={0}
            max={100}
            value={progressPct}
            onChange={(e) => setProgressPct(Number(e.target.value))}
            className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#B842F0]/50"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 font-medium">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as OrderStatus)}
            className="w-full mt-1 border cursor-pointer border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#B842F0]/50"
          >
            {NEXT_STATUS_OPTIONS.map((s) => (
              <option className="cursor-pointer" key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-500 font-medium">
          Note (optional)
        </label>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="E.g. Cleared 2/5 maps..."
          className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#B842F0]/50"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={isMutating}
        className="w-full bg-[#B842F0] cursor-pointer text-white text-sm font-semibold rounded-lg py-2 hover:opacity-90 transition disabled:opacity-50"
      >
        Update progress
      </button>
    </div>
  );
}

export default function BoosterMyOrdersTab() {
  const dispatch = useAppDispatch();
  const { items: orders, isLoading } = useSelector(
    (state: RootState) => state.order,
  );

  const load = () => {
    dispatch(fetchOrders({ scope: "assignedToMe", limit: 50 }));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">My boosts</h2>
        <button
          onClick={load}
          className="p-2 rounded-lg cursor-pointer border border-gray-200 hover:bg-gray-50 text-gray-500"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <Loader2 className="animate-spin mr-2" size={18} /> Loading...
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">
          You haven't been assigned any boosts yet. Contact the admin to receive
          a boost.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orders.map((order) => (
            <ProgressRow key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
