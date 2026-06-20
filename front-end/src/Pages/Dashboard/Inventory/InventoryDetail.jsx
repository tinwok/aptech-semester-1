import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import api from "@/services/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { useDebounce } from "use-debounce";

function InventoryDetail({ product }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });
  const pages = Array.from(
    { length: pagination.last_page },
    (_, index) => index + 1,
  );
  const formatVND = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };
  const [history, setHistory] = useState([]);
  useEffect(() => {
    if (product?.id) {
      getHistory(page, debouncedSearch);
    }
  }, [product?.id, page, debouncedSearch]);

  const getHistory = async (currentPage = 1, keyword = "") => {
    try {
      const res = await api.get(`/dashboard/inventory/product/${product.id}`, {
        params: {
          page: currentPage,
          search: keyword,
        },
      });
      const responseData = res.data;

      console.log("API pagination", responseData);
      setPagination({
        current_page: responseData.current_page ?? 1,
        last_page: responseData.last_page ?? 1,
        total: responseData.total ?? 0,
      });

      setHistory(responseData.data ?? []);
    } catch (error) {
      console.log(error?.res.data);
    }
  };

  return (
    <div className="max-w-[1200px] w-full mx-auto bg-white  rounded-lg p-6">
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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">STT</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Import </TableHead>
            <TableHead>Retail</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Apointment</TableHead>
            <TableHead>Apointment Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-center">Supplier Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>
                {(pagination.current_page - 1) * 10 + index + 1}
              </TableCell>

              <TableCell>{item.product?.name}</TableCell>

              <TableCell>{item.product?.current_quantity || "-"}</TableCell>
              <TableCell>
                {formatVND(item.product?.import_price) || "-"}
              </TableCell>
              <TableCell>
                {formatVND(item.product?.retail_price) || "-"}
              </TableCell>
              <TableCell>
                {item.type === "import" ? "Import" : "Export"}
              </TableCell>
              <TableCell>
                {item.invoice?.id ? item.invoice?.id : "--"}
              </TableCell>
              <TableCell>{item.invoice?.status}</TableCell>
              <TableCell>
                {item.supplier?.created_at
                  ? new Date(item.supplier?.created_at).toLocaleDateString(
                      "vi-VN",
                    )
                  : new Date(item.invoice?.appointment_date).toLocaleDateString(
                      "vi-VN",
                    )}
              </TableCell>
              <TableCell>
                {item.supplier?.name ? item.supplier?.name : "--"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination className="mt-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className="hover:text-white"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (pagination.current_page > 1) {
                  setPage(pagination.current_page - 1);
                }
              }}
            />
          </PaginationItem>

          {pages.map((pageNumber) => (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                className="hover:text-white"
                href="#"
                isActive={pageNumber === pagination.current_page}
                onClick={(e) => {
                  e.preventDefault();
                  setPage(pageNumber);
                }}
              >
                {pageNumber}
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
                  setPage(pagination.current_page + 1);
                }
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export default InventoryDetail;
