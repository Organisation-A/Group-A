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
  const [descriptionData, setDescriptionData] = useState(null); // State for displaying search result
  const navigate = useNavigate();
  const hide = document.querySelector(".mapboxgl-ctrl-top-left");

  const searchDescriptions = {
    MSL: {
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXNUEk8yHGxhMEEZgxHAg2RP0ko2BRQlrcVeSoe7GZ1KkVRXwJchwmRCpS6rvID18EsbI&usqp=CAU",
      text: "MSL stands for Mars Science Laboratory, a NASA mission that successfully landed the Curiosity rover on Mars in 2012.",
       // Replace with an actual image URL
    },
    "The Matrix": {
      text: "The Matrix is a 1999 science fiction film directed by the Wachowskis, depicting a dystopian future where humanity is unknowingly trapped inside a simulated reality.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCL7CyPRgbx1mbh8cNN4Cu-2sMMg4ca8YdNw&s", // Replace with an actual image URL
    },
    "Solomon Mahlangu": {
      text: "Solomon Mahlangu was a South African struggle icon, executed in 1979 at the age of 22 for his fight against apartheid.",
      image: "https://example.com/mahlangu-image.jpg", // Replace with an actual image URL
    },
    "Great Hall": {
      text: "The Great Hall is a significant venue at universities, often used for ceremonies and events like graduations and exams.",
      image: "https://example.com/greathall-image.jpg", // Replace with an actual image URL
    },
  };

  const handleInputChange = (event) => {
    setQuery(event.target.value);
    setDescriptionData(null);
  };

  const handleClearClick = () => {
    setQuery("");
    setDescriptionData(null);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    console.log("Searching for:", query);

    // Add the search term to recent searches if it's not already in the list
    if (query && !recentSearches.includes(query)) {
      setDescriptionData(searchDescriptions[query] || "No description available.");
    } else {
      setDescriptionData("No matching results found."); // Show "No matching results" if not found
    }
    
    if (query && !recentSearches.includes(query)) {
      setRecentSearches([query, ...recentSearches]);
    }

    setDescriptionData(searchDescriptions[query] || {
      text: "No description available for this search.",
      image: null,
    });

    setShowDropdown(false); // Close the dropdown after searching
    const hide = document.querySelector(".mapboxgl-ctrl-top-left");
    if (hide) {
      hide.style.display = "block";
    }
  };

  const handleFocus = () => {
    setShowDropdown(true); // Show the dropdown when focused
    const hide = document.querySelector(".mapboxgl-ctrl-top-left");
    if (hide) {
      hide.style.display = "none";
    }
  };

  const handleSearchSelect = (searchTerm) => {
    setQuery(searchTerm);
    setShowDropdown(false); // Hide the dropdown after selecting a search
    const hide = document.querySelector(".mapboxgl-ctrl-top-left");
    if (hide) {
      hide.style.display = "block";
    }
    setDescriptionData(searchDescriptions[searchTerm] || {
      text: "No description available for this search.",
      image: null,
    });
  };

  const handleBlur = () => {
    setShowDropdown(false);
    //setTimeout(() => setShowDropdown(false), 100); // Delay to allow click event
    const hide = document.querySelector(".mapboxgl-ctrl-top-left");
    if (hide) {
      hide.style.display = "block";
    }
  };

  // Filter recent searches based on the query
  const filteredSearches = recentSearches.filter((search) =>
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
        <button type="submit" className="search-icon-button">
          <FaSearch className="search-icon" />
        </button>

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
      {descriptionData && (
        <div className="search-result-card">
          <h3>Search Result for "{query}":</h3>
          {descriptionData.image && (
            <img
              src={descriptionData.image}
              alt={query}
              className="search-description-image"
            />
          )}
          <p className="description1">{descriptionData.text}</p>
        </div>
      )}

    </div>
  );
};

export default SearchBar;
