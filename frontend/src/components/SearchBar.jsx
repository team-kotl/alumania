import React, { useState } from "react";

const SearchBar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState("All");

    const filters = ["All", "Experiences", "Albums", "Events", "Opportunities"];

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const handleFilterClick = (filter) => {
        setSelectedFilter(filter);
        setIsDropdownOpen(false);
    };

    return (
        <div className="relative flex justify-center items-center h-[34px] mt-7 text-[14px] text-white/60 gap-0.5">
            <div
                className="flex items-center bg-[#FFFFFF] rounded-l-lg drop-shadow-md w-3/6 pl-2 
                focus-within:outline-none focus-within:ring-1 focus-within:ring-blue-500"
            >
                {/* SVG Icon */}
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-[#8192a1] ml-2"
                >
                    <path
                        d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
                        stroke="#8192a1"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    ></path>
                </svg>
                {/* Input */}
                <input
                    className="input bg-transparent w-full text-[#4d6c88] focus:outline-none focus:ring-0 focus:border-none"
                    name="text"
                    type="text"
                    placeholder="Search"
                />
            </div>
            <div className="relative">
                <button
                    className="text-[#8192a1] px-7 py-3 bg-[#FFFFFF]
                    rounded-r-lg border-y border-r 
                    border-r-white/10 border-y-white/10 
                    drop-shadow-md
                    hover:bg-[#dddddd]"
                    onClick={toggleDropdown}
                >
                    {selectedFilter}
                </button>
                {/* Dropdown Menu */}
                {isDropdownOpen && (
                    <div
                        className="absolute right-0 mt-1 bg-white shadow-lg 
                rounded-lg w-[150px] text-[#7C7575] z-10"
                    >
                        {filters.map((filter) => (
                            <button
                                key={filter}
                                className="block w-full text-left px-4 py-2 hover:bg-gray-200 hover:text-[#022543] hover:font-bold"
                                onClick={() => handleFilterClick(filter)}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div>
                
            </div>
        </div>
    );
};


export default SearchBar;

{<input
    className="input w-3/6 py-5 bg-[#FFFFFF] 
    text-[#8192a1] rounded-r-lg border-y border-r 
    border-white/10 focus:outline-none 
    drop-shadow-md
    "
    name="text"
    type="text"
    placeholder="Search"
/>}
