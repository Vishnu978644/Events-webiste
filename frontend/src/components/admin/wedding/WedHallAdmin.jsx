import React, { useState, useEffect } from "react";
import { FaTrash, FaPlus, FaImage, FaCheck, FaEdit, FaLink } from "react-icons/fa";

// The base URL for your Express API endpoints
const API_BASE_URL = 'http://localhost:5000/hall'; 

// 🛑 Helper Function for Robust Error Handling
// This function safely handles responses that are not valid JSON (e.g., HTML 404/500 pages)
const handleResponseError = async (response) => {
    // 1. Read the response body as text
    const text = await response.text();

    // 2. Default error message
    let message = `Request failed with status ${response.status}.`;
    
    // 3. Try to parse as JSON (safely)
    try {
        const json = JSON.parse(text);
        // Use the server's error message if available
        message = json.message || json.error || message; 
    } catch (e) {
        // If parsing fails (the body was HTML or empty text)
        console.error('API Error response was not JSON. Content:', text);
        if (text.startsWith('<!doctype')) {
            message = `Server returned an HTML page (404/500 error). Check your API URL and Express routes.`;
        } else {
             message = `Server returned an unexpected response (status ${response.status}).`;
        }
    }
    
    throw new Error(message);
};


const WedHallAdmin = () => {
    // State to hold the hall data
    const [items, setItems] = useState([]); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // State for new item URL input
    const [mainUrlInput, setMainUrlInput] = useState('');
    const [showUrlInput, setShowUrlInput] = useState(false);

    // 1. READ (R): Fetch all halls on load
    useEffect(() => {
        getHall();
    }, []);

    const getHall = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(API_BASE_URL);
            
            if (!response.ok) {
                await handleResponseError(response); 
            }
            
            const data = await response.json();
            
            // Map the fetched data to match the component's state structure
            const mappedData = data.map(item => ({
                id: item._id, 
                main: item.mainImageUrl,
                extras: item.thumbnailUrls || ["", "", "", ""], 
                title: item.title,
                description: item.description,
                price: item.price,
                saved: true, 
            }));
            setItems(mappedData);
        } catch (err) {
            setError(err.message);
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    // 2. CREATE (C): POST new hall
    const createHall = async (item) => {
        const payload = {
            mainImageUrl: item.main,
            thumbnailUrls: item.extras.filter(url => url), 
            title: item.title,
            description: item.description,
            price: item.price,
        };

        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                await handleResponseError(response);
            }

            const newHall = await response.json();
            return newHall; 
        } catch (err) {
            setError(err.message);
            console.error('Create error:', err);
            throw err; 
        }
    };

    // 3. UPDATE (U): PUT existing hall
    const updateHall = async (item) => {
        const payload = {
            mainImageUrl: item.main,
            thumbnailUrls: item.extras.filter(url => url),
            title: item.title,
            description: item.description,
            price: item.price,
        };

        try {
            const response = await fetch(`${API_BASE_URL}/${item.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                 await handleResponseError(response);
            }
        } catch (err) {
            setError(err.message);
            console.error('Update error:', err);
            throw err; 
        }
    };

    // 4. DELETE (D): DELETE hall
    const deleteHall = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'DELETE',
            });

            // Handle successful 204 No Content / 200 OK responses
            if (response.status === 204 || response.status === 200) {
                setItems(prev => prev.filter(item => item.id !== id));
                return;
            }

            // If it's an error status, use the robust handler
            await handleResponseError(response);

        } catch (err) {
            setError(err.message);
            console.error('Delete error:', err);
        }
    };

    // --- UI/State Handlers ---

    const handleAddClick = () => setShowUrlInput(true);

    const handleAddItem = () => {
        if (!mainUrlInput) return;

        const newItem = {
            id: null, 
            main: mainUrlInput, 
            extras: ["", "", "", ""], 
            title: "",
            description: "",
            price: "",
            saved: false,
        };

        setItems([...items, newItem]);
        setMainUrlInput(''); 
        setShowUrlInput(false); 
    };

    const handleChange = (index, field, value) => {
        const updated = [...items];
        updated[index][field] = value;
        setItems(updated);
    };

    const handleExtraChange = (itemIndex, slotIndex, url) => {
        const updated = [...items];
        updated[itemIndex].extras[slotIndex] = url;
        setItems(updated);
    };

    const deleteItemHandler = (index) => {
        const itemToDelete = items[index];
        if (itemToDelete.id) {
            setLoading(true);
            deleteHall(itemToDelete.id).finally(() => setLoading(false));
        } else {
            // New unsaved item, just remove it from state
            setItems(items.filter((_, i) => i !== index));
        }
    };

    const toggleSave = async (index) => {
        const item = items[index];

        if (item.saved) {
            // Case 1: Currently SAVED -> Switch to EDIT mode
            const updated = [...items];
            updated[index].saved = false;
            setItems(updated);
        } else {
            // Case 2: Currently EDITING -> Switch to SAVE mode (call API)
            setLoading(true);
            setError(null);
            try {
                if (item.id) {
                    // UPDATE: Item exists in DB
                    await updateHall(item);
                } else {
                    // CREATE: New item
                    const newHall = await createHall(item);
                    // Update state with the new MongoDB ID
                    const updated = [...items];
                    updated[index].id = newHall._id;
                    setItems(updated);
                }

                // If API call succeeds, switch to saved state
                const updated = [...items];
                updated[index].saved = true;
                setItems(updated);

            } catch (err) {
                // API call failed, keep the item in EDIT mode
                console.error('Save failed. Keeping item in edit mode.', err);
            } finally {
                setLoading(false);
            }
        }
    };

    const deleteExtra = (itemIndex, slotIndex) => {
        const updated = [...items];
        updated[itemIndex].extras[slotIndex] = "";
        setItems(updated);
    };


    return (
        <div className="mt-5 font-music font-bold text-[20px] p-4">

            <h2 className="text-3xl font-extrabold text-pink-600 mb-6">Wedding Hall Admin Manager</h2>

            {/* Loading/Error Messages */}
            {(loading || error) && (
                <div className={`mb-4 p-3 rounded text-sm font-medium ${error ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                    {loading && <span>**Loading data...** Please wait.</span>}
                    {error && <span>**Error:** {error}</span>}
                </div>
            )}

            {/* Floating Add Button */}
            <div className="flex gap-4 mb-3 absolute right-5 top-5">
                <FaPlus 
                    className="text-green-500 cursor-pointer text-2xl" 
                    title="Add New Hall" 
                    onClick={handleAddClick} 
                />
            </div>

            {/* Main URL Input Form (New Item Creation) */}
            {showUrlInput && (
                <div className="mb-8 p-4 border-2 border-green-400 rounded-lg bg-green-50 shadow-md">
                    <h3 className="text-xl font-semibold mb-3 text-green-700">Add New Hall (Main Image URL)</h3>
                    <div className="flex gap-2">
                        <input
                            type="url"
                            placeholder="Paste Main Image URL here (e.g., https://example.com/hall.jpg)"
                            value={mainUrlInput}
                            onChange={(e) => setMainUrlInput(e.target.value)}
                            className="flex-grow border px-3 py-2 rounded text-base text-gray-700"
                        />
                        <button
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                            onClick={handleAddItem}
                            disabled={!mainUrlInput.trim() || loading}
                        >
                            <FaCheck className="inline mr-1" /> Create Card
                        </button>
                        <button
                            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
                            onClick={() => setShowUrlInput(false)}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Hall Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item, i) => (
                    <div key={item.id || `temp-${i}`} className="border border-gray-300 rounded-xl p-4 shadow-lg relative bg-white">
                        
                        {/* Delete main item */}
                        <button
                            className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full z-10 hover:bg-red-700 transition"
                            onClick={() => deleteItemHandler(i)}
                            title={item.id ? "Delete Hall from Database" : "Discard New Hall"}
                            disabled={loading}
                        >
                            <FaTrash />
                        </button>

                        {/* Main Thumbnail */}
                        <img 
                            src={item.main || 'https://via.placeholder.com/400x200?text=Main+Image'} 
                            alt="Main Hall"
                            className="w-full h-40 object-cover rounded-lg mb-3 border border-gray-200" 
                        />

                        {/* Extra images */}
                        <div className="grid grid-cols-4 gap-2 mb-3">
                            {item.extras.map((imgUrl, index) => (
                                <div key={index} className="relative border border-gray-300 rounded-lg p-1 h-20">
                                    {imgUrl && imgUrl.startsWith('http') ? (
                                        <>
                                            <img 
                                                src={imgUrl} 
                                                alt={`Extra ${index + 1}`}
                                                className="w-full h-full object-cover rounded-md" 
                                            />
                                            {/* Delete Extra Button */}
                                            <button
                                                className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full leading-none text-xs hover:bg-red-700 transition"
                                                onClick={() => deleteExtra(i, index)}
                                                title="Delete Extra Image URL"
                                                disabled={item.saved || loading} 
                                            >
                                                <FaTrash className="text-xs" />
                                            </button>
                                        </>
                                    ) : (
                                        // Input for Extra URL
                                        <div className="w-full h-full flex flex-col justify-center items-center">
                                            <input
                                                type="url"
                                                placeholder="Paste URL"
                                                value={item.extras[index]}
                                                onChange={(e) => handleExtraChange(i, index, e.target.value)}
                                                className="text-xs text-center w-full h-full border border-gray-400 rounded-md p-1"
                                                readOnly={item.saved || loading} 
                                            />
                                            {!item.saved && <FaLink className="absolute text-gray-500 text-xs"/>}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Title / Desc / Price Inputs */}
                        <input
                            type="text"
                            placeholder="Title (e.g., Elegant Dome)"
                            value={item.title}
                            onChange={(e) => handleChange(i, "title", e.target.value)}
                            className="border px-3 py-1 rounded mb-2 w-full text-lg font-bold"
                            readOnly={item.saved || loading}
                        />
                        <textarea
                            placeholder="Description (Max 500 characters)"
                            value={item.description}
                            onChange={(e) => handleChange(i, "description", e.target.value)}
                            className="border px-3 py-1 rounded mb-2 w-full resize-none text-base"
                            rows={2}
                            readOnly={item.saved || loading}
                        />
                        <input
                            type="text"
                            placeholder="Price (e.g., $4800)"
                            value={item.price}
                            onChange={(e) => handleChange(i, "price", e.target.value)}
                            className="border px-3 py-1 rounded mb-2 w-full text-base"
                            readOnly={item.saved || loading}
                        />

                        {/* Save / Edit Button */}
                        <button
                            className={`w-full py-2 mt-2 rounded text-white font-semibold flex justify-center items-center gap-2 transition duration-300 ${
                                item.saved ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"
                            }`}
                            onClick={() => toggleSave(i)}
                            title={item.saved ? "Enable Editing" : "Sync changes to the database"}
                            disabled={loading}
                        >
                            {loading && !item.saved ? 'Saving...' : item.saved ? <FaEdit /> : <FaCheck />}
                            {loading && !item.saved ? 'Saving...' : item.saved ? "Edit" : "Save"}
                        </button>
                    </div>
                ))}

                {/* Empty State Message */}
                {items.length === 0 && !showUrlInput && !loading && (
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 w-full h-40 border-2 border-dashed border-gray-400 rounded-lg flex flex-col justify-center items-center text-gray-500 mt-4">
                        <FaImage className="text-4xl mb-2" />
                        Click the **(+)** icon to add a new wedding hall by URL.
                    </div>
                )}
            </div>
        </div>
    );
};

export default WedHallAdmin;