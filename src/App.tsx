
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Index from '@/pages/Index';
import About from '@/pages/About';
import Services from '@/pages/Services';
import Blog from '@/pages/Blog';
import Appointments from '@/pages/Appointments';
import Contact from '@/pages/Contact';
import Careers from '@/pages/Careers';
import SignUp from '@/pages/SignUp';
import Verify from '@/pages/VerifyOTP';
import PatientPortal from '@/pages/PatientPortal';
import Login from '@/pages/Login';
import Doctors from '@/pages/Doctors';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from '@/components/PrivateRoute';
import AIChat from '@/pages/AIChat';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import FestivalDecorations from '@/components/FestivalDecorations';
import { useTheme } from '@/contexts/ThemeContext';

// Admin components
import Admin from "@/pages/Admin";
import AdminDashboard from "@/pages/admin/Dashboard";
import DoctorsManager from "@/pages/admin/DoctorsManager";
import BlogManager from "@/pages/admin/BlogManager";
import CareersManager from "@/pages/admin/CareersManager";
import ApplicationsManager from "@/pages/admin/ApplicationsManager";
import SettingsManager from "@/pages/admin/SettingsManager";
import NotFound from '@/pages/NotFound';

function App() {
  const { isThemeChanging } = useTheme();

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      
      {/* Theme fade transition */}
      {isThemeChanging && (
        <div className="fixed inset-0 bg-white z-[9999] animate-fade-in" style={{ animationDirection: 'reverse' }}></div>
      )}
      
      <ThemeSwitcher />
      <FestivalDecorations />
      
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/ai-chat" element={<AIChat />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<Verify />} />
        <Route
          path="/patient-portal"
          element={
            <PrivateRoute>
              <PatientPortal />
            </PrivateRoute>
          }
        />
      
        {/* Admin Routes */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/doctors" element={<DoctorsManager />} />
        <Route path="/admin/blog" element={<BlogManager />} />
        <Route path="/admin/careers" element={<CareersManager />} />
        <Route path="/admin/applications" element={<ApplicationsManager />} />
        <Route path="/admin/settings" element={<SettingsManager />} />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
