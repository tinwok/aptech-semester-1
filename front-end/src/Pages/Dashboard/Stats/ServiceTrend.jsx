import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function ServiceTrend({ trend }) {
  if (!trend) return null;

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex justify-between mb-5">
        <h2 className="text-xl font-bold">Service Trend</h2>

        <div>
          <span className="mr-5">🔥 {trend.most_popular?.service}</span>

          <span>😴 {trend.least_popular?.service}</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={trend.all}>
          <XAxis dataKey="service" />

          <YAxis />

          <Tooltip />

          <Bar dataKey="total_sold" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ServiceTrend;
