
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, RefreshCw } from "lucide-react";
import PatientInfoCard from "@/components/patient-portal/PatientInfoCard";
import RewardsCard from "@/components/patient-portal/RewardsCard";
import PortalTabsSection from "@/components/patient-portal/PortalTabsSection";
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'react-toastify';

const PatientPortal = () => {
  const navigate = useNavigate();
  const { auth, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("labReports");
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        console.log("Checking auth session in PatientPortal");
        const { data: { session } } = await supabase.auth.getSession();
        const storedAuth = localStorage.getItem('authState');
        
        // Either Supabase session or localStorage auth is valid
        if (!session && (!storedAuth || !JSON.parse(storedAuth).isAuthenticated)) {
          console.log("No valid session found, redirecting to login");
          toast.error("Please log in to access the patient portal");
          navigate("/login");
        } else {
          console.log("Valid session found in PatientPortal");
          setIsLoading(false);
          
          // Check for last sync time
          fetchLastSyncTime();
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        toast.error("Authentication error. Please try logging in again.");
        navigate("/login");
      }
    };
    
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    // If we have auth data and needs profile, redirect to profile creation
    if (auth.isAuthenticated && auth.needsProfile) {
      console.log("User needs to complete profile, redirecting");
      navigate("/create-profile");
    }
  }, [auth, navigate]);

  const fetchLastSyncTime = async () => {
    try {
      const { data, error } = await supabase
        .from('ehr_integration')
        .select('last_sync_time')
        .eq('is_active', true)
        .limit(1)
        .single();
      
      if (!error && data) {
        setLastSyncTime(data.last_sync_time);
      }
    } catch (error) {
      console.error("Error fetching last sync time:", error);
    }
  };

  const handleSyncWithEHR = async () => {
    if (!auth.userId) {
      toast.error("User ID not found. Please log in again.");
      return;
    }

    setIsSyncing(true);
    try {
      const response = await supabase.functions.invoke('ehr-sync', {
        body: { patientId: auth.userId }
      });
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      if (response.data.success) {
        toast.success("Successfully synced with EHR system");
        setLastSyncTime(response.data.syncTime);
      } else {
        toast.error(response.data.message || "Failed to sync with EHR system");
      }
    } catch (error) {
      console.error("Error syncing with EHR:", error);
      toast.error("Error connecting to EHR system. Please try again later.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("You have been logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out. Please try again.");
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

  // Also verify authentication from the auth context
  if (!auth.isAuthenticated) {
    console.log("Not authenticated in render block, redirecting to login");
    navigate("/login");
    return null;
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
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  onClick={handleSyncWithEHR} 
                  disabled={isSyncing}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? 'Syncing...' : 'Sync with EHR'}
                </Button>
                <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
            
            {lastSyncTime && (
              <div className="mb-4 text-sm text-gray-500">
                Last synchronized with EHR: {new Date(lastSyncTime).toLocaleString()}
              </div>
            )}
            
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
