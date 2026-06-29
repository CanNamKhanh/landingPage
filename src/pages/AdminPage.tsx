import { useState } from "react";
import AdminOrdersTab from "./admin/AdminOrdersTab";
import AdminBoostersTab from "./admin/AdminBoostersTab";
import AdminChatTab from "./admin/AdminChatTab";
import { useAppDispatch, type RootState } from "@/stores/store";
import { fetchLogout } from "@/middlewares/authMiddleware";
import { useSelector } from "react-redux";
import { UserAvatar } from "@/components/Header";

type AdminTab = "orders" | "boosters" | "chat";

const TABS: { key: AdminTab; label: string }[] = [
  { key: "orders", label: "Manage Orders" },
  { key: "boosters", label: "Booster" },
  { key: "chat", label: "Customer Messages" },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("orders");
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
    <div className="h-screen bg-[#FAF5FC] text-black flex flex-col overflow-hidden">
      <header className="bg-white border-b flex items-center justify-between border-gray-100 px-6 py-4">
        <h1 className="text-xl font-extrabold text-gray-800">
          Rosie<span className="text-[#B842F0]">Boost</span> Admin
        </h1>
        <UserAvatar onLogout={handleLogout} username={user.username} />
      </header>

      <div className="px-6 pt-5 flex flex-col flex-1 min-h-0">
        <div className="flex gap-2 mb-5 shrink-0">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 cursor-pointer rounded-lg text-sm font-semibold transition ${
                activeTab === tab.key
                  ? "bg-[#B842F0] text-white"
                  : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div
          className={`flex-1 min-h-0 ${activeTab !== "chat" ? "overflow-y-auto pb-10" : ""}`}
        >
          {activeTab === "orders" && <AdminOrdersTab />}
          {activeTab === "boosters" && <AdminBoostersTab />}
          {activeTab === "chat" && <AdminChatTab />}
        </div>
      </div>
    </div>
  );
}
