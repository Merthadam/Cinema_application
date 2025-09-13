import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  setStudent, setAdult, setSenior,
  setSelectedSeats, resetCinemaState
} from '../store/cinemaSlice';
import { createReservation } from '../store/reservationSlice';
import { fetchScreeningById } from '../store/screeningSlice';
import SeatTable from './SeatTable';
import SeatReserver from './SeatReserver';

function SeatSelectionScreen({ screening, handleRefresh }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    student,
    adult,
    senior,
    selectedSeats
  } = useSelector(state => state.cinema);

  const user = useSelector(state => state.auth.user);

  const [showModal, setShowModal] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [currentScreening, setCurrentScreening] = useState(screening);
  const [bookingVersion, setBookingVersion] = useState(0);

  const totalPrice = student * 2000 + adult * 2500 + senior * 1800;

  const refreshScreening = async () => {
    const updated = await dispatch(fetchScreeningById(screening.id)).unwrap();
    if (updated) {
      const currentHash = currentScreening.bookings
        .map(b => `${b.row}-${b.seat}`)
        .join(',');
      const newHash = updated.bookings
        .map(b => `${b.row}-${b.seat}`)
        .join(',');

      if (newHash !== currentHash) {
        setBookingVersion(prev => prev + 1);
      }
      setCurrentScreening(updated);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await dispatch(createReservation({
        screeningId: screening.id,
        seats: selectedSeats,
        tickets: { student, adult, senior },
      })).unwrap();

      setShowModal(true);
      setResetTrigger(prev => prev + 1);
    } catch (err) {
      console.error('❌ Booking error:', err);
      alert('A foglalás nem sikerült. Próbáld újra később.');
    }
  };

  const handleClickSubmit = async () => {
    await handleSubmit();
    await refreshScreening();
    if (handleRefresh) await handleRefresh();
  };

  const modalClose = () => {
    setShowModal(false);
    dispatch(resetCinemaState());
  };

  useEffect(() => {
    dispatch(setSelectedSeats([]));
    dispatch(resetCinemaState());
    setShowModal(false);
    setCurrentScreening(screening);
  }, [screening.id]);

  return (
    <>
      <div className="flex flex-col items-center gap-6 px-4 py-6 w-full">
        <div className="block sm:hidden text-white text-sm text-center bg-black/40 px-4 py-2 rounded-md w-full max-w-md">
          👉 Érintsd meg a székeket a kiválasztáshoz!
        </div>

        <div className="w-full flex justify-center">
          <div className="w-full max-w-md">
            <SeatReserver
              selectedCount={selectedSeats.length}
              onSubmit={handleClickSubmit}
              resetSignal={resetTrigger}
            />
          </div>
        </div>

        <div className="w-full flex justify-center overflow-x-auto">
          <div className="min-w-[320px] sm:max-w-4xl w-full">
            <SeatTable
              key={`screening-${currentScreening.id}-${bookingVersion}`}
              screening={currentScreening}
              onSelectionChange={(seats) => dispatch(setSelectedSeats(seats))}
            />
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white text-black rounded-xl p-6 max-w-md w-full text-center shadow-lg">
            <h2 className="text-xl font-bold mb-4">Foglalás véglegesítve ✅</h2>

            <div className="text-sm text-gray-800 space-y-1 mb-3">
              <p><b>Jegyek:</b></p>
              <p>Diák: {student} db</p>
              <p>Felnőtt: {adult} db</p>
              <p>Nyugdíjas: {senior} db</p>

              <p className="mt-2"><b>Székek:</b></p>
              <ul className="text-sm text-gray-600">
                {selectedSeats.map((s, i) => (
                  <li key={i}>• Sor: {s.row}, Szék: {s.seat}</li>
                ))}
              </ul>

              <p className="mt-2 font-semibold">
                Összesen: {totalPrice.toLocaleString()} Ft
              </p>
            </div>

            <button
              className="mt-4 btn btn-primary"
              onClick={modalClose}
            >
              Bezárás
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default SeatSelectionScreen;
