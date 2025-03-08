// Author: @PEEACHYBEE Freskkie Encarnacion
//         @yukiroow Harry Dominguez
import { useState } from "react";
import {
    PiMagnifyingGlass,
    PiSortAscending,
    PiSortDescending,
} from "react-icons/pi";
/**
 * SearchBar component provides a UI for searching, filtering, and sorting content.
 * It includes a search input field, a dropdown to select a filter (Users, Experiences, Jobs, Events),
 * and a dropdown to toggle the sorting order (ascending/descending).
 */
const SearchBar = ({ setSearchQuery, setFilter, setSortOrder, setResults }) => {
    const [selectedFilter, setSelectedFilter] = useState("Users");
    const [descending, setDescending] = useState(true);

    const handleFilterClick = (filter) => {
        const menu = document.activeElement;
        if (menu) {
            menu.blur();
        }
        setFilter(filter.toLowerCase());
        setSelectedFilter(filter);
        setResults([]);
    };

    const handleSortClick = () => {
        const menu = document.activeElement;
        if (menu) {
            menu.blur();
        }
        const newSortOrder = descending ? "ASC" : "DESC";
        setDescending((prev) => !prev);
        setSortOrder(newSortOrder);
    };

    return (
        <>
            <div className="relative flex justify-center items-center h-8 mt-7 text-base">
                <div className="flex items-center bg-[#FFFFFF] rounded-l-lg w-3/6 pl-2 focus-within:outline-none focus-within:ring-1 focus-within:ring-blue-500 border border-gray-200">
                    <PiMagnifyingGlass className="w-5 h-5 text-[#8192a1] ml-2" />
                    <input
                        className="input bg-transparent w-full text-[#4d6c88] focus:outline-none focus:ring-0 border-none"
                        name="query"
                        type="text"
                        placeholder="Search"
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="dropdown dropdown-bottom">
                    <div
                        tabIndex={0}
                        role="button"
                        className="text-primary px-7 py-2 bg-white
                    rounded-r-md border border-l-0
                    border-gray-200
                    hover:bg-[#dddddd] cursor-pointer"
                    >
                        <span className="text-sm">{selectedFilter}</span>
                    </div>
                    <ul
                        tabIndex={0}
                        className="dropdown-content mt-2 menu bg-white text-primary rounded-box z-[1] w-32 shadow"
                    >
                        <li
                            onClick={() => handleFilterClick("Users")}
                            className="w-full"
                        >
                            <a>Users</a>
                        </li>
                        <li
                            onClick={() => handleFilterClick("Experiences")}
                            className="w-full"
                        >
                            <a>Experiences</a>
                        </li>
                        <li
                            onClick={() => handleFilterClick("Opportunities")}
                            className="w-full"
                        >
                            <a>Jobs</a>
                        </li>
                        <li
                            onClick={() => handleFilterClick("Events")}
                            className="w-full"
                        >
                            <a>Events</a>
                        </li>
                    </ul>
                </div>
                <div className="dropdown dropdown-bottom">
                    <div tabIndex={0} role="button" className="text-primary">
                        {descending ? (
                            <PiSortDescending className="cursor-pointer w-8 h-8 text-gray-500 hover:text-gray-700 ml-5" />
                        ) : (
                            <PiSortAscending className="cursor-pointer w-8 h-8 text-gray-500 hover:text-gray-700 ml-5" />
                        )}
                    </div>
                    <ul
                        tabIndex={0}
                        className="dropdown-content mt-2 menu bg-white text-primary rounded-box z-[1] w-40 p-2 shadow"
                    >
                        <li className="text-center font-semibold mb-2 text-gray-400">
                            Sort by{" "}
                            {selectedFilter === "Users"
                                ? "username"
                                : "publish date"}
                        </li>
                        <li onClick={() => handleSortClick("asc")}>
                            <a>Ascending</a>
                        </li>
                        <li onClick={() => handleSortClick("desc")}>
                            <a>Descending</a>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default SearchBar;
