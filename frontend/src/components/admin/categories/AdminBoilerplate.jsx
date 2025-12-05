import React, { useState, useEffect } from "react";
import { FaTrash, FaPlus, FaLink, FaCheck, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// ---------------------------------------------------------------------
// BOILERPLATE CONFIGURATION
// ---------------------------------------------------------------------
const API_ENDPOINT = "http://localhost:5000/YOUR_ENDPOINT_HERE"; // ⬅️ UPDATE THIS
const PAGE_TITLE = "Generic Image Manager";
const ITEM_SECTION_TITLE = "Items List";
const NAV_OPTIONS = [
    { label: "Section 1", value: "/admin/categories/section1" },
    { label: "Section 2", value: "/admin/categories/section2" }
];
// ---------------------------------------------------------------------

const AdminBoilerplate = () => {
    const [items, setItems] = useState([]);
    const [loadingIndex, setLoadingIndex] = useState(null);
    const navigate = useNavigate();

    // Navigate between sections
    const handleSelect = (e) => {
        if (e.target.value) navigate(e.target.value);
    };

    // Fetch items on load
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const res = await fetch(API_ENDPOINT);
                if (!res.ok) throw new Error("Network response was not ok");
                const data = await res.json();
                
                // MAPPING BACKEND FIELDS to FRONTEND STATE
                setItems(data.map(item => ({ 
                    id: item._id, 
                    image: item.img, 
                    image1: item.img1, // ⬅️ Dual image support
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

    // Create or Update item
    const handleSaveOrUpdate = async (index) => {
        const item = items[index];
        if (!item.image) return alert("Please provide an Image URL.");

        // PAYLOAD STRUCTURE
        const payload = { 
            img: item.image, 
            img1: item.image1, 
            title: item.heading, 
            details: item.description 
        };
        
        const method = item.id ? "PUT" : "POST";
        const url = item.id ? `${API_ENDPOINT}/${item.id}` : API_ENDPOINT;

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

            const updated = [...items];
            if (method === "POST") {
                updated[index] = { 
                    ...updated[index], 
                    id: data.type?._id || data._id, // Adjust based on backend response
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

    // Delete item
    const handleDeleteImage = async (index) => {
        const item = items[index];
        const isBackendItem = !!item.id;
        if (!window.confirm(isBackendItem ? "Delete from database?" : "Delete unsaved item?")) return;

        if (isBackendItem) {
            try {
                const res = await fetch(`${API_ENDPOINT}/${item.id}`, { method: "DELETE" });
                if (!res.ok) throw new Error("Failed to delete on server.");
            } catch (err) {
                 alert("Failed to delete from database.");
                 console.error("Delete error:", err);
                 return; 
            }
        }

        setItems(items.filter((_, i) => i !== index));
    };

    // Add new item
    const handleAdd = () => setItems([...items, { 
        image: "", 
        image1: "", 
        heading: "", 
        description: "", 
        saved: false 
    }]);

    // Update field
    const updateField = (index, field, value) => {
        const updated = [...items];
        updated[index][field] = value;
        if (updated[index].saved) updated[index].saved = false;
        setItems(updated);
    };

    // Handle Edit
    const handleEdit = (index) => {
        const updated = [...items];
        updated[index].saved = false;
        setItems(updated);
    };

    return (
        <div className="mt-5 font-music font-bold text-[20px]">
            <div className="mb-20 text-center">
                <h1 className="text-4xl font-extrabold text-pink-600 mb-2">{PAGE_TITLE}</h1>
                <p className="mb-10">Add images, heading, and description using an Image URL.</p>
                <select
                    className="border border-gray-300 font-serif rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 mt-2"
                    defaultValue=""
                    onChange={handleSelect}
                >
                    <option value="" disabled>Select Section</option>
                    {NAV_OPTIONS.map((opt, idx) => (
                        <option key={idx} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>

            <div className="mb-2 text-pink-700 underline underline-offset-8">{ITEM_SECTION_TITLE}</div>

            <div className="flex items-center gap-4 text-[22px] mb-3 absolute right-10">
                <FaPlus className="text-green-500 cursor-pointer" onClick={handleAdd} />
                <FaTrash className="text-red-500 cursor-pointer" onClick={() => setItems(items.filter(item => item.id))} />
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item, index) => (
                    <div key={item.id || index} className="border-2 p-3 rounded-xl relative">
                        {/* ----------------- Image Preview ----------------- */}
                        <div className="relative w-full h-40 rounded-lg overflow-hidden group border bg-gray-100 flex justify-center items-center">
                            {item.image ? (
                                <img src={item.image} alt="preview" className="w-full h-full object-cover group-hover:scale-105 transition" />
                            ) : (
                                <span className="text-gray-400 text-sm">No Image</span>
                            )}
                            <button onClick={() => handleDeleteImage(index)} className="absolute top-1 right-1 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition">
                                <FaTrash size={14} />
                            </button>
                        </div>
                        {/* ----------------- Image 1 URL ----------------- */}
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
                        
                        {/* Image 2 (img1) URL Input Field */}
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

                        <input
                            type="text"
                            placeholder="Enter heading"
                            value={item.heading}
                            disabled={item.saved}
                            onChange={(e) => updateField(index, "heading", e.target.value)}
                            className="w-full border mt-3 px-3 py-2 rounded-md text-[16px] text-black font-normal disabled:bg-gray-50 disabled:cursor-not-allowed"
                        />

                        <textarea
                            placeholder="Enter description"
                            value={item.description}
                            disabled={item.saved}
                            onChange={(e) => updateField(index, "description", e.target.value)}
                            rows="3"
                            className="w-full border mt-2 px-3 py-2 rounded-md text-[16px] font-normal disabled:bg-gray-50 disabled:cursor-not-allowed"
                        />

                        <div className="mt-2">
                            {!item.saved ? (
                                <button
                                    onClick={() => handleSaveOrUpdate(index)}
                                    disabled={loadingIndex === index}
                                    className="bg-green-500 text-white py-1 px-3 rounded flex items-center gap-2 hover:bg-green-600 transition"
                                >
                                    <FaCheck /> {item.id ? 'Update' : 'Save'}
                                </button>
                            ) : (
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
                    <div className="w-full h-40 border-2 border-dashed border-gray-400 rounded-lg flex flex-col justify-center items-center text-gray-500">
                        <FaLink className="text-4xl mb-2" />
                        Use (+) to add a new item via URL.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminBoilerplate;
