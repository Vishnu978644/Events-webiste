import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaTrash, FaImage, FaCheck, FaEdit } from 'react-icons/fa';

// NOTE: Replace this with your actual backend URL when deploying.
const API_URL = 'http://localhost:5000/groomdress';

const GroomDressAdmin = () => {
  // State for the list of dresses, including server-synced data
  const [images, setImages] = useState([]);
  // State for the new image URL input field
  const [imageUrl, setImageUrl] = useState('');
  // State to handle initial fetch loading or global actions
  const [loading, setLoading] = useState(false);
  // State to display fetch errors
  const [error, setError] = useState(null);

  // --- Fetch Logic (Read) ---
  useEffect(() => {
    fetchDresses();
  }, []);

  const fetchDresses = async () => {
    setLoading(true); // Start global loading
    setError(null);
    try {
      const res = await axios.get(API_URL);
      // Map server data: add 'saved: true' and 'isSaving: false' flags
      const data = res.data.map(item => ({ ...item, saved: true, isSaving: false }));
      setImages(data);
    } catch (error) {
      console.error("Error fetching dresses:", error);
      setError("Failed to load dresses. Please check the API server connection.");
    } finally {
      setLoading(false); // End global loading
    }
  };

  // --- Add URL Logic (Create - Local) ---
  const handleAddUrl = () => {
    if (!imageUrl.trim()) return alert("Please enter a valid image URL.");
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
        console.error("Error deleting dress:", error);
        alert("Failed to delete item on server. Restoring dress locally.");
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
      const dressData = { url: imgObj.url, title: imgObj.title, description: imgObj.description, price: imgObj.price };

      if (imgObj._id) {
        // Update existing item (PUT)
        const res = await axios.put(`${API_URL}/${imgObj._id}`, dressData);
        savedObj = res.data;
      } else {
        // Create new item (POST)
        const res = await axios.post(API_URL, dressData);
        savedObj = res.data;
      }

      // Update state with the server response (contains _id)
      setImages(prev => {
        const updated = [...prev];
        updated[index] = { ...savedObj, saved: true, isSaving: false }; // Mark as saved, turn off saving flag
        return updated;
      });

    } catch (error) {
      console.error("Error saving dress:", error);
      alert(`Failed to save dress: ${error.message}`);
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
      <h1 className='font-bold text-2xl font-music mt-4'>Brides Dress Counts ({images.length})</h1>

      {/* Global Status Indicators */}
      {loading && <p className="text-blue-500 font-semibold mt-2">Loading dresses...</p>}
      {error && <p className="text-red-500 font-semibold mt-2">Error: {error}</p>}

      <hr className="my-4" />

      {/* 🖼️ Image URL Input Form Model */}
      <div className='flex items-center gap-2 mt-4 p-4 border-2 rounded-2xl max-w-lg shadow-md'>
        <FaImage className='text-2xl text-gray-500' />
        <input
          type="url"
          placeholder="Paste Image URL here (e.g., https://example.com/dress.jpg)"
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

      {/* Uploaded images with fields */}
      <div className='flex flex-wrap gap-4 mt-4'>
        {images.map((imgObj, index) => (
          <div key={imgObj._id || index} className="relative w-[320px] border-2 rounded-2xl overflow-hidden shadow-lg p-2">
            
            {/* Image Preview */}
            <div className="relative w-full h-[180px] bg-gray-100 flex items-center justify-center">
              <img
                src={imgObj.url}
                alt={`Dress ${index + 1} - ${imgObj.title || 'No Title'}`}
                className="w-full h-full object-cover rounded"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/320x180?text=Invalid+Image+URL" }}
              />
              <p onClick={() => handleDelete(index)} className="absolute top-2 right-2 cursor-pointer text-red-500 bg-white rounded-full p-1 shadow-md hover:scale-110 transition">
                <FaTrash />
              </p>
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

export default GroomDressAdmin;
