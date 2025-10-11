import React from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  User,
  LayoutDashboard,
  Calendar,
  MessageSquare,
  CreditCard,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/auth";
import { toast } from "react-toastify";

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: "Patient Portal", path: "/patient-portal", active: true },
  { icon: Calendar, label: "Appointments", path: "/appointments" },
  { icon: MessageSquare, label: "Messages", path: "/messages", badge: 3 },
  { icon: CreditCard, label: "Billing", path: "/billing" },
  { icon: Settings, label: "Settings", path: "/settings" },
  { icon: HelpCircle, label: "Help & Support", path: "/help" },
];

const SideDrawer: React.FC<SideDrawerProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { auth } = useAuth();

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

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={`du-portal-drawer fixed top-0 left-0 h-full w-[80%] max-w-sm bg-[var(--du-surface)] z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Navigation menu"
      >
        <div className="flex flex-col h-full">
          {/* Close button */}
          <div className="flex justify-end p-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-[var(--du-text)] hover:bg-[var(--du-teal)]/10"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Profile section */}
          <div className="px-6 pb-6 border-b border-[var(--du-teal-2)]/20">
            <div className="flex items-center gap-3">
              <Avatar className="h-14 w-14 border-2 border-[var(--du-teal)]">
                <AvatarFallback className="bg-[var(--du-teal)] text-white text-lg">
                  {auth?.name?.charAt(0).toUpperCase() || "D"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-[var(--du-text)] font-semibold text-base">
                  {auth?.name || "Demo Patient"}
                </p>
                <p className="text-[var(--du-muted)] text-sm">
                  UHID: {auth?.hospitalId || "H12345"}
                </p>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-full transition-all ${
                    item.active
                      ? "bg-[var(--du-teal)] text-white shadow-lg"
                      : "text-[var(--du-text)] hover:bg-[var(--du-teal)]/10"
                  }`}
                  aria-label={item.label}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-[var(--du-teal)] text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t border-[var(--du-teal-2)]/20">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-full text-red-400 hover:bg-red-400/10 transition-all"
              aria-label="Log out"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Log out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideDrawer;
