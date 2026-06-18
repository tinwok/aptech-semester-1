import { useEffect, useState } from "react";
import api from "@/services/api";

import ProductTable from "./ProductTable";
import ProductFormDialog from "./ProductFormDialog";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "use-debounce";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
function Products() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);

  const [page, setPage] = useState(1);
  const emtyData = {
    name: "",
    current_quantity: "",
    import_price: "",
    retail_price: "",
    unit: "",
    status: "active",
  };
  const [formData, setFormData] = useState(emtyData);
  const fetchProducts = async (page = 1, debouncedSearch) => {
    try {
      setLoading(true);
      const res = await api.get("dashboard/products", {
        params: {
          page,
          search: debouncedSearch,
        },
      });
      console.log(res.data.data.data);

      setLoading(false);
      setProducts(res.data.data.data);
      setPagination(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products");
    }
  };
  const handleSubmit = async (formData) => {
    try {
      if (selectedProduct) {
        await api.put(`dashboard/products/${selectedProduct.id}`, formData);

        toast.success("Product updated successfully");
      } else {
        await api.post("dashboard/products", formData);

        toast.success("Product created successfully");
      }

      setOpenForm(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save product");
    }
  };

  const handleEdit = (product) => {
    try {
      setSelectedProduct(product);
      setOpenForm(true);
      toast.success("Product updated successfully");
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
    setPage(1);
    fetchProducts();
  }, [page, debouncedSearch]);
  return (
    <div className=" mx-auto p-10">
      <h1 className="font-bold text-xl mb-5">Products</h1>
      <div className="flex justify-between mb-5">
        <div className="relative w-[350px]">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search product or supplier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <Button
          onClick={() => {
            setSelectedProduct(null);
            setOpenForm(!openForm);
          }}
        >
          Add Product
        </Button>
      </div>

      {openForm && (
        <ProductFormDialog
          setFormData={setFormData}
          open={openForm}
          formData={formData}
          setOpen={setOpenForm}
          product={selectedProduct}
          onSubmit={handleSubmit}
        />
      )}

      <ProductTable
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
      <Pagination>
        <PaginationContent>
          <PaginationPrevious
            onClick={() => {
              if (page > 1) {
                setPage(page - 1);
              }
            }}
          />

          <PaginationNext
            onClick={() => {
              if (page < pagination.last_page) {
                setPage(page + 1);
              }
            }}
          />
        </PaginationContent>
      </Pagination>

      {/* Dialogs */}
    </div>
  );
}

export default Products;
