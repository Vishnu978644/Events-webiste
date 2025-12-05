import React from 'react';

const Hero4 = () => {
  const images = [
    '/gage7.jpg',
    '/gage8.jpg',
    '/gage9.jpg',
    '/gage10.jpg',
    '/gage11.jpg',
  ];

  return (
    // Outer container adjusted for top margin
    <div className="flex flex-col items-center justify-center bg-white py-12 mt-28">
      
      {/* Image Collage Section - Constrained to 1730px max width */}
      <div className="flex justify-center items-center w-full max-w-[1730px] px-4 space-x-3 md:space-x-5">
        {images.map((src, index) => (
          <div
            key={index}
            className={`mt-[20px]
              relative overflow-hidden shadow-xl rounded-lg
              h-80 md:h-[23rem] // Reduced height slightly
              // Adjusted width proportions for 5 columns in a 1730px container
              ${index === 2 ? 'w-1/4 max-w-[100px]' : 'w-[10%] max-w-[300px]'} 
              ${index === 0 || index === 4 ? 'hidden sm:block' : ''} // Keep hiding outer two on small screens
            `}
            style={{
              // Main image (index 2) remains centered, others shift
              transform:
                (index === 0 && 'translateY(8%)') ||
                (index === 4 && 'translateY(8%)') ||
                (index === 1 && 'translateY(-4%)') ||
                (index === 3 && 'translateY(-4%)') ||
                'translateY(0)',
              transition: 'transform 0.3s ease-in-out',
            }}
          >
            <img
              src={src}
              alt={`Bride collage strip ${index + 1}`}
              className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
            />
          </div>
        ))}
      </div>

      {/* Text Section - Reduced text size */}
      <div className="mt-10 text-center px-4">
        <h1 className="text-3xl md:text-3xl font-serif tracking-widest text-gray-700 mb-2 uppercase">
          G R O O M S
        </h1>
        <p className="text-base md:text-[15px] text-gray-800 font-light italic">
          The Grooms who stole the show and our hearts
        </p>
      </div>
    </div>
  );
};

export default Hero4;