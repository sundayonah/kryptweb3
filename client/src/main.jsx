import React from 'react'
import ReactDOM from 'react-dom/client'
import {TransactionProvider} from './context/TransactionContext';
import App from './App.jsx'
import './index.css'
import 'tailwindcss/tailwind.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <TransactionProvider>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </TransactionProvider>,
)
