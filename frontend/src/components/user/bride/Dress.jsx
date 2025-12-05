import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Assuming a read-only endpoint for fetching the dress catalog
const API_URL = 'http://localhost:5000/bridedress'; 

const Dress = () => {
  const navigate = useNavigate();
  
  // State to store the fetched list of dresses
  const [dresses, setDresses] = useState([]);
  // State for loading indicator
  const [loading, setLoading] = useState(true);
  // State for error handling
  const [error, setError] = useState(null);

  // --- Fetch Logic ---
  useEffect(() => {
    const fetchDresses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use axios to fetch data from the API
        const response = await axios.get(API_URL);
        
        // Assume the API returns an array of dress objects
        // The objects should have: url (for image), title, description, and price.
        // We map the 'url' property to 'img' to match the existing component structure.
        const fetchedDresses = response.data.map(dress => ({
            img: dress.url, // Map 'url' from API to 'img' for the component
            title: dress.title,
            description: dress.description,
            price: `₹${dress.price}`, // Format price assuming it comes as a number/string
            btn: "Buy",
            // Include any unique identifier like _id for navigation if needed later
            _id: dress._id 
        }));
        
        setDresses(fetchedDresses);
      } catch (err) {
        console.error("Error fetching dresses:", err);
        setError("Failed to load dress collection. Please try again later.");
        setDresses([]); // Clear list on error
      } finally {
        setLoading(false);
      }
    };

    fetchDresses();
  }, []); // Empty dependency array means this runs once on mount

  // --- Navigation Handler ---
  const handleClick = (dress) => {
    // Navigate to booking page with the selected dress details
    navigate('/booking', { state: { vendor: dress } });
  };

  // --- Render Logic ---
  return (
    <div className="flex flex-col items-center bg-gray-50 min-h-screen pt-20 mt-2 mb-0">
      
      {/* Page Header */}
      <h1 className="text-4xl md:text-4xl font-black font-serif tracking-widest text-pink-500 uppercase 
                      inline-block border-b-4 border-yellow-600 pb-2 mx-auto
                      mt-0 mb-20 text-center max-w-[1730px] px-4">
        Choose Your Dress
      </h1>

      {/* Banner */}
      <div className="relative mx-auto w-full max-w-[1730px] h-[350px] md:h-[400px] lg:h-[350px] mb-16 
                      rounded-3xl overflow-hidden shadow-xl px-4">
        <img
          src="/ban.jpg"
          alt="Banner"
          className="w-full h-full object-cover brightness-75 rounded-3xl"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-4xl md:text-5xl font-black font-serif mb-2">
            Elegant Wardrobe
          </h1>
          <p className="text-lg md:text-xl font-medium drop-shadow-md">
            Discover Our Exclusive Saree Collection
          </p>
        </div>
      </div>
      
      {/* Loading and Error States */}
      {loading && (
        <p className="text-xl text-blue-600 my-10">Loading beautiful dresses...</p>
      )}

      {error && (
        <p className="text-xl text-red-600 my-10 border p-4 rounded-lg bg-red-50">{error}</p>
      )}

      {/* Dress Grid */}
      {!loading && !error && dresses.length === 0 && (
        <p className="text-xl text-gray-500 my-10">No dresses found in the collection.</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 
                      gap-x-0 gap-y-16 px-4 pb-20 mx-auto w-full max-w-[1530px]">
        {dresses.map((dress, index) => (
          <div key={index} className="relative group flex flex-col items-center mx-auto w-[200px] h-[400px]">
            {/* Hanger Image */}
            <img
              src="/hanger.png"
              alt="Hanger"
              className="w-[100px] md:w-[100px] h-auto mb-[-20px] transition-transform duration-300 group-hover:rotate-2 z-10"
            />

            {/* Dress Card */}
            <div
              className="bg-white rounded-xl shadow-xl transition-all duration-500 transform group-hover:-translate-y-5 group-hover:rotate-1 overflow-hidden relative ml-8 mr-8
                          w-full max-w-xs"
              style={{ transformOrigin: "top center" }}
            >
              <img
                src={dress.img} // Uses the fetched dress.img (mapped from API url)
                alt={dress.title}
                className="w-full h-[300px] object-cover"
                onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/300x450?text=Image+Unavailable" }}
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-center px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <h3 className="text-lg md:text-xl font-bold text-pink-400 mb-2">
                  {dress.title}
                </h3>
                <p className="text-gray-100 text-[13px] mb-2">
                  {dress.description}
                </p>
                <p className="text-yellow-400 font-semibold mb-3">
                  {dress.price}
                </p>
                <button
                  className="bg-white px-3 mt-2 font-bold py-1 rounded-[50px] text-pink-500 hover:bg-gray-200 transition"
                  onClick={() => handleClick(dress)}
                >
                  {dress.btn}
                </button>
              </div>
            </div>

            {/* Title Below Card */}
            <h3 className="text-base md:text-[14px] font-semibold mt-4 text-gray-800 text-center">
              {dress.title}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dress;