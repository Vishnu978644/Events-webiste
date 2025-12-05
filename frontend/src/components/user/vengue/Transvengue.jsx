import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/transport";

const Transvengue = () => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedVenue, setSelectedVenue] = useState(null);

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      // Map backend data to match your frontend fields
      const mapped = data.map((t) => ({
        id: t._id,
        img: t.url || "/placeholder.jpg",
        name: t.title || "No Name",
        desc: t.description || "No Description",
        price: t.price || "N/A",
      }));
      setVenues(mapped);
    } catch (err) {
      setError("Failed to fetch transport data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = (venue) => {
    navigate("/booking", { state: { service: venue } });
  };

  const closeModal = () => setSelectedVenue(null);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="w-full py-16 px-10">
      <h2 className="text-5xl font-music font-bold text-center text-rose-500 mb-32 underline underline-offset-8 decoration-yellow-500">
        Choose your Transport
      </h2>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {venues.map((venue) => (
          <div
            key={venue.id}
            className="relative bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden transition-shadow duration-300 cursor-pointer"
            onClick={() => setSelectedVenue(venue)}
          >
            <img
              src={venue.img}
              alt={venue.name}
              className="w-full h-96 object-cover"
            />
            <div className="p-4 text-center">
              <h3 className="text-xl font-bold text-rose-700">{venue.name}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedVenue && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[99999] p-4">
          <div className="bg-white rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl z-[100000]">
            <img
              src={selectedVenue.img}
              alt={selectedVenue.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-6 text-center">
              <h2 className="text-3xl font-bold text-rose-600 mb-2">
                {selectedVenue.name}
              </h2>
              <p className="text-gray-700 mb-2">{selectedVenue.desc}</p>
              <p className="text-gray-800 font-semibold mb-6">
                Price: {selectedVenue.price}
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => handleBooking(selectedVenue)}
                  className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-full font-semibold transition duration-300"
                >
                  Book Now
                </button>
                <button
                  onClick={closeModal}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-full font-semibold transition duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transvengue;
