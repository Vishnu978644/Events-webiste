import React from "react";
import { cardrotate } from "../../../utils/Constant";

const Card = () => {
  const total = cardrotate.length;

  // Reduced radius for a more contained arc on wide screens (was 750)
  const radius = 340;
  const totalArc = 190;
  const startAngle = -97;
  const step = totalArc / (total - 1);

  if (total === 0) return null;

  return (
    // Outer container for centering content on 1730px display
    <div className="w-full max-w-screen-2xl mx-auto mt-20  px-4 mb-[-82px]">

      {/* --- Heading Section (Positioned outside the arc area) --- */}
      <div className="flex flex-col items-center text-center mb-16 mt-36">
        <h1 className="font-music font-bold text-5xl md:text-6xl xl:text-4xl">
          Happy Customers
        </h1>
        <p className="text-xl md:text-2xl text-rose-500 xl:text-[15px] mt-4 font-semibold tracking-wider">
          –––––– UPGRADE YOURSELF ––––––
        </p>
      </div>

      {/* --- Arc Container --- */}
      {/* Reduced height for compactness (was 1430px) */}
      <div className="relative flex justify-center items-end h-[850px] lg:h-[950px] bg-white mx-auto">

        {/* Decorative image positioned below the arc */}
        <img
          src="./ar.jpg"
          alt="Decorative background"
          className="absolute bottom-10 w-[500px] lg:w-[600px] xl:w-[490px] z-0 "
        />

        {cardrotate.map((item, index) => {
          const angle = startAngle + index * step;
          const rad = (angle * Math.PI) / 180;

          // Calculate X and Y coordinates based on the new radius (550)
          const x = radius * Math.sin(rad);
          const y = radius * Math.cos(rad);

          const tilt = angle + 5;

          // Base position transform (translate + rotate)
          const baseTransform = `translate(calc(-50% + ${x}px), ${-y}px) rotate(${tilt}deg)`;

          return (
            <img
              key={index}
              src={item.imgURL}
              alt={`card-${index}`}
              // Reduced card size slightly for better fit (w/h)
              className="absolute w-[180px] h-[240px] rounded-3xl border-2 border-rose-800 shadow-lg object-cover 
                          transition-transform duration-500 z-10 hover:z-50"
              style={{
                top: "40%",
                left: "50%",
                bottom: "50px", // Lifted slightly above the absolute bottom edge
                transform: baseTransform,
                transformOrigin: "50% 100%",
              }}
              // Custom inline hover scaling on X axis
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = `${baseTransform} scale(1.3)`; // X zoom
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = baseTransform; // Reset
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Card;