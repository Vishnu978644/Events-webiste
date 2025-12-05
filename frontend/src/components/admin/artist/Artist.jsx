import React, { useState, useEffect } from "react";
import { FaTrash, FaPlus, FaImage, FaEdit, FaSave, FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Base URL for the Artist API
const API_URL = "http://localhost:5000/artist"; 

const Artist = () => {
    const [artistData, setArtistData] = useState([]);
    const [urlInput, setUrlInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleSelect = (e) => {
        const value = e.target.value;
        if (value) navigate(value);
    };

    // --- FETCH (READ) OPERATION ---
    const fetchArtists = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const formattedData = data.map(item => ({
                ...item,
                isSaved: true, 
                _id: item._id 
            }));
            setArtistData(formattedData);
        } catch (err) {
            console.error("Failed to fetch artists:", err);
            setError("Failed to load artists. Please check the backend server.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArtists();
    }, []);

    // --- CREATE (Local Add) ---
    const handleAddFromURL = () => {
        if (!urlInput.trim()) {
            alert("Please enter a valid image URL.");
            return;
        }

        const newImage = {
            url: urlInput.trim(),
            title: "",
            price: "",
            description: "",
            isSaved: false, 
            // FIX: Use 'temp-' prefix for local IDs to avoid triggering PUT on first save
            _id: `temp-${Date.now().toString()}`, 
        };
        
        setArtistData([...artistData, newImage]);
        setUrlInput("");
    };
    
    // --- DELETE OPERATION ---
    const handleDeleteImage = async (index, id) => {
        if (!window.confirm("Are you sure you want to delete this artist?")) return;

        const isSavedToDB = id && !id.startsWith('temp-');

        // Optimistic update: remove locally first
        const originalData = artistData;
        setArtistData(artistData.filter((_, i) => i !== index));

        try {
            if (isSavedToDB) { 
                const response = await fetch(`${API_URL}/${id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error("Failed to delete from server.");
                }
            }
        } catch (err) {
            console.error("Failed to delete artist:", err);
            setError("Failed to delete artist on the server. Data restored locally.");
            setArtistData(originalData); // Rollback on error
        }
    };

    const handleDeleteAll = () => {
        if (!window.confirm("Are you sure you want to delete ALL artists? This only clears the frontend view.")) return;
        setArtistData([]);
    };

    const handleChange = (index, field, value) => {
        const updated = [...artistData];
        updated[index][field] = value;
        setArtistData(updated);
    };

    // --- SAVE (POST/PUT) OPERATION ---
    const handleSaveToggle = async (index) => {
        const item = artistData[index];
        setError(null);

        // 1. Toggle to EDIT mode (local state change only)
        if (item.isSaved) {
            const updated = [...artistData];
            updated[index].isSaved = false;
            setArtistData(updated);
            return;
        }

        // 2. Validation check before calling API (Crucial for 400 Bad Request fix)
        if (!item.title.trim() || !item.description.trim() || !item.price.trim() || !item.url.trim()) {
             alert("Please fill in all required fields (Title, Description, Price, and URL) before saving.");
             return;
        }

        // 3. Determine API method and endpoint (FIX IMPLEMENTED HERE)
        const isNewItem = item._id.startsWith('temp-');
        const method = isNewItem ? 'POST' : 'PUT';
        const endpoint = isNewItem ? API_URL : `${API_URL}/${item._id}`;


        // 4. API Call (POST or PUT)
        setLoading(true);
        
        const dataToSave = {
            url: item.url.trim(),
            title: item.title.trim(),
            description: item.description.trim(),
            price: item.price.trim(),
        };

        try {
            const response = await fetch(endpoint, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSave),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Server responded with ${response.status}`);
            }

            const savedItem = await response.json();
            
            // Update local state with the saved item and its official _id
            const updatedData = [...artistData];
            updatedData[index] = {
                ...savedItem,
                isSaved: true,
                _id: savedItem._id 
            };
            setArtistData(updatedData);

        } catch (err) {
            console.error(`Failed to ${method} artist:`, err);
            setError(`Failed to save artist: ${err.message}. Please check the console for details.`);
            
            // Keep it in the unsaved state for the user to retry
            const updated = [...artistData];
            updated[index].isSaved = false;
            setArtistData(updated);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-5 font-music font-bold text-[20px]">
            {/* Header and Section Selector (omitted for brevity) */}
            <div className="mb-10">
                <h1 className="text-4xl font-extrabold text-center text-pink-600 mb-2">Category Image Manager</h1>
                <p className="text-center mb-5">Manage Artist Vendors</p>
                <div className="flex justify-center text-[17px]">
                    <select
                        className="border border-gray-300 font-serif rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                        defaultValue=""
                        onChange={handleSelect}
                    >
                        <option value="" disabled>Select Section</option>
                        <option value="/admin/artist">Artist</option>
                    </select>
                </div>
            </div>

            <div className="mb-2 text-pink-700 underline underline-offset-8">Artist Vendors</div>

            {/* --- Direct URL Input Form --- */}
            <div className="flex items-center gap-2 mb-6 p-4 border border-blue-200 rounded-lg bg-blue-50/50">
                <input
                    type="text"
                    placeholder="Paste Image URL here..."
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="flex-grow border rounded px-3 py-2 text-sm font-normal focus:ring-pink-400 focus:border-pink-400"
                    onKeyDown={(e) => { if (e.key === "Enter") handleAddFromURL(); }}
                    disabled={loading}
                />
                <button
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition duration-200"
                    onClick={handleAddFromURL}
                    title="Add Image URL"
                    disabled={loading || !urlInput.trim()}
                >
                    <FaPlus /> Add
                </button>
            </div>
            {/* --- End Direct URL Input Form --- */}

            {/* Icons Row for Delete All */}
            <div className="flex items-center gap-4 text-[22px] mb-3 absolute right-10 top-20">
                <FaTrash
                    className={`cursor-pointer ${artistData.length === 0 ? 'text-gray-400' : 'text-red-500'}`}
                    title="Delete All Images"
                    onClick={handleDeleteAll}
                    disabled={artistData.length === 0 || loading}
                />
            </div>

            {/* Loading/Error Feedback */}
            {loading && (
                <div className="text-center text-blue-500 my-4 flex justify-center items-center gap-2 font-normal">
                    <FaSpinner className="animate-spin" /> Processing request...
                </div>
            )}
            {error && <div className="text-center text-red-500 my-4 font-normal p-2 bg-red-50 rounded">{error}</div>}

            {/* Display Grid */}
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {artistData.map((img, index) => (
                    <div
                        // Key is crucial: use _id or fallback to index for temp items
                        key={img._id} 
                        className="relative w-full border-2 border-gray-300 rounded-lg overflow-hidden p-2 flex flex-col gap-2 group"
                    >
                        {/* Status Label */}
                        <div className={`absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded ${img.isSaved ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                            {img.isSaved ? "Saved" : "Unsaved/Editing"}
                        </div>

                        {/* Image Display */}
                        <img
                            src={img.url}
                            alt={`Artist ${index + 1} Preview`}
                            className="w-full h-40 object-cover rounded transition duration-300"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/150?text=Invalid+URL";
                            }}
                        />

                        {/* Input Fields */}
                        <input
                            type="text"
                            placeholder="Title"
                            value={img.title}
                            disabled={img.isSaved || loading}
                            onChange={(e) => handleChange(index, "title", e.target.value)}
                            className="border rounded px-2 py-1 text-sm font-normal disabled:bg-gray-50 disabled:cursor-not-allowed"
                        />
                        <input
                            type="text"
                            placeholder="Price Start From"
                            value={img.price}
                            disabled={img.isSaved || loading}
                            onChange={(e) => handleChange(index, "price", e.target.value)}
                            className="border rounded px-2 py-1 text-sm font-normal disabled:bg-gray-50 disabled:cursor-not-allowed"
                        />
                        <textarea
                            placeholder="Description"
                            value={img.description}
                            disabled={img.isSaved || loading}
                            onChange={(e) => handleChange(index, "description", e.target.value)}
                            className="border rounded px-2 py-1 text-sm font-normal resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                        />

                        {/* Save/Edit Button */}
                        <button
                            onClick={() => handleSaveToggle(index)}
                            className={`px-3 py-1 rounded font-semibold text-white mt-2 flex items-center justify-center gap-2 transition duration-200 ${
                                img.isSaved ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"
                            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={loading}
                        >
                            {loading ? <FaSpinner className="animate-spin" /> : img.isSaved ? (<><FaEdit /> Edit</>) : (<><FaSave /> Save</>)}
                        </button>

                        {/* Individual Delete Button */}
                        <button
                            className={`absolute top-1 right-1 p-2 bg-red-500/80 hover:bg-red-700 text-white rounded-full shadow-lg transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title={`Delete Artist ${index + 1}`}
                            onClick={() => handleDeleteImage(index, img._id)}
                            disabled={loading}
                        >
                            <FaTrash className="text-sm" />
                        </button>
                    </div>
                ))}

                {artistData.length === 0 && !loading && (
                    <div className="w-full h-40 border-2 border-dashed border-gray-400 rounded-lg flex flex-col justify-center items-center text-gray-500 mt-0">
                        <FaImage className="text-4xl mb-2" />
                        Paste a URL in the box above to start adding artists.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Artist;