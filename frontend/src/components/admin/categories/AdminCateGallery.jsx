import React, { useEffect, useState } from "react";
import { FaTrash, FaPlus, FaEdit, FaSave, FaImage, FaTimesCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Defines the initial structure for a new gallery set
const initialGalleryState = {
    // _id is null for new galleries until saved to the backend (MongoDB generates it)
    _id: null, 
    main: "",
    extras: ["", "", "", ""], // Frontend field names
};

const AdminCateGallery = () => {
    const [galleries, setGalleries] = useState([]);
    const [newMainUrl, setNewMainUrl] = useState("");
    const [selectedGallery, setSelectedGallery] = useState(null); 
    const [isEditing, setIsEditing] = useState(false); 

    const navigate = useNavigate();

    // --- API Handlers ---

    // FETCH DATA ON COMPONENT MOUNT
    useEffect(() => {
        fetch("http://localhost:5000/gallery")
            .then((res) => res.json())
            .then((data) => {
                const fixed = data.map((g) => ({
                    // CRITICAL: Map backend fields to frontend state fields
                    _id: g._id, 
                    main: g.img,         // Maps backend 'img' to frontend 'main'
                    extras: g.collection, // Maps backend 'collection' to frontend 'extras'
                }));
                setGalleries(fixed);
            })
            .catch((err) => console.error("Fetch error:", err));
    }, []);

    // HANDLE SAVE/UPDATE FOR THE SELECTED GALLERY (Unified Logic)
    const handleSaveSelectedGallery = () => {
        if (!selectedGallery) return;

        // 1. Separate _id and map frontend fields to backend schema fields
        const { _id, main, extras } = selectedGallery; 
        
        // CRITICAL FIX: Create payload with correct backend field names (img and collection)
        const payload = {
            img: main,         
            collection: extras
        };

        const method = _id ? "PUT" : "POST";
        const url = _id ? `http://localhost:5000/gallery/${_id}` : `http://localhost:5000/gallery`;

        fetch(url, { 
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload), 
        })
        .then((res) => {
            if (!res.ok) {
                return res.json().then(errorData => { 
                    throw new Error(errorData.message || `HTTP error! Status: ${res.status}`); 
                });
            }
            return res.json();
        })
        .then((savedData) => {
            // Data received back from the server (includes the _id if it was a POST)
            // Ensure the updated object uses frontend names (main, extras) for consistency
            const updatedGallery = { 
                _id: savedData._id || _id,
                main: savedData.img, // Mapping back
                extras: savedData.collection // Mapping back
            };
            
            // Update the main galleries array
            setGalleries(prevGalleries => {
                if (_id) {
                    // Update existing item
                    const index = prevGalleries.findIndex(g => g._id === _id);
                    if (index > -1) {
                        const newGalleries = [...prevGalleries];
                        newGalleries[index] = updatedGallery;
                        return newGalleries;
                    }
                } else {
                    // Add new item
                    return [...prevGalleries, updatedGallery];
                }
                return prevGalleries;
            });

            setSelectedGallery(updatedGallery); 
            setIsEditing(false); // Lock the form
            alert(`Gallery successfully ${method === 'POST' ? 'created' : 'updated'}!`);
        })
        .catch((err) => {
            console.error("Save error:", err.message);
            alert(`Failed to save gallery. Error: ${err.message}`);
        });
    };
    
    // --- Local Handlers for the List ---
    
    // Create new gallery (initial entry)
    const handleCreateGallery = () => {
        if (newMainUrl.trim()) {
            const newGallery = { ...initialGalleryState, main: newMainUrl.trim() };
            
            // Add the new gallery temporarily to state (without _id)
            setGalleries([...galleries, newGallery]);
            setNewMainUrl("");
            
            // Immediately select the new gallery and enable editing
            handleSelectGallery(newGallery, true); 
        }
    };

    // Select a gallery item from the list to populate the form
    const handleSelectGallery = (gallery, startEditing = false) => {
        setSelectedGallery({...gallery}); // Clone for isolated editing
        setIsEditing(startEditing);
    };

    // Delete entire gallery
    const deleteGallery = (id) => {
        if (!id) return;

        if (window.confirm("Are you sure you want to delete this gallery set?")) {
            // 1. Send DELETE request to backend
            fetch(`http://localhost:5000/gallery/${id}`, { method: "DELETE" })
                .then(res => {
                    if (!res.ok) throw new Error(`Failed to delete. Status: ${res.status}`);
                    return res.text().then(text => text ? JSON.parse(text) : {}); 
                })
                .then(() => {
                    // 2. SUCCESS: Remove from local state
                    setGalleries(galleries.filter((g) => g._id !== id));
                    if (selectedGallery && selectedGallery._id === id) {
                        setSelectedGallery(null); // Clear the form
                        setIsEditing(false);
                    }
                    alert("Gallery deleted successfully.");
                })
                .catch(err => {
                    console.error("Delete error:", err.message);
                    alert(`Failed to delete gallery. Error: ${err.message}`);
                });
        }
    };

    // Handle changes in the form inputs
    const handleFormChange = (e, slot = null, isMain = false) => {
        if (!selectedGallery) return;
        const value = e.target.value;

        if (isMain) {
            setSelectedGallery({ ...selectedGallery, main: value });
        } else if (slot !== null) {
            const newExtras = [...selectedGallery.extras];
            newExtras[slot] = value;
            setSelectedGallery({ ...selectedGallery, extras: newExtras });
        }
    };

    // --- Navigation Handler ---
    const handleSelect = (e) => {
        if (e.target.value) navigate(e.target.value);
    };


    // --- Component Render ---
    return (
        <div className="p-6 min-h-screen bg-gray-50">

            {/* Header and Navigation */}
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-extrabold text-pink-600 mb-2">
                    Category Image Manager (List-Detail Mode)
                </h1>
                <p className="text-gray-600 mb-6">
                    Select a gallery on the left to edit its details in the main form.
                </p>

                <select
                    className="border border-gray-300 rounded-lg px-4 py-2"
                    defaultValue=""
                    onChange={handleSelect}
                >
                    <option value="" disabled>Select Section</option>
                    <option value="/admin/categories/wedflora">Wedding Images</option>
                    <option value="/admin/categories/wedgallery">Wedding Gallery</option>
                </select>
            </div>

            <hr className="my-8" />
            
            <div className="flex flex-col lg:flex-row gap-6">
                
                {/* --- LEFT: GALLERY LIST --- */}
                <div className="lg:w-1/3 w-full bg-white p-4 shadow-xl rounded-xl h-fit sticky top-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <FaImage className="text-pink-500" /> Gallery Sets
                    </h2>

                    {/* Create New Gallery Input */}
                    <div className="flex gap-2 mb-4 p-2 border rounded-lg bg-gray-50">
                        <input
                            type="text"
                            value={newMainUrl}
                            onChange={(e) => setNewMainUrl(e.target.value)}
                            placeholder="New Main URL (to create new gallery)"
                            className="flex-grow border p-2 rounded-lg text-sm"
                        />
                        <button
                            onClick={handleCreateGallery}
                            disabled={!newMainUrl.trim()}
                            className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
                        >
                            <FaPlus />
                        </button>
                    </div>

                    {/* List of Galleries */}
                    <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                        {galleries.length === 0 ? (
                            <p className="text-gray-500 italic">No galleries loaded.</p>
                        ) : (
                            galleries.map((g) => (
                                <div
                                    // Key uses _id for existing items, or main URL for temporary new items
                                    key={g._id || g.main} 
                                    className={`p-3 rounded-lg flex items-center justify-between cursor-pointer transition-all border ${
                                        selectedGallery?._id === g._id 
                                            ? "bg-pink-100 border-pink-500 shadow-md" 
                                            : "bg-white hover:bg-gray-50"
                                    }`}
                                    onClick={() => handleSelectGallery(g)}
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="w-12 h-12 flex-shrink-0 bg-gray-200 rounded overflow-hidden">
                                            {g.main 
                                                ? <img src={g.main} alt="Thumbnail" className="w-full h-full object-cover" /> 
                                                : <FaImage className="text-gray-500 w-full h-full p-2" />
                                            }
                                        </div>
                                        <span className="font-semibold text-sm truncate">
                                            {g.main.substring(0, 30)}...
                                        </span>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); deleteGallery(g._id); }}
                                        className="text-red-500 hover:text-red-700 p-1"
                                    >
                                        <FaTrash size={14} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* --- RIGHT: DETAIL/EDIT FORM --- */}
                <div className="lg:w-2/3 w-full bg-white p-6 shadow-xl rounded-xl">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        {selectedGallery ? 
                            `Editing Gallery: ${selectedGallery._id ? selectedGallery._id.substring(0, 12) + '...' : 'NEW ITEM'}` 
                            : "Select a Gallery to Edit"
                        }
                    </h2>

                    {!selectedGallery ? (
                        <p className="text-gray-500 mt-10 p-5 border-dashed border-gray-300 border rounded-lg">
                            Click on a gallery set on the left to load its details into this form.
                        </p>
                    ) : (
                        <div className="space-y-6">
                            
                            {/* Form Header and Edit/Save Control */}
                            <div className="flex justify-between items-center pb-4 border-b">
                                <span className={`font-semibold text-lg ${isEditing ? 'text-blue-600' : 'text-pink-600'}`}>
                                    {isEditing ? "Editing Mode" : "Read-Only Mode"}
                                </span>
                                <div className="flex gap-2">
                                    {isEditing ? (
                                        <>
                                            <button
                                                onClick={handleSaveSelectedGallery}
                                                className="bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-blue-700 disabled:bg-gray-400"
                                                disabled={!isEditing}
                                            >
                                                <FaSave /> Save Changes
                                            </button>
                                            <button
                                                onClick={() => {
                                                    // Revert changes by reloading original data
                                                    const original = galleries.find(g => g._id === selectedGallery._id);
                                                    setSelectedGallery(original ? {...original} : null); 
                                                    setIsEditing(false); 
                                                }}
                                                className="bg-red-500 text-white py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-red-600"
                                            >
                                                <FaTimesCircle /> Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="bg-pink-600 text-white py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-pink-700"
                                        >
                                            <FaEdit /> Enable Editing
                                        </button>
                                    )}
                                </div>
                            </div>
                            
                            {/* MAIN URL SECTION */}
                            <div className="p-4 border rounded-lg bg-gray-50">
                                <label className="block text-gray-700 font-bold mb-2">Main Image URL (Thumbnail)</label>
                                <input
                                    type="text"
                                    value={selectedGallery.main}
                                    onChange={(e) => handleFormChange(e, null, true)}
                                    disabled={!isEditing}
                                    className={`w-full border p-2 rounded-lg text-sm ${isEditing ? 'bg-white' : 'bg-gray-200 cursor-default'}`}
                                />
                                <div className="w-full h-40 mt-4 bg-gray-200 flex items-center justify-center rounded overflow-hidden">
                                    {selectedGallery.main 
                                        ? <img src={selectedGallery.main} alt="Main Preview" className="w-full h-full object-cover" /> 
                                        : <span className="text-gray-500">Main Image Preview</span>
                                    }
                                </div>
                            </div>

                            {/* COLLECTION URLS SECTION */}
                            <div className="p-4 border rounded-lg">
                                <label className="block text-gray-700 font-bold mb-3">Collection Image URLs (4)</label>
                                <div className="space-y-3">
                                    {selectedGallery.extras.map((url, slot) => (
                                        <div key={slot} className="flex gap-2 items-center">
                                            <input
                                                type="text"
                                                value={url}
                                                onChange={(e) => handleFormChange(e, slot)}
                                                disabled={!isEditing}
                                                placeholder={`Extra URL ${slot + 1}`}
                                                className={`flex-grow border p-2 rounded-lg text-sm ${isEditing ? 'bg-white' : 'bg-gray-200 cursor-default'}`}
                                            />
                                            <div className="w-10 h-10 flex-shrink-0 bg-gray-200 rounded overflow-hidden flex items-center justify-center">
                                                {url 
                                                    ? <img src={url} alt={`Extra ${slot} Preview`} className="w-full h-full object-cover" /> 
                                                    : <FaImage className="text-gray-500 text-sm" />
                                                }
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Final Save Button */}
                            <div className="pt-4 border-t">
                                <button
                                    onClick={handleSaveSelectedGallery}
                                    className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-purple-700 disabled:bg-gray-400"
                                    disabled={!isEditing}
                                >
                                    <FaSave /> {selectedGallery._id ? "Update Selected Gallery" : "Create New Gallery"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminCateGallery;