import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

interface EventsModalState {
  isOpen: boolean;
  selectedDate: string;
  selectedHour: number;
  selectedMinute: number;
  editingEventId: string | null;
  mode: 'create' | 'edit';
}

const initialState: EventsModalState = {
  isOpen: false,
  selectedDate: new Date().toISOString(),
  selectedHour: 9,
  selectedMinute: 0,
  editingEventId: null,
  mode: 'create',
};

export const eventsModalSlice = createSlice({
  name: 'eventsModal',
  initialState,
  reducers: {
    openCreateModal: (
      state,
      action: PayloadAction<{ date: Date; hour: number; minute?: number }>
    ) => {
      state.isOpen = true;
      state.selectedDate = action.payload.date.toISOString();
      state.selectedHour = action.payload.hour;
      state.selectedMinute = action.payload.minute || 0;
      state.editingEventId = null;
      state.mode = 'create';
    },
    openEditModal: (state, action: PayloadAction<string>) => {
      state.isOpen = true;
      state.editingEventId = action.payload;
      state.mode = 'edit';
    },
    closeModal: state => {
      state.isOpen = false;
    },
  },
});

export const { openCreateModal, openEditModal, closeModal } = eventsModalSlice.actions;

export const selectModalState = (state: { eventsModal: EventsModalState }) => state.eventsModal;
export const selectIsModalOpen = (state: { eventsModal: EventsModalState }) =>
  state.eventsModal.isOpen;
export const selectModalSelectedDate = (state: { eventsModal: EventsModalState }) =>
  new Date(state.eventsModal.selectedDate);
export const selectModalSelectedHour = (state: { eventsModal: EventsModalState }) =>
  state.eventsModal.selectedHour;
export const selectModalSelectedMinute = (state: { eventsModal: EventsModalState }) =>
  state.eventsModal.selectedMinute;
export const selectModalEditingEventId = (state: { eventsModal: EventsModalState }) =>
  state.eventsModal.editingEventId;
export const selectModalMode = (state: { eventsModal: EventsModalState }) => state.eventsModal.mode;

export default eventsModalSlice.reducer;
