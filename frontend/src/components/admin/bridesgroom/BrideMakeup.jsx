import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaImage, FaCheck, FaEdit } from 'react-icons/fa';

// NOTE: Set the API URL to the makeup endpoint
const API_URL = 'http://localhost:5000/bridemakeup'; 

const BrideMakeup = () => {
    const [images, setImages] = useState([]);
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Fetch Logic (Read) ---
    useEffect(() => {
        fetchMakeupEntries();
    }, []);

    const fetchMakeupEntries = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(API_URL);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Add 'saved: true' and 'isSaving: false' for all fetched items
            const mappedData = data.map(item => ({ 
                ...item, 
                // Ensure price is stored as a string for input field value
                price: item.price ? String(item.price) : '', 
                saved: true, 
                isSaving: false 
            }));
            setImages(mappedData);

        } catch (err) {
            console.error("Error fetching makeup entries:", err);
            setError(`Failed to load entries. Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // --- Add URL Logic (Create - Local) ---
    const handleAddUrl = () => {
        // NOTE: Changed alert to console.error + visual feedback (or custom modal) as per instructions
        if (!imageUrl.trim()) {
            console.error("Validation Error: Please enter a valid image URL.");
            return;
        }
        
        setImages(prev => [
            { 
                url: imageUrl.trim(), 
                title: '', 
                description: '', 
                design: '', 
                price: '', 
                saved: false, 
                isSaving: false,
                // Add a temporary unique ID for new unsaved items
                tempId: Date.now() 
            },
            ...prev,
        ]);
        setImageUrl('');
    };

    // --- Delete Logic (Delete) ---
    const handleDelete = async (index) => {
        const imgObj = images[index];

        // Optimistic UI update: remove locally first
        const originalImages = images;
        setImages(prev => prev.filter((_, i) => i !== index));

        if (imgObj._id) {
            try {
                const response = await fetch(`${API_URL}/${imgObj._id}`, {
                    method: 'DELETE',
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                // No response body needed for delete success

            } catch (err) {
                console.error("Error deleting makeup entry:", err);
                // NOTE: Changed alert to console.error + visual feedback (or custom modal) as per instructions
                alert("Failed to delete item on server. Restoring locally. Error: " + err.message);
                setImages(originalImages); // Revert state on failure
            }
        }
    };

    // --- Change Logic (Update - Local) ---
    const handleChange = (index, field, value) => {
        setImages(prev => {
            const updated = [...prev];
            
            if (field === 'price') {
                if (value === '' || /^\d*\.?\d*$/.test(value)) {
                    updated[index][field] = value;
                }
            } else {
                updated[index][field] = value;
            }

            return updated;
        });
    };

    // --- Save Logic (Create/Update - Server) ---
    const handleSave = async (index) => {
        const imgObj = images[index];
        
        // Validation checks
        if (!imgObj.url || !imgObj.title || !imgObj.description || !imgObj.design || !imgObj.price) {
             // NOTE: Changed alert to console.error + visual feedback (or custom modal) as per instructions
             console.error("Validation Error: All fields are required (URL, Title, Description, Design, Price)!");
             return;
        }
        
        const parsedPrice = parseFloat(imgObj.price);
        if (isNaN(parsedPrice) || parsedPrice <= 0) {
             // NOTE: Changed alert to console.error + visual feedback (or custom modal) as per instructions
             console.error("Validation Error: Price must be a valid positive number!");
             return;
        }

        if (imgObj.isSaving) return;
        
        // Set local saving state
        setImages(prev => {
            const updated = [...prev];
            updated[index].isSaving = true;
            return updated;
        });

        try {
            const isUpdate = !!imgObj._id;
            const url = isUpdate ? `${API_URL}/${imgObj._id}` : API_URL;
            const method = isUpdate ? 'PUT' : 'POST';

            // Data payload for the server
            const makeupData = {
                url: imgObj.url,
                title: imgObj.title,
                description: imgObj.description,
                design: imgObj.design,
                price: parsedPrice 
            };
            
            // 🛑 ADDED try/catch directly around fetch to capture network error specifically
            let response;
            try {
                response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(makeupData),
                });
            } catch (networkError) {
                // This block catches the "Failed to fetch" (network/CORS/unreachable server)
                console.error("Network Fetch Error:", networkError);
                throw new Error(`Failed to connect to server at ${url}. Check if the Express server is running and the CORS origin is correct.`);
            }


            if (!response.ok) {
                // Read error message from server response if available
                const errorBody = await response.json().catch(() => ({ message: 'Server error: Invalid JSON response' }));
                throw new Error(errorBody.message || `HTTP error! status: ${response.status}`);
            }

            const savedObj = await response.json();

            // Update state with server data and marks as saved
            setImages(prev => {
                const updated = [...prev];
                // Ensure the returned price is converted back to a string for the input field
                updated[index] = { ...savedObj, price: String(savedObj.price), saved: true, isSaving: false };
                return updated;
            });
        } catch (err) {
            console.error("Final Error saving makeup entry:", err);
             // NOTE: Changed alert to console.error + visual feedback (or custom modal) as per instructions
            alert(`Failed to save entry: ${err.message}`);
            
            // Revert saving flag on failure
            setImages(prev => {
                const updated = [...prev];
                updated[index].isSaving = false;
                return updated;
            });
        }
    };

    // --- Edit Logic (Local) ---
    const handleEdit = (index) => {
        setImages(prev => {
            const updated = [...prev];
            updated[index].saved = false;
            return updated;
        });
    };

    return (
        <div className='p-4'>
            {/* Header and URL Input */}
            <div className='flex items-center justify-between'>
                <h1 className='font-bold text-2xl font-music mt-8'>Brides Makeup Count ({images.length})</h1>
            </div>
            
            {/* Global Status Indicators */}
            {loading && <p className="text-blue-500 font-semibold mt-2">Loading makeup entries...</p>}
            {error && <p className="text-red-500 font-semibold mt-2">Error: {error}</p>}
            
            {/* Image URL Input Field */}
            <div className='flex items-center gap-2 mt-4 p-4 border-2 rounded-2xl max-w-lg shadow-md'>
                <FaImage className='text-2xl text-gray-500' />
                <input
                    type="url"
                    placeholder="Paste Image URL here (e.g., https://example.com/makeup.jpg)"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="flex-grow border-b-2 py-1 px-2 focus:border-green-500 outline-none"
                    disabled={loading}
                />
                <button 
                    onClick={handleAddUrl} 
                    className='text-green-500 hover:text-green-700 transition text-2xl p-1 disabled:opacity-50'
                    disabled={loading || !imageUrl.trim()}
                >
                    <FaPlus />
                </button>
            </div>


            {/* Uploaded images with editable fields */}
            <div className='flex flex-wrap gap-4 mt-4'>
                {images.map((imgObj, index) => (
                    <div key={imgObj._id || imgObj.tempId || index} className="relative w-[320px] border-2 rounded-2xl overflow-hidden shadow-lg p-2">
                        
                        {/* Image Preview */}
                        <div className="relative w-full h-[180px] bg-gray-100 flex items-center justify-center">
                            <img 
                                src={imgObj.url} 
                                alt={imgObj.title || 'Makeup Preview'} 
                                className="w-full h-full object-cover rounded"
                                onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/320x180?text=Invalid+URL" }}
                            />
                            <p 
                                onClick={() => handleDelete(index)} 
                                className="absolute top-2 right-2 cursor-pointer text-red-500 bg-white rounded-full p-1 shadow-md"
                            >
                                <FaTrash />
                            </p>
                            {imgObj.isSaving && <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center text-white font-bold">Saving...</div>}
                        </div>

                        {/* Input fields */}
                        <div className='flex flex-col mt-2 gap-2'>
                            <input type="text" placeholder="Image URL (read-only)" value={imgObj.url} disabled={true} className="border px-2 py-1 rounded bg-gray-100 text-gray-500" />
                            <input 
                                type="text" placeholder="Title" value={imgObj.title} 
                                disabled={imgObj.saved || imgObj.isSaving}
                                onChange={(e) => handleChange(index, 'title', e.target.value)}
                                className="border px-2 py-1 rounded disabled:bg-gray-50 disabled:text-gray-500"
                            />
                            <input 
                                type="text" placeholder="Description" value={imgObj.description} 
                                disabled={imgObj.saved || imgObj.isSaving}
                                onChange={(e) => handleChange(index, 'description', e.target.value)}
                                className="border px-2 py-1 rounded disabled:bg-gray-50 disabled:text-gray-500"
                            />
                            <input 
                                type="text" placeholder="Design/Style" value={imgObj.design} 
                                disabled={imgObj.saved || imgObj.isSaving}
                                onChange={(e) => handleChange(index, 'design', e.target.value)}
                                className="border px-2 py-1 rounded disabled:bg-gray-50 disabled:text-gray-500"
                            />
                            <input 
                                type="number" 
                                step="0.01" 
                                placeholder="Price" value={imgObj.price} 
                                disabled={imgObj.saved || imgObj.isSaving}
                                onChange={(e) => handleChange(index, 'price', e.target.value)}
                                className="border px-2 py-1 rounded disabled:bg-gray-50 disabled:text-gray-500"
                            />

                            {/* Save / Edit Button */}
                            {!imgObj.saved || imgObj.isSaving ? (
                                <button 
                                    onClick={() => handleSave(index)}
                                    disabled={imgObj.isSaving || !imgObj.title || !imgObj.design || !imgObj.description || !imgObj.price}
                                    className="bg-green-500 text-white mt-2 py-1 px-3 rounded flex items-center justify-center gap-2 hover:bg-green-600 transition disabled:bg-gray-400"
                                >
                                    {imgObj.isSaving ? 'Saving...' : <><FaCheck /> Save</>}
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleEdit(index)}
                                    disabled={imgObj.isSaving}
                                    className="bg-yellow-500 text-white mt-2 py-1 px-3 rounded flex items-center justify-center gap-2 hover:bg-yellow-600 transition disabled:bg-gray-400"
                                >
                                    <FaEdit /> Edit
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default BrideMakeup;