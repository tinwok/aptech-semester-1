import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  CalendarDays,
  ChevronDown,
  Gift,
  Heart,
  ComputerIcon,
  History,
  Home,
  KeyRound,
  LogOut,
  Package,
  Trash2,
  UserRound,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function getBasePathByRole(role) {
  if (role === "staff") return "/staff";
  return "/user";
}

function UserDropdown() {
  const navigate = useNavigate();
  const { user, role, logout, removeAccount } = useAuth();

  const basePath = getBasePathByRole(role);
  const displayPhone = user?.phone || user?.email || "Account";

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  async function handleRemoveAccount() {
    const confirmed = window.confirm(
      "Are you sure you want to remove your account? This action cannot be undone.",
    );

    if (!confirmed) return;

    await removeAccount();
    navigate("/");
  }

  function goToPage(path = "") {
    navigate(`${basePath}${path}`);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <span
          variant="outline"
          className="border-[#C2A26A] bg-[#FFFDF8] px-4 text-[#2B2115] shadow-sm hover:bg-[#FFF7E6] hover:text-[#9B7A3F]"
        >
          <UserRound className="mr-2 h-4 w-4 text-[#C2A26A]" />
          Hi, {displayPhone}
          <ChevronDown className="ml-2 h-4 w-4 text-[#C2A26A]" />
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-72 rounded-2xl border border-[#E8D7B3] bg-[#FFFDF8] p-2 shadow-xl"
      >
        <div className="rounded-xl bg-[#FFF7E6] px-3 py-3">
          <p className="truncate text-sm font-semibold text-[#2B2115]">
            Hi, {displayPhone}
          </p>

          <p className="mt-1 truncate text-xs text-[#8A6A35]">
            {user?.email || "No email"}
          </p>

          <p className="mt-1 text-xs capitalize text-[#8A6A35]">
            Role: {role || "customer"}
          </p>
        </div>

        <DropdownMenuSeparator className="my-2 bg-[#E8D7B3]" />

        {role == "admin" ? (
          <DropdownMenuItem className="cursor-pointer rounded-lg px-3 py-2 text-[#2B2115] focus:bg-[#FFF7E6] mb-2">
            <Link to="/dashboard">
              <ComputerIcon className="mr-3 h-4 w-4 text-[#C2A26A]" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={() => goToPage()}
            className="cursor-pointer rounded-lg px-3 py-2 text-[#2B2115] focus:bg-[#FFF7E6]"
          >
            <Home className="mr-3 h-4 w-4 text-[#C2A26A]" />
            Home
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={() => goToPage("/profile")}
          className="cursor-pointer rounded-lg px-3 py-2 text-[#2B2115] focus:bg-[#FFF7E6]"
        >
          <UserRound className="mr-3 h-4 w-4 text-[#C2A26A]" />
          Profile
        </DropdownMenuItem>

        {role !== "staff" && (
          <DropdownMenuItem
            onClick={() => goToPage("/preferences")}
            className="cursor-pointer rounded-lg px-3 py-2 text-[#2B2115] focus:bg-[#FFF7E6]"
          >
            <Heart className="mr-3 h-4 w-4 text-[#C2A26A]" />
            Preferences
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          onClick={() => goToPage("/appointments")}
          className="cursor-pointer rounded-lg px-3 py-2 text-[#2B2115] focus:bg-[#FFF7E6]"
        >
          <CalendarDays className="mr-3 h-4 w-4 text-[#C2A26A]" />
          Appointments
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => goToPage("/service-history")}
          className="cursor-pointer rounded-lg px-3 py-2 text-[#2B2115] focus:bg-[#FFF7E6]"
        >
          <History className="mr-3 h-4 w-4 text-[#C2A26A]" />
          Service History
        </DropdownMenuItem>

        {role !== "staff" && (
          <>
            <DropdownMenuItem
              onClick={() => goToPage("/orders")}
              className="cursor-pointer rounded-lg px-3 py-2 text-[#2B2115] focus:bg-[#FFF7E6]"
            >
              <Package className="mr-3 h-4 w-4 text-[#C2A26A]" />
              Orders
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => goToPage("/promotions")}
              className="cursor-pointer rounded-lg px-3 py-2 text-[#2B2115] focus:bg-[#FFF7E6]"
            >
              <Gift className="mr-3 h-4 w-4 text-[#C2A26A]" />
              Promotions
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => goToPage("/notifications")}
              className="cursor-pointer rounded-lg px-3 py-2 text-[#2B2115] focus:bg-[#FFF7E6]"
            >
              <Bell className="mr-3 h-4 w-4 text-[#C2A26A]" />
              Notifications
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuItem
          onClick={() => goToPage("/change-password")}
          className="cursor-pointer rounded-lg px-3 py-2 text-[#2B2115] focus:bg-[#FFF7E6]"
        >
          <KeyRound className="mr-3 h-4 w-4 text-[#C2A26A]" />
          Change Password
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-2 bg-[#E8D7B3]" />

        <DropdownMenuItem
          onClick={handleRemoveAccount}
          className="cursor-pointer rounded-lg px-3 py-2 text-red-600 focus:bg-red-50 focus:text-red-600"
        >
          <Trash2 className="mr-3 h-4 w-4" />
          Remove Account
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer rounded-lg px-3 py-2 text-red-600 focus:bg-red-50 focus:text-red-600"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserDropdown;
