import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { FestivalProvider } from './contexts/FestivalContext';
import { Toaster } from './components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Index from './pages/Index';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Doctors from './pages/Doctors';
import DoctorDetails from './pages/DoctorDetails';
import BookAppointment from './pages/BookAppointment';
import Appointments from './pages/Appointments';
import Careers from './pages/Careers';
import Contact from './pages/Contact';
import About from './pages/About';
import Services from './pages/Services';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <FestivalProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/doctor/:id" element={<DoctorDetails />} />
              <Route path="/book/:id" element={<BookAppointment />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <Toaster />
        </FestivalProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
