import { useNavigate } from "react-router-dom";
import {
  Bell,
  CalendarDays,
  ChevronDown,
  Gift,
  History,
  KeyRound,
  LogOut,
  Package,
  UserRound,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function UserDropdown() {
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  function goToProtectedPage(path) {
    if (user?.must_change_password) {
      navigate("/change-password");
      return;
    }

    navigate(path);
  }

  const displayPhone = user?.phone || user?.email || "Tài khoản";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="border-[#C2A26A] bg-[#FFFDF8] px-4 text-[#2B2115] shadow-sm hover:bg-[#FFF7E6] hover:text-[#9B7A3F]"
        >
          <UserRound className="mr-2 h-4 w-4 text-[#C2A26A]" />
          Hi, {displayPhone}
          <ChevronDown className="ml-2 h-4 w-4 text-[#C2A26A]" />
        </Button>
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
            {user?.email || "Chưa có email"}
          </p>

          <p className="mt-1 text-xs capitalize text-[#8A6A35]">
            Role: {role || "customer"}
          </p>

          {user?.must_change_password && (
            <p className="mt-2 rounded-lg bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
              Cần đổi mật khẩu trước khi xem/sửa thông tin.
            </p>
          )}
        </div>

        <DropdownMenuSeparator className="my-2 bg-[#E8D7B3]" />

        <DropdownMenuItem
          onClick={() => goToProtectedPage("/profile")}
          className="cursor-pointer rounded-lg px-3 py-2 text-[#2B2115] focus:bg-[#FFF7E6]"
        >
          <UserRound className="mr-3 h-4 w-4 text-[#C2A26A]" />
          Hồ sơ cá nhân
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => goToProtectedPage("/appointments")}
          className="cursor-pointer rounded-lg px-3 py-2 text-[#2B2115] focus:bg-[#FFF7E6]"
        >
          <CalendarDays className="mr-3 h-4 w-4 text-[#C2A26A]" />
          Lịch hẹn
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => goToProtectedPage("/service-history")}
          className="cursor-pointer rounded-lg px-3 py-2 text-[#2B2115] focus:bg-[#FFF7E6]"
        >
          <History className="mr-3 h-4 w-4 text-[#C2A26A]" />
          Lịch sử dịch vụ
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => goToProtectedPage("/orders")}
          className="cursor-pointer rounded-lg px-3 py-2 text-[#2B2115] focus:bg-[#FFF7E6]"
        >
          <Package className="mr-3 h-4 w-4 text-[#C2A26A]" />
          Đơn hàng
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => goToProtectedPage("/promotions")}
          className="cursor-pointer rounded-lg px-3 py-2 text-[#2B2115] focus:bg-[#FFF7E6]"
        >
          <Gift className="mr-3 h-4 w-4 text-[#C2A26A]" />
          Ưu đãi / Khuyến mãi
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => goToProtectedPage("/notifications")}
          className="cursor-pointer rounded-lg px-3 py-2 text-[#2B2115] focus:bg-[#FFF7E6]"
        >
          <Bell className="mr-3 h-4 w-4 text-[#C2A26A]" />
          Thông báo
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => navigate("/change-password")}
          className="cursor-pointer rounded-lg px-3 py-2 text-[#2B2115] focus:bg-[#FFF7E6]"
        >
          <KeyRound className="mr-3 h-4 w-4 text-[#C2A26A]" />
          Đổi mật khẩu
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-2 bg-[#E8D7B3]" />

        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer rounded-lg px-3 py-2 text-red-600 focus:bg-red-50 focus:text-red-600"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserDropdown;
