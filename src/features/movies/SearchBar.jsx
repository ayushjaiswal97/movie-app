import { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex justify-center mb-6">
      <input
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full max-w-md p-2 border rounded-l-md outline-none"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 rounded-r-md">
        Search
      </button>
    </form>
  );
};

export default SearchBar;


