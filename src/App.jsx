import React, { useState, useEffect, useCallback } from "react";
import ReactPlayer from "react-player";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { ClipLoader } from "react-spinners";
import MovieList from "./features/movies/MovieList";
import SearchBar from "./features/movies/SearchBar";

function App() {
  // Existing state
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("avengers");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [watchlist, setWatchlist] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // New trailer related state
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  // Fetch movies function here (same as before)...
  // 🧠 Jab bhi query ya page change hoga, TMDB se movies fetch karo
useEffect(() => {
  const fetchMovies = async () => {
    // ✂️ Agar query blank hai toh movies clear karo
    if (!query.trim()) {
      setMovies([]);         // saaf karo list
      setHasMore(false);     // aur infinite scroll rok do
      return;
    }

    setIsLoading(true); // 🔄 Spinner dikhana shuru karo

    try {
      const res = await axios.get("https://api.themoviedb.org/3/search/movie", {
        params: {
          api_key: API_KEY,  // 🔐 API key TMDB ke liye
          query,             // 🔍 Search string
          page,              // 📄 Current page (pagination ke liye)
        },
      });

      const newMovies = res.data.results; // 🧾 Movie data nikaalo

      // ✅ Page 1 hai toh list reset karo, warna add karo
      setMovies((prev) => (page === 1 ? newMovies : [...prev, ...newMovies]));

      // 📈 Agar aur pages baaki hai toh hasMore true rakho
      setHasMore(page < res.data.total_pages);
    } catch (err) {
      console.error("❌ Error fetching movies:", err);
    }

    setIsLoading(false); // ❌ Spinner hatao
  };

  fetchMovies(); // 📞 Function call

}, [query, page, API_KEY]); // 🔁 Dependencies: query ya page change hote hi run


  // New function to fetch trailer key from TMDB
  const fetchTrailer = async (movie) => {
    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/movie/${movie.id}/videos`,
        { params: { api_key: API_KEY } }
      );
      const videos = res.data.results;
      // Find official trailer from videos (YouTube)
      const trailer = videos.find(
        (vid) =>
          vid.site === "YouTube" &&
          (vid.type === "Trailer" || vid.type === "Teaser")
      );
      if (trailer) {
        setTrailerUrl(`https://www.youtube.com/watch?v=${trailer.key}`);
        setShowTrailer(true);
      } else {
        alert("Trailer not available");
      }
    } catch (error) {
      console.error("Failed to fetch trailer:", error);
    }
  };

  // Close trailer modal
  const closeTrailer = () => {
    setShowTrailer(false);
    setTrailerUrl(null);
  };

  // Existing handlers: handleSearch, addToWatchlist, removeFromWatchlist...

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="p-4 min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white transition-colors">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">🎬 Streamify</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-gray-800 text-white px-3 py-1 rounded dark:bg-white dark:text-black"
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        {/* Search Bar */}
        <SearchBar onSearch={setQuery} />

        {/* Loading Spinner */}
        {isLoading && page === 1 && (
          <div className="flex justify-center my-6">
            <ClipLoader size={40} color="#e50914" />
          </div>
        )}

        {/* Movie List with Infinite Scroll */}
        {!isLoading && (
          <InfiniteScroll
            dataLength={movies.length}
            next={() => setPage((prev) => prev + 1)}
            hasMore={hasMore}
            loader={<h4 className="text-center mt-4">Loading more movies...</h4>}
          >
            <MovieList
              movies={movies}
              onAddToWatchlist={(movie) =>
                setWatchlist((prev) =>
                  prev.find((m) => m.id === movie.id) ? prev : [...prev, movie]
                )
              }
              watchlist={watchlist}
              onPlayTrailer={fetchTrailer}  // <-- Trailer button function pass kar rahe hain
            />
          </InfiniteScroll>
        )}

        {/* Watchlist */}
        {watchlist.length > 0 && (
          <>
            <h2 className="text-2xl font-semibold mt-8 mb-4">🎯 Your Watchlist</h2>
            <MovieList
              movies={watchlist}
              onRemoveFromWatchlist={(id) =>
                setWatchlist((prev) => prev.filter((m) => m.id !== id))
              }
              onPlayTrailer={fetchTrailer}
            />
          </>
        )}

        {/* Trailer Modal */}
        {showTrailer && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
            onClick={closeTrailer}
          >
            <div
              className="bg-black p-2 rounded max-w-3xl w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeTrailer}
                className="absolute top-2 right-2 text-white text-xl font-bold"
              >
                ×
              </button>
              <ReactPlayer
                url={trailerUrl}
                controls
                width="100%"
                height="400px"
                playing
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
