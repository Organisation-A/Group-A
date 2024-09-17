import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css";
import { FaSearch } from "react-icons/fa";
import { MdClear } from "react-icons/md";

const SearchBar = () => {
  const [query, setQuery] = useState("");
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
  };

  const handleFocus = () => {
    navigate("/list"); // Navigate to the list page when search is focused
  };

  return (
    <div className="search-bar-container">
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
    </div>
  );
};

export default SearchBar;
