import React, { useState } from "react";
import { vendorebride } from '../../../utils/Constant.js';
import { useNavigate } from "react-router-dom";

const BrideVendore = () => {
  const [selectedVendor, setSelectedVendor] = useState(null);
  const navigate = useNavigate();

  const handleMove = (vendor) => {
    navigate('/booking', { state: { vendor } });
  };

  const handleExplore = () => {
    navigate('/vent/bride');
  };

  const openVendorDetails = (vendor) => {
    setSelectedVendor(vendor);
  };

  const closeVendorDetails = () => {
    setSelectedVendor(null);
  };

  const handleClick = () => {
    setSelectedVendor(null);
  };

  return (
    <div className="mx-auto max-w-[1730px] mt-32 px-4 sm:px-10">
      {/* Heading */}
      <div className="text-center mb-16">
        <h1 className="text-4xl xl:text-4xl sm:text-5xl lg:text-6xl font-black text-rose-600 font-serif inline-block border-b-4 border-yellow-500 pb-2">
          Brides Vendors
        </h1>
        <p className="text-lg sm:text-[14px] font-medium text-gray-700 max-w-3xl mx-auto mt-2">
          Everything a bride needs to shine with beauty, grace, and elegance.
        </p>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8 justify-items-stretch">
        {vendorebride.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-white rounded-xl shadow-xl p-3 sm:p-4 
                       hover:shadow-2xl transition duration-500 border-2 border-rose-200 
                       transform hover:scale-[1.03] h-[300px] cursor-pointer"
            onClick={() => openVendorDetails(item)}
          >
            <img
              src={item.img}
              alt={item.title}
              className="w-[400px] h-20 sm:h-56 object-cover rounded-lg mb-4 shadow-md"
            />
            <h2 className="text-xl sm:text-[15px] font-bold text-rose-700 text-center px-2">
              {item.title}
            </h2>
          </div>
        ))}
      </div>

      {/* Vendor Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 z-[9999] bg-black bg-opacity-80 flex items-center justify-center overflow-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
            {/* Close button */}
            <button
              onClick={closeVendorDetails}
              className="absolute top-0 right-0 text-purple-700 text-3xl font-bold"
            >
              &times;
            </button>

            {/* Vendor Image */}
            <img
              src={selectedVendor.img}
              alt={selectedVendor.title}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />

            {/* Vendor Details */}
            <h2 className="text-2xl font-bold text-rose-700 mb-2">{selectedVendor.title}</h2>
            <p className="text-gray-700 mb-2"><strong>Designer:</strong> {selectedVendor.designer || "N/A"}</p>
            <p className="text-gray-700 mb-4"><strong>Package Price:</strong> {selectedVendor.price || "N/A"}</p>

            {/* Buttons */}
            <div className="flex justify-between mt-4">
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                onClick={() => handleMove(selectedVendor)}
              >
                Pay Now
              </button>

              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                onClick={handleExplore}
              >
                Explore More
              </button>

             
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default BrideVendore;
