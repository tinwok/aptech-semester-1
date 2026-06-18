import { useEffect, useState } from "react";
import api from "@/services/api";
import SalesReport from "./Stats/SalesReport";
import InventoryReport from "./Stats/InventoryReport";
import ServiceTrend from "./Stats/ServiceTrend";

function Dashboard() {
  const [sales, setSales] = useState([]);
  const [inventory, setInventory] = useState(null);
  const [trend, setTrend] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [salesRes, inventoryRes, trendRes] = await Promise.all([
        api.get("/dashboard/stats/sales-report"),
        api.get("/dashboard/stats/inventory-report"),
        api.get("/dashboard/stats/service-trend"),
      ]);

      setSales(salesRes.data);
      setInventory(inventoryRes.data);
      setTrend(trendRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesReport />
        </div>

        <InventoryReport inventory={inventory} />
      </div>

      <ServiceTrend trend={trend} />
    </div>
  );
}

export default Dashboard;
