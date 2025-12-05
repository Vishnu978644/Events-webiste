import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Define the API URL
const API_URL = "http://localhost:5000/bgallery";

const BirthdayGallery = () => {
    // State to hold the URL of the video to be displayed in the modal
    const [currentVideo, setCurrentVideo] = useState(null);
    // State to hold the fetched gallery data
    const [bgallery, setBgallery] = useState([]);
    // State for loading and error handling (optional, but good practice)
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // React Router hook for navigation
    const navigate = useNavigate();

    // --- Modal Handlers ---

    // Open video modal, only if a video URL exists
    const openVideo = (videoUrl) => {
        if (videoUrl) {
            setCurrentVideo(videoUrl);
        }
    };

    // Close video modal
    const closeVideo = () => setCurrentVideo(null);

    // --- Navigation Handler ---

    // Navigate to booking page and pass the selected image URL as state
    const handleNavi = (imgUrl) => {
        // The state is passed correctly here. 
        // Ensure Booking.jsx uses 'useLocation()' to read this state.
        navigate("/booking", { state: { img: imgUrl, fromGallery: true } });
    };

    // --- Data Fetching ---

    useEffect(() => {
        setIsLoading(true);
        setError(null);

        fetch(API_URL)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                return res.json();
            })
            .then((data) => {
                setBgallery(data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching gallery data:", err);
                setError("Failed to load gallery items. Please try again.");
                setIsLoading(false);
            });
    }, []);

    // --- Component Rendering ---

    if (isLoading) {
        return (
            <section className="py-16 text-center">
                <p className="text-xl text-gray-600">Loading gallery...</p>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-16 text-center">
                <p className="text-xl text-red-600">Error: {error}</p>
            </section>
        );
    }

    return (
        <section className="py-16 bg-white max-w-[1500px] mx-auto">
            <h2 className="text-4xl font-black text-center text-pink-700 mb-16">
                Birthday Moments Gallery 🎂
            </h2>

            {bgallery.length === 0 ? (
                <p className="text-center text-xl text-gray-500">
                    No birthday moments found. Check your API server (`${API_URL}`).
                </p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 px-8">
                    {bgallery.map((item, i) => (
                        <div
                            key={item._id || i}
                            className="relative rounded-xl shadow-md overflow-hidden border-2 border-pink-100 group" // Added group for hover effect
                        >

                            {/* ---- CLICKABLE IMAGE/VIDEO THUMBNAIL ---- */}
                            <div
                                className="relative cursor-pointer"
                                onClick={() => openVideo(item.video)} // Opens modal only if item.video is truthy
                            >
                                <img
                                    src={item.img}
                                    alt={`Birthday Moment ${i + 1}`}
                                    className="w-full h-60 object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                                />

                                {item.video && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="rounded-full p-4 text-white bg-black bg-opacity-40 text-xl transition duration-300 group-hover:bg-opacity-60">
                                            {/* Font Awesome icon for play */}
                                            <i className="fa-solid fa-play"></i>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* ---- BOOK BUTTON ---- */}
                            <div className="p-4 flex justify-center">
                                <button
                                    onClick={() => handleNavi(item.img)}
                                    className="w-full max-w-[200px] bg-pink-500 text-white font-semibold text-lg py-2 rounded-full hover:bg-pink-700 transition"
                                >
                                    Book
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}


            {/* ---- VIDEO MODAL ---- */}
            {currentVideo && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
                    onClick={closeVideo} // Close modal when clicking outside
                >
                    <div
                        className="relative w-11/12 max-w-4xl p-6" // Increased max-width and added padding
                        onClick={(e) => e.stopPropagation()} // Prevent modal closure when clicking inside the content
                    >
                        <video
                            src={currentVideo}
                            autoPlay
                            controls
                            className="rounded-xl w-full max-h-[90vh]"
                        />

                        <button
                            onClick={closeVideo}
                            className="absolute -top-4 -right-4 md:top-0 md:-right-8 text-white text-5xl font-light hover:text-pink-400 transition"
                            aria-label="Close video"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default BirthdayGallery;