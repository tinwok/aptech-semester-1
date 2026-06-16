import { useEffect, useState } from "react";
import api from "../../services/api";
import { Button } from "@/components/ui/button";
import BookingForm from "../Booking/BookingForm";
import {
  CheckCircle,
  XCircle,
  TimerResetIcon,
  PencilIcon,
  PlusCircleIcon,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

function getCustomerName(item) {
  return item.customer?.user?.name || item.customer?.user?.phone || "N/A";
}

function getStaffName(item) {
  return item.staff?.users?.name || item.staff?.user?.name || "N/A";
}

function getServiceNames(item) {
  const details = item.invoice_details || item.invoiceDetails || [];

  if (!details.length) return "N/A";

  return details
    .map((detail) => detail.service?.title)
    .filter(Boolean)
    .join(", ");
}
// Lọc theo màu status
const statusStyles = {
  pending: "text-yellow-600",
  completed: "text-green-600",
  cancel: "text-red-600",
};
const IconStyles = {
  pending: <TimerResetIcon></TimerResetIcon>,
  completed: <CheckCircle></CheckCircle>,
  cancel: <XCircle></XCircle>,
};
// Lọc theo icon
export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  const pages = [];

  for (
    let i = Math.max(1, pagination.current_page - 2);
    i <= Math.min(pagination.last_page, pagination.current_page + 2);
    i++
  ) {
    pages.push(i);
  }
  const [error, setError] = useState("");

  const handleComplete = async (id) => {
    try {
      await api.post(`dashboard/appointments/${id}/complete`);
      fetchAppointments(pagination.current_page);
    } catch (err) {
      console.error("Complete appointment failed:", err);
      alert(err.response?.data?.message || "Complete failed");
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      await api.delete(`/dashboard/appointments/${id}`);
      fetchAppointments(pagination.current_page);
    } catch (err) {
      console.error("Cancel appointment failed:", err);
      alert(err.response?.data?.message || "Cancel failed");
    }
  };

  const fetchAppointments = async (page = 1) => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get(`/dashboard/appointments?page=${page}`);

      setAppointments(res.data.data ?? []);

      setPagination({
        current_page: res.data.current_page ?? 1,
        last_page: res.data.last_page ?? 1,
        total: res.data.total ?? 0,
      });
    } catch (err) {
      console.error("Fetch appointments failed:", err);

      if (err.response) {
        setError(err.response.data.message || "Server error");
      } else if (err.request) {
        setError("Không thể kết nối tới server");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold ">Appointments</h1>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default">
              Create Appointment
              <PlusCircleIcon />
            </Button>
          </DialogTrigger>

          <DialogContent className="w-full max-h-[90vh] bg-red-600 overflow-y-auto">
            <BookingForm
              isAdmin
              endpoint="/dashboard/appointments"
              onSuccess={() => {
                setDialogOpen(false);
                fetchAppointments();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 shadow-lg">
        <Table className="w-full">
          <TableHeader className="bg-zinc-800">
            <TableRow>
              <TableHead className="p-4 text-left text-zinc-300">
                Customer
              </TableHead>
              <TableHead className="p-4 text-left text-zinc-300">
                Staff
              </TableHead>
              <TableHead className="p-4 text-left text-zinc-300">
                Service
              </TableHead>
              <TableHead className="p-4 text-left text-zinc-300">
                Status
              </TableHead>
              <TableHead className="p-4 text-center text-zinc-300">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan="5" className="p-4 text-center text-white">
                  Loading appointments...
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              appointments.map((item) => (
                <TableRow
                  key={item.id}
                  className="border-t border-zinc-700 hover:bg-zinc-800"
                >
                  <TableCell className="p-4 text-white">
                    {getCustomerName(item)}
                  </TableCell>
                  <TableCell className="p-4 text-white">
                    {getStaffName(item)}
                  </TableCell>
                  <TableCell className="p-4 text-white">
                    {getServiceNames(item)}
                  </TableCell>

                  <TableCell className="p-4">
                    <span
                      className={`  ${
                        statusStyles[item.status] || "text-white-500"
                      }`}
                    >
                      {IconStyles[item.status]}
                    </span>
                  </TableCell>

                  <TableCell className="space-x-2 p-4 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">Actions</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            onClick={() => handleComplete(item.id)}
                          >
                            <CheckCircle />
                            Completed
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(item)}>
                            <PencilIcon />
                            Edit
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            onClick={() => handleCancel(item.id)}
                            variant="destructive"
                          >
                            <XCircle />
                            Cancel
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}

            {!loading && appointments.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan="5"
                  className="p-4 text-center text-zinc-300"
                >
                  No appointments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination className="mt-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className="hover:text-white"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (pagination.current_page > 1) {
                  fetchAppointments(pagination.current_page - 1);
                }
              }}
            />
          </PaginationItem>

          {pages.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                className="hover:text-white"
                href="#"
                isActive={page === pagination.current_page}
                onClick={(e) => {
                  e.preventDefault();
                  fetchAppointments(page);
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              className="hover:text-white"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (pagination.current_page < pagination.last_page) {
                  fetchAppointments(pagination.current_page + 1);
                }
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
