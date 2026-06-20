import axiosClient from "@/api/axiosClient";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2 } from "lucide-react";
import { useDebounce } from "use-debounce";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "sonner";

export default function Staffs() {
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);

  console.log(editingId);

  // pagitanion
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });
  const pages = [];

  for (
    let i = Math.max(1, pagination.current_page - 2);
    i <= Math.min(pagination.last_page, pagination.current_page + 2);
    i++
  ) {
    pages.push(i);
  }
  const emtyData = {
    name: "",
    email: "",
    phone: "",
    salarypassword: "",
    position: "",
    salary: "",
    shift: "",
    status: "active",
  };
  const [formData, setFormData] = useState(emtyData);

  const filteredStaffs = (staffs || []).filter((staff) =>
    staff.users?.name?.toLowerCase().includes(search.toLowerCase()),
  );

  const paginatedStaffs = filteredStaffs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const fetchStaffs = async (page = 1, search = " ") => {
    try {
      const response = await axiosClient.get("/dashboard/staffs", {
        params: {
          search,
          page,
        },
      });
      setPagination({
        current_page: response.data.current_page ?? 1,
        last_page: response.data.last_page ?? 1,
        total: response.data.total ?? 0,
      });
      setStaffs(response.data.data || response.data || []);
    } catch (err) {
      console.error("Error:", err);
      setStaffs([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchStaffs(1, debouncedSearch);
  }, [debouncedSearch]);
  useEffect(() => {
    const loadData = async () => {
      await fetchStaffs();
    };
    loadData();
  }, []);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleEdit = (staff) => {
    setIsEdit(true);
    setEditingId(staff.id);
    setFormData({
      name: staff.users?.name || "",
      email: staff.users?.email || "",
      phone: staff.users?.phone || "",
      password: "",
      position: staff.position || "",
      salary: staff.salary || "",
      shift: staff.shift || "",
      status: staff.status || "active",
    });
    setOpen(true);
  };
  const handleSubmit = async () => {
    try {
      if (isEdit) {
        await axiosClient.put(`/dashboard/staffs/${editingId}`, formData);
        toast.success("Update successful");
        setOpen(false);
        setFormData(emtyData);
        fetchStaffs();
      } else {
        await axiosClient.post("/dashboard/staffs", formData);
        setOpen(false);
        setFormData(emtyData);
        fetchStaffs();
        toast.success("Created staff successfuly");
      }
    } catch (error) {
      console.log(error.response?.data);
    }
  };
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xoá nhân viên này?");

    if (!confirmDelete) return;

    try {
      const response = await axiosClient.delete(`/dashboard/staffs/${id}`);

      if (response.status === 200) {
        toast.success("Delete Success!");
        fetchStaffs();
      } else {
        toast.warning("Delete Failed!");
      }
    } catch (error) {
      console.error(error);
      toast.warning("Something went wrong!");
    }
  };
  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold">Loading Staffs...</h1>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow">
          <p className="text-gray-500">Total Staffs</p>
          <h2 className="text-3xl font-bold">{staffs.length}</h2>
        </div>

        <div className="bg-green-100 rounded-xl p-4 shadow">
          <p className="text-green-700">Active</p>
          <h2 className="text-3xl font-bold">
            {staffs.filter((s) => s.status === "active").length}
          </h2>
        </div>

        <div className="bg-blue-100 rounded-xl p-4 shadow">
          <p className="text-blue-700">Stylists</p>
          <h2 className="text-3xl font-bold">
            {staffs.filter((s) => s.position === "stylist").length}
          </h2>
        </div>

        <div className="bg-purple-100 rounded-xl p-4 shadow">
          <p className="text-purple-700">Barbers</p>
          <h2 className="text-3xl font-bold">
            {staffs.filter((s) => s.position === "baber").length}
          </h2>
        </div>
      </div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex gap-3">
          <Input
            placeholder="🔍 Search staff..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-80 bg-white"
          />
        </div>

        <Button
          className="bg-green-600 hover:bg-green-700 shadow-lg"
          onClick={() => {
            setIsEdit(false);
            setEditingId(null);
            setFormData(emtyData);
            setOpen(true);
          }}
        >
          + Add Staff
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-xl border">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-gray-800">
            <tr>
              <th className="p-4 text-left">Stt</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4 text-left">Position</th>
              <th className="p-4 text-left">Salary</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {paginatedStaffs.map((staff, index) => (
              <tr
                key={staff.id}
                className="border-t border-gray-200 text-gray-800 hover:bg-gray-50"
              >
                <td className="p-4">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="p-4">{staff.users?.name}</td>
                <td className="p-4">{staff.users?.email}</td>
                <td className="p-4">{staff.users?.phone}</td>
                <td className="p-4">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    {staff.position}
                  </span>
                </td>
                <td className="p-4">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(staff.salary)}
                </td>
                <td className="p-4">
                  <span
                    className={`rounded-full px-3 py-1 text-sm text-gray-800 ${
                      staff.status === "active" ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {staff.status}
                  </span>
                </td>

                <td className="p-4 text-center">
                  <Button
                    size="sm"
                    className="mr-2 bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleEdit(staff)}
                  >
                    <Pencil size={16} />
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(staff.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 flex justify-center">
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className="hover:text-white"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (pagination.current_page > 1) {
                    fetchStaffs(pagination.current_page - 1);
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
                    fetchStaffs(page);
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
                    fetchStaffs(pagination.current_page + 1);
                  }
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit Staff" : "Add Staff"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <label htmlFor="name">Name</label>
              <Input
                id="name"
                placeholder="Input staff name"
                className="bg-zinc-600"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                placeholder="Input staff email"
                className="bg-zinc-600 "
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="phone">Phone</label>
              <Input
                id="phone"
                className="bg-zinc-600 "
                placeholder="Input staff phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <Input
                id="password"
                className="bg-zinc-600 "
                placeholder="Input staff password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="position">Position</label>
              <select
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 p-2"
              >
                <option value="">Select Position</option>
                <option value="baber">Barber</option>
                <option value="stylist">Stylist</option>
                <option value="manager">Manager</option>
                <option value="receptionist">Receptionist</option>
              </select>
            </div>
            <div>
              {" "}
              <label htmlFor="status">Status</label>{" "}
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 p-2"
              >
                <option value="">Select Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label htmlFor="salary">Salary</label>
              <Input
                id="salary"
                className="bg-zinc-600 "
                placeholder="Input staff salary"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
              />
            </div>

            <Select
              value={formData.shift}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  shift: value,
                }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a shift" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Working Shift</SelectLabel>
                  <SelectItem value="08:00-18:00">08:00 - 18:00</SelectItem>
                  <SelectItem value="09:00-19:00">09:00 - 19:00</SelectItem>
                  <SelectItem value="10:00-20:00">10:00 - 20:00</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={handleSubmit}
            >
              {isEdit ? "Update Staff" : "Save Staff"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
