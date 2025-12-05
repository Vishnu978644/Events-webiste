import React, { useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef(null);

  // Dummy section headings (variety sections)
  const sections = [
    "Brides Vendors",
    "Grooms Vendors",
    "Makeup Vendors",
    "Photography Vendors",
    "Sound & Music",
    "Choreography",
    "Wedding Halls",
  ];

  // Filter headings based on search
  const filteredSections = sections.filter((section) =>
    section.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Focus input or perform search
  const handleIconClick = () => {
    inputRef.current.focus();
  };

  return (
    <div className="flex flex-col items-center mt-36 w-full">
      {/* Search bar */}
      <div className="relative w-[800px] mb-16">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full py-7 pl-10 rounded-full bg-pink-100 text-gray-700 
                     placeholder-gray-500 outline-none border-2 border-pink-200 
                     focus:border-pink-400 transition duration-300 shadow-md text-3xl"
        />

        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 
                     bg-pink-400 hover:bg-pink-500 text-white 
                     p-3 rounded-full shadow transition duration-300 text-3xl"
          onClick={handleIconClick}
        >
          <FaSearch />
        </button>
      </div>

      {/* Results — show matching section headings */}
      <div className="flex flex-col items-center gap-8">
        {searchTerm ? (
          filteredSections.length > 0 ? (
            filteredSections.map((section, index) => (
              <h2
                key={index}
                className="text-5xl font-bold text-rose-600 font-music hover:text-rose-400 transition"
              >
                {section}
              </h2>
            ))
          ) : (
            <p className="text-gray-500 text-2xl">
              No matches found for “{searchTerm}”
            </p>
          )
        ) : (
          <p className="text-gray-400 text-2xl">
            Type to search for vendor categories
          </p>
        )}
      </div>
    </div>
  );
};

export default Search;
