// src/store/reservationsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const fetchReservations = createAsyncThunk(
  'reservations/fetchReservations',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      console.error('❌ Failed to fetch reservations:', err);
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createReservation = createAsyncThunk(
  'reservations/createReservation',
  async ({ screeningId, seats, tickets }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');

      const formattedSeats = seats.map(s => ({ row: s.row, seat: s.seat }));

      const ticket_types = [
        ...(tickets.student > 0 ? [{ type: 'student', quantity: tickets.student }] : []),
        ...(tickets.adult > 0 ? [{ type: 'adult', quantity: tickets.adult }] : []),
        ...(tickets.senior > 0 ? [{ type: 'senior', quantity: tickets.senior }] : []),
      ];

      const response = await axios.post(
        `${API_URL}/bookings`,
        {
          screening_id: screeningId,
          seats: formattedSeats,
          ticket_types,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (err) {
      console.error('❌ Reservation failed:', err.response?.data || err.message);
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const reservationsSlice = createSlice({
  name: 'reservations',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchReservations.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReservations.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchReservations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createReservation.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(createReservation.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default reservationsSlice.reducer;
