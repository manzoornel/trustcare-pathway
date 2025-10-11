import React from "react";
import { Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PortalTopBarProps {
  onMenuClick: () => void;
  notificationCount?: number;
}

const PortalTopBar: React.FC<PortalTopBarProps> = ({
  onMenuClick,
  notificationCount = 0,
}) => {
  return (
    <div className="du-portal-topbar sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-[var(--du-bg)] border-b border-[var(--du-teal-2)]/20">
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        className="text-[var(--du-text)] hover:bg-[var(--du-teal)]/10"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </Button>

      <h1 className="text-lg font-semibold text-[var(--du-text)] tracking-wide">
        Patient Portal
      </h1>

      <Button
        variant="ghost"
        size="icon"
        className="text-[var(--du-text)] hover:bg-[var(--du-teal)]/10 relative"
        aria-label="Notifications"
      >
        <Bell className="h-6 w-6" />
        {notificationCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-[var(--du-teal)] text-white border-0">
            {notificationCount > 9 ? "9+" : notificationCount}
          </Badge>
        )}
      </Button>
    </div>
  );
};

export default PortalTopBar;
