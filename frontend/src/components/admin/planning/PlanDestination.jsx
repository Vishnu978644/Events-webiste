import React, { useState, useEffect } from "react";
import { FaTrash, FaPlus, FaCheck, FaEdit, FaSpinner } from "react-icons/fa";

// Configuration
const API_ROOT = "http://localhost:5000";
const DESTINATION_ENDPOINT = `${API_ROOT}/destini`;

const PlanDestination = () => {
    const [destinations, setDestinations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // State for the new item form - uses the frontend names (head, url, desc)
    const [newItem, setNewItem] = useState({
        head: "",       // Maps to title (BE)
        desc: "",       // Maps to description (BE)
        place: "",
        price: "",
        pass: "",       // Required by BE schema
        url: "",        // Maps to imgURL (BE)
        sub1: "",
        sub2: "",
        sub3: "",
    });

    // --- R: READ / Fetch Destinations ---
    const fetchDestinations = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(DESTINATION_ENDPOINT);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            
            // Map BE data (imgURL, title, description) back to FE names if needed for display/editing
            const initializedData = data.map(item => ({
                ...item,
                head: item.title,         // Map title to head
                url: item.imgURL,         // Map imgURL to url
                desc: item.description,   // Map description to desc
                isSaved: true,
                gallery: item.gallery || [],
            }));
            setDestinations(initializedData);
        } catch (err) {
            console.error("Failed to fetch destinations:", err);
            setError("Failed to load destinations.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDestinations();
    }, []);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setNewItem(prev => ({ ...prev, [name]: value }));
    };

    // --- C: CREATE / Add a new Destination Item ---
    const handleAddItem = async (e) => {
        e.preventDefault();

        // Check for required fields (using FE names)
        const requiredFields = ['url', 'head', 'desc', 'pass', 'place', 'price'];
        const missing = requiredFields.filter(field => !newItem[field] || newItem[field].trim() === "");

        if (missing.length > 0) {
            alert(`Please provide all required fields: ${missing.join(', ')}.`);
            return;
        }

        const galleryUrls = [newItem.sub1, newItem.sub2, newItem.sub3].filter(url => url.trim() !== "");
        
        // Payload uses the FE names (url, head, desc) and the BE controller will map them
        const payload = {
            pass: newItem.pass.trim(),
            url: newItem.url.trim(),
            head: newItem.head.trim(),
            desc: newItem.desc.trim(),
            place: newItem.place.trim(),
            price: newItem.price.trim(), 
            gallery: galleryUrls,
        };

        try {
            const response = await fetch(DESTINATION_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Server Validation Error:", errorData);
                throw new Error(`Failed to create destination: ${response.status} - ${errorData.message || 'Unknown Error'}`);
            }

            // Success, reset form and refresh list
            setNewItem({ head: "", desc: "", place: "", price: "", pass: "", url: "", sub1: "", sub2: "", sub3: "" });
            fetchDestinations(); 

        } catch (err) {
            console.error("Error creating destination:", err);
            alert(`Failed to add new destination: ${err.message}. Check your console and server logs.`);
        }
    };
    
    // --- U & D Helpers (Using FE names for state updates) ---
    const handleChange = (index, field, value) => {
        const updated = [...destinations];
        updated[index][field] = value;
        setDestinations(updated);
    };

    const toggleSave = async (index) => {
        const updated = [...destinations];
        const item = updated[index];
        const isCurrentlySaved = item.isSaved;

        updated[index].isSaved = !isCurrentlySaved;
        setDestinations(updated);

        if (!isCurrentlySaved) {
            if (!item._id) return alert("Cannot save item without an ID.");

            // Construct payload using BE schema names as the PUT route doesn't have the mapper
            // If FE sends old names, the PUT route must also have a mapper!
            // To be safe, let's map back to BE names for the PUT request
            const updatePayload = {
                pass: item.pass.trim(),
                imgURL: item.url.trim(),       // Mapped for PUT
                title: item.head.trim(),       // Mapped for PUT
                description: item.desc.trim(), // Mapped for PUT
                place: item.place.trim(),
                price: item.price.trim(),
                gallery: item.gallery || [], 
            };
            
            try {
                const response = await fetch(`${DESTINATION_ENDPOINT}/${item._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatePayload),
                });

                if (!response.ok) throw new Error(`Failed to update destination: ${response.status}`);
                await fetchDestinations();
                
            } catch (err) {
                console.error("Error updating destination:", err);
                alert("Failed to save changes. Please try again.");
                const reverted = [...destinations];
                reverted[index].isSaved = true;
                setDestinations(reverted);
            }
        }
    };

    const deleteDestination = async (index) => {
        const itemToDelete = destinations[index];
        if (!window.confirm(`Are you sure you want to delete ${itemToDelete.head}?`)) return;

        try {
            const response = await fetch(`${DESTINATION_ENDPOINT}/${itemToDelete._id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error(`Failed to delete destination: ${response.status}`);
            setDestinations(destinations.filter((_, idx) => idx !== index));
        } catch (err) {
            console.error("Error deleting destination:", err);
            alert("Failed to delete destination. See console for details.");
        }
    };

    // ... (Gallery helpers unchanged) ...
    const handleAddGalleryImage = (index) => {
        if (destinations[index].isSaved) { alert("Click 'Edit' first."); return; }
        const newUrl = prompt("Enter the new gallery image URL:");
        if (newUrl) {
            const updated = [...destinations];
            updated[index].gallery.push(newUrl);
            setDestinations(updated);
        }
    };
    
    const handleDeleteGalleryImage = (dIndex, gIndex) => {
        if (destinations[dIndex].isSaved) { alert("Click 'Edit' first."); return; }
        const updated = [...destinations];
        const newGalleryArray = [...updated[dIndex].gallery];
        newGalleryArray.splice(gIndex, 1);
        updated[dIndex].gallery = newGalleryArray;
        setDestinations(updated);
    };

    // --- Render Logic (Inputs use FE names) ---
    if (isLoading) return <div className="p-6 text-center text-xl text-pink-600 mt-20"><FaSpinner className="animate-spin inline mr-2" /> Loading Destinations...</div>;
    if (error) return <div className="p-6 text-center text-xl text-red-600 mt-20">Error: {error}</div>;

    return (
        <div className="p-6">
            <h1 className="text-4xl font-extrabold text-center text-pink-600 mb-8">Destination Manager (FE names to BE schema)</h1>
            <p className="text-center mb-6 text-gray-600">Frontend fields: **head**, **url**, **desc**. Backend fields: **title**, **imgURL**, **description**.</p>

            <form onSubmit={handleAddItem} className="bg-gray-100 p-4 rounded-lg shadow-inner mb-8">
                <h2 className="text-2xl font-bold mb-4 text-pink-500">➕ Add New Destination</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {/* Inputs use FE names: head, url, desc */}
                    <input type="text" name="head" placeholder="* Title (head)" value={newItem.head} onChange={handleFormChange} required className="border rounded px-3 py-2 text-sm" />
                    <input type="text" name="pass" placeholder="* Pass (pass)" value={newItem.pass} onChange={handleFormChange} required className="border rounded px-3 py-2 text-sm" />
                    <input type="text" name="place" placeholder="* Place" value={newItem.place} onChange={handleFormChange} required className="border rounded px-3 py-2 text-sm" />
                    <input type="url" name="url" placeholder="* Main Image URL (url)" value={newItem.url} onChange={handleFormChange} required className="border rounded px-3 py-2 text-sm" />
                    <input type="text" name="price" placeholder="* Price" value={newItem.price} onChange={handleFormChange} required className="border rounded px-3 py-2 text-sm" />
                    
                    <div className="md:col-span-3 grid grid-cols-3 gap-3">
                        <input type="url" name="sub1" placeholder="Gallery URL 1 (Optional)" value={newItem.sub1} onChange={handleFormChange} className="border rounded px-3 py-2 text-sm" />
                        <input type="url" name="sub2" placeholder="Gallery URL 2 (Optional)" value={newItem.sub2} onChange={handleFormChange} className="border rounded px-3 py-2 text-sm" />
                        <input type="url" name="sub3" placeholder="Gallery URL 3 (Optional)" value={newItem.sub3} onChange={handleFormChange} className="border rounded px-3 py-2 text-sm" />
                    </div>
                </div>
                <textarea
                    name="desc" 
                    placeholder="* Description (desc)"
                    value={newItem.desc}
                    onChange={handleFormChange}
                    rows="3"
                    required
                    className="border rounded px-3 py-2 text-sm w-full mb-4 resize-none"
                />
                <div className="flex justify-end">
                    <button type="submit" className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-150">
                        <FaPlus /> Add Destination
                    </button>
                </div>
            </form>

            <hr className="my-8" />

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {destinations.map((item, i) => (
                    <div key={item._id || i} className="border rounded-lg p-3 shadow-lg relative flex flex-col gap-3 bg-white">
                        
                        <button className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full z-10 hover:bg-red-600 transition"
                            onClick={() => deleteDestination(i)}><FaTrash /></button>

                        <img src={item.url} alt={item.head} className="w-full h-40 object-cover rounded border border-gray-200" onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/600x400?text=Image+Error" }}/>

                        {/* Gallery Images and Edit Controls */}
                        <div className="grid grid-cols-4 gap-2 mt-2">
                            {(item.gallery || []).map((img, gIndex) => (
                                <div key={gIndex} className="relative">
                                    <img src={img} alt={`Gallery ${gIndex + 1}`} className="h-20 w-full object-cover rounded border border-gray-200" onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/100x80?text=Error" }}/>
                                    <button className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-red-600 text-white p-1 rounded-full text-xs hover:bg-red-700 transition disabled:opacity-0 disabled:pointer-events-none"
                                        onClick={() => handleDeleteGalleryImage(i, gIndex)} disabled={item.isSaved}>
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                            <button className="w-full h-20 flex items-center justify-center bg-gray-200 rounded text-gray-600 hover:bg-gray-300 transition disabled:opacity-50"
                                onClick={() => handleAddGalleryImage(i)} disabled={item.isSaved}>
                                <FaPlus className="text-sm" /> Add
                            </button>
                        </div>

                        {/* Editable Fields (Using FE names for state updates) */}
                        <label className="text-xs text-gray-500 font-normal mt-1">Title (head)</label>
                        <input type="text" value={item.head} disabled={item.isSaved} onChange={(e) => handleChange(i, "head", e.target.value)} className={`border rounded px-2 py-1 text-sm ${item.isSaved ? "bg-gray-50" : "bg-white"} `} />
                        
                        <label className="text-xs text-gray-500 font-normal">Pass</label>
                        <input type="text" value={item.pass} disabled={item.isSaved} onChange={(e) => handleChange(i, "pass", e.target.value)} className={`border rounded px-2 py-1 text-sm ${item.isSaved ? "bg-gray-50" : "bg-white"} `} />

                        <label className="text-xs text-gray-500 font-normal">Place</label>
                        <input type="text" value={item.place} disabled={item.isSaved} onChange={(e) => handleChange(i, "place", e.target.value)} className={`border rounded px-2 py-1 text-sm ${item.isSaved ? "bg-gray-50" : "bg-white"} `} />

                        <label className="text-xs text-gray-500 font-normal">Price</label>
                        <input type="text" value={item.price} disabled={item.isSaved} onChange={(e) => handleChange(i, "price", e.target.value)} className={`border rounded px-2 py-1 text-sm ${item.isSaved ? "bg-gray-50" : "bg-white"}`} />

                        <label className="text-xs text-gray-500 font-normal">Description (desc)</label>
                        <textarea value={item.desc} disabled={item.isSaved} onChange={(e) => handleChange(i, "desc", e.target.value)} className={`border rounded px-2 py-1 text-sm resize-none ${item.isSaved ? "bg-gray-50" : "bg-white"}`} rows="3" />

                        <button onClick={() => toggleSave(i)} disabled={!item._id} 
                            className={`px-3 py-2 rounded-full text-white font-semibold transition duration-150 flex items-center justify-center gap-2 disabled:opacity-50 ${item.isSaved ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"}`}>
                            {item.isSaved ? (<><FaEdit /> Edit</>) : (<><FaCheck /> Save</>)}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlanDestination;