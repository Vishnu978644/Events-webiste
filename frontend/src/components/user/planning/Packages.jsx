import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Packages = () => {
    // State for storing fetched packages and handling loading/error
    const [packages, setPackages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedCountry, setSelectedCountry] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const navigate = useNavigate();
    const MAX_WIDTH_CLASS = "max-w-[1730px] mx-auto";

    // --- Data Fetching Hook ---
    useEffect(() => {
        const fetchPackages = async () => {
            try {
                // The URL is the correct endpoint for fetching all destinations/packages.
                const response = await fetch('http://localhost:5000/destini'); 
                
                if (!response.ok) {
                    // Check for 404/500/etc errors from the server
                    throw new Error(`HTTP error! Status: ${response.status}. Check backend endpoint: /api/packages`);
                }
                
                const data = await response.json();
                
                // IMPORTANT: Ensure gallery array is not empty before attempting slider logic
                const validPackages = data.map(pkg => ({
                    ...pkg,
                    // Ensure 'gallery' exists and is an array of strings, or default to an array containing the main image
                    gallery: Array.isArray(pkg.gallery) && pkg.gallery.length > 0
                        ? pkg.gallery
                        : [pkg.imgURL].filter(Boolean) // Use the main image if gallery is empty/missing
                }));
                
                setPackages(validPackages); 
                
            } catch (err) {
                console.error("Failed to fetch packages:", err);
                setError(err.message.includes('404') ? "API endpoint not found. Verify your server routes." : "Failed to load destinations. Check server status.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPackages();
    }, []); 

    // Event Handlers
    const handleImageClick = (item) => {
        // Ensure item and its gallery exist before opening the popup
        if (!item || !item.gallery || item.gallery.length === 0) {
             alert("Package details are incomplete (missing image gallery).");
             return;
        }
        setSelectedCountry(item);
        setCurrentIndex(0);
    };

    const closePopup = () => setSelectedCountry(null);

    const prevSlide = () => {
        if (!selectedCountry) return;
        setCurrentIndex(prev =>
            prev === 0 ? selectedCountry.gallery.length - 1 : prev - 1
        );
    };

    const nextSlide = () => {
        if (!selectedCountry) return;
        setCurrentIndex(prev =>
            prev === selectedCountry.gallery.length - 1 ? 0 : prev + 1
        );
    };

    const handleBook = () => {
        if (!selectedCountry) return;
        
        // Ensure the current image URL is valid before navigating
        const currentImage = selectedCountry.gallery[currentIndex];
        
        navigate("/booking", {
            state: {
                place: selectedCountry.pass, // Using 'pass' as the place/slug
                image: currentImage,
                title: selectedCountry.title,
                description: selectedCountry.description,
                price: selectedCountry.price,
            }
        });
    };

    // Render Logic for Loading/Error
    if (isLoading) {
        return <div className="text-center mt-40 text-2xl font-semibold text-gray-600">Loading destinations...</div>;
    }

    if (error) {
        return <div className="text-center mt-40 text-2xl font-bold text-red-600">⚠️ Error: {error}</div>;
    }

    // --- Main Component Render ---
    return (
        <>
            {/* Title Section (No changes) */}
            <div className={`text-center mt-28 md:mt-[100px] px-4 ${MAX_WIDTH_CLASS}`}>
                <h1 className='text-4xl md:text-5xl font-bold text-gray-800'>
                    Destination That You Want
                </h1>
                <p className='text-lg md:text-xl text-rose-500 mt-6 font-semibold'>
                    — OUR COMPANY —
                </p>
            </div>

            {/* Grid Section */}
            <div className={`mt-16 md:mt-28 px-4 ${MAX_WIDTH_CLASS}`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-x-8 gap-y-16 justify-items-center">
                    {packages.map((item) => (
                        <div key={item._id || item.pass} className="text-center cursor-pointer group w-full max-w-xs">
                            <div className="w-[200px] h-[200px] relative">
                                <img
                                    src={item.imgURL} // Main image display
                                    alt={item.pass}
                                    className="w-full h-full object-cover rounded-full border-4 border-gray-300 shadow-xl transition duration-300 group-hover:border-rose-500 group-hover:scale-[1.03]"
                                    onClick={() => handleImageClick(item)}
                                />
                            </div>
                            <p className="text-xl md:text-2xl font-semibold mt-6 text-gray-700 group-hover:text-rose-600 transition">
                                {item.pass} {/* Displaying the slug/pass name */}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Popup + Slider */}
            {selectedCountry && (
                <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">
                    <div className="bg-white w-[95%] max-w-[700px] max-h-[90vh] rounded-xl shadow-2xl p-6 relative overflow-y-auto">
                        <button
                            onClick={closePopup}
                            className="absolute top-4 right-4 text-3xl font-bold text-black hover:text-red-600 transition"
                        >
                            &times;
                        </button>

                        <h2 className="text-3xl font-extrabold text-center text-rose-600 mb-6">
                            {selectedCountry.pass}
                        </h2>

                        {/* Slider */}
                        <div className="relative w-full h-[350px] flex justify-center items-center mb-6">
                            {/* Check if gallery exists and has images before accessing index */}
                            {selectedCountry.gallery && selectedCountry.gallery.length > 0 ? (
                                <>
                                    <img
                                        src={selectedCountry.gallery[currentIndex]}
                                        alt={`Gallery image ${currentIndex + 1}`}
                                        className="w-full h-full object-cover rounded-lg shadow-xl duration-500"
                                    />
                                    {/* Navigation buttons show only if there is more than one image */}
                                    {selectedCountry.gallery.length > 1 && (
                                        <>
                                            <button
                                                onClick={prevSlide}
                                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/70 transition"
                                            >
                                                ❮
                                            </button>
                                            <button
                                                onClick={nextSlide}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/70 transition"
                                            >
                                                ❯
                                            </button>
                                        </>
                                    )}
                                </>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg text-gray-500">
                                    No detailed gallery images available.
                                </div>
                            )}
                        </div>

                        {/* Package Details */}
                        <div className="border-t pt-4">
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                {selectedCountry.title}
                            </h3>
                            <p className="text-gray-600 mb-2 text-sm leading-relaxed">
                                {selectedCountry.description}
                            </p>
                            <h1 className='text-gray-600'><span className='text-xl font-bold text-pink-500'>Places :</span>  {selectedCountry.place}</h1>
                            <div className="text-xl font-extrabold text-green-700">
                                Price: {selectedCountry.price}
                            </div>
                        </div>

                        {/* Book Button */}
                        <div className="mt-6 flex justify-center">
                            <button
                                onClick={handleBook}
                                className="bg-rose-600 px-8 py-3 text-white rounded-full text-lg hover:bg-rose-700 font-bold shadow-xl transition"
                            >
                                Book Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Packages;