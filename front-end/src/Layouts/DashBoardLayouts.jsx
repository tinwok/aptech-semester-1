// Them cho em sidebar
import { Outlet } from "react-router";
import SideBar from "@/Pages/Dashboard/SideBar";
function DashBoardLayouts() {
  return (
    <div>
      <SideBar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default DashBoardLayouts;
