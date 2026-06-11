import { Outlet } from "react-router-dom";
import AuthButtons from "@/components/Auth/AuthButtons";

function Layout() {
  return (
    <div>
      <h1>day la navbar</h1>

      <div className="p-4">
        <AuthButtons />
      </div>

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
