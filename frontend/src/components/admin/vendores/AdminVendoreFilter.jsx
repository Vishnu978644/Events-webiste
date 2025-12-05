import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ImagePlus,
  Images,
  MessageSquareText,
  ArrowDownNarrowWide,
} from "lucide-react";

const AdminVendoreFilter = () => {
  const datas = [
    {
      name: "Brides",
      value: 450,
      icon: <ImagePlus size={24} />,
      color: "bg-indigo-600",
      darkColor: "bg-indigo-700",
      link: "vendorenavi",
      sublink: [
        { label: "Brides Dresses", number: 110 },
        { label: "Brides Jewels", number: 205 },
        
      ],
    },

    {
      name: "Grooms",
      value: 450,
      icon: <Images size={24} />,
      color: "bg-teal-600",
      darkColor: "bg-teal-700",
      link: "vendorenavi",
      sublink: [
        { label: "Grooms Dresses", number: 140 },
        { label: "Grooms Jewels", number: 225 },
      ],
    },

    {
      name: "Wedding Halls",
      value: 450,
      icon: <MessageSquareText size={24} />,
      color: "bg-rose-600",
      darkColor: "bg-rose-700",
      link: "vendorenavi",
      sublink: [
        { label: "Wedding Halls", number: 90 },
        { label: "Transport", number: 180 },
        { label: "Hall Decorationg", number: 250 },
      ],
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);
  const [selectedValues, setSelectedValues] = useState({});

  const toggleDropdown = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const selectSubItem = (cardIndex, numberValue) => {
    setSelectedValues({
      ...selectedValues,
      [cardIndex]: numberValue,
    });
    setOpenIndex(null);
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 rounded-xl mt-[-10px] w-[900px]">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {datas.map((item, index) => (
          <div
            key={index}
            className={`
              ${item.color}
              text-white p-6 rounded-xl shadow-lg 
              flex flex-col justify-between h-[170px]
              transition-all duration-300 hover:scale-[1.03] 
              hover:shadow-2xl cursor-pointer relative
            `}
          >
            {/* TOP ROW */}
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-full ${item.darkColor}`}>
                {item.icon}
              </div>

              <h1 className="text-sm font-semibold uppercase pt-1">{item.name}</h1>

              <ArrowDownNarrowWide
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown(index);
                }}
              />
            </div>

            {/* VALUE */}
            <p className="text-4xl font-extrabold">
              {selectedValues[index] ?? item.value}
            </p>

            {/* CLICK FOOTER */}
            <Link to={item.link} className="text-xs font-medium opacity-80 self-end">
              Click to manage →
            </Link>

            {/* DROPDOWN */}
            {openIndex === index && (
              <div className="absolute right-4 top-[50px] bg-rose-200  text-black shadow-lg rounded-md p-2 z-50 text-[12px] w-[150px] border-2 border-white">
                {item.sublink.map((sub, i) => (
                  <div
                    key={i}
                    className="p-2 rounded hover:bg-gray-100 cursor-pointer"
                    onClick={() => selectSubItem(index, sub.number)}
                  >
                    {sub.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminVendoreFilter;
