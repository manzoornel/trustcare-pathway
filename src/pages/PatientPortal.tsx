import React, { useState } from "react";
import { useAuth } from "@/contexts/auth";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { AlertCircle, Mail, User, Phone, Hash, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmailVerificationModal } from "@/components/patient-portal/EmailVerificationModal";
import { PortalSidebar } from "@/components/patient-portal/PortalSidebar";
import { DashboardCard } from "@/components/patient-portal/DashboardCard";
import PortalTabsSection from "@/components/patient-portal/PortalTabsSection";
import {
  FlaskConical,
  Pill,
  FileText,
  Calendar,
  MessageSquare,
  CreditCard,
  Mail as MailIcon,
  HelpCircle,
} from "lucide-react";

const PatientPortal: React.FC = () => {
  const { auth } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [openPatientInfoEdit, setOpenPatientInfoEdit] = useState<
    (() => void) | null
  >(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const navigate = useNavigate();

  // Mock email verification status - replace with actual auth state
  const isEmailVerified = false;

  const dashboardItems = [
    { icon: FlaskConical, title: "Lab Reports", titleMl: "ലാബ് റിപ്പോർട്ടുകൾ", tab: "labReports" },
    { icon: Pill, title: "Medication Summary", titleMl: "മരുന്നുകൾ", tab: "medications" },
    { icon: FileText, title: "Medical Summary", titleMl: "മെഡിക്കൽ സംഗ്രഹം", tab: "medicalSummary" },
    { icon: Calendar, title: "Appointments", titleMl: "അപ്പോയിന്റ്മെന്റുകൾ", tab: "appointments" },
    { icon: MessageSquare, title: "Chat with AI", titleMl: "AI ചാറ്റ്", tab: "chatAI" },
    { icon: HelpCircle, title: "Coming Soon", titleMl: "ഉടൻ വരുന്നു", tab: "comingSoon", comingSoon: true },
  ];

  const handleLogout = () => {
    toast.info(
      ({ closeToast }) => (
        <div className="flex flex-col">
          <p className="font-semibold mb-2">Confirm Logout</p>
          <p className="text-sm mb-3">Are you sure you want to logout?</p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                localStorage.clear();
                toast.dismiss();
                navigate("/login");
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Yes, Logout
            </button>
            <button
              onClick={closeToast}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
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

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "hsl(var(--color-dark-bg))" }}>
      <ToastContainer />
      
      {/* Sidebar */}
      <PortalSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white/5 backdrop-blur-sm border-b border-white/10 sticky top-0 z-10">
          <div className="px-8 py-4 flex items-center justify-between">
            {/* Welcome Message */}
            <div>
              <h1 className="text-2xl font-display font-bold text-white">
                Welcome to Patient Portal
              </h1>
              <p className="text-sm text-white/60">രോഗി പോർട്ടലിലേക്ക് സ്വാഗതം</p>
            </div>

            {/* User Info Card */}
            <div className="flex items-center gap-4 px-4 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
                {auth.name ? auth.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div>
                <p className="text-sm font-bold text-white">{auth.name || "User"}</p>
                <p className="text-xs text-white/60">ID: {auth.hospitalId || "Not Set"}</p>
              </div>
            </div>
          </div>

          {/* Email Verification Banner */}
          {!isEmailVerified && (
            <div className="mx-8 mb-4 p-4 rounded-xl bg-warning/20 backdrop-blur-sm border border-warning/40 flex items-center gap-3 animate-fade-in">
              <AlertCircle className="h-5 w-5 text-warning flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-sm text-white">
                  Email Verification Required / ഇമെയിൽ പരിശോധന ആവശ്യമാണ്
                </p>
                <p className="text-xs text-white/80 mt-0.5">
                  Please verify your email to access all features
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => setShowVerificationModal(true)}
                className="rounded-lg bg-warning hover:bg-warning/90 text-white font-semibold"
              >
                <Mail className="h-4 w-4 mr-2" />
                Verify Now
              </Button>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="p-8">
          {activeTab === "dashboard" ? (
            <>
              {/* Patient Info Card */}
              <div className="mb-8 p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-primary/30 shadow-xl">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Patient Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                    <User className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-white/60">Name</p>
                      <p className="text-sm font-semibold text-white">{auth.name || "Not provided"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                    <Hash className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-white/60">Hospital ID</p>
                      <p className="text-sm font-semibold text-white">{auth.hospitalId || "Not set"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                    <Phone className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-white/60">Phone</p>
                      <p className="text-sm font-semibold text-white">{auth.phone || "Not provided"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-white/60">Email</p>
                      <p className="text-sm font-semibold text-white">{auth.email || "Not provided"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <div>
                      <p className="text-xs text-white/60">Status</p>
                      <p className="text-sm font-semibold text-success">Active Patient</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dashboard Cards Grid */}
              <h2 className="text-xl font-bold text-white mb-6">Quick Access / പെട്ടെന്നുള്ള പ്രവേശനം</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dashboardItems.map((item) => (
                  <DashboardCard
                    key={item.tab}
                    icon={item.icon}
                    title={item.title}
                    titleMl={item.titleMl}
                    onClick={() => !item.comingSoon && setActiveTab(item.tab)}
                    comingSoon={item.comingSoon}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <PortalTabsSection
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                openPatientInfoEdit={openPatientInfoEdit || undefined}
              />
            </div>
          )}
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
