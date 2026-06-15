import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

console.log('[main] mounting React app');

// Force clear old local storage caches to ensure new data loads
if (!localStorage.getItem('cache_busted_v2')) {
  console.log('[main] Busting old local storage cache...');
  localStorage.clear();
  localStorage.setItem('cache_busted_v2', 'true');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
