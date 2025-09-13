import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedSeats } from '../store/cinemaSlice';

import availableImg from '../assets/backgrounds/available.png';
import selectedImg from '../assets/backgrounds/selected.png';
import bookedImg from '../assets/backgrounds/booked.png';

function SeatTable({ screening, onSelectionChange }) {
  const dispatch = useDispatch();
  const selectedSeats = useSelector(state => state.cinema.selectedSeats);

  useEffect(() => {
    onSelectionChange(selectedSeats);
  }, [selectedSeats, onSelectionChange]);

  function toggleSeat(row, column) {
    const exists = selectedSeats.find(seat => seat.row === row && seat.seat === column);
    if (exists) {
      dispatch(setSelectedSeats(selectedSeats.filter(seat => !(seat.row === row && seat.seat === column))));
    } else {
      dispatch(setSelectedSeats([...selectedSeats, { row, seat: column }]));
    }
  }

  function renderSeats() {
    const rows = [];

    for (let i = 1; i <= screening.room.rows; i++) {
      const rowCells = [];

      rowCells.push(
        <td
          key={`row-${i}`}
          className="text-right pr-2 text-white font-mono text-sm w-4 select-none"
          style={{ padding: 0, margin: 0 }}
        >
          {i}
        </td>
      );

      for (let j = 1; j <= screening.room.seatsPerRow; j++) {
        const isBooked = screening.bookings.some(b => b.row === i && b.seat === j);
        const isSelected = selectedSeats.some(s => s.row === i && s.seat === j);

        const bg = isBooked
          ? bookedImg
          : isSelected
            ? selectedImg
            : availableImg;

        rowCells.push(
          <td
            key={`${i}-${j}`}
            onClick={() => !isBooked && toggleSeat(i, j)}
            style={{
              backgroundImage: `url(${bg})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              width: '36px',
              height: '36px',
              padding: 0,
              margin: 0,
              cursor: isBooked ? 'not-allowed' : 'pointer',
            }}
          />
        );
      }

      rows.push(
        <tr key={i} className="leading-none h-[36px] p-0 m-0">{rowCells}</tr>
      );
    }

    return rows;
  }

  return (
    <div className="w-full h-full min-h-[300px] flex items-center justify-center">
      <div className="overflow-auto p-2 rounded-xl border border-white max-w-full">
        <table className="border-collapse select-none">
          <tbody>{renderSeats()}</tbody>
        </table>

        <div className="mt-4 flex justify-center gap-4 text-sm text-white">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-cover bg-center" style={{ backgroundImage: `url(${availableImg})` }} />
            Szabad
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-cover bg-center" style={{ backgroundImage: `url(${selectedImg})` }} />
            Kiválasztva
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-cover bg-center" style={{ backgroundImage: `url(${bookedImg})` }} />
            Foglalt
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeatTable;
