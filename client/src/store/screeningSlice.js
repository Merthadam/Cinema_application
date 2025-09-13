import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchScreeningsByMovieAndDate = createAsyncThunk(
  'screenings/fetchByMovieAndDate',
  async ({ movieId, date }) => {
    const { data } = await axios.get(`http://localhost:8000/api/movies/${movieId}`);
    return {
      movieId,
      date,
      screenings: (data.screenings || []).filter(
        s => new Date(s.date).toDateString() === new Date(date).toDateString()
      ),
    };
  }
);

export const fetchScreeningsByDate = createAsyncThunk(
  'screenings/fetchByDate',
  async (date) => {
    const { data } = await axios.get('http://localhost:8000/api/screenings');
    return data.filter(s => new Date(s.date).toDateString() === date.toDateString());
  }
);

export const fetchScreeningById = createAsyncThunk(
  'screenings/fetchById',
  async (id) => {
    const { data } = await axios.get(`http://localhost:8000/api/screenings/${id}`);
    return data;
  }
);

const screeningSlice = createSlice({
  name: 'screenings',
  initialState: {
    list: [],
    selected: null,
    loading: false,
    error: null,
    byMovie: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchScreeningsByDate.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchScreeningsByDate.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchScreeningsByMovieAndDate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchScreeningsByMovieAndDate.fulfilled, (state, action) => {
        const { movieId, date, screenings } = action.payload;
        if (!state.byMovie[movieId]) {
          state.byMovie[movieId] = {};
        }
        state.byMovie[movieId][date] = screenings;
        state.loading = false;
      })
      .addCase(fetchScreeningsByMovieAndDate.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(fetchScreeningById.fulfilled, (state, action) => {
        state.selected = action.payload;
      });
  },
});

export default screeningSlice.reducer;
