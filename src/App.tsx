import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Calendar } from './features/calendar';
import { persistor, store } from './store';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Calendar />
      </PersistGate>
    </Provider>
  );
}

export default App;
