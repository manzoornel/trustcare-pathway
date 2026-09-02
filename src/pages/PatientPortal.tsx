import React, { useState } from "react";
import { useAuth } from "@/contexts/auth";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { AlertCircle, Mail, User, Phone, Hash, CheckCircle, Menu, ArrowLeft, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmailVerificationModal } from "@/components/patient-portal/EmailVerificationModal";
import { PortalSidebar } from "@/components/patient-portal/PortalSidebar";
import { DashboardCard } from "@/components/patient-portal/DashboardCard";
import PortalTabsSection from "@/components/patient-portal/PortalTabsSection";
import { PatientSwitcher } from "@/components/patient-portal/PatientSwitcher";
import { DownloadAppBanner } from "@/components/patient-portal/DownloadAppBanner";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
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
  const [patientInfoOpen, setPatientInfoOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Read email verification status from localStorage
  const isEmailVerified = localStorage.getItem("is_email_verified") === "1" || 
                           localStorage.getItem("is_email_verified") === "true";
  
  // Read patient data from localStorage (fallback if auth context doesn't have it)
  const patientData = {
    name: auth.name || localStorage.getItem("patient_name") || "User",
    hospitalId: auth.hospitalId || localStorage.getItem("uhid") || "Not Set",
    phone: auth.phone || localStorage.getItem("phone") || "Not provided",
    email: auth.email || localStorage.getItem("email") || "Not provided"
  };

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

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <ToastContainer />

      {/* Desktop Sidebar */}
      {!isMobile && (
        <PortalSidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onLogout={handleLogout}
        />
      )}

      {/* Mobile Sidebar in Sheet */}
      {isMobile && (
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="p-0 w-72 border-0">
            <PortalSidebar
              activeTab={activeTab}
              onTabChange={handleTabChange}
              onLogout={handleLogout}
            />
          </SheetContent>
        </Sheet>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white border-b border-neutral-200 sticky top-0 z-10">
          <div className="px-4 md:px-8 py-4 flex items-center justify-between">
            {/* Mobile Menu Button */}
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(true)}
                className="mr-3 text-neutral-700 hover:bg-neutral-100"
              >
                <Menu className="h-6 w-6" />
              </Button>
            )}
            {/* Welcome Message */}
            <div className="flex-1">
              <h1 className="text-lg md:text-2xl font-display font-bold text-neutral-900">
                Welcome, {patientData.name.split(" ")[0]}
              </h1>
              <p className="text-xs md:text-sm text-neutral-500">രോഗി പോർട്ടലിലേക്ക് സ്വാഗതം</p>
            </div>

            {/* User Info Card */}
            <div className="hidden md:flex items-center gap-3 px-4 py-2.5 rounded-full bg-teal-50 border border-teal-100">
              <div className="h-9 w-9 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                {patientData.name ? patientData.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900 leading-tight">{patientData.name}</p>
                <p className="text-xs text-neutral-500 leading-tight">ID: {patientData.hospitalId}</p>
              </div>
            </div>
          </div>

          {/* Email Verification Banner */}
          {!isEmailVerified && (
            <div className="mx-4 md:mx-8 mb-4 p-3 md:p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-3 animate-fade-in">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-xs md:text-sm text-amber-900">
                  Email Verification Required / ഇമെയിൽ പരിശോധന ആവശ്യമാണ്
                </p>
                <p className="text-xs text-amber-700 mt-0.5 hidden md:block">
                  Please verify your email to access all features
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => setShowVerificationModal(true)}
                className="rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs"
              >
                <Mail className="h-3 w-3 md:h-4 md:w-4 md:mr-2" />
                <span className="hidden md:inline">Verify Now</span>
              </Button>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="p-4 md:p-8">
          {/* Patient Switcher - Allow switching between family members */}
          <PatientSwitcher
            currentPatientId={localStorage.getItem("patient_id") || ""}
          />

          {activeTab === "dashboard" ? (
            <>
              <DownloadAppBanner />

              {/* Patient Info Card — collapsed by default so the page opens
                  on Quick Access, not a wall of fields nobody needs yet */}
              <div className="mb-6 rounded-2xl bg-white border border-neutral-200 shadow-sm overflow-hidden">
                <button
                  onClick={() => setPatientInfoOpen((v) => !v)}
                  className="w-full flex items-center justify-between gap-3 p-4 md:p-5 text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
                      <User className="h-4.5 w-4.5 text-teal-600" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-sm font-bold text-neutral-900">Patient Information</h2>
                      <p className="text-xs text-neutral-500 truncate">
                        {patientData.name} &middot; ID: {patientData.hospitalId}
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 text-neutral-400 shrink-0 transition-transform ${
                      patientInfoOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {patientInfoOpen && (
                <div className="px-5 pb-5 md:px-6 md:pb-6 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50">
                    <User className="h-5 w-5 text-teal-600 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-neutral-500">Name</p>
                      <p className="text-sm font-semibold text-neutral-900 truncate">{patientData.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50">
                    <Hash className="h-5 w-5 text-teal-600 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-neutral-500">Hospital ID</p>
                      <p className="text-sm font-semibold text-neutral-900 truncate">{patientData.hospitalId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50">
                    <Phone className="h-5 w-5 text-teal-600 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-neutral-500">Phone</p>
                      <p className="text-sm font-semibold text-neutral-900 truncate">{patientData.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50">
                    <Mail className="h-5 w-5 text-teal-600 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-neutral-500">Email</p>
                      <p className="text-sm font-semibold text-neutral-900 truncate">{patientData.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50">
                    <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-neutral-500">Status</p>
                      <p className="text-sm font-semibold text-green-700">Active Patient</p>
                    </div>
                  </div>
                </div>
                </div>
                )}
              </div>

              {/* Dashboard Cards Grid */}
              <h2 className="text-base font-bold text-neutral-900 mb-4">Quick Access / പെട്ടെന്നുള്ള പ്രവേശനം</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
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
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-4 md:p-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab("dashboard")}
                className="mb-4 -ml-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
              >
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                Back to Dashboard
              </Button>
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
        defaultEmail={patientData.email}
      />
    </div>
  );
};

export default PatientPortal;
