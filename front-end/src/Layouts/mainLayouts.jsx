import { Outlet } from "react-router-dom";
import Header from "@/Pages/Home/common/Header";

function Layout() {
  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
