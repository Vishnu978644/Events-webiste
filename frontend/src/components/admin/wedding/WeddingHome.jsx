import React from "react";
import { useNavigate } from "react-router-dom";
import { Images, Home, Brush, Bus } from "lucide-react";

const WeddingHome = () => {
  const navigate = useNavigate();

  const items = [
    {
      title: "Hero Slide",
      path: "/admin/wedding/wedhero",
      icon: <Images size={28} />,
      color: "text-red-500",
    },
    {
      title: "Wedding Halls",
      path: "/admin/wedding/wedhall",
      icon: <Home size={28} />,
      color: "text-blue-500",
    },
    {
      title: "Hall Decorations",
      path: "/admin/wedding/decorationhalls",
      icon: <Brush size={28} />,
      color: "text-green-500",
    },
    {
      title: "Transport",
      path: "/admin/wedding/transport",
      icon: <Bus size={28} />,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">

      {items.map((item, index) => (
        <div
          key={index}
          onClick={() => navigate(item.path)}
          className="
            bg-white p-6 rounded-xl shadow-lg 
            cursor-pointer transition-all duration-300 
            flex items-center space-x-4
            border-l-4 border-l-transparent
            hover:shadow-xl hover:border-l-teal-400
          "
        >
          {/* Icon */}
          <div className={`p-3 rounded-full bg-gray-100 ${item.color}`}>
            {item.icon}
          </div>

          {/* Title */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 leading-none">
              {item.title}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Go to Editor →
            </p>
          </div>
        </div>
      ))}

    </div>
  );
};

export default WeddingHome;
