import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import EntryManagement from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EntryManagement />
  </StrictMode>,
)
