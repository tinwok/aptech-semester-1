import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    duration: "",
    category: "",
    status: "Active",
  });

  const fetchServices = () => {
    fetch("http://127.0.0.1:8000/api/dashboard/admin/services")
      .then((res) => res.json())
      .then((data) => {
        setServices(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this service?",
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/dashboard/admin/services/${id}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        alert("Delete Success!");
        fetchServices();
      } else {
        alert("Delete Failed!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (service) => {
    setEditingId(service.id);

    setFormData({
      name: service.name,
      price: service.price,
      duration: service.duration,
      category: service.category,
      status: service.status,
    });

    setOpen(true);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/dashboard/admin/services",
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
        alert("Add Service Success!");

        setOpen(false);

        setFormData({
          name: "",
          price: "",
          duration: "",
          category: "",
          status: "Active",
        });

        fetchServices();
      } else {
        console.log(data);
        alert("Add Service Failed!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/dashboard/admin/services/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      if (response.ok) {
        alert("Update Success!");

        setOpen(false);

        fetchServices();
      } else {
        console.log(data);
        alert("Update Failed!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold">Loading Services...</h1>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Services</h1>

        <Button
          className="bg-green-600 hover:bg-green-700"
          onClick={() => {
            setEditingId(null);

            setFormData({
              name: "",
              price: "",
              duration: "",
              category: "",
              status: "Active",
            });

            setOpen(true);
          }}
        >
          + Add Service
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl bg-zinc-900 shadow-lg">
        <table className="w-full">
          <thead className="bg-zinc-800 text-white">
            <tr>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Duration</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {services.map((service) => (
              <tr
                key={service.id}
                className="border-t border-zinc-800 text-white hover:bg-zinc-800/50"
              >
                <td className="p-4">{service.id}</td>
                <td className="p-4">{service.name}</td>

                <td className="p-4">
                  {Number(service.price).toLocaleString()} đ
                </td>

                <td className="p-4">{service.duration} phút</td>

                <td className="p-4">{service.category}</td>

                <td className="p-4">
                  <span
                    className={`rounded px-3 py-1 text-sm ${
                      service.status === "Active"
                        ? "bg-green-600"
                        : "bg-red-600"
                    }`}
                  >
                    {service.status}
                  </span>
                </td>

                <td className="p-4 text-center">
                  <Button
                    size="sm"
                    className="mr-2 bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleEdit(service)}
                  >
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(service.id)}
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
            <DialogTitle>
              {editingId ? "Edit Service" : "Add Service"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <Input
              placeholder="Price"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
            />

            <Input
              placeholder="Duration"
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: e.target.value })
              }
            />

            <Input
              placeholder="Category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            />

            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={editingId ? handleUpdate : handleSave}
            >
              {editingId ? "Update Service" : "Add Service"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
