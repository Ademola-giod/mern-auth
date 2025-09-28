// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AppContextProvider } from './context/AppContextProvider.jsx'
import { SpeedInsights } from "@vercel/speed-insights/react"


createRoot(document.getElementById('root')).render(
  
  <BrowserRouter>
  <AppContextProvider>
  <App/>
  </AppContextProvider>
  </BrowserRouter>
    
)
