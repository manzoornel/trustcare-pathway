import React from "react";
import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  icon: LucideIcon;
  title: string;
  titleMl: string;
  onClick: () => void;
  comingSoon?: boolean;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  icon: Icon,
  title,
  titleMl,
  onClick,
  comingSoon = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={comingSoon}
      className={`relative group p-6 rounded-2xl border-2 transition-all duration-300 ${
        comingSoon
          ? "border-muted-foreground/20 bg-muted/30 cursor-not-allowed opacity-50"
          : "border-primary bg-white/10 backdrop-blur-md hover:bg-primary/20 hover:border-primary hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1"
      }`}
      style={{ 
        borderColor: comingSoon ? undefined : "hsl(var(--color-card-border))",
      }}
    >
      {/* Icon */}
      <div className="flex justify-center mb-4">
        <div
          className={`p-4 rounded-xl ${
            comingSoon ? "bg-muted" : "bg-transparent"
          }`}
        >
          <Icon
            className="h-12 w-12"
            style={{ 
              color: comingSoon ? "hsl(var(--muted-foreground))" : "hsl(var(--color-primary))",
              strokeWidth: 1.5,
            }}
          />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-base font-bold text-white text-center mb-1 uppercase tracking-wide">
        {title}
      </h3>
      <p className="text-xs text-white/70 text-center">{titleMl}</p>

      {comingSoon && (
        <div className="absolute top-3 right-3 px-2 py-1 bg-muted rounded text-xs font-medium text-muted-foreground">
          Coming Soon
        </div>
      )}
    </button>
  );
};
