import { PieChart, Pie, Tooltip, Cell } from "recharts";

const data = [
  { name: "Math", marks: 85 },
  { name: "Science", marks: 90 },
  { name: "English", marks: 75 },
  { name: "History", marks: 80 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const PieChartComponent = () => {
  return (
    <div className="mt-4 p-4 bg-white shadow-lg rounded-lg">
      <h3 className="text-lg font-bold mb-2">Exam Progress</h3>
      <PieChart width={400} height={300}>
        <Pie data={data} dataKey="marks" outerRadius={100} fill="#8884d8">
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
};

export default PieChartComponent;
