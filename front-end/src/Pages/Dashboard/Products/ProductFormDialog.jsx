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
      onSubmit(formData);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 p-2  bg-stone-700 rounded p-5 text-white "
    >
      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-semibold ">
          Product Name
        </label>
        <Input
          placeholder="Enter product name"
          id="name"
          value={formData.name || ""}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold ">
          Current Quantity
        </label>
        <Input
          type="number"
          placeholder="Enter quantity"
          value={formData.current_quantity || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              current_quantity: Number(e.target.value),
            })
          }
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold ">
          Import Price
        </label>
        <Input
          type="number"
          placeholder="Enter import price"
          value={formData.import_price || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              import_price: Number(e.target.value),
            })
          }
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold ">
          Retail Price
        </label>
        <Input
          type="number"
          placeholder="Enter retail price"
          value={formData.retail_price || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              retail_price: Number(e.target.value),
            })
          }
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold ">Unit</label>
        <Select
          value={formData.unit || ""}
          onValueChange={(value) => setFormData({ ...formData, unit: value })}
        >
          <SelectTrigger className="w-full">
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
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Status
        </label>
        <Select
          value={formData.status || ""}
          onValueChange={(value) => setFormData({ ...formData, status: value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="unavailable">Unavailable</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" className="min-w-32">
          Save Product
        </Button>
      </div>
    </form>
  );
}

export default ProductFormDialog;
