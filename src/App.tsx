
import { Routes, Route } from 'react-router-dom';
import { Toaster } from "sonner";
import './App.css';

// Pages
import Index from './pages/Index';
import About from './pages/About';
import Services from './pages/Services';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import VerifyOTP from './pages/VerifyOTP';
import CreateProfile from './pages/Create-profile';
import PatientPortal from './pages/PatientPortal';
import NotFound from './pages/NotFound';
import AIChat from './pages/AIChat';
import Appointments from './pages/Appointments';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/create-profile" element={<CreateProfile />} />
        <Route path="/patient-portal" element={<PatientPortal />} />
        <Route path="/ai-chat" element={<AIChat />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
