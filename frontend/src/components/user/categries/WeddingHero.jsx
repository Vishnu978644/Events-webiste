import React, { useState, useEffect } from "react";
import { Loader2, AlertTriangle } from "lucide-react";

// Define the API endpoint URL (same one used in the Admin component)
const API_URL = "http://localhost:5000/hero";

const WeddingHero = () => {
    const [heroImages, setHeroImages] = useState([]); // State to hold fetched images
    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(true); // Loading state for initial fetch
    const [error, setError] = useState(null); // Error state for fetch failure

    // --- 1. Fetch Data from API ---
    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error(`Failed to fetch: Status ${response.status}`);
                }
                const data = await response.json();
                
                // Map the fetched data (url, title) to the required structure
                const mappedImages = data.map(item => ({
                    id: item._id, // Use _id as a key if needed
                    // NOTE: Assuming your display component expects 'img11' for the URL source
                    img11: item.url, 
                    title: item.title,
                }));

                setHeroImages(mappedImages);
            } catch (err) {
                console.error("Hero Fetch Error:", err);
                setError(`Failed to load images. Please check the backend server. Error: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, []); // Empty dependency array runs once on mount

    // --- 2. Auto-Slide Timer Effect ---
    useEffect(() => {
        // Only start the timer if images have loaded and there are images
        if (heroImages.length > 0) {
            const timer = setInterval(() => {
                setCurrent((prev) => (prev + 1) % heroImages.length);
            }, 3000);
            return () => clearInterval(timer);
        }
    }, [heroImages]); // Re-run effect when heroImages state changes (i.e., after successful fetch)


    // --- 3. Render Logic ---
    
    // Base classes for the container
    const containerClasses = "relative w-full max-w-screen-2xl mx-auto h-[600px] xl:h-[400px] overflow-hidden rounded-xl border-[3px] border-white shadow-xl mt-16";

    if (loading) {
        return (
            <div className={`${containerClasses} flex items-center justify-center bg-gray-100`}>
                <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
                <p className="ml-3 text-lg text-gray-700">Loading wedding inspiration...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`${containerClasses} flex items-center justify-center bg-red-50`}>
                <AlertTriangle className="w-8 h-8 text-red-600" />
                <p className="ml-3 text-lg text-red-700 font-semibold">{error}</p>
            </div>
        );
    }

    if (heroImages.length === 0) {
        return (
            <div className={`${containerClasses} flex items-center justify-center bg-yellow-50`}>
                <p className="text-lg text-yellow-800 font-semibold">No hero images found. Add some in the admin panel!</p>
            </div>
        );
    }

    // Main Carousel Render
    return (
        <div className={containerClasses}>
            {/* The image to display (using opacity for smooth transitions) */}
            {heroImages.map((image, index) => (
                <div 
                    key={image.id}
                    className={`absolute inset-0 transition-opacity duration-700 ${
                        index === current ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    <img
                        src={image.img11}
                        alt={`slide ${index + 1}`}
                        className="w-full h-full object-cover"
                    />
                    
                    {/* Text Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                        <h1 className="text-white text-7xl sm:text-6xl lg:text-7xl xl:text-6xl font-dancing font-bold drop-shadow-2xl text-center px-4  shadow-xl">
                            {image.title}
                        </h1>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default WeddingHero;