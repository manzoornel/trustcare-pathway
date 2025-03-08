
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { FestivalProvider } from '@/contexts/FestivalContext'

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <ThemeProvider>
        <FestivalProvider>
          <App />
        </FestivalProvider>
      </ThemeProvider>
    </AuthProvider>
  </BrowserRouter>
);
