import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const AdminWeddingFilter = () => {
  const navigate = useNavigate();
  
      const handleSelect = (e) => {
          const value = e.target.value;
          if (value) {
              navigate(value); // navigate to the selected path
          }
      };
  return (
    <div>
      <div className="mb-20">
                <h1 className="text-4xl font-extrabold text-center text-pink-600 mb-2">
                   Vendore Image Manager
                </h1>
                <p className="text-center mb-10">
                    Here you can add images and text for hero slide, wedding flora, and recent images.
                </p>
                <div className="flex justify-center text-[17px]">
                    <select
                        className="border border-gray-300 font-serif rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 mt-2"
                        defaultValue=""
                        onChange={handleSelect}
                    >
                        <option value="" disabled>
                            Select Section
                        </option>
                        <option value="/admin/wedding/wedhall">Wedding Halls</option>
                        <option value="/admin/wedding/decorationhalls">Wedding Hall Decoration</option>
                       <option value="/admin/wedding/transport">Veichle Transport</option>
                     
                       
                    </select>
                </div>
            </div>
    </div>

  )
}

export default AdminWeddingFilter
