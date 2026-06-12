import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Staffs() {
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    position: "",
    salary: "",
    shift: "",
    status: "active",
  });

  const fetchStaffs = () => {
    fetch("http://127.0.0.1:8000/api/dashboard/staffs")
      .then((res) => res.json())
      .then((data) => {
        setStaffs(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStaffs();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/dashboard/admin/staffs",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      console.log(data);

      if (response.ok) {
        alert("Add Staff Success!");

        setOpen(false);

        setFormData({
          name: "",
          email: "",
          phone: "",
          password: "",
          position: "",
          salary: "",
          shift: "",
          status: "active",
        });

        fetchStaffs();
      } else {
        alert(data.message || "Add Staff Failed");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  };
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xoá nhân viên này?");

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/dashboard/admin/staffs/${id}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        alert("Delete Success!");
        fetchStaffs();
      } else {
        alert("Delete Failed!");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
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
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Staffs</h1>

        <Button
          className="bg-green-600 hover:bg-green-700"
          onClick={() => setOpen(true)}
        >
          + Add Staff
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl bg-zinc-900 shadow-lg">
        <table className="w-full">
          <thead className="bg-zinc-800 text-white">
            <tr>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4 text-left">Position</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {staffs.map((staff) => (
              <tr
                key={staff.id}
                className="border-t border-zinc-800 text-white hover:bg-zinc-800/50"
              >
                <td className="p-4">{staff.id}</td>
                <td className="p-4">{staff.name}</td>
                <td className="p-4">{staff.email}</td>
                <td className="p-4">{staff.phone}</td>
                <td className="p-4">{staff.position}</td>

                <td className="p-4">
                  <span
                    className={`rounded px-3 py-1 text-sm ${
                      staff.status === "Active" ? "bg-green-600" : "bg-red-600"
                    }`}
                  >
                    {staff.status}
                  </span>
                </td>

                <td className="p-4 text-center">
                  <Button
                    size="sm"
                    className="mr-2 bg-blue-600 hover:bg-blue-700"
                  >
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(staff.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Staff</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              placeholder="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />

            <Input
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />

            <Input
              placeholder="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />

            <Input
              placeholder="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />

            <Input
              placeholder="Position"
              name="position"
              value={formData.position}
              onChange={handleChange}
            />

            <Input
              placeholder="Salary"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
            />

            <Input
              placeholder="Shift"
              name="shift"
              value={formData.shift}
              onChange={handleChange}
            />

            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={handleSubmit}
            >
              Save Staff
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
