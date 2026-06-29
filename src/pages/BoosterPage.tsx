import { useState } from "react";
import BoosterMyOrdersTab from "./booster/BoosterMyOrdersTab";
import BoosterAvailableOrdersTab from "./booster/BoosterAvailableOrdersTab";
import { fetchLogout } from "@/middlewares/authMiddleware";
import { useAppDispatch, type RootState } from "@/stores/store";
import { useSelector } from "react-redux";
import { UserAvatar } from "@/components/Header";

type BoosterTab = "mine" | "available";

const TABS: { key: BoosterTab; label: string }[] = [
  { key: "mine", label: "My boosts" },
  { key: "available", label: "Available Boosts" },
];

export default function BoosterPage() {
  const [activeTab, setActiveTab] = useState<BoosterTab>("mine");
  const dispatch = useAppDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    const refreshToken = localStorage.getItem("refreshToken") ?? "";
    dispatch(fetchLogout({ refreshToken }));
  };

  if (!user) {
    return <div>User not found!</div>;
  }

  return (
    <div className="min-h-screen bg-[#FAF5FC] text-black">
      <header className="bg-white border-b flex items-center justify-between border-gray-100 px-6 py-4">
        <h1 className="text-xl font-extrabold text-gray-800">
          Rosie<span className="text-[#B842F0]">Boost</span> Booster
        </h1>
        <UserAvatar onLogout={handleLogout} username={user.username} />
      </header>

      <div className="px-6 pt-5">
        <div className="flex gap-2 mb-5">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg cursor-pointer text-sm font-semibold transition ${
                activeTab === tab.key
                  ? "bg-[#B842F0] text-white"
                  : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="pb-10">
          {activeTab === "mine" && <BoosterMyOrdersTab />}
          {activeTab === "available" && <BoosterAvailableOrdersTab />}
        </div>
      </div>
    </div>
  );
}
