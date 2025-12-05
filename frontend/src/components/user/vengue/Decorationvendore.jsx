import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";

// 1. Define the API endpoint
const API_URL = "http://localhost:5000/decoration";

const Decorationvendore = () => {
  // State to hold the fetched hall data
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedHall, setSelectedHall] = useState(null);
  const [heroImage, setHeroImage] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Data coming from WedHall page (used for initial selection if passed)
  const initialItem = location.state;

  // 2. Data Fetching Logic (READ operation)
  useEffect(() => {
    const fetchHalls = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(API_URL);

        // Handle non-200 responses (e.g., 404, 500)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Map the fetched data to match the component's required structure
        const mappedData = data.map(item => ({
          id: item._id,
          img: item.mainImageUrl,
          name: item.title,
          price: item.price,
          thumbnails: item.thumbnailUrls || [],
          // Ensure description is mapped to 'desc'
          desc: item.description || "No description available for this venue." 
        }));

        setHalls(mappedData);

        // Check if there was an initial item passed via navigation state
        if (initialItem) {
          // Find the fully loaded item data based on the initial state ID
          const hallToSelect = mappedData.find(h => h.id === initialItem.id);
          if (hallToSelect) {
            setSelectedHall(hallToSelect);
            setHeroImage(hallToSelect.img);
          }
        }

      } catch (e) {
        console.error("Fetch Hall Error:", e);
        setError(`Failed to load wedding halls: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchHalls();
  }, [initialItem]);

  // --- UI/Modal Handlers ---

  const openModal = (hall) => {
    setSelectedHall(hall);
    setHeroImage(hall.img);
  };

// Corrected Hallvengue Navigation Handler
const handleClick = (hall) => {
    // 1. Force the modal to close immediately.
    setSelectedHall(null); 
    
    // 2. Wait 20 milliseconds to ensure the portal is fully removed.
    setTimeout(() => {
        navigate('/booking', { state: { vendor: hall } });
    }, 20); // This small delay prevents the conflict.
};

  const handleContact = () => {
    // Also close the modal before navigating to the contact page
    setSelectedHall(null); 
    navigate("/contact");
  };

  return (
    <div className="w-full min-h-[800px] flex flex-col items-center py-16 mt-[45px] mx-0 mr-[50px]">
      <h1 className="text-4xl font-music font-bold text-rose-700 drop-shadow-md mb-12 mb-[100px]">
        Wedding Halls Decorations
      </h1>

      {/* Loading/Error States */}
      {loading && (
        <p className="text-xl text-blue-600 font-semibold mb-6">Loading wedding halls...</p>
      )}
      {error && (
        <p className="text-xl text-red-600 font-semibold mb-6">Error: {error}</p>
      )}

      {/* Grid */}
      {!loading && halls.length === 0 && !error && (
        <p className="text-xl text-gray-500 font-semibold mb-6">No wedding halls found.</p>
      )}
      <div className="grid grid-cols-4 gap-12 px-10 relative">
        {halls.map((hall) => (
          <div
            key={hall.id}
            className="relative flex flex-col items-center group cursor-pointer"
          >
            {/* Hanging line (styling from original code) */}
            <div className="absolute top-[-50px] w-[2px] h-[50px] bg-rose-400"></div>

            {/* Card */}
            <div
              className="bg-white shadow-lg overflow-hidden transition-transform duration-300 group-hover:-translate-y-3 group-hover:rotate-[2deg] rounded-2xl"
              onClick={() => openModal(hall)}
            >
              <img
                src={hall.img || 'https://via.placeholder.com/430x300?text=No+Image'} // Fallback image
                alt={hall.name}
                className="w-[430px] h-[300px] object-cover rounded-2xl"
              />
            </div>

            <h2 className="text-center py-4 text-2xl font-bold text-rose-600 font-dancing mb-12">
              {hall.name}
            </h2>
          </div>
        ))}
      </div>

      {/* Modal - The Modal logic remains functional */}
      {selectedHall &&
        createPortal(
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999] p-4 overflow-auto">
            <div className="bg-white rounded-3xl overflow-hidden w-full max-w-[550px] shadow-2xl relative">
              <span
                onClick={() => setSelectedHall(null)}
                className="absolute top-3 right-5 text-5xl font-bold text-purple-700 cursor-pointer hover:text-red-600 z-50"
              >
                ×
              </span>
              <img
                src={heroImage}
                alt={selectedHall.name}
                className="w-full h-[220px] object-cover"
              />
              <div className="flex justify-center gap-3 p-3 flex-wrap">
                {selectedHall.thumbnails?.map((thumb, index) => (
                  <img
                    key={index}
                    src={thumb}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-[90px] h-[60px] object-cover rounded-lg cursor-pointer 
                            border-2 border-rose-200 hover:border-rose-500"
                    onClick={() => setHeroImage(thumb)}
                  />
                ))}
              </div>

              <div className="p-5 text-center">
                <h2 className="text-2xl font-bold text-rose-600 mb-1">
                  {selectedHall.name}
                </h2>
                <p className="text-pink-800 font-bold mb-4 text-lg">
                  Price: {selectedHall.price}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 px-2">
                  {selectedHall.desc}
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => handleClick(selectedHall)}
                    className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full font-semibold"
                  >
                    Pay Now
                  </button>
                  <button
                    onClick={handleContact}
                    className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full font-semibold"
                  >
                    Contact
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default Decorationvendore;