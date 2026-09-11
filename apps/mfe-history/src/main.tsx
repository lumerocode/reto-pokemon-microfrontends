import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const savedTheme = localStorage.getItem('pokemon-app-storage');
const theme = savedTheme ? JSON.parse(savedTheme).state?.theme : 'dark';
document.documentElement.classList.toggle('dark', theme !== 'light');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
