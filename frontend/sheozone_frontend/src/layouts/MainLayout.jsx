import { Outlet } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";

const MainLayout = () => {
  return (
    <div>
      <Header />
      <div className="scroll-smooth min-h-[500px]">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
