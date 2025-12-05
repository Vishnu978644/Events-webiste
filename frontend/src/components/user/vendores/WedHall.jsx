import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const WedHall = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const navigate=useNavigate()


  const data = [
    {
      img: "/hall1.jpg",
      title: "Grand Capacity",
      desc: "Spacious halls to host from 100 to 2000 guests with comfort.",
      price:'$1000'
    },
    {
      img: "/hall2.jpg",
      title: "Elegant Décor",
      desc: "Custom themes and lighting that bring your dream setting to life.",
       price:'$2000'
    },
    {
      img: "/hall3.jpg",
      title: "Luxury Catering",
      desc: "Premium dining experiences with global and local flavors.",
       price:'$2000'
    },
    {
      img: "/hall4.jpg",
      title: "Prime Location",
      desc: "Easily accessible venues with ample parking and city convenience.",
       price:'$4000'
    },
    {
      img: "/hall5.jpg",
      title: "On-site Services",
      desc: "Professional staff and planners to make your event seamless.",
       price:'$2000'
    },
  ];

  const handleClick = (item) => {
    navigate("/vent/vengue", { state: item });
  };

  const handleClose = () => {
    setSelectedCard(null);
  };

  return (
    <div className="mt-10">
  <h1 className="text-center text-4xl font-bold font-music mb-12 text-pink-800 underline underline-offset-8 decoration-yellow-500">Wedding Vengue</h1>
      {/* GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mx-auto max-w-[1730px] px-4 sm:px-10">
      
        {data.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl 
                       transition duration-300 transform hover:scale-[1.03] border-2 border-rose-100"
          >
            <img
              src={item.img}
              alt={item.title}
              className="w-full h-[250px] object-cover"
              onClick={() => handleClick(item)}
            />
            <div className="p-4 text-center">
              <h4 className="text-[20px] font-semibold text-rose-600 mb-2 font-serif">
                {item.title}
              </h4>
              <p className="text-gray-700 text-sm sm:text-[13px]">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* POPUP */}
{selectedCard && (
  <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[9999]">

    <div className="relative bg-white p-4 rounded-xl shadow-xl w-[300px]">

      {/* X Close Icon */}
      <span
        onClick={handleClose}
        className="absolute top-3 right-4 text-3xl font-bold text-gray-700 cursor-pointer hover:text-red-600"
      >
        ×
      </span>

      {/* Image */}
      <img
        src={selectedCard.img}
        alt={selectedCard.title}
        className="w-full h-[250px] object-cover rounded-lg"
      />

      {/* Text */}
      <h3 className="text-xl font-bold text-rose-600 text-center mt-3">
        {selectedCard.title}
      </h3>
      <p className="text-gray-700 text-center">{selectedCard.desc}</p>
      <p className="text-pink-700 font-bold text-center">{selectedCard.price}</p>

    </div>
  </div>
)}

    </div>
  );
};

export default WedHall;
