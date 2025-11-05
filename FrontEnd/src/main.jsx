import axiosInstance from './utils/axiosInstance.js'

(async () => {
  try {
    await axiosInstance.get('/health')
  } catch (error) {
    console.log(error)
    }
})


import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from './App.jsx';
import './index.css';
import { store } from './redux/store.js';
import axios from 'axios';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </BrowserRouter>{' '}
  </Provider>
);
