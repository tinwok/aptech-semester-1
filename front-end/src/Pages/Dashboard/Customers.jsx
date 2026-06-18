import { useEffect, useState } from "react";
import {
  getCustomers,
  deleteCustomer,
  createCustomer,
  updateCustomer,
} from "@/services/customerApi";

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
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CustomerTable from "./CustomerTable";
import { toast } from "sonner";
export default function Customers({ onCustomerCreated, selectedCustomerId }) {
  const [customers, setCustomers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const emtyData = {
    name: "",
    phone: "",
    password: "",
    email: "",
  };
  const [formData, setFormData] = useState(emtyData);

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

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async (page = 1, searchValue = " ") => {
    try {
      const res = await getCustomers(page, searchValue);

      setCustomers(res.data.data);
      setPagination({
        current_page: res.data.current_page ?? 1,
        last_page: res.data.last_page ?? 1,
        total: res.data.total ?? 0,
      });
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
    }
  };
  const handleSearch = () => {
    fetchCustomers(1, search);
  };
  const handleDelete = async (id) => {
    if (!confirm("Delete this customer?")) return;

    try {
      await deleteCustomer(id);

      setCustomers((prev) => prev.filter((customer) => customer.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData(emtyData);

    setEditingId(null);
    setIsEditing(false);
    setOpen(false);
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await updateCustomer(editingId, formData);
        toast.success("Updated customer account successfuly!");
      } else {
        const res = await createCustomer(formData);
        console.log(res.data.data.id);

        if (onCustomerCreated) {
          onCustomerCreated(res.data.data);
        }
        toast.success("Created customer account successfuly!");
      }

      await fetchCustomers();
      resetForm();
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
    }
  };

  const handleEdit = (customer) => {
    setOpen(true);
    setIsEditing(true);
    setEditingId(customer.id);

    setFormData({
      name: customer.user?.name || "",
      phone: customer.user?.phone || "",
      email: customer.user?.email || "",
      password: customer.user?.phone || "",
    });
  };
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold ">Customers</h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            onClick={() => {
              resetForm();
              setOpen(true);
            }}
            className="rounded-lg bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
          >
            + Add Customer
          </DialogTrigger>

          <DialogContent className="sm:max-w-[400px] bg-zinc-700 text-white border-zinc-700">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Edit Customer" : "Add Customer"}
              </DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-2   md:grid-cols-2">
              <div>
                <label htmlFor="name">Name: </label>
                <input
                  id="name"
                  className="rounded bg-zinc-800 p-2 text-white w-full"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label htmlFor="phone">Phone: </label>
                <input
                  id="phone"
                  className="rounded bg-zinc-800 p-2 text-white  w-full"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>

              <div>
                <label htmlFor="email">Email: </label>
                <input
                  className="rounded bg-zinc-800 p-2 text-white  w-full"
                  id="email"
                  placeholder="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  className="rounded bg-zinc-800 p-2 text-white  w-full"
                  placeholder="Password (default phone when editing)"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={handleSubmit}
                className="rounded bg-green-600 px-4 py-2 text-white"
              >
                {isEditing ? "Update" : "Create"}
              </button>

              <button
                onClick={() => setOpen(false)}
                className="rounded bg-zinc-600 px-4 py-2 text-white"
              >
                Cancel
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Field orientation="horizontal" className="mb-5">
        <Input
          type="search"
          placeholder="Search by name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />

        <Button onClick={handleSearch}>Search</Button>
      </Field>

      <CustomerTable
        onCustomerCreated={onCustomerCreated}
        customers={customers}
        pagination={pagination}
        onEdit={handleEdit}
        onDelete={handleDelete}
        selectedCustomerId={selectedCustomerId}
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
                  fetchCustomers(pagination.current_page - 1);
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
                  fetchCustomers(page);
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
                  fetchCustomers(pagination.current_page + 1);
                }
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
