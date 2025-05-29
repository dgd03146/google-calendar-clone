import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import calendarReducer from '../features/calendar/store/calendarSlice';
import eventsModalReducer from '../features/calendar/store/eventsModalSlice';
import { eventsSlice } from '../features/calendar/store/eventsSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['events', 'calendar'],
};

const rootReducer = combineReducers({
  events: eventsSlice.reducer,
  calendar: calendarReducer,
  eventsModal: eventsModalReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
