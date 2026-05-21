import { Toaster } from "sonner";
import MainLayout from "./layouts/MainLayout";
import MainPage from "./pages/MainPage";
import { Route, Routes } from "react-router-dom";
import ServicePolicyPage from "./pages/ServicePolicyPage";
import ValorantBookingPage from "./pages/ValorantBookingPage";
import LOLBookingPage from "./pages/LOLBookingPage";
import TftBookingPage from "./pages/TftBookingPage";
import DeltaForceBookingPage from "./pages/DeltaForceBookingPage";
import ArenaBreakoutBookingPage from "./pages/ArenaBreakoutBookingPage";

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          classNames: {
            toast:
              "!bg-[#0b0614] !text-white !border !border-[#00FF00] !font-bold",
            success: "!border-emerald-500",
            error: "!border-rose-500",
          },
        }}
      />

      <Routes>
        <Route element={<MainLayout />}>
          <Route path={"/"} element={<MainPage />} />
        </Route>
        <Route path={"/service-policy"} element={<ServicePolicyPage />} />
        <Route path={"/valorant"} element={<ValorantBookingPage />} />
        <Route path={"/lol"} element={<LOLBookingPage />} />
        <Route path={"/tft"} element={<TftBookingPage />} />
        <Route path={"/delta-force"} element={<DeltaForceBookingPage />} />
        <Route
          path={"/arena-breakout"}
          element={<ArenaBreakoutBookingPage />}
        />
      </Routes>
    </>
  );
}

export default App;
