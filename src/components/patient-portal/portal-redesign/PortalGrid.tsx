import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Pill,
  Activity,
  ClipboardList,
  Calendar,
  MessageSquare,
  Users,
  FileCheck,
  Briefcase,
} from "lucide-react";
import FeatureCard from "./FeatureCard";

interface PortalGridProps {
  onFeatureClick?: (feature: string) => void;
}

const mainFeatures = [
  { icon: FileText, label: "Lab Reports", key: "lab-reports" },
  { icon: Pill, label: "Medication Summary", key: "medications" },
  { icon: Activity, label: "Vital Reports", key: "vitals" },
  { icon: ClipboardList, label: "Medical Summary", key: "medical-summary" },
  { icon: Calendar, label: "Appointments", key: "appointments", badge: 2 },
  { icon: MessageSquare, label: "Chat with AI", key: "ai-chat" },
];

const comingSoonFeatures = [
  { icon: Users, label: "Family Members" },
  { icon: FileCheck, label: "Health Records" },
  { icon: Briefcase, label: "Insurance" },
];

const PortalGrid: React.FC<PortalGridProps> = ({ onFeatureClick }) => {
  const navigate = useNavigate();

  const handleFeatureClick = (key: string) => {
    if (onFeatureClick) {
      onFeatureClick(key);
    }

    // Map features to tab values in PortalTabsSection
    const tabMapping: Record<string, string> = {
      "lab-reports": "labReports",
      "medications": "medications",
      "vitals": "vitalsReports",
      "medical-summary": "medicalSummary",
      "appointments": "appointments",
      "ai-chat": "aiChat",
    };

    const tabValue = tabMapping[key];
    if (tabValue) {
      // Navigate with state to set the active tab
      navigate("/patient-portal", { state: { activeTab: tabValue } });
    }
  };

  return (
    <div className="space-y-8 px-4 pb-8">
      {/* Main feature grid */}
      <div className="grid grid-cols-2 gap-4">
        {mainFeatures.map((feature) => (
          <FeatureCard
            key={feature.key}
            icon={feature.icon}
            label={feature.label}
            onClick={() => handleFeatureClick(feature.key)}
            badge={feature.badge}
          />
        ))}
      </div>

      {/* Coming soon section */}
      <div>
        <h3 className="text-[var(--du-muted)] text-xs font-semibold uppercase tracking-wider mb-4 px-2">
          Coming Soon
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {comingSoonFeatures.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              label={feature.label}
              comingSoon
              disabled
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortalGrid;
