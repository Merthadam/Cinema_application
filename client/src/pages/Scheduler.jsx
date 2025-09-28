// client/src/pages/Scheduler.jsx
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setWeekOffset,
  setWeekdayIndex,
  selectSchedulerDate,
  selectNow,
} from "../store/schedulerSlice";
import Content from "../components/Content";

const hungarianWeekdays = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek"];

function startOfWeekMonday(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  const dow = (x.getDay() + 6) % 7; // Mon=0..Sun=6
  x.setDate(x.getDate() - dow);
  return x;
}

function Scheduler() {
  const dispatch = useDispatch();

  const selectedDay = useSelector(selectSchedulerDate);
  const now = useSelector(selectNow);
  const weekOffset = useSelector((state) => state.scheduler.weekOffset);
  const weekdayIndex = useSelector((state) => state.scheduler.weekdayIndex);

  const today = new Date(now);
  const todayDowMon0 = (today.getDay() + 6) % 7; // 0..6
  const todayWorkIndex = Math.min(Math.max(todayDowMon0, 0), 4); // clamp to Mon..Fri

  const didInitRef = useRef(false);
  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;

    // Default to "today" in current week
    dispatch(setWeekOffset(0));
    dispatch(setWeekdayIndex(todayWorkIndex));
  }, [dispatch, todayWorkIndex]);

  const selectedDayObj =
    selectedDay && !isNaN(new Date(selectedDay).getTime())
      ? new Date(selectedDay)
      : null;

  const atCurrentWeek = weekOffset <= 0;

  return (
    <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 text-white">
      <div className="flex justify-center items-center gap-4 my-4">
        {/* Prev week — disabled at current week */}
        <button
          onClick={() => {
            if (!atCurrentWeek) dispatch(setWeekOffset(weekOffset - 1));
          }}
          disabled={atCurrentWeek}
          className={`px-4 py-2 rounded text-white ${
            atCurrentWeek
              ? "bg-gray-600 cursor-not-allowed opacity-60"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          ← Előző hét
        </button>

        <div className="text-lg font-semibold">
          {selectedDayObj
            ? selectedDayObj.toLocaleDateString("hu-HU", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
            : ""}
        </div>

        {/* Next week — allowed */}
        <button
          onClick={() => dispatch(setWeekOffset(weekOffset + 1))}
          className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
        >
          Következő hét →
        </button>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap justify-center">
        {hungarianWeekdays.map((day, i) => {
          const isSelected = weekdayIndex === i;
          const isPastInCurrentWeek = atCurrentWeek && i < todayWorkIndex;
          return (
            <button
              key={day}
              onClick={() => {
                if (!isPastInCurrentWeek) dispatch(setWeekdayIndex(i));
              }}
              disabled={isPastInCurrentWeek}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isSelected
                  ? "bg-lime-400 text-[#0d1b2a]"
                  : isPastInCurrentWeek
                  ? "bg-gray-600 text-white cursor-not-allowed opacity-60"
                  : "bg-gray-700 text-white hover:bg-gray-600"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {selectedDayObj && (
        <Content date={selectedDayObj} weekday={weekdayIndex + 1} />
      )}
    </div>
  );
}

export default Scheduler;
