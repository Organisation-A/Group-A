import React, { useState } from "react";
import "./SearchBar.css"; // Import your CSS file
import { FaSearch } from "react-icons/fa";
import { MdClear } from "react-icons/md";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleClearClick = () => {
    setQuery("");
  };

  const handleSearch = (event) => {
    event.preventDefault();
    // Implement your search logic here
    console.log("Searching for:", query);
  };

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search"
          className="search-input"
        />
        <FaSearch className="search-icon" />
        {query && <MdClear className="clear-icon" onClick={handleClearClick} />}
      </form>
    </div>
  );
};

export default SearchBar;
