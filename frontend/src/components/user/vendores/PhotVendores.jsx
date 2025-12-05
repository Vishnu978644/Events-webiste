import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

const photographers = [
  {
    id: 1,
    name: "Lens & Love",
    img: "/photo4.jpg",
    package: "Starts from $500",
    desc: "Spontaneous and heartfelt clicks that capture real emotions.",
  },
  {
    id: 2,
    name: "Romantic Frames",
    img: "/photo2.jpg",
    package: "Starts from $600",
    desc: "Romantic frames that celebrate your love and chemistry.",
  },
  {
    id: 3,
    name: "Wedding Wonders",
    img: "/photo3.jpg",
    package: "Starts from $550",
    desc: "Every ceremony, smile, and celebration — beautifully preserved.",
  },
  // Add more photographers here...
];

const PhotVendores = () => {
  const [selectedPhotographer, setSelectedPhotographer] = useState(null);

  const navigate=useNavigate();

  const handleClick=()=>{
    navigate('/contact')
  }

  return (
    <div className="mt-36">

      {/* Hero Section */}
      <div className="relative mx-auto max-w-[1730px] h-[350px] overflow-hidden px-4">
        <img
          src="/photo1.jpg"
          alt="Wedding Photography"
          className="w-full h-full object-cover brightness-[0.65] rounded-3xl shadow-xl"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
          <h1 className="text-5xl md:text-4xl font-black font-serif mb-4 tracking-wide drop-shadow-lg">
            Wedding Photography Vendors
          </h1>
          <p className="text-xl max-w-3xl text-gray-200 leading-relaxed drop-shadow-md">
            Capturing every emotion, every detail, and every unforgettable moment — 
            turning your love story into timeless art.
          </p>
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-[1200px] mx-auto text-center mt-16 mb-16 px-6">
        <h2 className="text-4xl font-bold font-music text-rose-600 mb-6">
          Your Story, Beautifully Framed
        </h2>
        <p className="text-[15px] text-gray-700 leading-relaxed">
          Our professional photographers specialize in creating visual stories that
          preserve your most precious wedding memories. From candid moments to cinematic
          portraits.
        </p>
      </div>

      {/* Gallery Section */}
      <div className="mx-auto max-w-[1730px] grid grid-cols-1 md:grid-cols-3 gap-8 px-4 sm:px-10 mb-28">
        {photographers.map((photo) => (
          <div
            key={photo.id}
            className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-300 transform hover:scale-[1.02] border-2 border-rose-100 cursor-pointer"
            onClick={() => setSelectedPhotographer(photo)}
          >
            <img
              src={photo.img}
              alt={photo.name}
              className="w-full h-[200px] object-cover"
            />
            <div className="p-6 text-center">
              <h3 className="text-[20px] text-rose-600 font-semibold mb-2 font-serif">
                {photo.name}
              </h3>
              <p className="text-gray-700 text-[13px]">{photo.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal using React Portal */}
      {selectedPhotographer &&
        createPortal(
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999] p-4 overflow-auto">
            <div className="bg-white rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl">
              <img
                src={selectedPhotographer.img}
                alt={selectedPhotographer.name}
                className="w-full h-auto max-h-[60vh] object-cover"
              />
              <div className="p-6 text-center">
                <h2 className="text-2xl font-bold text-rose-600 mb-2">{selectedPhotographer.name}</h2>
                <p className="text-gray-700 mb-2">{selectedPhotographer.desc}</p>
                <p className="text-gray-800 font-semibold mb-6">
                  Package: {selectedPhotographer.package}
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                 
                  <button
                    onClick={() => setSelectedPhotographer(null)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-full font-semibold transition duration-300"
                  >
                    Close
                  </button>
                  <button className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-full font-semibold transition duration-300"
                  onClick={handleClick}
                  >
                    Contact
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

    </div>
  );
};

export default PhotVendores;
