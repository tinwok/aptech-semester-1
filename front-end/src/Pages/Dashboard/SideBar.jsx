import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, LogOut } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

function SideBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem("zenstyle_access_token");
      localStorage.removeItem("zenstyle_user");

      navigate("/", { replace: true });
      window.location.reload();
    }
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r border-zinc-800 bg-zinc-900 p-4 text-white">
        <h2 className="mb-6 text-2xl font-bold text-white">ZenStyle</h2>

        <nav className="space-y-2">
          <Link
            to="/dashboard"
            className={`block rounded-lg px-3 py-2 ${
              location.pathname === "/dashboard"
                ? "bg-zinc-800 text-white"
                : "text-gray-300 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            Dashboard
          </Link>

          <Link
            to="/dashboard/appointments"
            className="block rounded-lg px-3 py-2 text-gray-300 hover:bg-zinc-800 hover:text-white"
          >
            Appointments
          </Link>

          <Link
            to="/dashboard/services"
            className="block rounded-lg px-3 py-2 text-gray-300 hover:bg-zinc-800 hover:text-white"
          >
            Services
          </Link>

          <Link
            to="/dashboard/staffs"
            className="block rounded-lg px-3 py-2 text-gray-300 hover:bg-zinc-800 hover:text-white"
          >
            Staffs
          </Link>

          <Link
            to="/dashboard/customers"
            className="block rounded-lg px-3 py-2 text-gray-300 hover:bg-zinc-800 hover:text-white"
          >
            Customers
          </Link>
          <Link
            to="/dashboard/inventory"
            className="block rounded-lg px-3 py-2 text-gray-300 hover:bg-zinc-800 hover:text-white"
          >
            Inventory
          </Link>
          <Link
            to="/dashboard/supplier"
            className="block rounded-lg px-3 py-2 text-gray-300 hover:bg-zinc-800 hover:text-white"
          >
            Supplier
          </Link>
        </nav>
      </aside>

      <div className="fixed bottom-4 left-4 w-56">
        <div className="mb-3 flex justify-center text-center text-white hover:text-red-500">
          <ArrowLeft />
          <Link to="/">Back to mainpage</Link>
        </div>

        <Button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
        >
          <LogOut size={18} />
          Logout
        </Button>
      </div>
    </div>
  );
}

export default SideBar;
