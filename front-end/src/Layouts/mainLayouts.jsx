import { useNavigate } from "react-router";
// them cho em NavBAr
import { Outlet } from "react-router";

function Layout() {
  const navigate = useNavigate();
  return (
    <div>
      {/* <Navbar /> */}
      <h1>day la navbar</h1>
      <main>
        <Outlet></Outlet>
      </main>
    </div>
  );
}

export default Layout;
