import { Link } from "react-router-dom";
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
import { Button } from "@/components/ui/button";

function SideBar() {
  return (
    <div>
      {" "}
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-white p-4">
          <h2 className="mb-6 text-xl font-bold">ZenStyle</h2>

          <nav className="space-y-2">
            <Link
              to="/dashboard"
              className="block rounded-lg px-3 py-2 hover:bg-gray-100"
            >
              Dashboard
            </Link>
            <Link
              to="/dashboard/appointments"
              className="block rounded-lg px-3 py-2 hover:bg-gray-100"
            >
              Appointments
            </Link>
            <Link
              to="/dashboard/services"
              className="block rounded-lg px-3 py-2 hover:bg-gray-100"
            >
              Services
            </Link>
            <Link
              to="/dashboard/staffs"
              className="block rounded-lg px-3 py-2 hover:bg-gray-100"
            >
              Staffs
            </Link>
            <Link
              to="/dashboard/customers"
              className="block rounded-lg px-3 py-2 hover:bg-gray-100"
            >
              Customers
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
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
              <DropdownMenuTrigger asChild>
                <Button variant="outline">User</Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link to="/settings">Settings</Link>
                </DropdownMenuItem>

                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
