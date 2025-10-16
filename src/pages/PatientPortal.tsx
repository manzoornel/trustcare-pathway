import React, { useState } from "react";
import { useAuth } from "@/contexts/auth";
import PatientInfoCard from "@/components/patient-portal/PatientInfoCard";
import PortalTabsSection from "@/components/patient-portal/PortalTabsSection";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Home, LogOut, Mail, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmailVerificationModal } from "@/components/patient-portal/EmailVerificationModal";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const PatientPortal: React.FC = () => {
  const { auth } = useAuth();
  const [activeTab, setActiveTab] = useState("labReports");
  const [openPatientInfoEdit, setOpenPatientInfoEdit] = useState<
    (() => void) | null
  >(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const navigate = useNavigate();

  // Mock email verification status - replace with actual auth state
  const isEmailVerified = false; // Change based on actual auth state

  const handleClick = () => {
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "hsl(var(--color-secondary))" }}>
      {/* Header Section */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg"
                style={{ backgroundColor: "hsl(var(--color-primary))" }}
              >
                DU
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-display font-bold text-foreground">
                  Doctor Uncle
                </h1>
                <p className="text-sm text-muted-foreground">Patient Portal</p>
              </div>
            </div>

            {/* User Info & Actions */}
            <div className="flex items-center gap-3 md:gap-4">
              {/* User Profile */}
              <div className="flex items-center gap-3 bg-muted/50 px-4 py-2 rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarFallback
                    className="font-semibold text-white"
                    style={{ backgroundColor: "hsl(var(--color-primary))" }}
                  >
                    {auth.name ? getInitials(auth.name) : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-foreground">
                    {auth.name || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {auth.hospitalId || "ID Not Set"}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/")}
                className="hidden md:flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Home
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClick}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </div>
          </div>

          {/* Email Verification Banner */}
          {!isEmailVerified && (
            <div
              className="mt-4 p-4 rounded-lg border-l-4 flex items-start gap-3 animate-fade-in"
              style={{
                backgroundColor: "hsl(var(--color-warning) / 0.1)",
                borderColor: "hsl(var(--color-warning))",
              }}
            >
              <AlertCircle
                className="h-5 w-5 flex-shrink-0 mt-0.5"
                style={{ color: "hsl(var(--color-warning))" }}
              />
              <div className="flex-1">
                <p className="font-semibold text-sm text-foreground">
                  Email Verification Required
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Please verify your email address to access all features and receive important
                  updates.
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => setShowVerificationModal(true)}
                className="flex-shrink-0 rounded-lg"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(var(--color-primary)) 0%, hsl(var(--color-accent)) 100%)",
                }}
              >
                <Mail className="h-4 w-4 mr-2" />
                Verify Now
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-6 px-4">
        <ToastContainer />

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <PatientInfoCard
              patientName={auth.name || ""}
              hospitalId={auth.hospitalId}
              phone={auth.phone}
              email={auth.email}
              onRegisterOpenEdit={(fn) => setOpenPatientInfoEdit(() => fn)}
            />
            {/* Optional future components like RewardsCard */}
          </div>

          {/* Right Column */}
          <div className="md:col-span-2">
            <PortalTabsSection
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              openPatientInfoEdit={openPatientInfoEdit || undefined}
            />
          </div>
        </div>
      </div>

      {/* Email Verification Modal */}
      <EmailVerificationModal
        open={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        defaultEmail={auth.email}
      />
    </div>
  );
};

export default PatientPortal;
