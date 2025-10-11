import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import PortalTopBar from "@/components/patient-portal/portal-redesign/PortalTopBar";
import SideDrawer from "@/components/patient-portal/portal-redesign/SideDrawer";
import PortalGrid from "@/components/patient-portal/portal-redesign/PortalGrid";
import PortalTabsSection from "@/components/patient-portal/PortalTabsSection";

const PatientPortal: React.FC = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("labReports");
  const [showGrid, setShowGrid] = useState(true);

  // Mock user data for demo (when no auth)
  const demoUser = {
    name: auth?.name || "Demo Patient",
    hospitalId: auth?.hospitalId || "H12345",
    email: auth?.email || "demo@example.com",
    phone: auth?.phone || "1234567890",
  };

  // Handle incoming state for tab navigation
  useEffect(() => {
    const state = location.state as { activeTab?: string };
    if (state?.activeTab) {
      setActiveTab(state.activeTab);
      setShowGrid(false);
      // Clear the state
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

  const handleLogout = () => {
    toast.info(
      ({ closeToast }) => (
        <div className="flex flex-col">
          <p>Are you sure you want to logout?</p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => {
                localStorage.clear();
                toast.dismiss();
                navigate("/login");
              }}
              className="px-3 py-1 bg-red-600 text-white rounded"
            >
              Yes
            </button>
            <button
              onClick={closeToast}
              className="px-3 py-1 bg-gray-500 text-white rounded"
            >
              No
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };

  const handleFeatureClick = (feature: string) => {
    setShowGrid(false);
  };

  return (
    <div
      className="du-portal-container min-h-screen"
      style={{
        backgroundColor: "var(--du-bg)",
        "--du-bg": "#203238",
        "--du-surface": "#253943",
        "--du-teal": "#34C9C7",
        "--du-teal-2": "#58D7D6",
        "--du-text": "#FFFFFF",
        "--du-muted": "#94A3B8",
        "--du-radius": "20px",
        "--du-shadow": "0 8px 24px rgba(0,0,0,.35)",
      } as React.CSSProperties}
    >
      <ToastContainer />

      {/* Top Bar */}
      <PortalTopBar
        onMenuClick={() => setIsDrawerOpen(true)}
        notificationCount={3}
      />

      {/* Side Drawer */}
      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      {showGrid ? (
        <>
          {/* Hero Section */}
          <div className="flex flex-col items-center py-8 px-4">
            {/* Logo placeholder - replace with actual Doctor Uncle logo */}
            <div className="w-24 h-24 mb-4 rounded-full bg-[var(--du-teal)] flex items-center justify-center">
              <div className="text-white text-4xl font-bold">DU</div>
            </div>

            <h2 className="text-2xl font-bold text-[var(--du-text)] mb-2 text-center">
              Welcome to Patient Portal
            </h2>

            <p className="text-[var(--du-muted)] text-sm mb-6 text-center">
              {demoUser.name}
            </p>

            <Button
              onClick={handleLogout}
              className="bg-[var(--du-teal)] hover:bg-[var(--du-teal-2)] text-white font-semibold px-8 py-6 rounded-full transition-all hover:shadow-[0_0_20px_rgba(52,201,199,0.4)]"
            >
              <LogOut className="mr-2 h-5 w-5" />
              Log out
            </Button>
          </div>

          {/* Feature Grid */}
          <PortalGrid onFeatureClick={handleFeatureClick} />
        </>
      ) : (
        <div className="container mx-auto py-6 px-4">
          {/* Back button */}
          <Button
            variant="ghost"
            onClick={() => setShowGrid(true)}
            className="mb-4 text-[var(--du-text)] hover:bg-[var(--du-teal)]/10"
          >
            ← Back to Dashboard
          </Button>

          {/* Tabs Section */}
          <PortalTabsSection
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>
      )}
    </div>
  );
};

export default PatientPortal;
