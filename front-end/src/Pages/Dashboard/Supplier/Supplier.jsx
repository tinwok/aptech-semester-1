import { useEffect, useState } from "react";
import { supplierApi } from "@/services/supplierApi";
import { useDebounce } from "use-debounce";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import SupplierTable from "./SupplierTable";

export default function Supplier({ onSuppliersCreated, selectedSupplierId }) {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
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

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [open, setOpen] = useState(false);

  const fetchSuppliers = async (
    currentPage = 1,
    searchValue = debouncedSearch,
  ) => {
    try {
      setLoading(true);

      const res = await supplierApi.getAll({
        page: currentPage,
        search: searchValue,
      });

      const responseData = res.data;

      setPagination({
        current_page: responseData.current_page ?? 1,
        last_page: responseData.last_page ?? 1,
        total: responseData.total ?? 0,
      });

      setSuppliers(responseData.data ?? []);
    } catch (err) {
      console.log("ERROR:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers(1, "");
  }, []);

  useEffect(() => {
    fetchSuppliers(1, debouncedSearch);
  }, [debouncedSearch]);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
    });

    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await supplierApi.update(editingId, formData);
      } else {
        await supplierApi.create(formData);
      }

      resetForm();
      setOpen(false);
      fetchSuppliers(pagination.current_page, debouncedSearch);
    } catch (error) {
      console.log(error?.response?.data);
    }
  };

  const handleEdit = (supplier) => {
    setEditingId(supplier.id);

    setFormData({
      name: supplier.name,
      phone: supplier.phone,
      email: supplier.email,
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete?")) return;

    try {
      await supplierApi.delete(id);
      fetchSuppliers(pagination.current_page, debouncedSearch);
    } catch (error) {
      console.error(error?.response?.data);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Supplier Management</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Top bar */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 border rounded-md p-2 bg-background flex-1">
              <Input
                type="text"
                placeholder="Search supplier..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black"
              />
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger
                className=""
                onClick={() => {
                  resetForm();
                  setOpen(true);
                }}
              >
                Add Supplier
              </DialogTrigger>

              <DialogContent className="bg-zinc-50 text-black rounded-lg p-6">
                <DialogHeader>
                  <DialogTitle>
                    {editingId ? "Save " : "Add Supplier"}
                  </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div className="space-y-1">
                    <label htmlFor="name" className="text-sm font-medium">
                      Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="text-black"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Phone
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="text-black"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="text-black"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingId ? "Update Supplier" : "Create Supplier"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>

        <SupplierTable
          onSuppliersCreated={onSuppliersCreated}
          selectedSupplierId={selectedSupplierId}
          suppliers={suppliers}
          loading={loading}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />

        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className="hover:text-white"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (pagination.current_page > 1) {
                    fetchSuppliers(
                      pagination.current_page - 1,
                      debouncedSearch,
                    );
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
                    fetchSuppliers(page, debouncedSearch);
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
                    fetchSuppliers(
                      pagination.current_page + 1,
                      debouncedSearch,
                    );
                  }
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </Card>
    </div>
  );
}
