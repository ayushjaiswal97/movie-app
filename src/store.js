import { configureStore } from '@reduxjs/toolkit';
import movieReducer from './features/movies/movieSlice';

const rootReducer = {
  movies: movieReducer,
};

export const store = configureStore({
  reducer: rootReducer,
  devTools: import.meta.env.MODE !== 'production',
});
