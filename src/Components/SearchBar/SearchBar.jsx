import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css";
import { FaSearch } from "react-icons/fa";
import { MdClear } from "react-icons/md";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState([
    "MSL",
    "The Matrix",
    "Solomon Mahlangu",
    "Great Hall",
  ]); // Example recent searches
  const [showDropdown, setShowDropdown] = useState(false); // For controlling the dropdown visibility
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleClearClick = () => {
    setQuery("");
  };

  const handleSearch = (event) => {
    event.preventDefault();
    console.log("Searching for:", query);
    
    // Add the search term to recent searches if it's not already in the list
    if (query && !recentSearches.includes(query)) {
      setRecentSearches([query, ...recentSearches]);
    }

    setShowDropdown(false); // Close the dropdown after searching
  };

  const handleFocus = () => {
    setShowDropdown(true); // Show the dropdown when focused
  };

  const handleSearchSelect = (searchTerm) => {
    setQuery(searchTerm);
    setShowDropdown(false); // Hide the dropdown after selecting a search
  };

  const handleBlur = () => {
    setTimeout(() => setShowDropdown(false), 100); // Delay to allow click event
  };

  // Filter recent searches based on the query
  const filteredSearches = recentSearches.filter(search =>
    search.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="search-bar-container" onBlur={handleBlur}>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder="Search"
          className="search-input"
        />
        <FaSearch className="search-icon" />
        {query && <MdClear className="clear-icon" onClick={handleClearClick} />}
      </form>

      {/* Full-screen overlay to hide page content when dropdown is visible */}
      {showDropdown && (
        <div className="overlay">
          <ul className="recent-searches-dropdown">
            {filteredSearches.map((search, index) => (
              <li
                key={index}
                className="recent-search-item"
                onClick={() => handleSearchSelect(search)}
              >
                {search}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;

