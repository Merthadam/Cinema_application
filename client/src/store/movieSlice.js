import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchMoviesOnDate = createAsyncThunk(
  'movies/fetchMoviesOnDate',
  async (date) => {
    const targetDateStr = date.toISOString().split('T')[0];
    const { data: movies } = await axios.get('http://localhost:8000/api/movies');
    return movies.filter(movie =>
      movie.screenings?.some(screening => screening.date === targetDateStr)
    );
  }
);



export const fetchMovieDetails = createAsyncThunk(
  'movies/fetchMovieDetails',
  async (movieId) => {
    const { data } = await axios.get(`http://localhost:8000/api/movies/${movieId}`);
    return data;
  }
);

const movieSlice = createSlice({
  name: 'movies',
  initialState: {
    list: [],
    selected: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedMovie(state) {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMoviesOnDate.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMoviesOnDate.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchMoviesOnDate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchMovieDetails.fulfilled, (state, action) => {
        state.selected = action.payload;
      });
  }
});

export const { clearSelectedMovie } = movieSlice.actions;
export default movieSlice.reducer;
