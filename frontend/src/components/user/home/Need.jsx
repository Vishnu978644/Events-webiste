import React, { useState } from "react";
import { needdemo } from "../../../utils/Constant";
import { useNavigate } from "react-router-dom";

const Need = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const navigate = useNavigate();

  const handleBookNow = (card) => {
    navigate("/booking", { state: { vendor: card } });
  };
const handleClick=()=>{
  navigate("/vent")
}
  return (
    <div className="w-full max-w-screen-xl mx-auto mt-32">
      <h1 className="flex justify-center mt-20 text-3xl md:text-4xl lg:text-5xl xl:text-4xl font-music font-bold text-center px-4">
        All Your Need is Here
      </h1>
      <p className="text-base md:text-lg text-rose-500 flex xl:text-base justify-center items-center mt-3 mb-20 font-semibold tracking-wider">
        –––––– OUR SERVICES ––––––
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-3 gap-y-20 mt-12 px-4">
        {needdemo.map((item, index) => (
          <div
            key={index}
            className="text-center w-full cursor-pointer"
            onClick={() => setSelectedCard(item)}
          >
            {/* Card */}
            <div className="w-[240px] h-[310px] mx-auto [perspective:1000px] group shadow-xl rounded-t-[150px]">
              <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                <div className="absolute w-full h-full [backface-visibility:hidden]">
                  <img
                    src={item.imgURL}
                    alt={item.imgURL}
                    className="w-full h-full rounded-2xl object-cover border-4 border-rose-300 rounded-t-[150px]"
                  />
                </div>
                <div className="absolute w-full h-full bg-rose-50 rounded-t-[150px] flex items-center justify-center [backface-visibility:hidden] [transform:rotateY(180deg)] border-4 border-purple-700">
                  <img
                    src="./ci.jpg"
                    alt="Card background"
                    className="absolute w-full h-full object-cover opacity-50 rounded-t-[150px]"
                  />
                  <h1 className="text-lg md:text-xl xl:text-[13px] font-semibold font-music text-blue-950 w-3/4 relative z-10 p-2">
                    {item.rev}
                  </h1>
                </div>
              </div>
            </div>

            <h1 className="text-xl md:text-2xl font-music xl:text-[17px] font-bold text-black mt-4 px-2 xl:w-[240px] ml-[80px]">
              {item.passage}
            </h1>
            <button className="text-base md:text-lg mt-4 border-2 px-5 py-1 rounded-lg bg-rose-200 border-rose-500 text-rose-700 font-momo hover:bg-rose-300 hover:text-rose-600 transition duration-300 xl:text-[14px]">
              {item.btn}
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedCard && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 shadow-xl w-[90%] sm:w-[500px] relative text-center">
            <button
              className="absolute top-2 right-2 text-rose-600 font-bold text-xl"
              onClick={() => setSelectedCard(null)}
            >
              ✕
            </button>

            <img
              src={selectedCard.imgURL}
              alt={selectedCard.passage}
              className="w-full h-60 object-cover rounded-xl border-2 border-rose-300"
            />
            <h2 className="text-2xl font-bold text-rose-700 mt-4">
              {selectedCard.passage}
            </h2>
            <p className="text-gray-600 mt-2">{selectedCard.rev}</p>

            {/* Buttons */}
            <div className="flex justify-center gap-4 mt-6">
              <button className="px-5 py-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition"
              onClick={handleClick}
              >
                Explore More
              </button>
              <button
                className="px-5 py-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition"
                onClick={() => handleBookNow(selectedCard)}
              >
                Book Now
              </button>
            </div>

            <button
              onClick={() => setSelectedCard(null)}
              className="mt-6 text-rose-500 underline hover:text-rose-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Need;
