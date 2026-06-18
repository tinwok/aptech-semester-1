import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
function ProductTable({ products, onDetail, onEdit, onDelete }) {
  console.log(products);

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Import</TableHead>
            <TableHead>Retail</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>

              <TableCell>{product.current_quantity}</TableCell>

              <TableCell>
                {Number(product.import_price).toLocaleString("vi-VN")} ₫
              </TableCell>

              <TableCell>
                {Number(product.retail_price).toLocaleString("vi-VN")} ₫
              </TableCell>

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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDetail(product.id)}
                >
                  <Eye />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onEdit(product)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(product.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default ProductTable;
