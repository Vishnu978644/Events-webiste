import React from "react";
import { side } from "../../../utils/Constant";
import { Link } from "react-router-dom";

const Sidenav = () => {
  return (
    // Outer container: Reduced height to h-[60px]
    <div className="fixed top-[60px] left-0 w-full z-[9999] h-[50px] shadow-lg ">

      {/* Background container: Stretches across the full fixed element */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat "
        style={{
          backgroundImage: "url('https://i.pinimg.com/1200x/43/9d/f1/439df1fd1cf3855295cab46f73c13038.jpg') ",
        }}
      >
        {/* Optional overlay for readability */}
        <div className="absolute inset-0 bg-purple-400/30 backdrop-blur-[2px]"></div>
      </div>

      {/* Navigation Content Wrapper: Constrained, centered, and set to h-full (60px) */}
      <div
        className="relative h-full mx-auto 
                   max-w-[1700px] w-full 
                   flex items-center justify-center 
                   border-b-4 border-pink-200"
      >
        {/* Navigation Links container */}
        <div className="relative flex items-center justify-center gap-x-10 px-4 md:gap-x-20 mr-[100px]">

          {/* Optional sidebar image: Adjusted for smaller height */}
          

          {side.map((item, index) => (
            <Link key={index} to={item.path}>
              <h1
                className="text-lg md:text-[16px] font-black font-serif text-white hover:text-black
                                   cursor-pointer hover:bg-white/60 hover:scale-110 px-3 py-1
                                   rounded-xl transition-all duration-300 ease-in-out whitespace-nowrap"
              >
                {item.name}
              </h1>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidenav;