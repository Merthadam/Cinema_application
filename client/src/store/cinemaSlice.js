
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedSeats: [],
  student: 0,
  adult: 0,
  senior: 0,
};

const cinemaSlice = createSlice({
  name: 'cinema',
  initialState,
  reducers: {
    setSelectedSeats(state, action) {
      state.selectedSeats = action.payload;
    },
    setStudent(state, action) {
      state.student = action.payload;
    },
    setAdult(state, action) {
      state.adult = action.payload;
    },
    setSenior(state, action) {
      state.senior = action.payload;
    },
    resetCinemaState(state) {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setSelectedSeats,
  setStudent,
  setAdult,
  setSenior,
  resetCinemaState,
} = cinemaSlice.actions;

export default cinemaSlice.reducer;
