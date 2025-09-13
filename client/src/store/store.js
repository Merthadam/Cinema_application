import { configureStore } from '@reduxjs/toolkit';
import movieReducer from './movieSlice';
import screeningReducer from './screeningSlice';
import authReducer from './authSlice'; 
import cinemaReducer from './cinemaSlice';
import reservationsReducer from './reservationSlice';
import schedulerReducer from './schedulerSlice';

export const store = configureStore({
  reducer: {
    movies: movieReducer,
    screenings: screeningReducer,
    auth: authReducer, 
    cinema: cinemaReducer,
    reservations: reservationsReducer, 
    scheduler: schedulerReducer, 
  },
});
