import { useEffect, useState } from "react";
import api from "@/services/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Services() {
  const [services, setServices] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });

  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [file, setFile] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration_minutes: "",
    price: "",
    status: "active",
    note: "",
  });

  // ===== GET (PAGINATION) =====
  const fetchServices = async (page = 1) => {
    try {
      setLoading(true);
      const res = await api.get(`/services?page=${page}`);
      const data = res.data;
      setServices(data.data);

      setPagination({
        current_page: data.current_page,
        last_page: data.last_page,
        total: data.total,
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // ===== CREATE =====
  const handleCreate = async () => {
    try {
      const data = new FormData();

      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("duration_minutes", formData.duration_minutes);
      data.append("status", formData.status);
      data.append("note", formData.note);
      data.append("price", formData.price);

      if (file) {
        data.append("image", file);
      }
      await api.post("/services", data);
      setOpen(false);
      resetForm();
      fetchServices(pagination.current_page);
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  // ===== UPDATE =====
  const handleUpdate = async () => {
    try {
      const data = new FormData();

      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("duration_minutes", formData.duration_minutes);
      data.append("status", formData.status);
      data.append("note", formData.note);

      if (file) {
        data.append("image", file);
      }

      await api.post(`/services/${editingId}?_method=PUT`, data);

      setOpen(false);
      setEditingId(null);
      resetForm();
      fetchServices(pagination.current_page);
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  // ===== DELETE =====
  const handleDelete = async (id) => {
    if (!confirm("Delete service?")) return;

    await api.delete(`/services/${id}`);
    fetchServices(pagination.current_page);
  };

  // ===== EDIT =====
  const handleEdit = (item) => {
    setEditingId(item.id);

    setFormData({
      title: item.title,
      description: item.description,
      duration_minutes: item.duration_minutes,
      status: item.status,
      price: item.price,
      note: item.note,
    });

    setOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      duration_minutes: "",
      status: "active",
      price: "",
      note: "",
    });

    setFile(null);
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between mb-5">
        <h1 className="text-2xl font-bold">Services</h1>

        <Button
          onClick={() => {
            setEditingId(null);
            resetForm();
            setOpen(true);
          }}
        >
          Add Service
        </Button>
      </div>

      {/* TABLE */}
      <div className="border rounded-lg p-6">
        <table className="w-full text-center">
          <thead>
            <tr>
              <th className="py-3">Title</th>
              <th className="py-3">Duration</th>
              <th className="py-3">Price</th>
              <th className="py-3">Image</th>
              <th className="py-3">Status</th>
              <th className="py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {services.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="py-3">{s.title}</td>
                <td className="py-3">{s.duration_minutes} min</td>
                <td className="py-3">{s.price} </td>
                <td className="py-3">
                  <div className="flex justify-center">
                    {s.image_url && (
                      <img
                        src={s.image_url}
                        className="w-12 h-12 object-cover"
                      />
                    )}
                  </div>
                </td>
                <td className="py-3">
                  <span className="py-2 px-2 bg-green-300 rounded-xl">
                    {s.status}
                  </span>
                </td>

                <td className="py-3">
                  <div className="flex justify-center gap-2">
                    <Button onClick={() => handleEdit(s)}>Edit</Button>
                    <Button onClick={() => handleDelete(s.id)}>Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Total: {pagination.total} services
        </p>

        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={pagination.current_page === 1}
            onClick={() => fetchServices(pagination.current_page - 1)}
          >
            Previous
          </Button>

          <span className="flex items-center px-3">
            Page {pagination.current_page} / {pagination.last_page}
          </span>

          <Button
            variant="outline"
            disabled={pagination.current_page === pagination.last_page}
            onClick={() => fetchServices(pagination.current_page + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {/* MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Service" : "Add Service"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <h3>Title</h3>
            <Input
              placeholder="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            <h3>Description</h3>
            <Textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
            />
            <h3>Duration minutes</h3>
            <Input
              type="number"
              placeholder="Duration minutes"
              value={formData.duration_minutes}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  duration_minutes: e.target.value,
                })
              }
            />
            <h3>Note</h3>
            <Input
              placeholder="Note"
              value={formData.note}
              onChange={(e) =>
                setFormData({ ...formData, note: e.target.value })
              }
            />
            <h3>Price</h3>
            <Input
              placeholder="Price"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
            />
            {/* STATUS */}
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full border p-2"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            {/* IMAGE */}
            <Input type="file" onChange={(e) => setFile(e.target.files[0])} />

            <Button
              onClick={editingId ? handleUpdate : handleCreate}
              className="w-full"
            >
              {editingId ? "Update" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
