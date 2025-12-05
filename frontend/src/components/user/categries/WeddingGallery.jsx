import React, { useState, useEffect } from "react";
// import { useEffect } from "react"; // Only need to import once

const WeddingGallery = () => {
    // Main gallery images

    const [currentCollection, setCurrentCollection] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [galleryData, setGalleryData] = useState([]);  

    useEffect(()=>{
        fetch("http://localhost:5000/gallery")
        .then((res)=>res.json())
        .then((data)=>setGalleryData(data))
        .catch((err)=>console.log("error fetching data",err))
    },[]);
    
    // Note: If you were using the mapped data from AdminCateGallery (main, extras) 
    // you would need to adjust the fetch and rendering, but assuming backend returns 
    // the original schema fields (img, collection) this is fine.

    const openSlider = (collection, index) => {
        setCurrentCollection(collection);
        setCurrentIndex(index);
    };

    const closeSlider = () => {
        setCurrentCollection(null);
        setCurrentIndex(0);
    };

    const prevImage = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? currentCollection.length - 1 : prev - 1
        );
    };

    const nextImage = () => {
        setCurrentIndex((prev) =>
            prev === currentCollection.length - 1 ? 0 : prev + 1
        );
    };

    return (
        <section className="py-12 bg-gray-50 max-w-[1500px] mx-auto mb-0">
            <h2 className="text-4xl font-bold text-center text-pink-700 mb-20 underline underline-offset-8 decoration-yellow-500">
                Wedding Moments Gallery
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-8">
                {galleryData.map((item, i) => (
                    <img
                        key={i}
                        // FIX 1: Removed the leading slash
                        src={item.img} 
                        alt={`Gallery ${i + 1}`}
                        className="rounded-lg shadow-md hover:scale-[1.03] border-2 border-white transition-transform duration-300 w-[490px] h-72 object-cover cursor-pointer"
                        onClick={() => openSlider(item.collection, 0)}
                    />
                ))}
            </div>

            {/* Slider Overlay */}
            {currentCollection && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="relative w-4/5 max-w-3xl">
                        <img
                            // FIX 2: Removed the leading slash
                            src={currentCollection[currentIndex]}
                            alt={`Collection ${currentIndex + 1}`}
                            className="rounded-lg shadow-xl w-full h-[500px] object-cover object-center transform transition-transform duration-500"
                        />


                        {/* Close Button */}
                        <button
                            onClick={closeSlider}
                            className="absolute top-4 right-4 text-white text-3xl font-bold"
                        >
                            &times;
                        </button>
                        {/* Previous Button */}
                        <button
                            onClick={prevImage}
                            className="absolute top-1/2 left-0 text-white text-3xl font-bold -translate-y-1/2 px-4"
                        >
                            &#10094;
                        </button>
                        {/* Next Button */}
                        <button
                            onClick={nextImage}
                            className="absolute top-1/2 right-0 text-white text-3xl font-bold -translate-y-1/2 px-4"
                        >
                            &#10095;
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default WeddingGallery;