import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setStudent,
  setAdult,
  setSenior
} from '../store/cinemaSlice';

function SeatReserver({ selectedCount, onSubmit }) {
  const dispatch = useDispatch();

  const student = useSelector(state => state.cinema.student);
  const adult = useSelector(state => state.cinema.adult);
  const senior = useSelector(state => state.cinema.senior);
  const selectedSeats = useSelector(state => state.cinema.selectedSeats);

  const ticketPrices = {
    student: 2000,
    adult: 2500,
    senior: 1800,
  };

  const totalTickets = student + adult + senior;
  const totalPrice =
    student * ticketPrices.student +
    adult * ticketPrices.adult +
    senior * ticketPrices.senior;

  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setIsValid(selectedCount > 0 && totalTickets === selectedCount);
  }, [selectedCount, student, adult, senior]);

  const handleSubmit = () => {
    const tickets = { student, adult, senior };
    if (isValid) {
      onSubmit({ tickets, totalPrice });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto border border-gray-700 rounded-xl p-6 bg-black/20 text-white flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <TicketSelector
          label="Diák"
          value={student}
          onChange={(val) => dispatch(setStudent(val))}
          price={ticketPrices.student}
        />
        <TicketSelector
          label="Felnőtt"
          value={adult}
          onChange={(val) => dispatch(setAdult(val))}
          price={ticketPrices.adult}
        />
        <TicketSelector
          label="Nyugdíjas"
          value={senior}
          onChange={(val) => dispatch(setSenior(val))}
          price={ticketPrices.senior}
        />
      </div>

      <div className="border-t border-gray-600 pt-3 text-sm text-right text-gray-300">
        Összesen:&nbsp;
        <span className="text-white font-semibold">
          {totalPrice.toLocaleString()} Ft
        </span>
      </div>

      {isValid && (
        <>
          <button className="btn btn-primary w-full" onClick={handleSubmit}>
            Foglalás
          </button>

          <div className="text-sm mt-4 text-left text-gray-300 bg-black/40 p-3 rounded-md">
            <div className="font-bold mb-1">🧾 Foglalás összesítő</div>
            <p>Diák: {student} db</p>
            <p>Felnőtt: {adult} db</p>
            <p>Nyugdíjas: {senior} db</p>
            <p className="mt-2">Helyek:</p>
            <ul className="list-disc list-inside text-white">
              {selectedSeats.map((s, i) => (
                <li key={i}>
                  Sor: {s.row}, Szék: {s.seat}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

function TicketSelector({ label, value, onChange, price }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
        <div className="font-medium">{label}</div>
        <div className="text-sm text-gray-400">{price.toLocaleString()} Ft</div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(Math.max(0, value - 1))}
          className="btn btn-sm bg-blue-600 text-white hover:bg-blue-700"
        >
          –
        </button>
        <input
          type="text"
          readOnly
          value={value}
          className="w-10 text-center bg-transparent border border-gray-500 rounded"
        />
        <button
          onClick={() => onChange(value + 1)}
          className="btn btn-sm bg-blue-600 text-white hover:bg-blue-700"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default SeatReserver;
