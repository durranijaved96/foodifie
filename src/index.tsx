/* eslint-disable @typescript-eslint/no-unused-vars */
// src/index.tsx

// Import necessary polyfills
import 'crypto'; // or import 'crypto-browserify';
import 'stream'; // or import 'stream-browserify';

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Load environment variables from the .env file

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();

export {};
