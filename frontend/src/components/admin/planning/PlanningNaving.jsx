import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaImage } from 'react-icons/fa'

const PlanningNaving = () => {
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
        <div className="p-6">
            <h1 className="text-4xl font-extrabold text-center text-pink-600 mb-2">
                Category Gallery Image Manager
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
                    <option value="/admin/categories/wedgallery">Wedding Gallery</option>
                    <option value="/admin/categories/birthgallery">Birthday Gallery</option>
                    <option value="/admin/categories/corparategallery">Corparate Gallery</option>
                </select>
            </div>
            {/* ----------------------------------------------------------------- */}

            <div className="w-[340px] mt-20 border-2 border-gray-300 border-dotted rounded-lg overflow-hidden">
                {/* Heading at top */}


                {/* Empty Content Area */}
                <div className="h-40 flex flex-col justify-center items-center text-gray-500 border-dotted border-gray-300 ">
                    <FaImage className="text-4xl mb-2" />
                    <p>Use the (+) icon to start adding images</p>
                </div>
            </div>


        </div>
    );
};

export default PlanningNaving;