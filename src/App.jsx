import { useState, useEffect } from "react";
import axios from "axios";
import MovieList from "./features/movies/MovieList";
import SearchBar from "./features/movies/SearchBar";
import InfiniteScroll from "react-infinite-scroll-component";

function App() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("avengers"); // Default search
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [watchlist, setWatchlist] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    const fetchMovies = async () => {
      if (!query.trim()) return; // ✅ Prevent empty queries

      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/search/movie`,
          {
            params: {
              api_key: API_KEY,
              query,
              page,
            },
          }
        );

        const newMovies = res.data.results;

        setMovies((prev) => (page === 1 ? newMovies : [...prev, ...newMovies]));
        setHasMore(page < res.data.total_pages);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      }
    };

    fetchMovies();
  }, [query, page, API_KEY]);

  const handleSearch = (q) => {
    setQuery(q);
    setPage(1); // Reset to first page on new search
    setMovies([]); // Clear previous movies
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="p-4 min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white transition-colors">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">🎬 Movie App</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-gray-800 text-white px-3 py-1 rounded dark:bg-white dark:text-black"
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        <SearchBar onSearch={handleSearch} />

        <InfiniteScroll
          dataLength={movies.length}
          next={() => setPage((prev) => prev + 1)}
          hasMore={hasMore}
          loader={<h4 className="text-center">Loading more movies...</h4>}
        >
          <MovieList
            movies={movies}
            onAddToWatchlist={(movie) =>
              setWatchlist((prev) =>
                prev.find((m) => m.id === movie.id) ? prev : [...prev, movie]
              )
            }
            watchlist={watchlist}
          />
        </InfiniteScroll>

        {watchlist.length > 0 && (
          <>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Your Watchlist</h2>
            <MovieList
              movies={watchlist}
              onRemoveFromWatchlist={(id) =>
                setWatchlist((prev) => prev.filter((m) => m.id !== id))
              }
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
