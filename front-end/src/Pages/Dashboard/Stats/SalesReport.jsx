import { useEffect, useState } from "react";
import api from "@/services/api";

function SalesReport() {
  const [type, setType] = useState("monthly");
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchReport();
  }, [type]);

  const fetchReport = async () => {
    try {
      const res = await api.get(`/dashboard/stats/sales-report?type=${type}`);

      setData(res.data);
    } catch (error) {
      console.log(error?.data?.message);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex justify-between mb-5">
        <h2 className="text-xl font-bold">Sales Report</h2>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th>Period</th>
            <th>Orders</th>
            <th>Revenue</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr key={item.period}>
              <td>{item.period}</td>

              <td>{item.total_orders}</td>

              <td>{Number(item.revenue).toLocaleString("vi-VN")}₫</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SalesReport;
