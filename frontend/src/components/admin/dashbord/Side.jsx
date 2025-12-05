import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Folder,
  Users,
  Crown,
  HeartHandshake,
  Phone,
  ListChecks,
  IndianRupeeIcon,
  ArrowDown
} from "lucide-react";

const Side = () => {
  const [openIndex, setOpenIndex] = useState(null); // which dropdown is open

  const toggleDropdown = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const menu = [
    { name: "Dashboard", path: "/admin/dashbord", icon: <LayoutDashboard size={20} /> },

    {
      name: "Categories",
      path: "/admin/categories",
      icon: <ListChecks size={20} />,
      sublink: [
       { name: "Wedding Events", path: "/admin/categories/wedflora" },
        { name: "Birthday Events", path: "/admin/categories/birthgallery" },
        { name: "Corparate Events", path: "/admin/categories/recentimages" },
      ],
    },

    { name: "Vendores", path: "/admin/vendore", icon: <Folder size={20} />,
  sublink: [
        { name: "Brides", path: "/admin/bridegroom/bridedress" },
        { name: "Grooms", path: "/admin/bridegroom/groomjewels" },
        { name: "Wedding Halls", path: "/admin/wedding/wedhall" },
      
      ],
  },
   
    { name: "Planning", path: "/admin/planning", icon: <Crown size={20} /> ,
   sublink: [
        { name: "Destinations", path: "/admin/planning/destinationplan" },
        { name: "Services", path: "/admin/planning/serviceplan" },
      
      ],
  },
   
    { name: "Payments", path: "/admin/payment", icon: <IndianRupeeIcon size={20} /> },
     { name: "Contact", path: "/admin/contact", icon: <Phone size={20} /> },
  ];

  return (
    <div className="w-[270px] h-screen bg-rose-200 flex flex-col justify-between p-6 rounded-r-3xl shadow-xl fixed">

      {/* Logo */}
      <div>
        <div className="flex mb-[-30px] ">
          <img
            src="/logo.jpg"
            alt="Logo"
            className="w-[84px] h-36 mb-2 ml-10 mt-[-42px] object-cover"
          />
          <p className="text-[15px] font-momo font-bold text-purple-800 items-center flex justify-center ml-2">
            Admin
          </p>
        </div>

        {/* Sidebar Menu */}
        <ul className="space-y-3 mt-6">
          {menu.map((item, index) => (
            <div key={index}>
              <li className="flex items-center justify-between text-[17px] cursor-pointer px-4 py-3 rounded-xl 
                hover:bg-white transition hover:text-[#4C8FFF]">

                {/* Left side icon + text */}
                <div
                  className="flex items-center gap-4 w-full"
                  onClick={() => item.sublink && toggleDropdown(index)}
                >
                  {item.icon}
                  {item.path ? (
                    <Link to={item.path}>{item.name}</Link>
                  ) : (
                    item.name
                  )}
                </div>

                {/* Arrow for dropdown items */}
                {item.sublink && (
                  <ArrowDown
                    className={`transition-transform duration-300 cursor-pointer ml-2 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                    size={18}
                    onClick={(e) => {
                      e.stopPropagation(); // STOP navigation
                      toggleDropdown(index);
                    }}
                  />
                )}
              </li>

              {/* Dropdown List */}
              {item.sublink && openIndex === index && (
                <ul className="ml-8 mt-2 border-l-4 border-rose-400 pl-4 space-y-1">
                  {item.sublink.map((sub, i) => (
                    <li key={i}>
                      <Link
                        to={sub.path}
                        className="text-[15px] py-1 block text-gray-700 hover:text-pink-800 font-bold cursor-pointer"
                      >
                        • {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Side;
