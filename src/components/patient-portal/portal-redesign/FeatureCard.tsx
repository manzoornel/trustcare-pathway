import React from "react";
import { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FeatureCardProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  badge?: number;
  disabled?: boolean;
  comingSoon?: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  label,
  onClick,
  badge,
  disabled = false,
  comingSoon = false,
}) => {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`du-feature-card relative flex flex-col items-center justify-center gap-3 p-6 rounded-[20px] bg-[var(--du-surface)] border-2 border-transparent transition-all duration-200 ${
        disabled || comingSoon
          ? "opacity-40 cursor-not-allowed"
          : "hover:border-[var(--du-teal)] hover:shadow-[0_0_20px_rgba(52,201,199,0.3)] active:scale-[0.98]"
      }`}
      style={{
        minHeight: "160px",
        boxShadow: "var(--du-shadow)",
      }}
      aria-label={label}
      role="button"
    >
      {badge && badge > 0 && !comingSoon && (
        <Badge className="absolute top-3 right-3 h-6 w-6 flex items-center justify-center p-0 text-xs bg-[var(--du-teal)] text-white border-0">
          {badge > 9 ? "9+" : badge}
        </Badge>
      )}

      {comingSoon && (
        <div className="absolute top-3 right-3 bg-[var(--du-muted)] text-[var(--du-bg)] text-[10px] font-bold px-2 py-1 rounded">
          SOON
        </div>
      )}

      <Icon className="h-10 w-10 text-[var(--du-teal)]" strokeWidth={1.5} />
      <span className="text-[var(--du-text)] text-sm font-semibold uppercase tracking-[0.04em] text-center">
        {label}
      </span>
    </button>
  );
};

export default FeatureCard;
