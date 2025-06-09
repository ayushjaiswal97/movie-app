import React, { useState, useEffect } from "react";

const SearchBar = ({ onSearch }) => {
  const [input, setInput] = useState("");

  // Debounce input (optional) for better performance
  useEffect(() => {
    const handler = setTimeout(() => {
      if (input.trim() !== "") onSearch(input);
    }, 500);

    return () => clearTimeout(handler);
  }, [input, onSearch]);

  return (
    <input
      type="search"
      placeholder="Search movies..."
      value={input}
      onChange={(e) => setInput(e.target.value)}
      className="w-full p-3 mb-4 rounded border border-gray-300 dark:bg-gray-700 dark:text-white"
    />
  );
};

export default SearchBar;
