import { Outlet } from "react-router";
import SideBar from "@/Pages/Dashboard/SideBar";

function DashBoardLayouts() {
  return (
    <div className="flex min-h-screen">
      <SideBar />

      <main className="flex-1 bg-slate-50">
        <Outlet />
      </main>
    </div>
  );
}

export default DashBoardLayouts;
