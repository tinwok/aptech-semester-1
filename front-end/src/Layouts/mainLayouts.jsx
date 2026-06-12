
import AuthButtons from "@/components/Auth/AuthButtons";
import { useNavigate } from "react-router";
// them cho em NavBAr
import { Outlet } from "react-router";
import Header from "@/Pages/Home/common/Header";

function Layout() {
  return (
    <div>
      <div className="p-4">
        <AuthButtons />
      </div>

      {/* <Navbar /> */}
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
