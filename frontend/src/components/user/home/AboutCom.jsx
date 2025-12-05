import React from 'react';
import { useNavigate } from 'react-router-dom';

const AboutCom = () => {
  const navigate = useNavigate();

  // Vendor / Service details to send to Booking page
  const serviceData = {
    img: "./a1.jpg",
    title: "Experienced Event Planners",
    designer: "Our Team",
    price: "Contact for Quote",
    packageDetails: [
      "Full Event Planning & Coordination",
      "Custom Event Design & Decor",
      "Guest Management & Invitations",
      "On-site Supervision",
      "Vendor Coordination",
      "Personalized Experience",
    ],
  };

  const handleBookingClick = () => {
    navigate('/booking', { state: { vendor: serviceData } });
  };

  return (
    <div className='w-full max-w-5xl mx-auto'>
      {/* Section Title */}
      <div className="flex flex-col items-center justify-center text-center gap-2 mt-16 mb-8 px-4">
        <h1 className='font-music font-bold text-3xl md:text-4xl lg:text-5xl xl:text-3xl'>
          About Company
        </h1>
        <p className='text-sm md:text-base text-rose-500 font-semibold tracking-widest xl:text-[15px] mb-20'>
          –––––– OUR COMPANY ––––––
        </p>
      </div>

      {/* Image and Text Blocks */}
      <div className="flex flex-col lg:flex-row justify-center items-center lg:items-start gap-8 lg:gap-16 mt-10 px-4">
        {/* Image Block */}
        <div className="w-full lg:w-1/2 max-w-md lg:max-w-none">
          <img
            src="./a1.jpg"
            alt="Team or event preparation image"
            className="w-full h-[350px] md:h-[400px] lg:h-[450px] xl:h-[400px] object-cover rounded-2xl border-2 border-pink-300 shadow-md"
          />
        </div>

        {/* Text Block */}
        <div className="w-full lg:w-1/2 max-w-md lg:max-w-none pt-2">
          <h1 className="font-music text-2xl lg:text-3xl xl:text-3xl font-bold mb-1">
            We are a team of passionate and
          </h1>
          <h1 className="font-music text-2xl lg:text-3xl xl:text-3xl font-bold text-rose-500 mb-4">
            experienced Events planners
          </h1>
          <p className="text-sm xl:text-[13px] md:text-base mt-2 mb-6 leading-normal text-gray-700">
            We are a team of passionate and experienced events planners dedicated to creating unforgettable moments that reflect your unique story. Our mission is to turn your dreams into beautifully executed celebrations filled with love, laughter, and timeless memories. From intimate gatherings to grand luxury weddings, we handle every detail — from planning, design, and décor to guest management and coordination — ensuring a seamless experience for you and your loved ones.
          </p>

          {/* BOOK NOW Button */}
          <button 
            onClick={handleBookingClick}
            className="text-sm md:text-base font-semibold border-2 border-rose-600 mt-2 bg-rose-200 px-5 py-2 rounded-md cursor-pointer 
                       transform hover:scale-105 transition duration-300 hover:bg-rose-300 text-rose-600 shadow-sm"
          >
            BOOK NOW
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutCom;
