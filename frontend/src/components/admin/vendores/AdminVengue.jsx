import React, { useRef, useState } from 'react';
import { FaPlus, FaTrash, FaImage } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdminVengue = () => {
  const [images, setImages] = useState([]);
  const inputref = useRef();

  const handleClick = () => inputref.current.click();

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImages(prev => [...prev, file]);
  }

  const handleDelete = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  }
  const navigate = useNavigate();

  const handleSelect = (e) => {
    // Check if the event object is from the dropdown (select element)
    // or from the onClick of the visual boxes (a string path).
    const value = typeof e === 'string' ? e : e.target.value;
    if (value) {
      navigate(value); // navigate to the selected path
    }
  };

  return (
    <div>

      <div className="p-6">
        <h1 className="text-4xl font-extrabold text-center text-pink-600 mb-2">
         Vendore Image Manager
        </h1>
        <p className="text-center mb-6 text-gray-600">
          Select a section below to manage the images and text content.
        </p>

        {/* --- Dropdown Selector (Kept for accessibility/alternative) --- */}
        <div className="flex justify-center mb-10">
          <select
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            defaultValue=""
            onChange={handleSelect}
          >
            <option value="" disabled>
              Select Section
            </option>
            <option value="/admin/vendore/makeupposter">Makeup Vendores</option>
            <option value="/admin/vendore/photocards">Photography Vendore</option>
            <option value="/admin/vendore/Venguecards">Vengue Vendore</option>
          </select>
        </div>
        <div className='flex justify-between'>
          <h1 className='font-bold text-2xl font-music mt-8'>Vengue Image Cards</h1>
          <div className='flex mt-8 text-xl gap-x-3'>
            <p onClick={handleClick} className='cursor-pointer text-green-400 text-2xl'><FaPlus /></p>
          </div>
        </div>

        <input
          type="file"
          ref={inputref}
          className="hidden"
          onChange={handleUpload}
        />

        <div className='border-2 w-[300px] h-[150px] rounded-2xl mt-10 flex pl-10 pt-10 text-xl font-music text-gray-400 items-center'>
          <FaImage className='mr-2' /> + Upload Your Image
        </div>

        <div className='flex flex-wrap gap-4 mt-4'>
          {images.map((img, index) => (
            <div key={index} className="relative w-[320px] h-[180px] border-2 rounded-2xl overflow-hidden shadow-lg">
              <img
                src={URL.createObjectURL(img)}
                alt={img.name}
                className="w-full h-full object-cover"
              />
              <p
                onClick={() => handleDelete(index)}
                className="absolute top-2 right-2 cursor-pointer text-red-500 bg-white rounded-full p-1"
              >
                <FaTrash />
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminVengue;
