import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// lancer le serv "npm run dev" dans le terminal (oublie pas le serveur)
{/* <StrictMode> */ }
{/* </StrictMode>, */ }
createRoot(document.getElementById('root')!).render(

  <App />

)

