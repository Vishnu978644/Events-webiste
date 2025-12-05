// AdminBirthGallery.jsx (The complete, corrected component)
import React, { useState, useEffect } from "react";
import { FaTrash, FaPlus, FaCheck, FaEdit, FaTimes, FaImage } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// This MUST match the path in app.js
const API_URL = 'http://localhost:5000/bgallery'; 

const AdminBirthGallery = () => {
  // State includes _id (for DB tracking), main URL, video URL, and saved status
  const [galleries, setGalleries] = useState([]);
  const [newMainUrl, setNewMainUrl] = useState(""); 
  const navigate = useNavigate();

  // --- API Handlers ---

  // FETCH DATA on load (GET)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();
        
        const mappedData = data.map(g => ({
          _id: g._id,
          main: g.img,
          video: g.video || "",
          saved: true, 
        }));
        setGalleries(mappedData);
      } catch (err) {
        console.error("Fetch error:", err.message);
      }
    };
    fetchData();
  }, []);


  // SAVE / UPDATE (POST or PUT)
  const handleSave = async (i) => {
    const galleryToSave = galleries[i];
    const { _id, main, video } = galleryToSave;
    
    // ✅ FIX 1: PAYLOAD MISMATCH - Mapping frontend 'main' to backend 'img'
    const payload = { img: main, video: video }; 
    
    const method = _id ? "PUT" : "POST";
    // The URL construction is correct
    const url = _id ? `${API_URL}/${_id}` : API_URL; 

    console.log(`Attempting to ${method} request to URL: ${url}`); 

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let errorData;
        try {
            errorData = await res.json();
        } catch (e) {
            // This catches the 404 non-JSON page
            throw new Error(`Server returned non-JSON error page. Status: ${res.status}`);
        }
        throw new Error(errorData.message || `HTTP error! Status: ${res.status}`);
      }

      const savedData = await res.json();

      // ✅ FIX 2: MAPPING RESPONSE - Mapping backend 'img' back to frontend 'main'
      const updatedGallery = {
        _id: savedData._id,
        main: savedData.img,
        video: savedData.video || "",
        saved: true,
      };

      setGalleries(prevGalleries => {
        const newGalleries = [...prevGalleries];
        const index = _id ? newGalleries.findIndex(g => g._id === _id) : i;

        if (index !== -1) {
             newGalleries[index] = updatedGallery;
        }
        return newGalleries;
      });

      alert(`Gallery item successfully ${method === 'POST' ? 'created' : 'updated'}!`);

    } catch (err) {
      console.error("Save error:", err.message);
      alert(`Failed to save gallery: ${err.message}`);
    }
  };


  // DELETE (DELETE)
  const deleteGallery = async (i) => {
    const galleryToDelete = galleries[i];
    const id = galleryToDelete._id;

    if (!window.confirm("Are you sure you want to delete this gallery set?")) return;

    if (!id) {
      setGalleries(galleries.filter((_, index) => index !== i));
      return;
    }

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

      if (!res.ok) throw new Error(`Failed to delete. Status: ${res.status}`);

      setGalleries(galleries.filter((_, index) => index !== i));
      alert("Gallery deleted successfully.");
    } catch (err) {
      console.error("Delete error:", err.message);
      alert(`Failed to delete gallery. Error: ${err.message}`);
    }
  };


  // --- Local Handlers & Render ---
  const handleSelect = (e) => {
    if (e.target.value) navigate(e.target.value);
  };

  const handleCreateGallery = () => {
    if (newMainUrl.trim()) {
      setGalleries([
        ...galleries,
        { _id: null, main: newMainUrl.trim(), video: "", saved: false }, 
      ]);
      setNewMainUrl("");
    }
  };

  const handleVideoUrlChange = (i, value) => {
    const updated = [...galleries];
    updated[i].video = value;
    updated[i].saved = false; 
    setGalleries(updated);
  };

  const deleteVideo = (i) => {
    const updated = [...galleries];
    updated[i].video = "";
    updated[i].saved = false; 
    setGalleries(updated);
  };

  const handleEdit = (i) => {
    const updated = [...galleries];
    updated[i].saved = false;
    setGalleries(updated);
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50 text-gray-800">

      {/* Header and Navigation */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-pink-600 mb-2">
          🎂 Birthday Gallery Manager (URL Mode)
        </h1>
        <p className="text-gray-600 mb-6">
          Manage birthday gallery sets by pasting image and video URLs.
        </p>
        <div className="flex justify-center text-[17px]">
          <select
            className="border border-gray-300 rounded-lg px-4 py-2"
            defaultValue=""
            onChange={handleSelect}
          >
            <option value="" disabled>Select Section</option>
            <option value="/admin/categories/birthgallery">Gallery</option>
             <option value="/admin/categories/clientsay">Client Say</option>
          </select>
        </div>
      </div>
      
      <hr className="my-8" />

      {/* CREATE NEW GALLERY FORM */}
      <div className="flex flex-col md:flex-row gap-4 mb-10 p-4 bg-white shadow rounded-xl border">
          <span className="text-gray-700 font-semibold min-w-[150px] flex items-center">
              New Main Image URL:
          </span>
          <input
              type="text"
              value={newMainUrl}
              onChange={(e) => setNewMainUrl(e.target.value)}
              placeholder="Paste main image URL here..."
              className="flex-grow border p-3 rounded-lg"
          />
          <button
              onClick={handleCreateGallery}
              disabled={!newMainUrl.trim()}
              className={`p-3 text-white rounded-lg flex items-center gap-2 min-w-[180px] justify-center ${
                  !newMainUrl.trim()
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600"
              }`}
          >
              <FaPlus /> Create Gallery Set
          </button>
      </div>

      {/* GALLERY GRID */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleries.map((g, i) => (
          <div key={g._id || `temp-${i}`} className="border rounded-lg p-3 shadow-lg bg-white relative">

            <div className="flex justify-end gap-2 mb-3">
                {/* SAVE / EDIT BUTTON */}
                {!g.saved ? (
                  <button
                    onClick={() => handleSave(i)}
                    className="bg-green-500 text-white py-1 px-3 rounded flex items-center gap-2 text-sm hover:bg-green-600 transition disabled:opacity-50"
                    disabled={!g.main.trim()}
                  >
                    <FaCheck /> {g._id ? "Update" : "Save"}
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(i)}
                    className="bg-yellow-500 text-white py-1 px-3 rounded flex items-center gap-2 text-sm hover:bg-yellow-600 transition"
                  >
                    <FaEdit /> Edit
                  </button>
                )}
                {/* DELETE GALLERY */}
                <button
                  className="bg-red-500 text-white p-2 rounded-full h-8 w-8 flex items-center justify-center"
                  onClick={() => deleteGallery(i)}
                  title="Delete Gallery Set"
                >
                  <FaTrash className="text-sm" />
                </button>
            </div>

            {/* MAIN IMAGE INPUT & PREVIEW */}
            <h3 className="font-semibold text-lg mb-2">Main Image:</h3>
            <input
                type="text"
                value={g.main}
                onChange={(e) => {
                    const updated = [...galleries];
                    updated[i].main = e.target.value;
                    updated[i].saved = false; 
                    setGalleries(updated);
                }}
                placeholder="Paste Main Image URL"
                disabled={g.saved}
                className={`w-full border p-2 rounded-lg text-sm mb-3 ${g.saved ? 'bg-gray-100' : 'bg-white'}`}
            />
            <img 
                src={g.main} 
                alt="Main Preview" 
                className="w-full h-40 object-cover rounded mb-3 bg-gray-200" 
                onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                onLoad={(e) => { e.target.style.display = 'block'; }}
            />
            
            <hr className="my-3" />

            {/* VIDEO SECTION */}
            <h3 className="font-semibold text-lg mb-2 flex justify-between items-center">
                Video URL:
                {g.video && !g.saved && (
                    <button
                        onClick={() => deleteVideo(i)}
                        className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1"
                    >
                        <FaTimes /> Clear
                    </button>
                )}
            </h3>
            
            <input
                type="text"
                value={g.video}
                onChange={(e) => handleVideoUrlChange(i, e.target.value)}
                placeholder="Paste Video URL (optional)"
                disabled={g.saved}
                className={`w-full border p-2 rounded-lg text-sm mb-3 ${g.saved ? 'bg-gray-100' : 'bg-white'}`}
            />
            
            {g.video && (
                <video 
                    src={g.video} 
                    className="w-full h-40 rounded mb-2 bg-gray-200" 
                    controls 
                    onError={(e) => console.error("Video load error:", e)}
                />
            )}
            {!g.video && g.saved && (
                 <div className="w-full h-10 flex items-center justify-center text-gray-500 bg-gray-100 rounded text-sm">No video attached.</div>
            )}
            
          </div>
        ))}

        {/* Empty placeholder */}
        {galleries.length === 0 && (
          <div className="lg:col-span-3 w-full h-40 border-2 border-dashed border-pink-400 rounded-lg flex flex-col justify-center items-center text-gray-500 bg-pink-50">
            <FaImage className="text-4xl mb-2" />
            Use the input field above to add your first gallery set URL.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBirthGallery;