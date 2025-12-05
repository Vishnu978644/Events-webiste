import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const WeddingCards = () => {
  const [selected, setSelected] = useState(null);
  const [weddings, setWeddings] = useState([]); // ✅ FIXED
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/type")
      .then((res) => res.json())
      .then((data) => setWeddings(data))
      .catch((err) => console.log("Error fetching data:", err));
  }, []);

  const handleBookNow = (wedding) => {
    navigate("/booking", {
      state: {
        vendor: {
          img: wedding.img1,
          title: wedding.title,
          designer: "Flora Weddings",
          price: "Contact for Quote",
          packageDetails: [wedding.details],
        },
      },
    });
  };

  const handleExploreMore = () => {
    navigate("/vent");
  };

  return (
    <section className="py-16 text-center px-6 max-w-[1500px] mx-auto">
      <h2 className="text-4xl font-music font-bold text-pink-700 mb-16 underline underline-offset-8 decoration-yellow-500">
        Welcome to a Wedding by Flora
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {weddings.map((item, i) => (
          <div
            key={i}
            onClick={() => setSelected(item)}
            className="rounded-xl overflow-hidden shadow-xl hover:shadow-2xl border border-pink-200 cursor-pointer transition"
          >
            <img src={item.img} alt={item.title} className="w-full h-84 object-cover" />
            <div className="p-4 bg-pink-50">
              <h3 className="text-xl font-bold text-pink-700">{item.title}</h3>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 shadow-xl w-[90%] sm:w-[500px] relative text-center">
            <button
              className="absolute top-2 right-3 text-rose-600 font-bold text-2xl hover:text-rose-800 transition"
              onClick={() => setSelected(null)}
            >
              ✕
            </button>

            <img
              src={selected.img1}
              alt={selected.title}
              className="w-full h-60 object-cover rounded-xl border-2 border-rose-300 shadow-md"
            />
            <h2 className="text-2xl font-bold text-rose-700 mt-4">{selected.title}</h2>
            <p className="text-gray-600 mt-3 text-base">{selected.details}</p>

            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={handleExploreMore}
                className="px-5 py-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition"
              >
                Explore More
              </button>
              <button
                onClick={() => handleBookNow(selected)}
                className="px-5 py-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition"
              >
                Book Now
              </button>
            </div>

            <button
              onClick={() => setSelected(null)}
              className="mt-6 text-rose-500 underline hover:text-rose-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default WeddingCards;
