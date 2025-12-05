import React from "react";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
  FaSpotify,
} from "react-icons/fa";

const Footer = () => {
  return (
    // Reduced margin top from 150px to a moderate value
    <footer className="bg-rose-100 mt-20 rounded-3xl w-full border-4 border-rose-200 overflow-hidden mb-2">
      
      {/* Main Content Container (Logo + Link Columns) */}
      {/* Reduced vertical padding from py-12 to py-8 */}
      <div className="max-w-screen-2xl h-[100px] mx-auto flex flex-col lg:flex-row justify-between items-start px-6 md:px-12 lg:px-16 xl:px-20 py-8 gap-6 mb-2">
        
        {/* Left side - Logo & Tagline */}
        <div className="relative flex flex-col justify-start items-center lg:items-start w-full lg:w-1/3">
          <div className="text-center lg:text-left flex ml-[100px] mt-[-50px] w-[300px]">
            <img
              src="./logo.jpg"
              alt="Logo"
              // Slightly reduced logo size
              className="w-[100px] lg:w-[120px] mx-auto lg:mx-0 "
            />
            {/* Reduced margin and text size */}
            <p className="text-[13px] font-momo text-purple-600 mt-[73px]">
              events & connected
            </p>
          </div>

          <img
            src="./flowers.png"
            alt="flowers"
            // Adjusted positioning to be less intrusive on height
            className="hidden md:block absolute top-[-90px] left-[-70px] lg:left-[-120px] w-[210px] lg:w-[260px] h-auto opacity-80"
          />
        </div>

        {/* Center Columns (Link Sections) */}
        {/* Reduced gap between columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 lg:gap-8 xl:gap-6 text-gray-700 w-full lg:w-2/3 ml-[100px]">
          
          {/* Column 1: Our Company */}
          <div className="">
            <h2 className="font-bold lg:text-[18px] md:text-2xl mb-3 text-gray-900">
              Our Company
            </h2>
            {/* Reduced vertical space-y */}
            <ul className="space-y-1 text-base md:text-lg lg:text-[14px]">
              <li>Blog</li>
              <li>Podcast</li>
              <li>Careers</li>
              <li>Newsroom</li>
            </ul>
          </div>

          {/* Column 2: Products */}
          <div>
            <h2 className="font-bold lg:text-[18px] md:text-2xl mb-3 text-gray-900">
              Products
            </h2>
            <ul className="space-y-1 text-base md:text-lg lg:text-[14px]">
              <li>Cut Flowers</li>
              <li>Ornamental Plants</li>
              <li>Merchandising</li>
              <li>Partner Resources</li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h2 className="font-bold lg:text-[18px] md:text-2xl mb-3 text-gray-900">
              Contact
            </h2>
            <ul className="space-y-1 text-base md:text-lg lg:text-[14px]">
              <li>FAQs</li>
              <li>Contact</li>
              <li>About Us</li>
            </ul>
          </div>

          {/* Column 4: More Products */}
          <div>
            <h2 className="font-bold lg:text-[18px] md:text-2xl mb-2 text-gray-900">
              More Products
            </h2>
            <ul className="space-y-0 text-base md:text-lg lg:text-[14px]">
              <li>Cut Flowers</li>
              <li>Ornamental Plants</li>
              <li>Merchandising</li>
              <li>Partner Resources</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Address Section */}
      <div className="flex  px-6 md:px-12 pt-4 pb-6 ">
        <p className="text-center text-gray-600 text-sm md:text-base max-w-4xl leading-relaxed w-[270px] ml-[120px] ">
          Jalan Cempaka Wangi No 22 Jakarta - Indonesia Jalan Cempaka Wangi
        </p>
      </div>

      {/* Bottom Bar (Social Icons) - Reduced vertical padding to py-4 */}
      <div className="flex flex-col md:flex-row  items-center gap-6 py-4 border-t border-gray-200 ml-[175px]">
        <div className="flex gap-8 md:gap-12 lg:text-xl md:text-3xl text-gray-600">
        
          <FaFacebookF className="hover:text-blue-500 cursor-pointer transition" />
          <FaYoutube className="hover:text-red-600 cursor-pointer transition" />
          <FaSpotify className="hover:text-green-500 cursor-pointer transition" />
            <FaLinkedinIn className="hover:text-blue-600 cursor-pointer transition" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;