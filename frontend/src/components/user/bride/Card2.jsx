import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// NOTE: Define your API endpoint
const API_URL = "http://localhost:5000/bridemakeup";

const Card2 = () => {
  // State to store the fetched list of makeup services
  const [cardsData, setCardsData] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // --- Fetch Data Logic ---
  useEffect(() => {
    const fetchMakeupServices = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(API_URL);
        
        // Map the fetched data to the component's expected structure
        // Assuming the API returns: url (for main image), title, description, design (for designer), price (for package)
        const mappedData = response.data.map(item => ({
            // The API provides 'url' which we'll use for the main image
            img: item.url, 
            // Since the API only has one image URL, we'll use the same URL for the modal (img1)
            img1: item.url, 
            title: item.title,
            // Assuming 'design' field from schema maps to 'designer' on client side
            designer: item.design, 
            // Assuming 'description' field from schema maps to 'desc' on client side
            desc: item.description, 
            // Format the number price into a string package
            package: `Starts from $${item.price.toFixed(2)}`,
            // Include the full API object for booking purposes
            ...item 
        }));

        setCardsData(mappedData);
      } catch (err) {
        console.error("Error fetching makeup data:", err);
        setError("Failed to load makeup packages. Please check the server connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchMakeupServices();
  }, []); 
  
  // --- Navigation Handlers ---
  const handleBook = (card) => {
    // Navigate to Booking page with selected card info (including the original API data like _id)
    navigate("/booking", { state: { vendor: card } });
  };

  const handleContact = () => {
    navigate("/contact");
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 bg-gray-50 min-h-screen">
      
      {/* Heading */}
      <h2 className="text-5xl md:text-4xl font-black tracking-widest text-pink-500 uppercase mb-16 font-serif
                      inline-block border-b-4 border-yellow-600 pb-2 text-center">
        M A K E U P
      </h2>

      {/* Loading and Error States */}
      {loading && <p className="text-xl text-blue-600 my-10">Loading makeup packages...</p>}
      {error && <p className="text-xl text-red-600 my-10 border p-4 rounded-lg bg-red-100">{error}</p>}
      
      {/* Grid */}
      {!loading && !error && cardsData.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-20 mx-auto max-w-[1730px] px-6 md:px-10 justify-items-stretch">
          {cardsData.map((card, index) => (
            <div
              key={card._id || index} // Use MongoDB ID if available
              className="bg-white rounded-xl shadow-xl hover:shadow-2xl transition-transform transform hover:scale-[1.03] 
                         p-5 flex flex-col items-center justify-between cursor-pointer"
            >
              <img
                src={card.img}
                alt={card.title}
                className="w-[200px] h-[210px] object-cover rounded-lg mb-6"
                onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/200x210?text=Image+Missing" }}
              />
              <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{card.title}</h3>
                  <p 
                    className="text-pink-600 font-medium hover:cursor-pointer hover:text-pink-800 transition"
                    onClick={() => setSelectedCard(card)}
                  >
                    Explore
                  </p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* No Data State */}
      {!loading && !error && cardsData.length === 0 && (
          <p className="text-xl text-gray-500 my-10">No makeup packages are currently available.</p>
      )}

      {/* Modal using React Portal */}
      {selectedCard &&
        createPortal(
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999] p-4 overflow-auto">
            <div className="bg-white rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl">
              <img
                src={selectedCard.img1}
                alt={selectedCard.title}
                className="w-full h-auto max-h-[50vh] object-cover"
                onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/500x300?text=Image+Missing" }}
              />
              <div className="p-6 text-center">
                <h2 className="text-2xl font-bold text-pink-500 mb-2">{selectedCard.title}</h2>
                <p className="text-gray-700 mb-2">{selectedCard.desc}</p>
                <p className="text-gray-800 font-semibold mb-2">Designer: {selectedCard.designer}</p>
                <p className="text-gray-800 font-semibold mb-6">Package: {selectedCard.package}</p>
                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    onClick={() => handleBook(selectedCard)}
                    className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full font-semibold transition duration-300"
                  >
                    Book
                  </button>
                  <button
                    onClick={() => setSelectedCard(null)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-full font-semibold transition duration-300"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleContact}
                    className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full font-semibold transition duration-300"
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

export default Card2;