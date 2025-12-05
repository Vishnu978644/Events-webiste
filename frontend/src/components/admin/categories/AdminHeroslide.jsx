import React, { useState, useEffect, useCallback } from "react";
import { Trash2, Edit2, Save, AlertTriangle, Plus, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BROKEN_IMAGE_FALLBACK = "https://placehold.co/150x150/f9f9f9/ccc?text=Image+Error";
const API_URL = "http://localhost:5000/hero";

const AdminHeroslide = () => {
    const [heroImages, setHeroImages] = useState([]);
    const [newUrl, setNewUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [newTitle, setNewTitle] = useState(""); // New state for initial title input
    const navigate = useNavigate();

    // Helper to map API data to local state structure
    const mapDataToState = (data) =>
        data.map((item) => ({
            _id: item._id || Date.now().toString(),
            img: item.url || "", // Mapped from item.url
            name: item.title || "", // Mapped from item.title
            editable: false,
            isBroken: false,
        }));

    // --- R: FETCH (READ) Operation ---
    const fetchHeroImages = async () => {
        setLoading(true);
        setApiError(null);
        try {
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error(`Failed to fetch: Status ${res.status}`);
            const data = await res.json();
            setHeroImages(mapDataToState(data));
        } catch (err) {
            console.error("Fetch error:", err);
            setApiError(`Failed to load images: ${err.message}. Check server status.`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHeroImages();
    }, []);

    const handleImageError = useCallback((index) => {
        setHeroImages((prev) =>
            prev.map((img, i) => (i === index ? { ...img, isBroken: true } : img))
        );
    }, []);

    // --- C: CREATE (POST) Operation ---
    const handleAddUrl = async () => {
        if (!newUrl.trim()) {
            setApiError("Please enter a valid image URL.");
            return;
        }

        // --- FIX: Client-side validation for required title ---
        if (!newTitle.trim()) {
            setApiError("Title is required for a new hero image.");
            return;
        }

        setLoading(true);
        setApiError(null);

        const newItem = { 
            url: newUrl.trim(), 
            title: newTitle.trim() // Ensure title is sent 
        };

        try {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newItem),
            });

            if (!res.ok) {
                // If the server returns a 400 (Bad Request/Validation), it will be caught here.
                const errorData = await res.json();
                throw new Error(errorData.message || `Server error: Status ${res.status}. Check backend logs.`);
            }

            const saved = await res.json();
            const newImage = {
                _id: saved._id, 
                img: saved.url,
                name: saved.title,
                editable: false,
                isBroken: false,
            };
            setHeroImages((prev) => [...prev, newImage]);
            setNewUrl("");
            setNewTitle(""); // Clear title input on success

        } catch (err) {
            console.error("Add error:", err.message);
            // Display the specific validation message from the server
            setApiError(`Failed to add image: ${err.message}`); 
        } finally {
            setLoading(false);
        }
    };

    // --- D: DELETE Operation ---
    const handleDeleteImage = async (id) => {
        if (!window.confirm("Are you sure you want to delete this image?")) return;

        setLoading(true);
        setApiError(null);

        const originalImages = heroImages;
        setHeroImages((prev) => prev.filter((img) => img._id !== id));

        try {
            const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

            if (!res.ok) {
                 const errorData = await res.json();
                 throw new Error(errorData.message || `Server error: Status ${res.status}`);
            }

        } catch (err) {
            console.error("Delete error:", err.message);
            setApiError(`Failed to delete image: ${err.message}. Reverting changes.`);
            setHeroImages(originalImages); 
        } finally {
            setLoading(false);
        }
    };

    // --- U: UPDATE (PUT) Operation ---
    const saveName = async (index) => {
        const imgObj = heroImages[index];

        // Ensure title is not empty before saving
        if (!imgObj.name.trim()) {
            setApiError("The image title cannot be empty. Please enter a title.");
            return;
        }

        setLoading(true);
        setApiError(null);

        setHeroImages((prev) =>
            prev.map((img, i) => (i === index ? { ...img, editable: false } : img))
        );

        try {
            const res = await fetch(`${API_URL}/${imgObj._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: imgObj.name.trim() }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || `Server error: Status ${res.status}`);
            }
            
            const updatedData = await res.json();
            setHeroImages((prev) =>
                prev.map((img, i) =>
                    i === index ? { ...img, name: updatedData.title || img.name } : img
                )
            );
        } catch (err) {
            console.error("Update error:", err.message);
            setApiError(`Failed to update name: ${err.message}.`);
            setHeroImages((prev) =>
                prev.map((img, i) => (i === index ? { ...img, editable: true } : img))
            );
        } finally {
            setLoading(false);
        }
    };

    // --- Local State Handlers ---
    const toggleEdit = (index) => {
        setHeroImages((prev) =>
            prev.map((img, i) => (i === index ? { ...img, editable: !img.editable } : img))
        );
    };

    const handleNameChange = (index, value) => {
        setHeroImages((prev) =>
            prev.map((img, i) => (i === index ? { ...img, name: value } : img))
        );
    };

    const handleSelect = (e) => {
        const value = e.target.value;
        if (value) navigate(value);
    };

    return (
        <div className="mt-5 max-w-4xl mx-auto p-4 md:p-8 font-sans">
            <div className="mb-10">
                <h1 className="text-4xl font-extrabold text-center text-pink-600 mb-2">
                    Image Carousel Manager
                </h1>
                <p className="text-center text-gray-600 mb-6">
                    Add image URLs and set titles for hero slides.
                </p>
                <div className="flex justify-center text-[17px]">
                    <select
                        className="border border-gray-300 font-serif rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 mt-2 shadow-sm"
                        defaultValue=""
                        onChange={handleSelect}
                    >
                        <option value="" disabled>
                            Select Section
                        </option>
                        <option value="/admin/categories/heroslide">Category Main (Current)</option>
                    </select>
                </div>
            </div>

            <h2 className="text-2xl font-semibold mb-4 text-pink-700 border-b pb-2">Hero Images</h2>

            {/* Error Message Display */}
            {apiError && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                    <p className="font-bold">API Error</p>
                    <p>{apiError}</p>
                </div>
            )}

            <div className="flex flex-col gap-2 mb-6 p-4 border rounded-lg bg-gray-50">
                <div className="flex gap-2">
                    {/* URL Input */}
                    <input
                        type="url"
                        placeholder="Paste image URL here"
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        className="border px-4 py-2 rounded-lg flex-grow text-base focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-inner"
                        disabled={loading}
                    />
                    {/* Title Input */}
                    <input
                        type="text"
                        placeholder="Required: Enter Initial Title"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="border px-4 py-2 rounded-lg w-1/3 text-base focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-inner"
                        disabled={loading}
                    />
                </div>
                <div className="flex gap-2 justify-end">
                    <button
                        onClick={handleAddUrl}
                        className="bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2 rounded-lg text-base transition duration-150 shadow-md flex items-center gap-1 disabled:opacity-50"
                        disabled={loading || !newUrl.trim() || !newTitle.trim()}
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Add Image
                    </button>
                    <button
                        onClick={() => setHeroImages([])}
                        className="bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2 rounded-lg text-base transition duration-150 shadow-md flex items-center gap-1 disabled:opacity-50"
                        disabled={loading}
                    >
                        <Trash2 className="w-4 h-4" /> Clear Local
                    </button>
                </div>
            </div>

            {loading && heroImages.length === 0 && (
                 <div className="text-center p-10 text-gray-500">
                    <Loader2 className="w-6 h-6 animate-spin inline mr-2" /> Loading data...
                 </div>
            )}

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {heroImages.map((imageObj, index) => (
                    <div
                        key={imageObj._id}
                        className="relative w-full border-2 border-gray-300 rounded-xl shadow-lg overflow-hidden p-3 bg-white"
                    >
                        <div className="relative w-full h-36 mb-3 rounded-lg overflow-hidden">
                            {imageObj.isBroken ? (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-red-100 text-red-600 border-dashed border-2 border-red-300 rounded-lg p-2 text-center">
                                    <AlertTriangle className="w-6 h-6 mb-1" />
                                    <span className="text-sm font-semibold">Image Failed to Load</span>
                                    <p className="text-xs text-red-500 mt-1">Check URL or CORS</p>
                                </div>
                            ) : (
                                <img
                                    src={imageObj.img || BROKEN_IMAGE_FALLBACK}
                                    alt={`Hero Slide ${index + 1}`}
                                    onError={() => handleImageError(index)}
                                    className="w-full h-full object-cover transition duration-300 hover:scale-105"
                                />
                            )}
                        </div>

                        <p className="text-sm text-gray-500 mb-1">ID: {imageObj._id.slice(-8)}</p>

                        <input
                            type="text"
                            placeholder="Enter Title"
                            value={imageObj.name}
                            disabled={!imageObj.editable || loading}
                            onChange={(e) => handleNameChange(index, e.target.value)}
                            className={`w-full border px-3 py-1 rounded-md text-base focus:outline-none focus:ring-2 ${
                                imageObj.editable ? "border-pink-400 bg-white" : "border-gray-200 bg-gray-50 cursor-default"
                            }`}
                        />

                        <button
                            onClick={() => (imageObj.editable ? saveName(index) : toggleEdit(index))}
                            className={`mt-3 w-full px-3 py-2 rounded-lg text-white font-semibold transition duration-150 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 ${
                                imageObj.editable ? "bg-blue-600 hover:bg-blue-700" : "bg-yellow-600 hover:bg-yellow-700"
                            }`}
                            disabled={loading}
                        >
                            {loading && !imageObj.editable ? <Loader2 className="w-4 h-4 animate-spin" /> : imageObj.editable ? (
                                <>
                                    <Save className="w-4 h-4" /> Save Name
                                </>
                            ) : (
                                <>
                                    <Edit2 className="w-4 h-4" /> Edit Name
                                </>
                            )}
                        </button>

                        <button
                            className="absolute top-0 right-0 m-4 p-2 bg-red-500/90 hover:bg-red-700 text-white rounded-full shadow-xl transition-all duration-300 opacity-80 hover:opacity-100 disabled:opacity-50"
                            onClick={() => handleDeleteImage(imageObj._id)}
                            aria-label="Delete image"
                            disabled={loading}
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            {heroImages.length === 0 && !loading && (
                <div className="text-center text-gray-500 p-10 border-2 border-dashed border-gray-300 rounded-lg mt-8">
                    No hero images added yet. Paste a URL and title above to start.
                </div>
            )}
        </div>
    );
};

export default AdminHeroslide;