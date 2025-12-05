import React, { useState, useEffect } from "react";
import { FaPlane, FaTag, FaCalendarAlt, FaMoneyBillWave, FaSpinner, FaMapMarkerAlt } from "react-icons/fa"; 

// --- 1. Constants (Using the confirmed Payment API Endpoint) ---
const DATA_API_URL = "http://localhost:5000/payment"; 

// Helper to format currency consistently
const formatCurrency = (amount) => {
    if (typeof amount !== 'number' || isNaN(amount)) return 'N/A';
    return `₹${amount.toLocaleString('en-IN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })}`;
};

const PlanningHome = () => {
  const [recentBookings, setRecentBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * ✈️ Fetches data from the payment API, filters for destinations, and prepares data for display.
   */
  const fetchRecentBookings = async () => {
    setIsLoading(true);
    setError(null);

    try {
        // --- START: Actual API Fetch Logic ---
        const response = await fetch(DATA_API_URL);
        
        if (!response.ok) {
            // Throw the specific status code for better debugging
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const rawData = await response.json(); 
        // --- END: Actual API Fetch Logic ---

        
        // --- Data Conversion and Filtering ---
        
        // 1. Filter: Ensure we only process records marked as 'destination'
        const destinationRecords = rawData.filter(item => 
            // Assuming the API returns a 'type' field
            item.type === 'destination' 
        );

        // 2. Map/Transform: Create booking objects using payment API fields.
        const transformedBookings = destinationRecords.map(record => {
            // Find the best available date field (common API names: transactionDate, date, bookingDate)
            const dateSource = record.transactionDate || record.date || record.bookingDate;

            return {
                // Key should be unique (paymentId or bookingId)
                id: record.paymentId || record.bookingId || Math.random(), 
                
                // Use the destination field for the main country/title
                country: record.destination || 'Destination N/A', 
                
                // Use a descriptive field for the package name
                package: record.packageName || record.itemDescription || 'Travel Package', 
                
                // Format the amount paid
                price: formatCurrency(record.amountPaid),
                
                // Format the date string for display
                date: dateSource ? new Date(dateSource).toLocaleDateString('en-IN', {
                    year: 'numeric', month: 'short', day: 'numeric'
                }) : 'Date N/A',
                
                type: 'destination'
            };
        });
        
        // Sort by date (descending) based on the original date source for correct order
        transformedBookings.sort((a, b) => new Date(b.date) - new Date(a.date));

        setRecentBookings(transformedBookings);

    } catch (err) {
        console.error("Data loading failed:", err);
        // If the error is 404, we provide a focused message
        const errorMessage = err.message.includes("404") 
            ? `404 Not Found. Please confirm the API URL (${DATA_API_URL}) is active.`
            : `Failed to load data from API: ${err.message}.`;

        setError(errorMessage);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentBookings();
    const intervalId = setInterval(fetchRecentBookings, 60000); 
    return () => clearInterval(intervalId);
  }, []);

  // --- Conditional Rendering ---
  
  if (error) {
    return (
        <div className="p-8 text-red-700 bg-red-100 border-l-4 border-red-500 rounded-md">
            <h2 className="font-bold">Data Fetch Error:</h2>
            <p>{error}</p>
        </div>
    );
  }

  // --- Main Component Render ---
  return (
    <div className="p-8 ml-[10px] max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-pink-600 inline-flex items-center justify-center">
          <FaPlane className="mr-3 text-3xl" /> Recent Booked Destinations
        </h1>
        <p className="text-gray-500 mt-2">
          Destination reservations sourced from the **Payment API** at `{DATA_API_URL}`.
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
          <div className="flex justify-center items-center py-10 text-pink-500">
              <FaSpinner className="animate-spin text-4xl mr-3" />
              <span className="text-xl font-medium">Fetching latest destination bookings...</span>
          </div>
      )}

      {/* No Bookings State */}
      {!isLoading && recentBookings.length === 0 && (
          <div className="text-center p-10 bg-white rounded-xl shadow-md border-t-4 border-pink-500">
              <FaMapMarkerAlt className="text-5xl text-pink-400 mx-auto mb-4" />
              <p className="text-xl text-gray-500">No destination records found in the API data.</p>
          </div>
      )}

      {/* Booking Cards Grid */}
      {!isLoading && recentBookings.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {recentBookings.map((booking) => (
            <div
              key={booking.id} 
              className="relative border-t-4 border-pink-500 rounded-xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden bg-white group"
            >
              {/* Country Header */}
              <div className="p-5 bg-pink-500 text-white flex justify-between items-center">
                <h2 className="text-2xl font-bold truncate">{booking.country}</h2>
                <FaPlane className="text-3xl opacity-80" />
              </div>

              {/* Booking Details */}
              <div className="p-5 space-y-3">
                <div className="flex items-center text-gray-700">
                  <FaTag className="text-pink-400 mr-3 flex-shrink-0" />
                  <p className="text-lg">
                    Package: <span className="font-semibold text-gray-900">{booking.package}</span>
                  </p>
                </div>
                <div className="flex items-center text-gray-700">
                  <FaMoneyBillWave className="text-green-500 mr-3 flex-shrink-0" />
                  <p className="text-lg">
                    Price: <span className="font-extrabold text-green-600">{booking.price}</span>
                  </p>
                </div>
                <div className="flex items-center text-gray-700">
                  <FaCalendarAlt className="text-blue-400 mr-3 flex-shrink-0" />
                  <p className="text-sm">
                    Booked On: <span className="font-medium text-gray-800">{booking.date}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlanningHome;