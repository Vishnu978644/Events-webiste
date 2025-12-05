import React, { useState, useEffect } from "react";
import { FaTrash, FaPlus, FaLink, FaCheck, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminWedFlora = () => {
    // ------------------- STATE MANAGEMENT -------------------
    const [items, setItems] = useState([]); // Stores the list of items
    const [loadingIndex, setLoadingIndex] = useState(null); // Tracks which item is currently saving
    const navigate = useNavigate(); // Hook for navigating between routes

    // ------------------- NAVIGATION -------------------
    const handleSelect = (e) => {
        if (e.target.value) navigate(e.target.value);
    };

    // ------------------- FETCH ITEMS ON LOAD (READ) -------------------
    useEffect(() => {
        const fetchItems = async () => {
            try {
                // Fetch data from the local server endpoint
                const res = await fetch("http://localhost:5000/type");
                if (!res.ok) throw new Error("Network response was not ok");
                const data = await res.json();
                
                // Map backend fields to the frontend state structure
                setItems(data.map(item => ({ 
                    id: item._id, 
                    image: item.img, 
                    image1: item.img1, // Map secondary image
                    heading: item.title, 
                    description: item.details, 
                    saved: true 
                })));
            } catch (err) {
                console.error("Fetch error:", err);
                alert("Failed to load data. Check server connection.");
            }
        };
        fetchItems();
    }, []);

    // ------------------- CREATE OR UPDATE ITEM -------------------
    const handleSaveOrUpdate = async (index) => {
        const item = items[index];
        if (!item.image) return alert("Please provide an Image URL.");

        // Data payload sent to the backend
        const payload = { 
            img: item.image, 
            img1: item.image1, // Include secondary image in payload
            title: item.heading, 
            details: item.description 
        };
        
        // Determine if creating (POST) or updating (PUT)
        const method = item.id ? "PUT" : "POST";
        const url = item.id ? `http://localhost:5000/type/${item.id}` : "http://localhost:5000/type";

        try {
            setLoadingIndex(index);
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || `HTTP error! Status: ${res.status}`);
            }

            const data = await res.json();

            // Update local state after successful save/update
            const updated = [...items];
            if (method === "POST") {
                // Save the new ID returned by the server
                updated[index] = { 
                    ...updated[index], 
                    id: data.type._id, 
                    saved: true 
                };
            } else {
                updated[index].saved = true;
            }

            setItems(updated);
            alert(`Item ${method === "POST" ? "Created" : "Updated"} successfully!`);
        } catch (err) {
            console.error("Save/Update error:", err);
            alert(`Failed to ${method === "POST" ? "create" : "update"} item. Check the console for details.`);
        } finally {
            setLoadingIndex(null);
        }
    };

    // ------------------- DELETE ITEM -------------------
    const handleDeleteImage = async (index) => {
        const item = items[index];
        const isBackendItem = !!item.id; // Check if the item is already in the database
        if (!window.confirm(isBackendItem ? "Delete from database?" : "Delete unsaved item?")) return;

        if (isBackendItem) {
            try {
                // Send DELETE request to server
                const res = await fetch(`http://localhost:5000/type/${item.id}`, { method: "DELETE" });
                if (!res.ok) throw new Error("Failed to delete on server.");
            } catch (err) {
                alert("Failed to delete from database.");
                console.error("Delete error:", err);
                return; 
            }
        }

        // Remove the item from the local state list
        setItems(items.filter((_, i) => i !== index));
    };

    // ------------------- ADD NEW ITEM -------------------
    const handleAdd = () => setItems([...items, { 
        image: "", 
        image1: "", // Initialize secondary image field
        heading: "", 
        description: "", 
        saved: false 
    }]);

    // ------------------- UPDATE LOCAL FIELD -------------------
    const updateField = (index, field, value) => {
        const updated = [...items];
        updated[index][field] = value;
        // Mark as unsaved if user starts typing
        if (updated[index].saved) updated[index].saved = false;
        setItems(updated);
    };

    // ------------------- ENABLE EDITING -------------------
    const handleEdit = (index) => {
        const updated = [...items];
        updated[index].saved = false; // Set saved to false to unlock inputs
        setItems(updated);
    };

    // ------------------- RENDERED COMPONENT (JSX) -------------------
    return (
        <div className="mt-5 font-music font-bold text-[20px]">
            <div className="mb-20 text-center">
                <h1 className="text-4xl font-extrabold text-pink-600 mb-2">Category Image Manager</h1>
                <p className="mb-10">Add images, heading, and description for Wedding Flora using an Image URL.</p>
                <select
                    className="border border-gray-300 font-serif rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 mt-2"
                    defaultValue="/admin/categories/wedflora"
                    onChange={handleSelect}
                >
                    <option value="" disabled>Select Section</option>
                    <option value="/admin/categories/wedflora">Wedding Types</option>
                    <option value="/admin/categories/wedgallery">Wedding gallery</option>
                </select>
            </div>

            <div className="mb-2 text-pink-700 underline underline-offset-8">Wedding Flora Items</div>

            <div className="flex items-center gap-4 text-[22px] mb-3 absolute right-10">
                {/* Button to add a new blank item */}
                <FaPlus className="text-green-500 cursor-pointer" onClick={handleAdd} />
                {/* Button to remove UN-SAVED items (items without an ID) */}
                <FaTrash 
                    className="text-red-500 cursor-pointer" 
                    onClick={() => {
                        if (window.confirm("Remove ALL unsaved/new items?")) {
                            setItems(items.filter(item => item.id));
                        }
                    }} 
                />
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item, index) => (
                    // Card for a single item
                    <div key={item.id || index} className="border-2 p-3 rounded-xl relative">
                        {/* ----------------- Image Preview ----------------- */}
                        <div className="relative w-full h-40 rounded-lg overflow-hidden group border bg-gray-100 flex justify-center items-center">
                            {item.image ? (
                                <img src={item.image} alt="preview" className="w-full h-full object-cover group-hover:scale-105 transition" />
                            ) : (
                                <span className="text-gray-400 text-sm">No Image</span>
                            )}
                            {/* Individual Delete Button (Triggers API delete) */}
                            <button onClick={() => handleDeleteImage(index)} className="absolute top-1 right-1 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition">
                                <FaTrash size={14} />
                            </button>
                        </div>
                        {/* ----------------- Primary Image URL Input ----------------- */}
                        <div className="flex items-center mt-3 gap-2">
                            <FaLink className="text-gray-500 w-5 h-5"/>
                            <input
                                type="text"
                                placeholder="Paste Primary Image URL"
                                value={item.image}
                                disabled={item.saved}
                                onChange={(e) => updateField(index, "image", e.target.value)}
                                className="w-full border px-3 py-2 rounded-md text-[16px] text-black font-normal disabled:bg-gray-50 disabled:cursor-not-allowed"
                            />
                        </div>
                        
                        {/* ----------------- Secondary Image URL Input (img1) ----------------- */}
                        <div className="flex items-center mt-3 gap-2">
                            <FaLink className="text-gray-500 w-5 h-5"/>
                            <input
                                type="text"
                                placeholder="Paste Secondary Image URL (img1)"
                                value={item.image1}
                                disabled={item.saved}
                                onChange={(e) => updateField(index, "image1", e.target.value)}
                                className="w-full border px-3 py-2 rounded-md text-[16px] text-black font-normal disabled:bg-gray-50 disabled:cursor-not-allowed"
                            />
                        </div>

                        {/* ----------------- Heading Input ----------------- */}
                        <input
                            type="text"
                            placeholder="Enter heading"
                            value={item.heading}
                            disabled={item.saved}
                            onChange={(e) => updateField(index, "heading", e.target.value)}
                            className="w-full border mt-3 px-3 py-2 rounded-md text-[16px] text-black font-normal disabled:bg-gray-50 disabled:cursor-not-allowed"
                        />

                        {/* ----------------- Description Input ----------------- */}
                        <textarea
                            placeholder="Enter description"
                            value={item.description}
                            disabled={item.saved}
                            onChange={(e) => updateField(index, "description", e.target.value)}
                            rows="3"
                            className="w-full border mt-2 px-3 py-2 rounded-md text-[16px] font-normal disabled:bg-gray-50 disabled:cursor-not-allowed"
                        />

                        {/* ----------------- Action Buttons ----------------- */}
                        <div className="mt-2">
                            {!item.saved ? (
                                // Show Save/Update button when in edit mode
                                <button
                                    onClick={() => handleSaveOrUpdate(index)}
                                    disabled={loadingIndex === index}
                                    className="bg-green-500 text-white py-1 px-3 rounded flex items-center gap-2 hover:bg-green-600 transition"
                                >
                                    <FaCheck /> {item.id ? 'Update' : 'Save'}
                                </button>
                            ) : (
                                // Show Edit button when saved
                                <button
                                    onClick={() => handleEdit(index)}
                                    className="bg-yellow-500 text-white py-1 px-3 rounded flex items-center gap-2 hover:bg-yellow-600 transition"
                                >
                                    <FaEdit /> Edit
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                {items.length === 0 && (
                    // Message shown if no items are loaded
                    <div className="w-full h-40 border-2 border-dashed border-gray-400 rounded-lg flex flex-col justify-center items-center text-gray-500">
                        <FaLink className="text-4xl mb-2" />
                        Use (+) to add a new item via URL.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminWedFlora;