import type { CalendarEvent, CreateEventData } from '@/features/calendar/types/event';
import type { RootState } from '@/store';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

interface EventsState {
  events: CalendarEvent[];
}

const initialState: EventsState = {
  events: [],
};

const generateEventId = (): string => {
  return `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    addEvent: (state, action: PayloadAction<CreateEventData>) => {
      const newEvent: CalendarEvent = {
        id: generateEventId(),
        title: action.payload.title?.trim() || '(제목 없음)',
        date: action.payload.date,
        startTime: action.payload.startTime,
        endTime: action.payload.endTime,
        repeatType: action.payload.repeatType || 'none',
        createdAt: new Date().toISOString(),
      };
      state.events.push(newEvent);
    },
    updateEvent: (state, action: PayloadAction<{ id: string; data: Partial<CreateEventData> }>) => {
      const { id, data } = action.payload;
      const index = state.events.findIndex(e => e.id === id);
      if (index === -1) return;

      const event = state.events[index];

      const updatedEvent: CalendarEvent = {
        ...event,
        title: data.title !== undefined ? data.title.trim() || '(제목 없음)' : event.title,
        date: data.date ?? event.date,
        startTime: data.startTime ?? event.startTime,
        endTime: data.endTime ?? event.endTime,
        repeatType: data.repeatType !== undefined ? data.repeatType || 'none' : event.repeatType,
      };

      state.events[index] = updatedEvent;
    },
    deleteEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter(event => event.id !== action.payload);
    },
  },
});

export const { addEvent, updateEvent, deleteEvent } = eventsSlice.actions;

export const selectAllEvents = (state: RootState) => state.events.events;

export const selectEventsByDate = (state: RootState, date: string) =>
  state.events.events.filter(event => event.date === date);

export const selectEventById = (state: RootState, id: string) =>
  state.events.events.find(event => event.id === id);

export const selectEventsCount = (state: RootState) => state.events.events.length;

export const selectEventsDayEvents = (state: RootState, date: string) =>
  state.events.events.filter(event => event.date === date);
