import React, { useState, useEffect } from "react";

const CorpHero = () => {
  const [recent, setRecent] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Recent Data From API
  useEffect(() => {
    setLoading(true);

    fetch("http://localhost:5000/recent")
      .then((res) => res.json())
      .then((data) => {

        // 🔥 MAP BACKEND → FRONTEND PROPERLY
        const mapped = data.map((item) => ({
          img: item.url ?? null,
          head: item.head ?? "",
          desc: item.desc ?? "",
          date: item.date ?? "",
          location: item.location ?? ""
        }));

        setRecent(mapped);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error fetching data", err);
        setError("Error fetching data");
        setLoading(false);
      });
  }, []);

  const openEventDetails = (event) => {
    setSelectedEvent(event);
  };

  const closeEventDetails = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="w-full">

      {/* Heading */}
      <h2 className="text-4xl font-bold font-music text-pink-800 underline underline-offset-8 decoration-yellow-500 text-center mt-24">
        Recent Corporate Highlights
      </h2>

      {/* Loading */}
      {loading && (
        <p className="text-center text-gray-600 mt-10">Loading events...</p>
      )}

      {/* Error */}
      {error && (
        <p className="text-center text-red-600 mt-10">{error}</p>
      )}

      {/* Events Grid */}
      {!loading && !error && (
        <div className="max-w-[1300px] mx-auto px-6 mt-20 mb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {recent.map((event, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl cursor-pointer transition text-center"
                onClick={() => openEventDetails(event)}
              >
                <img
                  src={event.img ? event.img : null}
                  alt={event.head || "Recent Image"}
                  className="w-full h-56 object-cover rounded-2xl"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/400x300?text=Image+Not+Found";
                  }}
                />

                <div className="p-4">
                  <h3 className="text-[20px] font-bold font-momo text-pink-700">
                    {event.head}
                  </h3>
                  <p className="text-gray-600 mt-1">{event.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-11/12 md:w-3/4 max-w-3xl p-6 relative">

            <button
              onClick={closeEventDetails}
              className="absolute top-0 right-0 text-purple-700 text-4xl font-bold"
            >
              &times;
            </button>

            <img
              src={selectedEvent.img ? selectedEvent.img : null}
              alt={selectedEvent.head}
              className="w-full h-64 object-cover rounded-lg mb-4"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://via.placeholder.com/400x300?text=Image+Not+Found";
              }}
            />

            <h3 className="text-2xl font-bold text-blue-700 mb-2">
              {selectedEvent.head}
            </h3>

            <p className="text-gray-700 mb-2">{selectedEvent.desc}</p>

            <p className="text-gray-500 mb-1">
              <strong>Date:</strong> {selectedEvent.date}
            </p>

            <p className="text-gray-500">
              <strong>Location:</strong> {selectedEvent.location}
            </p>

          </div>
        </div>
      )}
    </div>
  );
};

export default CorpHero;
