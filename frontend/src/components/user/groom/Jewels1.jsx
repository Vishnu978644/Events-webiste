import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

// NOTE: Ensure this URL matches your Express route for fetching jewels
const API_URL = 'http://localhost:5000/groomjewel';

const Jewels1 = () => {
  const navigate = useNavigate();
  
  // State to hold the fetched jewel data
  const [jewels, setJewels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Data Fetching Logic (READ) ---
  useEffect(() => {
    const fetchJewels = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(API_URL);
        
        // --- CRUCIAL FIX: MAP API's 'url' TO COMPONENT's EXPECTED 'img' KEY ---
        // This ensures the image shows both on this page and the /booking page
        const mappedJewels = res.data.map(jewel => ({
            img: jewel.url, // Map the API field 'url' to the component field 'img'
            title: jewel.title,
            description: jewel.description,
            price: jewel.price,
            btn: "Buy",
            _id: jewel._id // Include unique ID
        }));

        setJewels(mappedJewels); 
      } catch (err) {
        console.error("Error fetching jewels:", err);
        setError("Failed to load jewels. Please check the server connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchJewels();
  }, []);

  const handleBuy = (jewel) => {
    // Passes the object which NOW contains the correct 'img' key
    navigate("/booking", { state: { vendor: jewel } }); 
  };

  // --- Conditional Rendering for Loading and Errors ---
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl text-pink-500">
        Loading magnificent jewelleries...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-xl text-red-600 p-4">
        <p>{error}</p>
        <p className="text-gray-500 text-base mt-2">Check if your Node.js server is running at {API_URL}</p>
      </div>
    );
  }

  if (jewels.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen pt-20 text-gray-700">
        <h2 className="text-2xl font-semibold">No Jewellery Found</h2>
        <p className="mt-2">Please add items through the admin panel at /bridejeweladmin.</p>
      </div>
    );
  }
    
  return (
    <div className="flex flex-col items-center bg-gray-50 min-h-screen pt-20">
      
      {/* Title */}
      <h1 className="text-4xl md:text-4xl font-black font-serif tracking-widest text-pink-500 uppercase 
                      inline-block border-b-4 border-yellow-600 pb-2 mx-auto
                      mt-2 text-center max-w-[1730px] px-4 mb-36">
        Choose Your Jewellery
      </h1>

      {/* Banner */}
      <div className="relative mx-auto w-full max-w-[1730px] h-[250px] md:h-[400px] lg:h-[450px] mb-20 rounded-3xl overflow-hidden shadow-xl px-4">
        <img src="/ban4.jpg" alt="Jewellery Banner" className="w-full h-full object-cover brightness-75 rounded-3xl" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-4xl md:text-5xl font-black font-serif mb-2">Magnificent Jewelleries</h1>
          <p className="text-lg md:text-xl font-medium drop-shadow-md">Discover Our Exclusive Jewellery Collection</p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-x-4 gap-y-12 px-4 pb-20 mx-auto w-full max-w-[1730px]">
        {jewels.map((jewel, index) => (
          <div key={jewel._id || index} className="relative group flex flex-col items-center mx-auto">
            <div className="bg-white rounded-xl shadow-xl transition-all duration-500 transform group-hover:-translate-y-4 group-hover:rotate-1 overflow-hidden relative w-full max-w-xs">
              <img 
                src={jewel.img} // Uses the mapped 'img' key which holds the API 'url'
                alt={jewel.title} 
                className="w-[300px] h-[250px] object-cover" 
                onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/300x250?text=Image+Not+Found" }}
              />
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-center px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <h3 className="text-lg md:text-xl font-bold text-pink-400 mb-2">{jewel.title}</h3>
                <p className="text-gray-100 text-sm">{jewel.description}</p>
                <p className="text-yellow-400 font-semibold mt-2">Price: {jewel.price}</p>
                <button
                  className="bg-white px-3 mt-4 font-bold py-1 rounded-[50px]"
                  onClick={() => handleBuy(jewel)}
                >
                  {jewel.btn || 'Buy'}
                </button>
              </div>
            </div>
            {/* Title & Price Below */}
            <h3 className="text-base md:text-lg font-semibold mt-4 text-gray-800 text-center">{jewel.title}</h3>
            <p className="text-sm text-gray-600">{jewel.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Jewels1;