
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '@/pages/Index';
import About from '@/pages/About';
import Services from '@/pages/Services';
import Blog from '@/pages/Blog';
import Appointments from '@/pages/Appointments';
import Contact from '@/pages/Contact';
import Careers from '@/pages/Careers';
import SignUp from '@/pages/SignUp';
import Verify from '@/pages/VerifyOTP';
import PatientProfile from '@/pages/PatientPortal';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from '@/components/PrivateRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Add the admin page imports
import Admin from "@/pages/Admin";
import AdminDashboard from "@/pages/admin/Dashboard";
import BlogManager from "@/pages/admin/BlogManager";
import CareersManager from "@/pages/admin/CareersManager";
import ApplicationsManager from "@/pages/admin/ApplicationsManager";

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl pauseOnFocusLoss draggable pauseOnHover />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/verify" element={<Verify />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <PatientProfile />
              </ProtectedRoute>
            }
          />
        
          {/* Admin Routes */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/blog" element={<BlogManager />} />
          <Route path="/admin/careers" element={<CareersManager />} />
          <Route path="/admin/applications" element={<ApplicationsManager />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
