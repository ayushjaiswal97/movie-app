import React, { useState } from "react";
import ReactPlayer from "react-player";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const MovieList = ({
  movies,
  onAddToWatchlist,
  onRemoveFromWatchlist,
}) => {
  const [trailerUrl, setTrailerUrl] = useState("");
  const [showPlayer, setShowPlayer] = useState(false);

  const fetchTrailer = async (movieId) => {
    const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`
      );
      const data = await res.json();
      const trailer = data.results.find(
        (vid) => vid.type === "Trailer" && vid.site === "YouTube"
      );
      if (trailer) {
        setTrailerUrl(`https://www.youtube.com/watch?v=${trailer.key}`);
        setShowPlayer(true);
      } else {
        alert("Trailer not available");
      }
    } catch (error) {
      console.error("Error fetching trailer:", error);
      alert("Error fetching trailer");
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {movies.map((movie) => (
          <div key={movie.id} className="bg-white rounded shadow p-2 flex flex-col">
            <img
              src={`${IMAGE_BASE_URL}${movie.poster_path}`}
              alt={movie.title}
              className="rounded mb-2"
            />
            <h3 className="text-lg font-semibold">{movie.title}</h3>
            <p className="text-sm text-gray-600 mb-2">Rating: {movie.vote_average}</p>
            <button
              onClick={() => fetchTrailer(movie.id)}
              className="bg-red-600 text-white px-2 py-1 rounded mb-2"
            >
              Watch Trailer
            </button>

            {onAddToWatchlist && (
              <button
                onClick={() => onAddToWatchlist(movie)}
                className="bg-green-600 text-white px-2 py-1 rounded"
              >
                + Add to Watchlist
              </button>
            )}

            {onRemoveFromWatchlist && (
              <button
                onClick={() => onRemoveFromWatchlist(movie.id)}
                className="bg-yellow-600 text-black px-2 py-1 rounded"
              >
                Remove from Watchlist
              </button>
            )}
          </div>
        ))}
      </div>

      {showPlayer && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-black p-4 rounded-lg max-w-3xl w-full relative">
            <button
              onClick={() => setShowPlayer(false)}
              className="absolute top-2 right-2 text-white text-xl font-bold"
            >
              &times;
            </button>
            <ReactPlayer url={trailerUrl} controls width="100%" />
          </div>
        </div>
      )}
    </>
  );
};

export default MovieList;
