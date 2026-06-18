import { useEffect, useState } from "react";
import api from "../../services/api";

import BookingForm from "../Booking/BookingForm";
import {
  CheckCircle,
  XCircle,
  TimerResetIcon,
  PencilIcon,
  Plus,
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
import { Button } from "@/components/ui/button";
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
  const [editingAppointment, setEditingAppointment] = useState(null);

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
  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    setDialogOpen(true);
  };
  const handleCreate = () => {
    setEditingAppointment(null);
    setDialogOpen(true);
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
        {/* <DialogTrigger className="px-3 flex py-2 rounded bg-green-700 text-sm text-white border border-transparent cursor-pointer hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Create Appointment
        </DialogTrigger>
        */}

        <Button
          onClick={() => handleCreate()}
          className="bg-green-700 hover:bg-green-800 text-white"
        >
          Create Appointment <Plus></Plus>
        </Button>
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
              appointments.map((appointment) => (
                <TableRow
                  key={appointment.id}
                  className="border-t border-zinc-700 hover:bg-zinc-800"
                >
                  <TableCell className="p-4 text-white">
                    {getCustomerName(appointment)}
                  </TableCell>
                  <TableCell className="p-4 text-white">
                    {getStaffName(appointment)}
                  </TableCell>
                  <TableCell className="p-4 text-white">
                    {getServiceNames(appointment)}
                  </TableCell>

                  <TableCell className="p-4">
                    <span
                      className={`  ${
                        statusStyles[appointment.status] || "text-white-500"
                      }`}
                    >
                      {IconStyles[appointment.status]}
                    </span>
                  </TableCell>

                  <TableCell className="space-x-2 p-4 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="px-2 rounded bg-white border border-transparent cursor-pointer hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        ...
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            onClick={() => handleComplete(appointment.id)}
                          >
                            <CheckCircle />
                            Completed
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={(e) => {
                              e.preventDefault();
                              handleEdit(appointment);
                            }}
                          >
                            <PencilIcon />
                            Edit
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            onClick={() => handleCancel(appointment.id)}
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
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[1200px] max-h-[90vh] overflow-y-auto bg-trans border-trans text-black-500">
          <BookingForm
            isAdmin
            endpoint="/dashboard/appointments"
            appointment={editingAppointment}
            onSuccess={() => {
              setDialogOpen(false);
              fetchAppointments();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
