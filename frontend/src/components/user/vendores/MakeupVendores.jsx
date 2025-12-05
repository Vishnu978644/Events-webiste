import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSpinner, FaMapMarkerAlt } from "react-icons/fa";

// Define the API endpoint URL
const API_URL = "http://localhost:5000/artist";

const MakeupVendores = () => {
    // State to hold the fetched data
    const [makeupArtists, setMakeupArtists] = useState([]);
    const [showArtists, setShowArtists] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/contact");
    };

    // --- FETCH DATA FUNCTION ---
    const fetchMakeupArtists = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`Failed to fetch data (Status: ${response.status})`);
            }
            const data = await response.json();
            // Assuming the data structure is: { _id, title, url, price, description }
            // Map the fetched data to match the expected display structure
            const formattedData = data.map(item => ({
                id: item._id, 
                name: item.title, 
                img: item.url, // Use the URL field for the image source
                price: item.price, 
                description: item.description || "Top rated professional.",
            }));
            setMakeupArtists(formattedData);
        } catch (err) {
            console.error("Fetch Error:", err);
            setError("Failed to load vendors. Please ensure the backend server is running on " + API_URL);
        } finally {
            setLoading(false);
        }
    };

    // Run fetch on component mount
    useEffect(() => {
        fetchMakeupArtists();
    }, []);

    // Function to handle opening the artists modal and fetching data if empty
    const handleExploreArtists = () => {
        if (makeupArtists.length === 0 && !loading) {
             fetchMakeupArtists();
        }
        setShowArtists(true);
    };


    return (
        <div className="mx-auto max-w-[1630px] mt-32 px-4 sm:px-10">
            {/* Heading */}
            <div className="text-center mb-16">
                <h1 className="text-4xl sm:text-4xl font-black text-rose-600 font-music inline-block border-b-4 border-yellow-500 pb-2 mb-2">
                    Makeup Vendors
                </h1>
                <p className="text-[15px] text-gray-700 max-w-4xl mx-auto mt-4">
                    Enhancing every bride’s natural beauty with elegance, artistry, and confidence.
                </p>
            </div>

            {/* Hero Section */}
            <div className="flex flex-col lg:flex-row items-center justify-center gap-12 bg-rose-50 p-6 md:p-12 rounded-3xl shadow-xl hover:shadow-2xl transition duration-500 border-2 border-rose-200">
                <div className="flex-shrink-0 w-full lg:w-1/2">
                    <img
                        src="/makeup-main.jpg"
                        alt="Bridal Makeup"
                        className="w-full h-80 sm:h-[350px] object-cover rounded-2xl shadow-lg"
                    />
                </div>

                <div className="w-full lg:w-1/2 p-4">
                    <h2 className="text-3xl sm:text-3xl font-black text-gray-800 font-serif mb-6 leading-tight">
                        Perfect Your Bridal Glow ✨
                    </h2>
                    <p className="text-gray-700 text-base leading-relaxed mb-8 text-[15px]">
                        Our top-rated makeup artists bring your dream look to life — blending traditional
                        styles with modern trends for a <strong>timeless, flawless finish</strong>.
                    </p>
                    <button
                        onClick={handleExploreArtists} // Use the new handler
                        className="bg-rose-500 hover:bg-rose-600 text-white border-4 border-teal-400 px-8 py-3 rounded-full text-lg font-semibold transition duration-300 shadow-md transform hover:-translate-y-0.5"
                        disabled={loading}
                    >
                        {loading ? <FaSpinner className="animate-spin inline mr-2" /> : "Explore Artists"}
                    </button>
                </div>
            </div>

            {/* POPUP MODAL */}
            {showArtists && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex justify-center items-center p-4">
                    
                    {/* Popup box */}
                    <div className="w-[1000px] h-[600px] bg-white rounded-2xl shadow-2xl relative p-6 overflow-y-auto">
                        
                        {/* Close button */}
                        <button
                            onClick={() => setShowArtists(false)}
                            className="absolute top-4 right-4 text-white bg-rose-500 hover:bg-rose-600 w-8 h-8 rounded-full flex justify-center items-center text-xl"
                        >
                            ✕
                        </button>

                        <h2 className="text-3xl font-bold text-center text-rose-600 mb-6">
                            Makeup Artists
                        </h2>

                        {/* Loading/Error State */}
                        {loading && (
                            <div className="text-center p-10 text-xl text-gray-600">
                                <FaSpinner className="animate-spin inline mr-2" /> Loading vendor data...
                            </div>
                        )}
                        {error && (
                            <div className="text-center p-10 text-xl text-red-600 bg-red-50 border border-red-200 rounded-lg mx-auto max-w-lg font-normal">
                                {error}
                            </div>
                        )}

                        {/* Artist Grid */}
                        {!loading && !error && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {makeupArtists.length > 0 ? (
                                    makeupArtists.map((artist) => (
                                        <div
                                            key={artist.id}
                                            className="bg-white rounded-xl shadow-md border hover:shadow-xl transition overflow-hidden"
                                        >
                                            {/* Image */}
                                            <img
                                                src={artist.img}
                                                alt={artist.name}
                                                className="w-full h-56 object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "https://via.placeholder.com/400x300?text=Image+Not+Available";
                                                }}
                                            />
                                            <div className="p-4 text-center">
                                                <h3 className="text-xl font-bold text-gray-800 mb-1">{artist.name}</h3>
                                                <p className="text-rose-500 font-semibold mb-3">{artist.price}</p>
                                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{artist.description}</p>
                                                
                                                <button
                                                    onClick={handleClick}
                                                    className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-full font-semibold shadow-md transition"
                                                >
                                                    Contact Now
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-3 text-center p-10 text-gray-500 border-dashed border-2 rounded-lg">
                                        <FaMapMarkerAlt className="inline text-3xl mb-2" />
                                        <p>No makeup artists found. Please add vendors in the admin panel.</p>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>
            )}
        </div>
    );
};

export default MakeupVendores;