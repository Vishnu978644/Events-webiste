import React, { useEffect, useState } from "react";
import { FaTrash, FaPlus, FaImage, FaCheck, FaEdit, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminRecentImage = () => {
  const [heroImages, setHeroImages] = useState([]);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const navigate = useNavigate();

  const handleSelect = (e) => {
    if (e.target.value) navigate(e.target.value);
  };

  const handleAddClick = () => setShowUrlInput(true);

  const handleAddImageFromUrl = () => {
    if (!newImageUrl.trim().startsWith("http")) {
      alert("Enter a valid image URL (http/https)");
      return;
    }

    const newImage = {
      img: newImageUrl.trim(),
      heading: "",
      description: "",
      date: "",
      location: "",
      saved: false,
    };

    setHeroImages([...heroImages, newImage]);
    setNewImageUrl("");
    setShowUrlInput(false);
  };

  const handleCancelAdd = () => {
    setNewImageUrl("");
    setShowUrlInput(false);
  };

  const handleDeleteImage = (index) => {
    const item = heroImages[index];

    if (item._id) {
      fetch(`http://localhost:5000/recent/${item._id}`, {
        method: "DELETE",
      }).catch((err) => console.error("Delete Error:", err));
    }

    setHeroImages(heroImages.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    const updated = [...heroImages];
    updated[index][field] = value;
    setHeroImages(updated);
  };

  const handleEdit = (index) => {
    const updated = [...heroImages];
    updated[index].saved = false;
    setHeroImages(updated);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // ✅ FIXED — correct fields sent to backend
  const handleSave = async (index) => {
    const updated = [...heroImages];
    const item = updated[index];

    const cleanItem = {
      url: item.img,
      head: item.heading,       // FIXED
      desc: item.description,   // FIXED
      date: item.date,
      location: item.location,
    };

    try {
      let res;
      if (item._id) {
        res = await fetch(`http://localhost:5000/recent/${item._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cleanItem),
        });
      } else {
        res = await fetch("http://localhost:5000/recent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cleanItem),
        });
      }

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const savedItem = await res.json();

      updated[index] = {
        ...savedItem,
        _id: savedItem._id,
        img: savedItem.url || null,
        heading: savedItem.head || "",      // FIXED
        description: savedItem.desc || "",  // FIXED
        date: savedItem.date || "",
        location: savedItem.location || "",
        saved: true,
      };

      setHeroImages(updated);
    } catch (err) {
      console.error("Error saving image:", err);
      alert("Failed to save image. Check console and backend.");
    }
  };

  // FETCH FIXED
  useEffect(() => {
    fetch("http://localhost:5000/recent")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) =>
        setHeroImages(
          data.map((item) => ({
            _id: item._id,
            img: item.url || null,
            heading: item.head || "",        // FIXED
            description: item.desc || "",    // FIXED
            date: item.date || "",
            location: item.location || "",
            saved: true,
          }))
        )
      )
      .catch((err) => console.error("Error fetching recent images:", err));
  }, []);

  return (
    <div className="mt-5 font-music font-bold text-[20px] relative p-4 md:p-8">
      <div className="mb-20">
        <h1 className="text-4xl font-extrabold text-center text-pink-600 mb-2">
          Category Image Manager
        </h1>
        <p className="text-center mb-10 text-lg text-gray-700">
          Efficiently manage your image gallery.
        </p>

        <div className="flex justify-center text-[17px]">
          <select
            className="border border-gray-300 rounded-lg px-4 py-2 mt-2 shadow-md"
            defaultValue=""
            onChange={handleSelect}
          >
            <option value="" disabled>Select Section</option>
            <option value="/admin/categories/recentimages">Recent Images</option>
            <option value="/admin/categories/corparategallery">Gallery</option>
          </select>
        </div>
      </div>

      <div className="mb-4 flex justify-between items-center relative">
        <h2 className="text-pink-800 underline underline-offset-8 text-2xl font-bold">
          Recent Corporate Images
        </h2>
        <div className="flex items-center gap-4 text-[22px]">
          <FaPlus
            className="text-green-500 cursor-pointer hover:text-green-700 transition"
            onClick={handleAddClick}
          />
          <span className="text-gray-400">|</span>
          <FaTrash
            className="text-red-500 cursor-pointer hover:text-red-700 transition"
            onClick={() => setHeroImages([])}
          />
        </div>
      </div>

      {showUrlInput && (
        <div className="mb-8 p-4 border border-blue-400 bg-blue-50 rounded-lg flex flex-col sm:flex-row gap-3 items-center shadow-lg">
          <input
            type="text"
            placeholder="Paste Image URL (https://...)"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            className="flex-grow border rounded px-3 py-2 text-sm"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddImageFromUrl}
              className="bg-green-600 text-white py-2 px-4 rounded flex items-center gap-1"
            >
              <FaCheck /> Add
            </button>
            <button
              onClick={handleCancelAdd}
              className="bg-red-500 text-white py-2 px-4 rounded flex items-center gap-1"
            >
              <FaTimes /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {heroImages.map((img, index) => (
          <div key={index} className="relative border-2 border-gray-300 rounded-xl p-4 shadow-lg bg-white">
            {img.img ? (
              <img
                src={img.img}
                alt={img.heading || "Recent Image"}
                className="w-full h-48 object-cover rounded-lg mb-3"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/400x192?text=Invalid+URL";
                }}
              />
            ) : (
              <img
                src="https://via.placeholder.com/400x192?text=No+Image"
                className="w-full h-48 object-cover rounded-lg mb-3"
                alt="No Image"
              />
            )}

            <button
              className="absolute top-1 right-1 p-2 bg-red-500 text-white rounded-full"
              onClick={() => handleDeleteImage(index)}
            >
              <FaTrash className="text-sm" />
            </button>

            <div className="flex flex-col gap-2 text-sm mt-2">
              {!img.saved ? (
                <>
                  <input
                    type="text"
                    placeholder="Heading"
                    value={img.heading}
                    onChange={(e) => handleChange(index, "heading", e.target.value)}
                    className="border rounded px-3 py-2 text-base font-semibold"
                  />
                  <textarea
                    placeholder="Description"
                    value={img.description}
                    onChange={(e) => handleChange(index, "description", e.target.value)}
                    className="border rounded px-3 py-2"
                    rows="2"
                  />
                  <input
                    type="date"
                    value={img.date || ""}
                    onChange={(e) => handleChange(index, "date", e.target.value)}
                    className="border rounded px-3 py-2"
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={img.location}
                    onChange={(e) => handleChange(index, "location", e.target.value)}
                    className="border rounded px-3 py-2"
                  />
                </>
              ) : (
                <>
                  <div className="font-extrabold text-base text-gray-900">{img.heading || "No Heading"}</div>
                  <div className="text-gray-700">{img.description || "No Description"}</div>

                  <div className="text-gray-600 flex items-center gap-2">
                    📅 <span className="font-medium">Date:</span> {formatDate(img.date)}
                  </div>

                  <div className="text-gray-600 flex items-center gap-2">
                    📍 <span className="font-medium">Location:</span> {img.location || "N/A"}
                  </div>
                </>
              )}
            </div>

            {!img.saved ? (
              <button
                onClick={() => handleSave(index)}
                className="bg-green-500 text-white py-2 px-4 rounded-lg mt-3 w-full flex items-center justify-center gap-2 font-bold"
              >
                <FaCheck /> Save Changes
              </button>
            ) : (
              <button
                onClick={() => handleEdit(index)}
                className="bg-yellow-500 text-white py-2 px-4 rounded-lg mt-3 w-full flex items-center justify-center gap-2 font-bold"
              >
                <FaEdit /> Edit Details
              </button>
            )}
          </div>
        ))}

        {heroImages.length === 0 && (
          <div className="border-2 border-dashed h-40 flex flex-col justify-center items-center rounded-xl text-gray-500 bg-gray-50 col-span-full">
            <FaImage className="text-4xl mb-2" />
            <span className="text-lg">Use (+) to add images.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRecentImage;
