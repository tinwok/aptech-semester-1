

import { useNavigate } from "react-router";
// them cho em NavBAr
import { Outlet } from "react-router";
import Header from "@/Pages/Home/common/Header";

function Layout() {
  return (
    <div>
     
      {/* <Navbar /> */}
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
