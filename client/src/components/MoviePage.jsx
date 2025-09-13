import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchScreeningsByMovieAndDate } from '../store/screeningSlice';
import SeatSelectionScreen from './SeatSelectionScreen';

function MoviePage({ movie, date, onConfirmBooking }) {
  const dispatch = useDispatch();
  const screenings = useSelector(
    (state) => state.screenings.byMovie[movie.id]?.[date] || []
  );
  const loading = useSelector((state) => state.screenings.loading);
  const error = useSelector((state) => state.screenings.error);

  const [selectedScreeningId, setSelectedScreeningId] = useState(null);

  useEffect(() => {
    if (movie.id && date) {
      dispatch(fetchScreeningsByMovieAndDate({ movieId: movie.id, date }));
      setSelectedScreeningId(null);
    }
  }, [movie.id, date, dispatch]);

  const selectedScreening = screenings.find((s) => s.id === selectedScreeningId);

  function timeButtonClicked(screening) {
    setSelectedScreeningId((prev) => (prev === screening.id ? null : screening.id));
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-10 sm:gap-12 border border-gray-600 rounded-xl bg-black/20 shadow-lg">
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        <div className="w-48 sm:w-60 md:w-72 rounded-xl shadow-xl transform rotate-[-4deg] overflow-hidden">
          <img
            src={new URL(`${movie.image_path}`, import.meta.url).href}
            alt={movie.title}
            className="w-full h-auto object-cover aspect-[2/3] rounded-xl"
          />
        </div>

        <div className="text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">{movie.title}</h1>
          <p className="text-gray-400 text-sm sm:text-base">{movie.release_year}</p>
          <p className="mt-4 text-gray-300 text-sm sm:text-base leading-relaxed max-w-prose">
            {movie.description}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 items-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-white text-center">Vetítések</h2>
        {loading ? (
          <div className="text-lime-400 animate-pulse">Betöltés...</div>
        ) : error ? (
          <div className="text-red-400">Hiba történt: {error}</div>
        ) : (
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {screenings.map((screening) => {
              const isFull =
                screening.bookings.length ===
                screening.room.rows * screening.room.seatsPerRow;

              const isSelected = selectedScreeningId === screening.id;

              // Allow clicking past times: do NOT compute or use isPast here.
              let buttonStyle = 'px-4 py-2 rounded-md text-sm font-medium transition-all';
              if (isFull) {
                buttonStyle += ' bg-gray-600 text-white cursor-not-allowed';
              } else if (isSelected) {
                buttonStyle += ' bg-green-600 text-white';
              } else {
                buttonStyle += ' bg-white text-black hover:bg-green-600 hover:text-white';
              }

              return (
                <button
                  key={screening.id}
                  disabled={isFull} // only disable when full; past times are allowed
                  onClick={() => timeButtonClicked(screening)}
                  className={buttonStyle}
                >
                  {screening.start_time}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {selectedScreening && (
        <div className="mt-2 sm:mt-4 rounded-xl border border-gray-700 bg-black/30 p-4 sm:p-6">
          <SeatSelectionScreen
            screening={selectedScreening}
            onConfirmBooking={onConfirmBooking}
          />
        </div>
      )}
    </div>
  );
}

export default MoviePage;
