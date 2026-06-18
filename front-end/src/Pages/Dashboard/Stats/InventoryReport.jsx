function InventoryReport({ inventory }) {
  if (!inventory) return null;

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="font-bold text-xl mb-5">Inventory Report</h2>

      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          Import: {inventory.import}
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          Export: {inventory.export}
        </div>

        <div className="bg-red-50 p-4 rounded-lg">Waste: {inventory.waste}</div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          Low Stock:
          {inventory.low_stock_products.length}
        </div>
      </div>
    </div>
  );
}

export default InventoryReport;
