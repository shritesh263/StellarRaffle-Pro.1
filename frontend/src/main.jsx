import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { FreighterProvider } from './context/FreighterContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FreighterProvider>
      <App />
    </FreighterProvider>
  </React.StrictMode>,
)
