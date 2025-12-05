import React, { useState, useEffect } from "react";
import { slideImg } from "../../../utils/Constant.js";

const Hero = () => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            // Note: If slideImg is large, ensure this is efficient.
            setCurrent((prev) => (prev + 1) % slideImg.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    return (
        // Container now correctly centers and uses responsive height
        <div className="relative w-full max-w-screen-2xl mx-auto h-[600px] xl:h-[400px] overflow-hidden shaddow bg-rose-100 rounded-xl border-[3px] border-white shadow-xl">
            <img
                src={slideImg[current].imgURL}
                alt="slide"
                // Image scales to fill the container using w-full h-full
                className="w-full h-full transition-opacity duration-700 object-cover"
            />
            
            {/* Text container uses inset-0 for perfect centering and adds a subtle overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                {/* Responsive text sizes, using xl:text-8xl for 1730px screens */}
                <h1 className="text-white text-4xl sm:text-6xl lg:text-7xl xl:text-5xl font-dancing font-bold drop-shadow-2xl text-center px-4">
                    {slideImg[current].title}
                </h1>
            </div>
            
        </div>
    );
};

export default Hero;