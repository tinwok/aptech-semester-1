// CustomerContext.jsx
import { createContext, useContext, useState } from "react";

const CustomerContext = createContext();

export function CustomerProvider({ children }) {
  const [selectedCustomerId, setSelectedCustomerId] = useState(
    customerId || null,
  );

  return (
    <CustomerContext.Provider
      value={{ selectedCustomerId, setSelectedCustomerId }}
    >
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  return useContext(CustomerContext);
}
