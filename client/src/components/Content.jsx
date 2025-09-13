import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MovieCard from './MovieCard';
import MoviePage from './MoviePage';
import { fetchMoviesOnDate } from '../store/movieSlice';

function Content({ date, weekday, onConfirmBooking }) {
  const dispatch = useDispatch();
  const movies = useSelector((state) => state.movies.list);
  const loading = useSelector((state) => state.movies.loading);
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  useEffect(() => {
    if (date) dispatch(fetchMoviesOnDate(date));
  }, [date, dispatch]);

  useEffect(() => {
    if (selectedMovieId && !movies.some(m => m.id === selectedMovieId)) {
      setSelectedMovieId(null);
    }
  }, [movies, selectedMovieId]);

  const selectedMovie = movies.find((movie) => movie.id === selectedMovieId);
  const handleMovieClick = (movieId) => {
    setSelectedMovieId((prev) => (prev === movieId ? null : movieId));
  };

  const weekdayLabel = ['Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek'][weekday - 1] || '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d1b2a] to-[#1b263b] text-white p-4 sm:p-6">
      <div className="flex justify-start mb-6">
        <div className="px-4 py-1 rounded-full bg-lime-400 text-[#0d1b2a] font-semibold text-lg shadow">
          {weekdayLabel}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="text-lime-400 text-xl font-semibold animate-pulse">Betöltés...</div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 transition-all duration-500 ease-in-out">
          <div className="flex-1">
            <div className="block sm:hidden overflow-x-auto pb-4">
              <div className="flex gap-4">
                {movies.map((movie) => (
                  <div
                    key={movie.id}
                    onClick={() => handleMovieClick(movie.id)}
                    className="cursor-pointer shrink-0 w-[180px]"
                  >
                    <MovieCard movie={movie} selected={selectedMovieId === movie.id} />
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden sm:grid gap-6 grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
              {movies.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => handleMovieClick(movie.id)}
                  className="cursor-pointer"
                >
                  <MovieCard movie={movie} selected={selectedMovieId === movie.id} />
                </div>
              ))}
            </div>

            <div className="sm:hidden mt-6">
              {selectedMovie && (
                <div className="p-4 bg-black/30 rounded-xl border border-lime-400 shadow-xl">
                  <MoviePage
                    movie={selectedMovie}
                    weekday={weekday}
                    date={date}
                    onConfirmBooking={onConfirmBooking}
                  />
                </div>
              )}
            </div>
          </div>

          <div
            className={`
              hidden sm:block transition-all duration-500 ease-in-out
              overflow-hidden
              ${selectedMovie ? 'w-[600px] opacity-100' : 'w-0 opacity-0'}
            `}
          >
            <div className="p-4 bg-black/30 rounded-xl border border-lime-400 shadow-xl h-full">
              {selectedMovie && (
                <MoviePage
                  movie={selectedMovie}
                  weekday={weekday}
                  date={date}
                  onConfirmBooking={onConfirmBooking}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Content;
