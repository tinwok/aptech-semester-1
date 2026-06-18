import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function ProductFormDialog({ onSubmit, formData, setFormData }) {
  const handleSubmit = (e) => {
    e.preventDefault();

    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-medium">
          Product Name
        </label>
        <Input
          placeholder="Enter product name"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Current Quantity
        </label>
        <Input type="number" placeholder="Enter quantity" />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Import Price</label>
        <Input type="number" placeholder="Enter import price" />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Retail Price</label>
        <Input type="number" placeholder="Enter retail price" />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Unit</label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select unit" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ml">ml</SelectItem>
            <SelectItem value="g">g</SelectItem>
            <SelectItem value="pcs">pcs</SelectItem>
            <SelectItem value="bottle">bottle</SelectItem>
            <SelectItem value="box">box</SelectItem>
            <SelectItem value="pair">pair</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Status</label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="unavailable">Unavailable</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit">Save Product</Button>
      </div>
    </form>
  );
}

export default ProductFormDialog;
