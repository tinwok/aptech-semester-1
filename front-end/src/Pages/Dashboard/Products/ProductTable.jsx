import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import InventoryDetail from "../Inventory/InventoryDetail";
import { Eye, PenIcon, TrashIcon, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import InventoryOrder from "../Inventory/InventoryOrder";
function ProductTable({
  products,
  onDetail,
  onEdit,
  onDelete,
  pagination,
  fetchProducts,
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const [product, setProducts] = useState({});

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>STT</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Import</TableHead>
            <TableHead>Retail</TableHead>
            <TableHead>Unit</TableHead>

            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.map((product, index) => (
            <TableRow key={product.id}>
              <TableCell>
                {" "}
                {(pagination.current_page - 1) * 10 + index + 1}
              </TableCell>
              <TableCell>{product.name}</TableCell>

              <TableCell>{product.current_quantity}</TableCell>

              <TableCell>
                {Number(product.import_price).toLocaleString("vi-VN")} ₫
              </TableCell>

              <TableCell>
                {Number(product.retail_price).toLocaleString("vi-VN")} ₫
              </TableCell>
              <TableCell>{product.unit}</TableCell>

              <TableCell>
                <Badge
                  variant={
                    product.status === "available" ? "default" : "destructive"
                  }
                >
                  {product.status}
                </Badge>
              </TableCell>

              <TableCell>
                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="border border-solid-gray px-2  rounded hover:bg-black hover:text-white cursor-pointer">
                      ...
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          onClick={() => {
                            setOrderOpen(true);
                            setProducts(product);
                          }}
                        >
                          <Package></Package>Order
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            (onDetail(product.id), setDialogOpen(true));
                            setProducts(product);
                          }}
                        >
                          <Eye /> Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="secondary"
                          size="sm"
                          onClick={() => onEdit(product)}
                        >
                          <PenIcon></PenIcon> Edit
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          variant="destructive"
                          size="sm"
                          onClick={() => onDelete(product.id)}
                        >
                          <TrashIcon />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[1200px] max-h-[90vh] overflow-y-auto bg-white border-trans text-black-500">
          <InventoryDetail
            product={product}
            onSuccess={() => {
              setDialogOpen(false);
            }}
          ></InventoryDetail>
        </DialogContent>
      </Dialog>
      {/* Order Dialog */}
      <Dialog open={orderOpen} onOpenChange={setOrderOpen}>
        <DialogContent className="sm:max-w-[1200px] max-h-[90vh] overflow-y-auto bg-white border-trans text-black-500">
          <InventoryOrder
            product={product}
            onSuccess={() => {
              setOrderOpen(false);
              fetchProducts();
            }}
          ></InventoryOrder>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ProductTable;
