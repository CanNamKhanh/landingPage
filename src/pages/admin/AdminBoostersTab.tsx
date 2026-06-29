import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch, type RootState } from "@/stores/store";
import { createBoosterThunk, fetchBoosters } from "@/Slices/boosterSlice";
import { Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import type { CreateBoosterPayload } from "@/types/booster.types";

const EMPTY_FORM: CreateBoosterPayload = {
  email: "",
  username: "",
  password: "",
  displayName: "",
};

export default function AdminBoostersTab() {
  const dispatch = useAppDispatch();
  const {
    items: boosters,
    isLoading,
    isCreating,
  } = useSelector((state: RootState) => state.booster);
  const [form, setForm] = useState<CreateBoosterPayload>(EMPTY_FORM);

  useEffect(() => {
    dispatch(fetchBoosters());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log("[AdminBoostersTab] create booster", {
    //   ...form,
    //   password: "***",
    // });

    const result = await dispatch(createBoosterThunk(form));
    if (createBoosterThunk.fulfilled.match(result)) {
      toast.success(`Created booster ${result.payload.username}`);
      setForm(EMPTY_FORM);
    } else {
      toast.error((result.payload as string) ?? "Failed to create booster.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Form tạo booster */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 h-fit"
      >
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <UserPlus size={18} className="text-[#B842F0]" /> Create Booster
        </h2>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-500 font-medium">
              Display name
            </label>
            <input
              value={form.displayName}
              onChange={(e) =>
                setForm((f) => ({ ...f, displayName: e.target.value }))
              }
              className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#B842F0]/50"
              placeholder="Nguyen Van A"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 font-medium">
              Username *
            </label>
            <input
              required
              value={form.username}
              onChange={(e) =>
                setForm((f) => ({ ...f, username: e.target.value }))
              }
              className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#B842F0]/50"
              placeholder="booster_van_a"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 font-medium">Email *</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#B842F0]/50"
              placeholder="booster@email.com"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 font-medium">
              Password *
            </label>
            <input
              required
              type="password"
              minLength={8}
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
              className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#B842F0]/50"
              placeholder="At least 8 characters"
            />
          </div>

          <button
            type="submit"
            disabled={isCreating}
            className="w-full mt-2 cursor-pointer bg-[#B842F0] text-white font-semibold rounded-lg py-2.5 text-sm hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isCreating && <Loader2 size={16} className="animate-spin" />}
            Create Booster
          </button>
        </div>
      </form>

      {/* List booster */}
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Booster List</h2>

        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <Loader2 className="animate-spin mr-2" size={18} /> Loading...
          </div>
        ) : boosters.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            No boosters available yet
          </div>
        ) : (
          <div className="space-y-2">
            {boosters.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3"
              >
                <div>
                  <div className="font-medium text-gray-800 text-sm">
                    {b.displayName ?? b.username}{" "}
                    <span className="text-gray-400 text-xs">@{b.username}</span>
                  </div>
                  <div className="text-xs text-gray-400">{b.email}</div>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-gray-500">
                    {b._count?.boostedOrders ?? 0} Boosts in Progress
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full font-semibold ${
                      b.isActive
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {b.isActive ? "Active" : "Disabled"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
