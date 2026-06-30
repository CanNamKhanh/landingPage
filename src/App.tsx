import { Toaster } from "sonner";
import MainLayout from "./layouts/MainLayout";
import MainPage from "./pages/MainPage";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import ServicePolicyPage from "./pages/ServicePolicyPage";
import ValorantBookingPage from "./pages/ValorantBookingPage";
import LOLBookingPage from "./pages/LOLBookingPage";
import TftBookingPage from "./pages/TftBookingPage";
import DeltaForceBookingPage from "./pages/DeltaForceBookingPage";
import ArenaBreakoutBookingPage from "./pages/ArenaBreakoutBookingPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import RefundPolicyPage from "./pages/RefundPolicyPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminPage from "./pages/AdminPage";
import BoosterPage from "./pages/BoosterPage";
import { useSelector } from "react-redux";
import { useAppDispatch, type RootState } from "./stores/store";
import { useEffect } from "react";
import { fetchMe } from "./middlewares/authMiddleware";
import { useConversationSocket } from "./hooks/useConversationSocket";

function App() {
  const dispatch = useAppDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  useConversationSocket();

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  useEffect(() => {
    if (location.pathname === "/") {
      if (user) {
        if (user.role === "ADMIN") {
          navigate("/admin");
        } else if (user.role === "BOOSTER") {
          navigate("/booster");
        }
      }
    }
  }, [user, navigate, location.pathname]);

  return (
    <>
      <Toaster
        duration={2000}
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
        <Route path={"/privacy-policy"} element={<PrivacyPolicyPage />} />
        <Route path={"/refund-policy"} element={<RefundPolicyPage />} />
        <Route path={"/valorant"} element={<ValorantBookingPage />} />
        <Route path={"/lol"} element={<LOLBookingPage />} />
        <Route path={"/tft"} element={<TftBookingPage />} />
        <Route path={"/delta-force"} element={<DeltaForceBookingPage />} />
        <Route
          path={"/arena-breakout"}
          element={<ArenaBreakoutBookingPage />}
        />

        {/* Chỉ role ADMIN vào được */}
        <Route
          path={"/admin"}
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        {/* Chỉ role BOOSTER vào được */}
        <Route
          path={"/booster"}
          element={
            <ProtectedRoute allowedRoles={["BOOSTER"]}>
              <BoosterPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
