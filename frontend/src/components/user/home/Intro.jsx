import React from "react";
import { intronames } from '../../../utils/Constant.js';

const Intro = () => {
    return (
        // Container centered on wide screens, height adjusted, and top margin reduced
        <div className="w-full max-w-screen-2xl mx-auto h-[550px] lg:h-[620px] xl:h-[350px] bg-rose-100 flex flex-col items-center justify-center text-center mt-10 rounded-xl shadow-lg">
            
            {/* Image size adjusted for 1730px view */}
            <img 
                src="./rose.jpg" 
                alt="Rose decoration" 
                className="w-[250px] md:w-[200px] lg:w-[350px] xl:w-[150px] mb-4 mt-10 " 
            />
            
            {/* name1: Reduced size for wide screens */}
            <p className="text-4xl md:text-5xl font-dancing text-rose-500 mb-2 xl:text-2xl">
                {intronames.name1}
            </p>

            {/* Separator div for controlled spacing */}
            <div className="h-4"></div> 
            
            {/* name2 & name3: Reduced size and spacing adjusted */}
            <h1 className="text-3xl md:text-3xl lg:text-[70px] xl:text-[35px] font-music font-bold text-black px-4 leading-snug">
                {intronames.name2}
                
                {/* Manual line breaks replaced with margin/padding control */}
                <div className="h-6 lg:h-8"></div> 
                
                <span className="md:text-4xl lg:text-5xl xl:text-[35px] block mb-12">
                    {intronames.name3}
                </span>
            </h1>
        </div>
    );
};

export default Intro;