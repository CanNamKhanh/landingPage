import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/stores/store";
import type { Role } from "@/types/common.types";

interface ProtectedRouteProps {
  allowedRoles: Role[];
  children: React.ReactNode;
}

export default function ProtectedRoute({
  allowedRoles,
  children,
}: ProtectedRouteProps) {
  // Lấy trường status từ auth store
  const { user, status } = useSelector((state: RootState) => state.auth);

  // NẾU HỆ THỐNG CHƯA KHỞI ĐỘNG XONG HOẶC ĐANG LOAD DỮ LIỆU -> CHẶN LẠI KHÔNG CHO REDIRECT
  if (status === "idle" || status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0b0614] text-white font-bold text-lg">
        Verifying access permissions...
      </div>
    );
  }

  // Khi status đã là "succeeded" hoặc "failed", lúc này dữ liệu 'user' mới chính xác 100%
  if (!user) {
    // console.warn("[ProtectedRoute] chưa đăng nhập -> redirect /");
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user.role as Role)) {
    // console.warn("[ProtectedRoute] role không hợp lệ", {
    //   role: user.role,
    //   allowedRoles,
    // });
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
