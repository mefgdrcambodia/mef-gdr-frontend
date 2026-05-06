import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Make sure there's a div with id="root" in your public/index.html
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);  