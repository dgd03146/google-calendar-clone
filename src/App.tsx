import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PersistGate } from 'redux-persist/integration/react';
import { Calendar } from './features/calendar';
import { persistor, store } from './store';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Calendar />
        <ToastContainer position="bottom-center" autoClose={3000} />
      </PersistGate>
    </Provider>
  );
}

export default App;
