// Them cho em sidebar
import { Outlet } from "react-router";

function DashBoardLayouts() {
  <div>
    {/* <SideBar /> */}
    <main>
      <Outlet></Outlet>
    </main>
  </div>;
}

export default DashBoardLayouts;
