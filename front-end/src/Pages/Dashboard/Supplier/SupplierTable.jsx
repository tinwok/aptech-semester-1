import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
function SupplierTable({
  suppliers,
  loading,
  handleEdit,
  handleDelete,
  onSuppliersCreated,
  selectedSupplierId,
}) {
  console.log("selectedSupplierId", selectedSupplierId);

  const handleSelectedSupplier = (supplier) => {
    if (selectedSupplierId === supplier.id) {
      onSuppliersCreated?.(null);
    } else {
      onSuppliersCreated?.(supplier);
    }
  };
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                Loading...
              </TableCell>
            </TableRow>
          ) : suppliers.length ? (
            suppliers.map((supplier) => (
              <TableRow
                key={supplier.id}
                onClick={() => {
                  handleSelectedSupplier(supplier);
                }}
                className={` cursor-pointer ${
                  selectedSupplierId === supplier.id
                    ? "bg-green-600/30 ring-2 ring-green-500"
                    : ""
                }`}
              >
                <TableCell>{supplier.id}</TableCell>
                <TableCell className="font-medium">{supplier.name}</TableCell>
                <TableCell>{supplier.phone}</TableCell>
                <TableCell>{supplier.email}</TableCell>

                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEdit(supplier)}
                    >
                      Edit
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(supplier.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                No suppliers found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default SupplierTable;
