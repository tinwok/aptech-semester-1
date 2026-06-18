import { useEffect, useState } from "react";
import api from "@/services/api";

import ProductTable from "./ProductTable";
import ProductFormDialog from "./ProductFormDialog";

import { useDebounce } from "use-debounce";
import { toast } from "sonner";

import { SearchIcon } from "lucide-react";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Dialog, DialogContent } from "@/components/ui/dialog";
function Products() {
  const [products, setProducts] = useState([]);
  //  pagination
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
  //    pagination end

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [openDetail, setOpenDetail] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const emtyData = {
    name: "",
    current_quantity: "",
    import_price: "",
    retail_price: "",
    unit: "",
    status: "available",
  };
  const [formData, setFormData] = useState(emtyData);
  const fetchProducts = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const res = await api.get("dashboard/products", {
        params: {
          page,
          search: search,
        },
      });
      console.log(res.data.data.data);
      setPagination({
        current_page: res.data.current_page ?? 1,
        last_page: res.data.last_page ?? 1,
        total: res.data.total ?? 0,
      });
      setLoading(false);
      setProducts(res.data.data.data);
    } catch (err) {
      console.error("Data:", err.response?.data);
      toast.error("Failed to load products");
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedProduct) {
        await api.put(`dashboard/products/${selectedProduct.id}`, formData);
        setDialogOpen(false);
        setFormData(emtyData);
        toast.success("Product updated successfully");
      } else {
        await api.post("dashboard/products", formData);
        setFormData(emtyData);
        setDialogOpen(false);
        toast.success("Product created successfully");
      }

      setSelectedProduct(null);
      fetchProducts();
    } catch (error) {
      console.error("Data:", error.response?.data);
      toast.error("Failed to save product");
    }
  };

  const handleEdit = (product) => {
    try {
      setSelectedProduct(product);
      setDialogOpen(true);
      setFormData({
        name: product?.name,
        current_quantity: product?.current_quantity || "",
        import_price: product?.import_price || "",
        retail_price: product?.retail_price || "",
        unit: product?.unit || "",
        status: product?.status || "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to load products");
    }
  };
  const handleDetail = async (id) => {
    const res = await api.get(`dashboard/products/${id}`);
    setSelectedProduct(res.data.data);
    setOpenDetail(true);
  };
  const handleDelete = async (id) => {
    try {
      if (!confirm("Delete product?")) return;

      await api.delete(`dashboard/products/${id}`);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      console.error(error);
      toast.error("Failed to load products");
    }
  };
  useEffect(() => {
    fetchProducts(1, debouncedSearch);
  }, [debouncedSearch]);
  return (
    <div className=" mx-auto p-10">
      <h1 className="font-bold text-xl mb-5">Products</h1>
      <div className="flex justify-between mb-5">
        <Field orientation="horizontal" className="mb-5 w-full max-w-md">
          <div className="relative w-full">
            <SearchIcon
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <Input
              id="search"
              type="search"
              placeholder="Search by name, phone or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 w-full rounded-xl border border-gray-200bg-white shadow-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200 "
            />
          </div>
        </Field>

        <Button
          className="px-2 bg-green-800 text-white rounded cursor-pointer"
          onClick={() => {
            setDialogOpen(true);
            setSelectedProduct(null);
          }}
        >
          Create Products
        </Button>
      </div>

      <ProductTable
        pagination={pagination}
        setDialogOpen={setDialogOpen}
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDetail={handleDetail}
      />
      {/* <ProductDetailDialog
        open={openDetail}
        setOpen={setOpenDetail}
        product={selectedProduct}
      /> */}
      <Pagination className="mt-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className="hover:text-white"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (pagination.current_page > 1) {
                  fetchProducts(pagination.current_page - 1);
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
                  fetchProducts(page);
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
                  fetchProducts(pagination.current_page + 1);
                }
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      {/* Dialogs */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-trans">
          <ProductFormDialog
            setFormData={setFormData}
            formData={formData}
            product={selectedProduct}
            onSubmit={handleSubmit}
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

export default Products;
