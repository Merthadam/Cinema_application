import { createSlice, createSelector } from '@reduxjs/toolkit';


function getNextWeekday(date) {
  const copy = new Date(date);
  if (copy.getDay() === 0) copy.setDate(copy.getDate() + 1);
  else if (copy.getDay() === 6) copy.setDate(copy.getDate() + 2);
  return copy;
}

function getWeekStart(date) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() - ((copy.getDay() + 6) % 7));
  return copy;
}

function addWeeks(date, n) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + n * 7);
  return copy;
}

const now = new Date();
const today = getNextWeekday(now);
const weekday = (today.getDay() + 6) % 7;
const index = Math.min(weekday, 4);
const monday = getWeekStart(today);
const selectedDay = new Date(monday);
selectedDay.setDate(monday.getDate() + index);

const initialState = {
  weekOffset: 0,
  weekdayIndex: index,
  selectedDay: selectedDay.toISOString(),
  now: now.toISOString(),
};

const schedulerSlice = createSlice({
  name: 'scheduler',
  initialState,
  reducers: {
    setWeekOffset(state, action) {
      state.weekOffset = action.payload;
      updateSelectedDay(state);
    },
    setWeekdayIndex(state, action) {
      state.weekdayIndex = action.payload;
      updateSelectedDay(state);
    },
  },
});

function updateSelectedDay(state) {
  const now = new Date(state.now);
  const baseMonday = getWeekStart(now);
  const targetWeek = addWeeks(baseMonday, state.weekOffset);
  const newDate = new Date(targetWeek);
  newDate.setDate(targetWeek.getDate() + state.weekdayIndex);
  state.selectedDay = newDate.toISOString();
}

export const selectSchedulerDate = createSelector(
  state => state.scheduler.selectedDay,
  (iso) => new Date(iso)
);

export const selectNow = createSelector(
  state => state.scheduler.now,
  (iso) => new Date(iso)
);

export const canGoBack = (weekOffset) => weekOffset > 0;
export const canGoForward = (weekOffset) => weekOffset < 51;

export const { setWeekOffset, setWeekdayIndex } = schedulerSlice.actions;
export default schedulerSlice.reducer;
