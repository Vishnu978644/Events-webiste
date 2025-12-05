import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaTrash, FaImage, FaCheck, FaEdit } from 'react-icons/fa';

// NOTE: Ensure this matches the route you set up in app.js
const API_URL = 'http://localhost:5000/bridejewel';

const BrideJewelAdmin = () => {
  // State for the list of jewels, including server-synced data
  const [images, setImages] = useState([]);
  // State for the new image URL input field
  const [imageUrl, setImageUrl] = useState('');
  // State to handle initial fetch loading or global actions
  const [loading, setLoading] = useState(false);
  // State to display fetch errors
  const [error, setError] = useState(null);

  // --- Fetch Logic (Read) ---
  useEffect(() => {
    fetchJewels();
  }, []);

  const fetchJewels = async () => {
    setLoading(true); // Start global loading
    setError(null);
    try {
      const res = await axios.get(API_URL);
      // Map server data: add 'saved: true' and 'isSaving: false' flags
      const data = res.data.map(item => ({ ...item, saved: true, isSaving: false }));
      setImages(data);
    } catch (error) {
      console.error("Error fetching jewels:", error);
      setError("Failed to load jewels. Please check the API server connection.");
    } finally {
      setLoading(false); // End global loading
    }
  };

  // --- Add URL Logic (Create - Local) ---
  const handleAddUrl = () => {
    if (!imageUrl.trim()) return alert("Please enter a valid image URL.");
    
    // Simple URL validation (optional, but good practice)
    try {
        new URL(imageUrl.trim());
    } catch (_) {
        return alert("The URL format is invalid. Ensure it starts with http:// or https://");
    }

    setImages(prev => [
      // New item is marked as unsaved
      { url: imageUrl.trim(), title: '', description: '', price: '', saved: false, isSaving: false },
      ...prev,
    ]);
    setImageUrl('');
  };

  // --- Delete Logic (Delete) ---
  const handleDelete = async (index) => {
    const imgObj = images[index];

    // **Optimistic UI Update:** Delete from local state immediately
    const originalImages = images;
    setImages(prev => prev.filter((_, i) => i !== index));

    // Only attempt server delete if the item has an ID (i.e., it was saved)
    if (imgObj._id) {
      try {
        await axios.delete(`${API_URL}/${imgObj._id}`);
      } catch (error) {
        console.error("Error deleting jewel:", error);
        alert("Failed to delete item on server. Restoring jewel locally.");
        setImages(originalImages); // Revert state on server failure
      }
    }
  };

  // --- Change Logic (Update - Local) ---
  const handleChange = (index, field, value) => {
    setImages(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  // --- Save Logic (Create/Update - Server) ---
  const handleSave = async (index) => {
    const imgObj = images[index];

    // Basic Validation
    if (!imgObj.title || !imgObj.description || !imgObj.price) {
      return alert("All fields (Title, Description, Price) are required before saving!");
    }

    // Prevent double-clicking/saving
    if (imgObj.isSaving) return;

    // Set 'isSaving' flag to disable buttons and show status
    setImages(prev => {
      const updated = [...prev];
      updated[index].isSaving = true;
      return updated;
    });

    try {
      let savedObj;
      // Data payload matches your schema fields
      const jewelData = { url: imgObj.url, title: imgObj.title, description: imgObj.description, price: imgObj.price };

      if (imgObj._id) {
        // Update existing item (PUT)
        const res = await axios.put(`${API_URL}/${imgObj._id}`, jewelData);
        savedObj = res.data;
      } else {
        // Create new item (POST)
        const res = await axios.post(API_URL, jewelData);
        savedObj = res.data;
      }

      // Update state with the server response (contains _id)
      setImages(prev => {
        const updated = [...prev];
        updated[index] = { ...savedObj, saved: true, isSaving: false }; // Mark as saved, turn off saving flag
        return updated;
      });

    } catch (error) {
      console.error("Error saving jewel:", error);
      // Improved error message to check server response data
      const errorMessage = error.response?.data?.message || error.message || "Unknown error.";
      alert(`Failed to save jewel: ${errorMessage}`);
      
      // Turn off saving flag on failure and keep the item editable
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
      updated[index].saved = false; // Allow editing again
      return updated;
    });
  };

  return (
    <div className="p-4"> 
      <h1 className='font-bold text-2xl font-music mt-4'>Brides Jewels Counts ({images.length})</h1>

      {/* Global Status Indicators */}
      {loading && <p className="text-blue-500 font-semibold mt-2">Loading jewels...</p>}
      {error && <p className="text-red-500 font-semibold mt-2">Error: {error}</p>}

      <hr className="my-4" />

      {/* 🖼️ Image URL Input Form */}
      <div className='flex items-center gap-2 mt-4 p-4 border-2 rounded-2xl max-w-lg shadow-md'>
        <FaImage className='text-2xl text-gray-500' />
        <input
          type="url" // Input type 'url' gives better mobile experience
          placeholder="Paste Image URL here (e.g., https://example.com/jewel.jpg)"
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

      <hr className="my-4" />

      {/* Uploaded jewels list */}
      <div className='flex flex-wrap gap-4 mt-4'>
        {images.map((imgObj, index) => (
          <div key={imgObj._id || index} className="relative w-[320px] border-2 rounded-2xl overflow-hidden shadow-lg p-2">
            
            {/* Image Preview and Delete Button */}
            <div className="relative w-full h-[180px] bg-gray-100 flex items-center justify-center">
              <img
                src={imgObj.url}
                alt={`Jewel ${index + 1} - ${imgObj.title || 'No Title'}`}
                className="w-full h-full object-cover rounded"
                // Fallback image if URL is broken
                onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/320x180?text=Invalid+Image+URL" }}
              />
              <button 
                onClick={() => handleDelete(index)} 
                className="absolute top-2 right-2 cursor-pointer text-red-500 bg-white rounded-full p-1 shadow-md hover:scale-110 transition"
                disabled={imgObj.isSaving}
              >
                <FaTrash />
              </button>
            </div>

            {/* Input Fields */}
            <div className='flex flex-col mt-2 gap-2'>
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
                type="text" placeholder="Price" value={imgObj.price} 
                disabled={imgObj.saved || imgObj.isSaving} 
                onChange={(e) => handleChange(index, 'price', e.target.value)} 
                className="border px-2 py-1 rounded disabled:bg-gray-50 disabled:text-gray-500" 
              />

              {/* Save / Edit Button */}
              {!imgObj.saved || imgObj.isSaving ? (
                <button 
                  onClick={() => handleSave(index)} 
                  disabled={!imgObj.title || !imgObj.description || !imgObj.price || imgObj.isSaving} 
                  className="bg-green-500 text-white mt-2 py-1 px-3 rounded flex items-center justify-center gap-2 hover:bg-green-600 transition disabled:bg-gray-400"
                >
                  {imgObj.isSaving ? (
                    <>Saving...</>
                  ) : (
                    <><FaCheck /> Save</>
                  )}
                </button>
              ) : (
                <button 
                  onClick={() => handleEdit(index)} 
                  className="bg-yellow-500 text-white mt-2 py-1 px-3 rounded flex items-center justify-center gap-2 hover:bg-yellow-600 transition disabled:bg-gray-400"
                  disabled={imgObj.isSaving}
                >
                  <FaEdit /> Edit
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrideJewelAdmin;