import ChatBox from "@/components/ChatBox";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div>
      <Header />
      <Outlet />
      <ChatBox />
      <Footer />
    </div>
  );
}

export default MainLayout;
