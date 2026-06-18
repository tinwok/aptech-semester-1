import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, LogOut } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

function SideBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const navItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Appointments", path: "/dashboard/appointments" },
    { label: "Services", path: "/dashboard/services" },
    { label: "Staffs", path: "/dashboard/staffs" },
    { label: "Customers", path: "/dashboard/customers" },
    {
      label: "Customer Preferences",
      path: "/dashboard/customer-preferences",
    },
    { label: "Feedback Reports", path: "/dashboard/feedbacks" },
  ];

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
    <aside className="relative w-64 border-r border-zinc-800 bg-zinc-900 p-4 text-white">
      <h2 className="mb-6 text-2xl font-bold text-white">ZenStyle</h2>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`block rounded-lg px-3 py-2 ${
                isActive
                  ? "bg-zinc-800 text-white"
                  : "text-gray-300 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="fixed bottom-4 left-4 w-56">
        <div className="mb-3 flex justify-center gap-2 text-center text-white hover:text-red-500">
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
    </aside>
  );
}

export default SideBar;
