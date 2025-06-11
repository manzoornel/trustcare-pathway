import React, { Fragment, useState } from "react";
import { useAuth } from "@/contexts/auth";
import PatientInfoCard from "@/components/patient-portal/PatientInfoCard";
import PortalTabsSection from "@/components/patient-portal/PortalTabsSection";
import RewardsCard from "@/components/patient-portal/RewardsCard";
import EHRConnectionPanel from "@/components/patient-portal/EHRConnectionPanel";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Dialog, Transition } from "@headlessui/react";
import { instance } from "../axios";

const PatientPortal: React.FC = () => {
  const { auth } = useAuth();
  const [activeTab, setActiveTab] = useState("labReports");
  const [modelflage, setmodelflag] = useState(false);
  const [otp, setotp] = useState("");
  const navigate = useNavigate();
  const handleClick = () => {
    toast.info(
      ({ closeToast }) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p>Are you sure you want to logout?</p>
          <div style={{ marginTop: "10px" }}>
            <button
              onClick={() => {
                localStorage.clear();
                toast.dismiss();
                navigate("/login");
              }}
              style={{
                marginRight: "10px",
                padding: "6px 12px",
                backgroundColor: "red",
                color: "white",
                border: "none",
                borderRadius: "4px",
              }}
            >
              Yes
            </button>
            <button
              onClick={closeToast}
              style={{
                padding: "6px 12px",
                backgroundColor: "gray",
                color: "white",
                border: "none",
                borderRadius: "4px",
              }}
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
    <div className="container mx-auto py-8 px-4">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "29px",
        }}
      >
        <h1 className="text-3xl font-bold   text-center md:text-left">
          Welcome to Patient Portal
        </h1>
        <button
          onClick={() => handleClick()}
          style={{
            padding: "10px",
            background: "white",
            border: " red solid 1px",
            borderRadius: "6px",
            color: "red",
          }}
        >
          Log out
        </button>
      </div>

      <ToastContainer />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6 md:order-1 order-1">
          <div className="order-1 md:order-none">
            <PatientInfoCard
              patientName={auth.name || ""}
              hospitalId={auth.hospitalId}
              phone={auth.phone}
              email={auth.email}
            />
          </div>
          <div className="order-3 md:order-none">{/* <RewardsCard /> */}</div>
          {/* <EHRConnectionPanel /> */}
        </div>

        {/* Right Column */}
        <div className="md:col-span-2 order-2 md:order-2">
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
