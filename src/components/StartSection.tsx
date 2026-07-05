import { Headphones, Lock, Star, Trophy } from "lucide-react";

const stats = [
  { id: 1, icon: Trophy, stat: "1000+", title: "Completed Orders" },
  { id: 2, icon: Star, stat: "Express", title: "Customer Rating" },
  { id: 3, icon: Headphones, stat: "24/7", title: "Support" },
  { id: 4, icon: Lock, stat: "VPN", title: "Protection Available" },
];

function StartSection() {
  return (
    // 1. Chỉ định rõ màu nền tối đồng nhất và kéo sát padding/margin nếu cần
    <div className="reveal py-20 px-4 select-none relative flex mx-auto w-full flex-wrap gap-5 justify-center bg-[#0D0F21]">
      {stats.map((item) => (
        <div
          key={item.id}
          // 2. Thay border sáng bằng border mờ border-white/5 và tăng trải nghiệm giao diện tối
          className="rounded-2xl border border-white/5 p-6 w-64 flex flex-col items-center gap-3 transition-all duration-300 hover:scale-[1.02]"
          style={{
            // Dùng nền hơi sáng hơn nền tổng một chút kèm mờ đục đổ bóng nhẹ giống ảnh mẫu
            background: "rgba(255, 255, 255, 0.03)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
          }}
        >
          <span
            className="shrink-0 rounded-xl flex items-center justify-center w-10 h-10 shadow-md"
            style={{
              background: "linear-gradient(135deg, #d42d82 0%, #f55a6a 100%)",
            }}
          >
            {/* Thêm màu trắng cho icon tránh bị chìm */}
            <item.icon size={20} color="white" />
          </span>

          {/* Cân chỉnh kích thước chữ giống hệt cấu trúc ảnh mẫu image_1ceb1b.jpg */}
          <span className="text-[#F447A0] text-3xl font-extrabold tracking-tight mt-1">
            {item.stat}
          </span>

          <span className="text-white/70 text-sm font-medium">
            {item.title}
          </span>
        </div>
      ))}
    </div>
  );
}

export default StartSection;
