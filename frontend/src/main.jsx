import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // ← import App
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App /> {/* ← render App, not RouterProvider directly */}
  </React.StrictMode>
);
