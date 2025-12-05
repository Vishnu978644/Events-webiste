import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid} from "recharts";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const VendoreHome = () => {
  const navigate = useNavigate();

  const chartData = [
    { Product: "Brides", January: 861, February: 504, March: 1101 },
    { Product: "Grooms", January: 720, February: 680, March: 900 },
    { Product: "Wedding Halls", January: 950, February: 450, March: 1050 },
  ];
const COLORS = ["#007ACC", "#FF5733", "#28A745", "#FFC300", "#C70039"];
  
  return (
    <div className="flex gap-6 mt-6">

     <div className="w-[460px] h-[280px] border p-2 rounded-2xl bg-white shadow-lg flex justify-center items-center">
  <PieChart width={440} height={260}>
    <Pie
      data={chartData}
      dataKey="January"
      nameKey="Product"
      cx="50%"
      cy="50%"
      outerRadius={80}
      fill="#8884d8"
      label
    >
      {chartData.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip />
    <Legend wrapperStyle={{ paddingTop: 10 }} />
  </PieChart>
</div>

      {/* RIGHT SIDE – TOP VENDORS LIST */}
       <div className="p-6 flex justify-center">

                <div className="bg-pink-200 rounded-xl p-6 text-center w-full max-w-md">
                    <h2 className="text-2xl font-bold text-pink-800 mb-4">Artist Vendore</h2>
                    <p className="text-pink-700 mb-6">Manage all your slides and images from one place.</p>
                    <button
                        className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
                        onClick={() => navigate('/admin/artist')}
                    >
                        Go to Artist
                    </button>
                </div>

            </div>

    </div>
  );
};

export default VendoreHome;
