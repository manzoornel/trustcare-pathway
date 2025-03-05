
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import PatientInfoCard from "@/components/patient-portal/PatientInfoCard";
import RewardsCard from "@/components/patient-portal/RewardsCard";
import PortalTabsSection from "@/components/patient-portal/PortalTabsSection";
import { supabase } from "@/integrations/supabase/client";

const PatientPortal = () => {
  const navigate = useNavigate();
  const { auth, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("labReports");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate("/login");
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        navigate("/login");
      }
    };
    
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    // If needs profile, redirect to profile creation
    if (auth.needsProfile) {
      navigate("/create-profile");
    }
  }, [auth, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your patient portal...</p>
        </div>
      </div>
    );
  }

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
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <PatientInfoCard 
                  patientName={auth.name || ""}
                  hospitalId={auth.hospitalId}
                  phone={auth.phone}
                  email={auth.email}
                />
              </div>
              
              <div className="lg:col-span-1">
                <RewardsCard />
              </div>
            </div>
            
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
