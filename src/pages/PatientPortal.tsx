
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import PatientInfoCard from "@/components/patient-portal/PatientInfoCard";
import PortalTabsSection from "@/components/patient-portal/PortalTabsSection";

const PatientPortal = () => {
  const navigate = useNavigate();
  const { auth, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("labReports");

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!auth.isAuthenticated) {
      navigate("/login");
    }
    // If needs profile, redirect to profile creation
    else if (auth.needsProfile) {
      navigate("/create-profile");
    }
  }, [auth, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <Helmet>
        <title>Patient Portal | Doctor Uncle Family Clinic</title>
        <meta
          name="description"
          content="Access your medical records, lab reports, medications, and appointments at Doctor Uncle Family Clinic."
        />
      </Helmet>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="pt-20 px-4 max-w-7xl mx-auto">
          <div className="py-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">Patient Portal</h1>
                <p className="text-gray-600">
                  Welcome back, {auth.name || "Patient"}
                </p>
              </div>
              <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
            
            <PatientInfoCard 
              patientName={auth.name || ""}
              hospitalId={auth.hospitalId}
              phone={auth.phone}
              email={auth.email}
            />
            
            <PortalTabsSection 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
        </div>
        
        <Footer />
      </div>
    </>
  );
};

export default PatientPortal;
