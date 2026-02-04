import { Toaster } from "sonner";
import MainLayout from "./layouts/MainLayout";

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

      <MainLayout />
    </>
  );
}

export default App;
