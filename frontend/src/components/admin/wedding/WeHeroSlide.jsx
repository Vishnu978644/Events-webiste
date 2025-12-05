import React, { useState, useRef } from "react";
import { FaTrash, FaPlus, FaImage } from "react-icons/fa";

const WedHeroSlide= () => {
    const [heroImages, setHeroImages] = useState([]); 
    const inputRef = useRef(null); 
    
    // SIMPLE: Trigger input
    const handleAdd = () => {
        inputRef.current.click();
    };

    // SIMPLE: Add image
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const imageURL = URL.createObjectURL(file);
        setHeroImages([...heroImages, imageURL]);
        e.target.value = null;
    };

    // SIMPLE: Delete specific image
    const handleDeleteImage = (index) => {
        URL.revokeObjectURL(heroImages[index]);
        setHeroImages(heroImages.filter((_, i) => i !== index));
    };

  return (
    <div className="mt-5 font-music font-bold text-[20px]">

      <div className="mb-2"> Hero Slide Images</div>

      {/* Icons Row */}
      <div className="flex items-center gap-4 text-[22px] mb-3 absolute right-10 ">
        <FaPlus 
            className="text-green-500 cursor-pointer" 
            title="Add New Image" 
            onClick={handleAdd} 
        />
        <span className="text-gray-600">/</span>

        {/* SIMPLE delete all */}
        <FaTrash 
            className="text-red-500 cursor-pointer" 
            title="Delete All Images"
            onClick={() => {
                heroImages.forEach((url) => URL.revokeObjectURL(url));
                setHeroImages([]);
            }}
        />
      </div>

      {/* Hidden Input */}
      <input
        type="file"
        className="hidden" 
        accept="image/*"
        ref={inputRef} 
        onChange={handleFileSelect} 
      />

      {/* Display Grid */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        {heroImages.map((imageURL, index) => (
            <div key={index} className="relative w-full h-40 border-2 border-gray-300 rounded-lg overflow-hidden group">
                
                <img 
                    src={imageURL} 
                    alt={`Hero Slide ${index + 1} Preview`} 
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                />

                {/* Individual Delete Button */}
                <button 
                    className="absolute top-1 right-1 p-2 bg-red-500/80 hover:bg-red-700 text-white rounded-full shadow-lg transition opacity-0 group-hover:opacity-100"
                    title={`Delete Image ${index + 1}`}
                    onClick={() => handleDeleteImage(index)}
                >
                    <FaTrash className="text-sm"/>
                </button>
            </div>
        ))}

        {heroImages.length === 0 && (
            <div className="w-full h-40 border-2 border-dashed border-gray-400 rounded-lg flex flex-col justify-center items-center text-gray-500 mt-0">
                <FaImage className="text-4xl mb-2" />
                Use the (+) icon to start adding images.
            </div>
        )}

      </div>

    </div>
  );
};

export default WedHeroSlide;
