import { Toaster } from "sonner";
import MainLayout from "./layouts/MainLayout";
import MainPage from "./pages/MainPage";
import { Route, Routes } from "react-router-dom";
import ServicePolicyPage from "./pages/ServicePolicyPage";

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          classNames: {
            toast:
              "!bg-[#0b0614] !text-white !border !border-pink-500 !font-bold",
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
      </Routes>
    </>
  );
}

export default App;
