import React, { useState } from "react";
import { cux } from "../../../utils/Constant.js"; // Assuming cux is the array of review data

const Review = () => {
  // Use a sensible default of 3 items for compact display on wide screens, 
  // but keep 4 for the grid structure's simplicity.
  const ITEMS_TO_SHOW = 4; 
  const [startIndex, setStartIndex] = useState(0);

  const nextSlide = () => {
    // Only move if there are enough items left to display the next full slide
    if (startIndex + ITEMS_TO_SHOW < cux.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const prevSlide = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  const visibleItems = cux.slice(startIndex, startIndex + ITEMS_TO_SHOW);

  return (
    // Centered container with reduced margins and max width for 1730px view
    <div className="w-full max-w-screen-xl mx-auto mt-36 mb-24 px-4">
      
      {/* --- Heading Section --- */}
      <div className="flex flex-col items-center justify-center text-center gap-4 mb-16 mt-36">
        {/* Reduced text size for heading */}
        <h1 className="font-music font-bold text-4xl md:text-5xl lg:text-6xl xl:text-4xl">
          Customers Review
        </h1>
        {/* Reduced text size for separator */}
        <p className="text-lg md:text-xl text-rose-500 font-semibold tracking-widest xl:text-[15px]">
          –––––– UPGRADE YOURSELF ––––––
        </p>
      </div>

      {/* --- Reviews Section (Slider) --- */}
      <div className="relative flex justify-center items-center">
        
        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          // Responsive positioning and size, disabled state added
          className={`absolute left-0 lg:left-[-60px] xl:left-[90px] text-3xl font-bold transition duration-300 p-2 text-pink-600
                    `}
         
        >
          ❮
        </button>

        {/* Review Cards Grid */}
        {/* Ensures 4 columns on large screens and removes fixed gaps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 transition-transform duration-300">
          {visibleItems.map((item, index) => (
            <div
              key={index}
              // Card width adjusted to be smaller and relative, height reduced
              className="relative bg-white shadow-xl rounded-2xl p-4 w-[200px] h-[300px] flex flex-col items-center text-center 
                         border-2  rounded-b-[100px] mx-auto transition-all duration-500"
            >
              <img
                src={item.imgURL}
                alt="Reviewer profile"
                // Reduced image size
                className="w-[120px] h-[120px] rounded-full object-cover border-4 border-rose-600"
              />
              <img
                src={item.imgURL1}
                alt="Decorative element"
                // Adjusted position for smaller card
                className="w-[60px] absolute top-2 right-4"
              />
              {/* Reduced text size */}
              <p className="text-2xl mt-4">{item.star}</p>
              <p className="text-sm mt-2 text-gray-700 px-2 line-clamp-3">
                {item.context}
              </p>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          // Responsive positioning and size, disabled state added
          className={`absolute right-0 lg:right-[-60px] xl:right-[90px] text-3xl font-bold transition duration-300 p-2 
                      ${startIndex + ITEMS_TO_SHOW >= cux.length ? 'text-gray-400 cursor-not-allowed' : 'text-rose-600 hover:text-rose-800'}`}
          disabled={startIndex + ITEMS_TO_SHOW >= cux.length}
        >
          ❯
        </button>
      </div>
    </div>
  );
};

export default Review;