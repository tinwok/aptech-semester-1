import api from "@/services/api";
import { useEffect } from "react";
import Supplier from "../Supplier/Supplier";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
function InventoryOrder({ product, onSuccess }) {
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);
  const [formData, setFormData] = useState({
    product_id: product?.id || "",
    supplier_id: "",
    quantity: "",
    note: "",
  });
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get("/dashboard/inventory");
    } catch (error) {
      console.log(error?.response?.data);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleReset = () => {
    setFormData({
      product_id: "",
      supplier_id: "",
      quantity: "",
      note: "",
    });

    setSelectedSupplierId(null);
  };
  const handleSubmit = async () => {
    try {
      const res = await api.post("dashboard/inventory/import", formData);

      onSuccess();
      toast.success("Created order successfully!");
    } catch (error) {
      console.log(error?.response?.data);
      toast.warning("Created order failed!");
    }
  };
  return (
    <div>
      {" "}
      <Supplier
        onSuppliersCreated={(supplier) => {
          setSelectedSupplierId(supplier ? supplier.id : null);
          setFormData((prev) => ({
            ...prev,
            supplier_id: supplier?.id || "",
          }));
        }}
        selectedSupplierId={selectedSupplierId}
      ></Supplier>
      <FieldGroup className="w-[50%] shadow-md p-5 rounded">
        <Field>
          <FieldLabel htmlFor="fieldgroup-quantity">Quantity</FieldLabel>
          <Input
            id="fieldgroup-quantity"
            name="quantity"
            placeholder="Input quantity"
            value={formData.quantity}
            onChange={handleChange}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="fieldgroup-note">Note</FieldLabel>
          <Input
            id="fieldgroup-note"
            name="note"
            placeholder="Input note"
            value={formData.note}
            onChange={handleChange}
          />
          <FieldDescription>Order Products</FieldDescription>
        </Field>
        <Field orientation="horizontal">
          <Button type="reset" variant="outline" onClick={() => handleReset()}>
            Reset
          </Button>
          <Button type="button " onClick={() => handleSubmit()}>
            Submit
          </Button>
        </Field>
      </FieldGroup>
    </div>
  );
}

export default InventoryOrder;
