import { useNavigate } from "react-router";
// them cho em NavBAr
import { Outlet } from "react-router";
import Header from "@/components/Main/common/Header";

function Layout() {
  const navigate = useNavigate();
  return (
    <div>
      {/* <Navbar /> */}
      <Header />
      <main>
        <Outlet></Outlet>
      </main>
    </div>
  );
}

export default Layout;
