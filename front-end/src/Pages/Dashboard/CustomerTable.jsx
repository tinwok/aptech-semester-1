import { CheckCircle, XCircle, Trash2, PencilIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
export default function CustomerTable({
  customers,
  pagination,
  onEdit,
  onDelete,
  onCustomerCreated,
  selectedCustomerId,
}) {
  const handleSelectCustomer = (customer) => {
    if (selectedCustomerId === customer.id) {
      onCustomerCreated?.(null);
    } else {
      onCustomerCreated?.(customer);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 shadow-lg">
      <table className="w-full">
        <thead className="bg-zinc-800">
          <tr>
            <th className="p-4 text-left text-zinc-300">Stt</th>
            <th className="p-4 text-left text-zinc-300">Name</th>
            <th className="p-4 text-left text-zinc-300">Email</th>
            <th className="p-4 text-left text-zinc-300">Phone</th>
            <th className="p-4 text-center text-zinc-300">Action</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((customer, index) => (
            <tr
              key={customer.user.id}
              onClick={() => handleSelectCustomer(customer)}
              className={`border-t border-zinc-700 cursor-pointer transition hover:bg-zinc-800 ${
                selectedCustomerId === customer.id
                  ? "bg-green-600/30 ring-2 ring-green-500"
                  : ""
              }`}
            >
              <td className="p-4 text-white">
                {(pagination.current_page - 1) * 10 + index + 1}
              </td>

              <td className="p-4 text-white">{customer.user.name}</td>
              <td className="p-4 text-white">{customer.user.email}</td>
              <td className="p-4 text-white">{customer.user.phone}</td>

              <td className="space-x-2 p-4 text-center ">
                <DropdownMenu>
                  <DropdownMenuTrigger className="px-2 rounded bg-white border border-transparent cursor-pointer hover:bg-blue-900 ">
                    ...
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={() => handleSelectCustomer(customer)}
                      >
                        <CheckCircle></CheckCircle>
                        {selectedCustomerId === customer.id
                          ? "Unselect"
                          : "Select"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(customer)}>
                        <PencilIcon></PencilIcon>
                        Edit
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={() => onDelete(customer.id)}
                        variant="destructive"
                      >
                        <Trash2 />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
