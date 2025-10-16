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
    <div className="h-screen w-72 flex flex-col border-r" style={{ backgroundColor: "hsl(var(--color-sidebar))" }}>
      {/* Logo Section */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3 mb-2">
          <img
            src={doctorUncleLogo}
            alt="Doctor Uncle"
            className="h-16 w-16 rounded-full object-contain bg-white/10 p-1"
          />
        </div>
        <h1 className="text-2xl font-display font-bold text-white">
          DOCTOR UNCLE
        </h1>
        <p className="text-xs text-white/70 mt-1 uppercase tracking-wide">
          The Complete Family Clinic
        </p>
      </div>

      {/* Navigation Menu */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-1">
          <div className="px-3 py-2 text-xs font-semibold text-white/50 uppercase tracking-wider">
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
                    ? "bg-primary text-white shadow-lg"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-primary"}`} />
                <div className="flex-1 text-left">
                  <div className={`text-sm font-medium ${isActive ? "text-white" : ""}`}>
                    {item.label}
                  </div>
                  <div className="text-xs text-white/50">{item.labelMl}</div>
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-white/10 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
          onClick={() => navigate("/")}
        >
          <Home className="h-4 w-4 mr-3" />
          Home
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4 mr-3" />
          Log out
        </Button>
      </div>
    </div>
  );
};
