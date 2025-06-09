import React from "react";

const MovieList = ({ movies, onAddToWatchlist, onRemoveFromWatchlist, watchlist = [], onPlayTrailer }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {movies.map((movie) => {
        const posterUrl = movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : "https://via.placeholder.com/500x750?text=No+Image";

        const isInWatchlist = watchlist.some((m) => m.id === movie.id);

        return (
          <div
            key={movie.id}
            className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 relative group"
          >
            <img
              src={posterUrl}
              alt={movie.title}
              className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2 line-clamp-1">
                {movie.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-300 mb-3 line-clamp-2">
                {movie.overview || "No description available."}
              </p>
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                  ⭐ {movie.vote_average || "N/A"}
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  📅 {movie.release_date?.split("-")[0] || "N/A"}
                </span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {isInWatchlist ? (
                  <button
                    onClick={() => onRemoveFromWatchlist(movie.id)}
                    className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded-full transition"
                  >
                    ❌ Remove
                  </button>
                ) : (
                  <button
                    onClick={() => onAddToWatchlist(movie)}
                    className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded-full transition"
                  >
                    ➕ Add
                  </button>
                )}
                <button
                  onClick={() => onPlayTrailer(movie)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-3 py-1 rounded-full transition"
                >
                  ▶️ Trailer
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MovieList;
