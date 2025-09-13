import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReservations } from '../store/reservationSlice';

function ReservationsPage() {
  const dispatch = useDispatch();

  const { list: reservations, loading } = useSelector((state) => state.reservations);

  useEffect(() => {
    dispatch(fetchReservations());
  }, [dispatch]);

  const now = new Date();

  const upcoming = reservations.filter(r => new Date(r.screening.date) >= now);
  const past = reservations.filter(r => new Date(r.screening.date) < now);

  const formatSeats = seatsJson => {
    try {
      const seats = JSON.parse(seatsJson);
      return seats.map(s => `${s.row}. sor, ${s.seat}. szék`).join(', ');
    } catch (e) {
      return 'Hibás ülésadatok';
    }
  };

  const formatTicketTypes = ticketTypesJson => {
    try {
      const tickets = JSON.parse(ticketTypesJson);
      return tickets.map((t, i) => {
        const label = t.type === 'adult' ? 'Felnőtt' : t.type === 'student' ? 'Diák' : 'Nyugdíjas';
        return (
          <div key={i} className="flex justify-between text-sm">
            <span>{t.quantity}× {label}</span>
            <span>{t.quantity * 1250} Ft</span>
          </div>
        );
      });
    } catch (e) {
      return <p className="text-sm text-red-400">Hibás jegyadat</p>;
    }
  };

  const renderCards = bookings => (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {bookings.map(r => (
        <div
          key={r.id}
          className="bg-white/10 backdrop-blur-md border border-white/20 text-white p-4 rounded-xl min-w-[300px] shadow-md flex flex-col justify-between"
        >
          <div className="flex justify-between items-start gap-2">
            <div>
              <h3 className="text-lg font-bold">{r.screening.movie.title}</h3>
              <p className="text-sm text-gray-300">
                {new Date(r.screening.date).toLocaleDateString('hu-HU', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  weekday: 'long',
                })}
              </p>
            </div>
            <img
              src={r.screening.movie.image_path}
              alt={r.screening.movie.title}
              className="w-16 h-20 object-cover rounded-md"
            />
          </div>

          <div className="mt-4 border-t border-white/20 pt-2 space-y-1">
            {formatTicketTypes(r.ticket_types)}
          </div>

          <div className="mt-4 text-sm">
            <span className="text-gray-400 block">Helyek:</span>
            <span className="italic">{formatSeats(r.seats)}</span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">Közelgő</h1>
      {loading ? <p>Betöltés...</p> : renderCards(upcoming)}

      <h2 className="text-2xl font-bold mb-4 mt-10">Korábbi foglalások</h2>
      {loading ? <p>Betöltés...</p> : renderCards(past)}
    </div>
  );
}

export default ReservationsPage;
