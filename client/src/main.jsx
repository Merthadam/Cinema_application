import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CinemaProvider } from './store/cinemaContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CinemaProvider>
      <App />
    </CinemaProvider>
  </StrictMode>,
)
