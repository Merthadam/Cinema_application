import axios from 'axios';

export async function getScreeningForDate(date) {
  try {
    const { data: screenings } = await axios.get('http://localhost:8000/api/screenings');
    return screenings.filter(screening => {
      const screeningDate = new Date(screening.date);
      return screeningDate.toDateString() === date.toDateString();
    });
  } catch (error) {
    console.error('Error fetching screenings:', error);
    return [];
  }
}

export function getWeekNumberAndWeekday(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  const weekday = date.getDay() === 0 ? 7 : date.getDay();
  return { weekNumber: weekNo, weekday };
}

export async function getMoviesOnDate(date) {
  try {
    console.log("🟡 getMoviesOnDate received date:", date);
    const targetDateStr = date.toISOString().split('T')[0];
    console.log("🔵 formatted targetDateStr:", targetDateStr);

    const [moviesResponse] = await Promise.all([
      axios.get('http://localhost:8000/api/movies'),
    ]);

    const movies = moviesResponse.data;
    console.log("🟢 movies fetched:", movies);

    const filtered = movies.filter(movie =>
      movie.screenings?.some(screening => screening.date === targetDateStr)
    );

    console.log("🟣 filtered movies:", filtered);
    return filtered;
  } catch (error) {
    console.error('❌ Error fetching movies on date:', error);
    return [];
  }
}



export async function getMovieScreeningsForDate(movieId, date) {
  try {
    const { data: movie } = await axios.get(`http://localhost:8000/api/movies/${movieId}`);
    return movie.screenings.filter(screening => {
      const screeningDate = new Date(screening.date);
      return screeningDate.toDateString() === date.toDateString();
    });
  } catch (error) {
    console.error('Error fetching movie screenings:', error);
    return [];
  }
}

export async function getMovieDetails(movieId) {
  try {
    const { data } = await axios.get(`http://localhost:8000/api/movies/${movieId}`);
    return data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
}

export async function getBookingsForScreening(screeningId) {
  try {
    const { data } = await axios.get(`Cgs/${screeningId}`);
    return data;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return null;
  }
}

export async function getRoomDetails(roomId) {
  try {
    const { data } = await axios.get(`http://localhost:8000/api/rooms/${roomId}`);
    return data;
  } catch (error) {
    console.error('Error fetching room details:', error);
    return null;
  }
}

export async function createReservation({ screeningId, seats, tickets }) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not authenticated');

  try {
    const formattedSeats = seats.map(s => ({
      row: s.row,
      seat: s.seat,
    }));

    const ticket_types = [
      ...(tickets.student > 0 ? [{ type: "student", quantity: tickets.student }] : []),
      ...(tickets.adult > 0 ? [{ type: "adult", quantity: tickets.adult }] : []),
      ...(tickets.senior > 0 ? [{ type: "senior", quantity: tickets.senior }] : []),
    ];

    const response = await axios.post(
      'http://localhost:8000/api/bookings',
      {
        screening_id: screeningId,
        seats: formattedSeats,
        ticket_types: ticket_types,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('❌ Reservation failed:', error.response?.data || error.message);
    throw error;
  }
}
export async function getScreeningById(screeningId) {
  try {
    const { data } = await axios.get(`http://localhost:8000/api/screenings/${screeningId}`);
    return data;
  } catch (error) {
    console.error('Error fetching screening by ID:', error);
    return null;
  }
}


