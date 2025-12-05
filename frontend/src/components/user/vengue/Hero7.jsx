import React, { useState } from "react";

const Hero7 = () => {
  const images = [
    "/heroven.jpg",
    "/heroven2.jpg",
    "/heroven3.jpg",
    "/heroven4.jpg",
  ];
  const [selected, setSelected] = useState(0);

  return (
    // Max width container, centered, and adjusted top margin
    <div className="relative mx-auto w-full max-w-[1730px] h-[410px] mt-[103px] flex flex-col items-center justify-center px-4 overflow-hidden  shadow-2xl ">
      
      {/* 🖼️ Main Hero Image */}
      <img
        src={images[selected]}
        alt="Hero"
        className="w-full h-full object-cover border-4 border-rose-300 shadow-lg transition-all duration-700"
      />

      {/* 🔤 Overlay Text - Reduced size */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center z-10 bg-black/30">
        <h1 className="text-6xl sm:text-5xl font-black font-serif mb-4 drop-shadow-xl">
          Elegant Wardrobe
        </h1>
        <p className="text-xl sm:text-2xl font-medium font-serif text-purple-200 drop-shadow-lg max-w-2xl">
          Discover Our Exclusive Saree Collection
        </p>
      </div>

      {/* 🖼️ Thumbnails */}
      <div className="absolute bottom-6 flex gap-4 sm:gap-6 z-10 bg-black/50 p-3 rounded-xl">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`Thumb ${i + 1}`}
            onClick={() => setSelected(i)}
            // Conditional border styling for the active thumbnail
            className={`w-20 sm:w-30 h-16 sm:h-20 object-cover rounded-xl border-4 cursor-pointer transition-all duration-300 ${
              selected === i
                ? "border-yellow-400 scale-105 shadow-2xl"
                : "border-transparent opacity-70 hover:opacity-100"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero7;