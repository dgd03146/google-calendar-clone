import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { addWeeks, subWeeks } from 'date-fns';

interface CalendarState {
  currentDate: string;
  viewMode: 'week' | 'month';
}

const initialState: CalendarState = {
  currentDate: new Date().toISOString(),
  viewMode: 'week',
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setCurrentDate: (state, action: PayloadAction<string>) => {
      state.currentDate = action.payload;
    },
    goToNextWeek: state => {
      const currentDate = new Date(state.currentDate);
      const nextWeek = addWeeks(currentDate, 1);
      state.currentDate = nextWeek.toISOString();
    },
    goToPrevWeek: state => {
      const currentDate = new Date(state.currentDate);
      const prevWeek = subWeeks(currentDate, 1);
      state.currentDate = prevWeek.toISOString();
    },
    goToToday: state => {
      state.currentDate = new Date().toISOString();
    },
    setViewMode: (state, action: PayloadAction<'week' | 'month'>) => {
      state.viewMode = action.payload;
    },
  },
});

export const { setCurrentDate, goToNextWeek, goToPrevWeek, goToToday, setViewMode } =
  calendarSlice.actions;

export const selectCurrentDate = (state: { calendar: CalendarState }) =>
  new Date(state.calendar.currentDate);

export const selectCurrentDateString = (state: { calendar: CalendarState }) =>
  state.calendar.currentDate;

export const selectViewMode = (state: { calendar: CalendarState }) => state.calendar.viewMode;

export default calendarSlice.reducer;
