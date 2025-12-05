import React, { useState, useEffect } from "react";

const pictures = [
  { img: '/event1.jpg' },
  { img: '/event2.jpg' },
  { img: '/event3.jpg' },
  { img: '/event4.jpg' },
  { img: '/event5.jpg' },
];

const Hero2 = () => {
  // 1. State to track the current image index
  const [currentIndex, setCurrentIndex] = useState(0);

  // 2. useEffect to set up the timer for sliding
  useEffect(() => {
    // Set up the interval (timer) to change the index every 2000ms
    const timer = setInterval(() => {
      // Calculate the next index, looping back to 0 when the end is reached
      setCurrentIndex((prevIndex) => (prevIndex + 1) % pictures.length);
    }, 2000); // Timer set to 2000 milliseconds (2 seconds)

    // Clear the interval when the component unmounts or the dependencies change
    return () => clearInterval(timer);
  }, []); // Empty dependency array ensures this effect runs once on mount

  // Get the current picture object based on the state
  const currentPicture = pictures[currentIndex];

  return (
    <div className="w-full flex justify-center mt-[120px] px-4">
      {/* Container for the single, overlaid image */}
      <div className="relative w-full max-w-[2600px] h-[400px]  shadow-2xl overflow-hidden mt-2">
        
        <img
          key={currentIndex} // Use key to force re-render, aiding in transition effect if applied
          src={currentPicture.img}
          alt={`Event Banner ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-1000 ease-in-out "
        />

        {/* Text/Overlay Content (Example) */}
       
      </div>
    </div>
  );
};

export default Hero2;