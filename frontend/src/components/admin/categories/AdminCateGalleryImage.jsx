import React, { useState, useRef } from "react";
import { FaTrash, FaPlus, FaImage } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminCateGalleryImage = () => {
  const [galleries, setGalleries] = useState([]);
  const mainInput = useRef(null);
  const extraInput = useRef(null);
  const [activeExtraIndex, setActiveExtraIndex] = useState(null);
  const [extraSlot, setExtraSlot] = useState(null);

  const navigate = useNavigate();

  // Add main thumbnail
  const handleAddMain = () => mainInput.current.click();

  const handleMainSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setGalleries([...galleries, { main: url, extras: ["", "", "", ""] }]);
    e.target.value = null;
  };

  // Add extra image
  const handleAddExtra = (gIndex, slot) => {
    setActiveExtraIndex(gIndex);
    setExtraSlot(slot);
    extraInput.current.click();
  };

  const handleExtraSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const updated = [...galleries];
    updated[activeExtraIndex].extras[extraSlot] = url;
    setGalleries(updated);
    e.target.value = null;
    setActiveExtraIndex(null);
    setExtraSlot(null);
  };

  // Delete gallery or extra image
  const deleteGallery = (i) => setGalleries(galleries.filter((_, index) => index !== i));
  const deleteExtraImage = (gIndex, slot) => {
    const updated = [...galleries];
    updated[gIndex].extras[slot] = "";
    setGalleries(updated);
  };

  // Navigation
  const handleSelect = (e) => {
    const value = typeof e === "string" ? e : e.target.value;
    if (value) navigate(value);
  };

  return (
    <div className="p-6 font-music font-bold text-[20px]">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-pink-600 mb-2">
          Category Gallery Image Manager
        </h1>
        <p className="text-gray-600 mb-6">
          Manage your thumbnail and extra images.
        </p>

        <select
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 text-[17px]"
          defaultValue=""
          onChange={handleSelect}
        >
          <option value="" disabled>Select Section</option>
          <option value="/admin/categories/recentimages">Recent Images</option>
          <option value="/admin/categories/corparategallery">Gallery</option>
        </select>
      </div>

      {/* Add main image button */}
      <div className="flex items-center gap-4 text-[22px] mb-3 absolute right-10">
        <FaPlus className="text-green-500 cursor-pointer" onClick={handleAddMain} />
      </div>

      {/* Hidden file inputs */}
      <input type="file" ref={mainInput} className="hidden" onChange={handleMainSelect} />
      <input type="file" ref={extraInput} className="hidden" onChange={handleExtraSelect} />

      {/* Gallery Grid */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleries.map((g, i) => (
          <div key={i} className="border rounded-lg p-3 shadow relative">
            <button
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
              onClick={() => deleteGallery(i)}
            >
              <FaTrash />
            </button>

            <img src={g.main} className="w-full h-40 object-cover rounded" />

            <div className="mt-4">
              <p className="font-semibold text-[18px] mb-2">Extra Images (4)</p>
              <div className="grid grid-cols-4 gap-2">
                {g.extras.map((img, slot) => (
                  <div key={slot} className="relative border rounded p-1">
                    {img ? (
                      <>
                        <img src={img} className="h-16 w-full object-cover rounded" />
                        <button
                          className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full"
                          onClick={() => deleteExtraImage(i, slot)}
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </>
                    ) : (
                      <button
                        className="w-full h-16 flex items-center justify-center bg-gray-200 rounded text-gray-600"
                        onClick={() => handleAddExtra(i, slot)}
                      >
                        + Add
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {galleries.length === 0 && (
          <div className="w-full h-40 border-2 border-dashed border-gray-400 rounded-lg flex flex-col justify-center items-center text-gray-500">
            <FaImage className="text-4xl mb-2" />
            Use + to add a Thumbnail
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCateGalleryImage;
