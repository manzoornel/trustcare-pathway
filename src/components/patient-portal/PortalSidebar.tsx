import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FlaskConical,
  Pill,
  FileText,
  Calendar,
  MessageSquare,
  CreditCard,
  Mail,
  Settings,
  LogOut,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import doctorUncleLogo from "@/assets/doctor-uncle-logo.jpg";

interface PortalSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

const menuItems = [
  { id: "labReports", icon: FlaskConical, label: "Lab Reports", labelMl: "ലാബ് റിപ്പോർട്ടുകൾ" },
  { id: "medications", icon: Pill, label: "Medication Summary", labelMl: "മരുന്നുകൾ" },
  { id: "medicalSummary", icon: FileText, label: "Medical Summary", labelMl: "മെഡിക്കൽ സംഗ്രഹം" },
  { id: "appointments", icon: Calendar, label: "Appointments", labelMl: "അപ്പോയിന്റ്മെന്റുകൾ" },
  { id: "chatAI", icon: MessageSquare, label: "Chat with AI", labelMl: "AI ചാറ്റ്" },
  { id: "billing", icon: CreditCard, label: "Billing", labelMl: "ബില്ലിംഗ്" },
  { id: "messages", icon: Mail, label: "Messages", labelMl: "സന്ദേശങ്ങൾ" },
  { id: "settings", icon: Settings, label: "Settings", labelMl: "ക്രമീകരണങ്ങൾ" },
];

export const PortalSidebar: React.FC<PortalSidebarProps> = ({
  activeTab,
  onTabChange,
  onLogout,
}) => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-72 flex flex-col border-r border-neutral-200 bg-white">
      {/* Logo Section */}
      <div className="p-6 border-b border-neutral-200">
        <div className="flex items-center gap-3 mb-2">
          <img
            src={doctorUncleLogo}
            alt="Doctor Uncle"
            className="h-14 w-14 rounded-full object-contain border border-neutral-200 p-1"
          />
          <div>
            <h1 className="text-lg font-display font-bold text-neutral-900 leading-tight">
              DOCTOR UNCLE
            </h1>
            <p className="text-[11px] text-neutral-500 uppercase tracking-wide">
              The Complete Family Clinic
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-1">
          <div className="px-3 py-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Patient Portal
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-teal-600 text-white shadow-sm"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                }`}
              >
                <Icon className={`h-5 w-5 shrink-0 ${isActive ? "text-white" : "text-teal-600"}`} />
                <div className="flex-1 text-left min-w-0">
                  <div className={`text-sm font-medium truncate ${isActive ? "text-white" : ""}`}>
                    {item.label}
                  </div>
                  <div className={`text-xs truncate ${isActive ? "text-white/70" : "text-neutral-400"}`}>{item.labelMl}</div>
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-neutral-200 space-y-1">
        <Button
          variant="ghost"
          className="w-full justify-start text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
          onClick={() => navigate("/")}
        >
          <Home className="h-4 w-4 mr-3" />
          Home
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4 mr-3" />
          Log out
        </Button>
      </div>
    </div>
  );
};
