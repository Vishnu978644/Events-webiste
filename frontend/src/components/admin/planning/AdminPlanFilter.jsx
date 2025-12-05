import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ImagePlus,
  Images,
  MessageSquareText,
  ArrowDownNarrowWide,
  Plus, // 👈 New Icon
  Minus, // 👈 New Icon
} from "lucide-react";

const AdminPlanFilter = () => {
  const datas = [
    {
      name: "Destinations",
      value: 450,
      icon: <ImagePlus size={24} />,
      color: "bg-indigo-600",
      darkColor: "bg-indigo-700",
      link: "vendorenavi",
    },

    {
      name: "Services",
      value: 450,
      icon: <Images size={24} />,
      color: "bg-teal-600",
      darkColor: "bg-teal-700",
      link: "vendorenavi",
      sublink: [
        { label: "Catering", number: 140 },
        { label: "Makeup", number: 225 },
        { label: "Photography", number: 140 },
        { label: "Choreography", number: 225 },
      ],
    },
  ];

  // 1. STATE MANAGEMENT
  const [openIndex, setOpenIndex] = useState(null);
  // Stores the numeric value selected from the sublinks
  const [selectedValues, setSelectedValues] = useState({}); 
  // NEW: Stores the adjustment (+/-) made by the user
  const [localValueAdjustments, setLocalValueAdjustments] = useState({}); 

  // 2. HELPER FUNCTIONS

  const toggleDropdown = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const selectSubItem = (cardIndex, numberValue) => {
    setSelectedValues({
      ...selectedValues,
      [cardIndex]: numberValue,
    });
    setOpenIndex(null);
    // When a sub-item is selected, reset the local adjustment for that card
    setLocalValueAdjustments((prev) => {
      const newAdjustments = { ...prev };
      delete newAdjustments[cardIndex];
      return newAdjustments;
    });
  };

  // NEW FUNCTION: Handles increment/decrement
  const handleValueChange = (index, delta) => {
    setLocalValueAdjustments((prev) => {
      // 1. Get the current base value (selected sublink or default value)
      const baseValue = selectedValues[index] ?? datas[index].value;
      // 2. Get the current adjustment
      const currentAdjustment = prev[index] ?? 0;
      
      // Calculate the new total adjustment
      const newAdjustment = currentAdjustment + delta;

      // Optional: Prevent count from dropping below zero
      if (baseValue + newAdjustment < 0) return prev;

      // Update the state with the new adjustment
      return {
        ...prev,
        [index]: newAdjustment,
      };
    });
  };

  // 3. RENDER
  return (
    <div className="p-4 md:p-6 bg-gray-50 rounded-xl mt-[-10px] w-[1200px] ml-[60px] ">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-20">
        {datas.map((item, index) => {
          // Determine the base value (Sublink value takes precedence over default item value)
          const baseValue = selectedValues[index] ?? item.value;
          // Get the local adjustment from the buttons
          const adjustment = localValueAdjustments[index] ?? 0;
          // Calculate the final displayed value
          const displayedValue = baseValue + adjustment;

          return (
            <div
              key={index}
              className={`
                ${item.color}
                text-white p-6 rounded-xl shadow-lg 
                flex flex-col justify-between h-[170px]
                transition-all duration-300 hover:scale-[1.03] 
                hover:shadow-2xl cursor-pointer relative
              `}
              // Only navigate if there is no dropdown active
              onClick={() => {
                if (!item.sublink && item.link) {
                  // In a real app, you'd use useNavigate() hook here
                  // console.log("Navigating to:", item.link);
                }
              }}
            >
              {/* TOP ROW */}
              <div className="flex justify-between items-start">
                <div className={`p-3 rounded-full ${item.darkColor}`}>
                  {item.icon}
                </div>

                <h1 className="text-sm font-semibold uppercase pt-1">{item.name}</h1>

                {/* Only show arrow if there is a sublink */}
                {item.sublink && (
                  <ArrowDownNarrowWide
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation(); // IMPORTANT: prevents parent onClick
                      toggleDropdown(index);
                    }}
                  />
                )}
              </div>

              {/* VALUE AND BUTTONS ROW 👈 UPDATED */}
              <div className="flex justify-between items-center mt-2">
                {/* VALUE */}
                <p className="text-4xl font-extrabold">
                  {displayedValue}
                </p>

                {/* PLUS/MINUS BUTTONS 👈 ADDED */}
                <div className="flex space-x-2">
                  {/* Minus Button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents card click/dropdown toggle
                      handleValueChange(index, -1);
                    }}
                    className={`p-2 rounded-full ${item.darkColor} hover:opacity-80 transition-opacity`}
                    aria-label="Decrement value"
                  >
                    <Minus size={18} />
                  </button>
                  {/* Plus Button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents card click/dropdown toggle
                      handleValueChange(index, 1);
                    }}
                    className={`p-2 rounded-full ${item.darkColor} hover:opacity-80 transition-opacity`}
                    aria-label="Increment value"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
              {/* END VALUE AND BUTTONS ROW */}

              {/* CLICK FOOTER */}
              <Link
                to={item.link}
                className={`text-xs font-medium opacity-80 self-end ${
                  item.sublink ? "pointer-events-none opacity-50" : ""
                }`}
              >
                Click to manage →
              </Link>

              {/* DROPDOWN */}
              {openIndex === index && item.sublink && (
                <div 
                    className="absolute right-4 top-[50px] bg-rose-200 text-black shadow-lg rounded-md p-2 z-50 text-[12px] w-[150px] border-2 border-white"
                    onClick={(e) => e.stopPropagation()} // Prevents closing dropdown when clicking sublinks
                >
                  {item.sublink.map((sub, i) => (
                    <div
                      key={i}
                      className="p-2 rounded hover:bg-gray-100 cursor-pointer flex justify-between"
                      onClick={() => selectSubItem(index, sub.number)}
                    >
                      {sub.label}
                      <span className="font-bold ml-2">({sub.number})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default AdminPlanFilter;