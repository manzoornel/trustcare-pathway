import React, { useState } from "react";
import { useAuth } from "@/contexts/auth";
import PatientInfoCard from "@/components/patient-portal/PatientInfoCard";
import PortalTabsSection from "@/components/patient-portal/PortalTabsSection";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const PatientPortal: React.FC = () => {
  const { auth } = useAuth();
  const [activeTab, setActiveTab] = useState("labReports");
  const navigate = useNavigate();

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

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-center md:text-left">
          Welcome to Patient Portal
        </h1>
        <button
          onClick={handleClick}
          className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50 transition"
        >
          Log out
        </button>
      </div>

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
          />
          {/* Optional future components like RewardsCard */}
        </div>

        {/* Right Column */}
        <div className="md:col-span-2">
          <PortalTabsSection
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>
      </div>
    </div>
  );
};

export default PatientPortal;
