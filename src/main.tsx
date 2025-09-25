
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { FestivalProvider } from '@/contexts/FestivalContext'
import { LanguageProvider } from '@/contexts/LanguageContext'

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <ThemeProvider>
        <FestivalProvider>
          <LanguageProvider>
            <App />
          </LanguageProvider>
        </FestivalProvider>
      </ThemeProvider>
    </AuthProvider>
  </BrowserRouter>
);
