import { Link, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function SideBar() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 bg-zinc-900 text-white p-4">
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
        </nav>
      </aside>

      {/* Header */}
      <div className="flex-1">
        <header className="flex items-center justify-between border-b bg-white px-6 py-4">
          <div className="flex gap-3">
            <Input placeholder="Search by name..." className="w-64" />

            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-md border px-4 py-2 text-sm">
              User
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link to="/profile">Profile</Link>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Link to="/settings">Settings</Link>
              </DropdownMenuItem>

              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
      </div>
    </div>
  );
}

export default SideBar;
