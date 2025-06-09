import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const fetchMovies = createAsyncThunk('movies/fetchMovies', async () => {
  const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`);
  return response.data.results;
});

const movieSlice = createSlice({
  name: 'movies',
  initialState: { items: [], status: 'idle' },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchMovies.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export default movieSlice.reducer;
