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
      className={`relative group flex flex-col items-center text-center p-4 md:p-5 rounded-2xl border transition-all duration-200 ${
        comingSoon
          ? "border-neutral-200 bg-neutral-50 cursor-not-allowed opacity-60"
          : "border-neutral-200 bg-white hover:border-teal-300 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm"
      }`}
    >
      {/* Icon */}
      <div
        className={`flex items-center justify-center h-12 w-12 md:h-14 md:w-14 rounded-xl mb-2.5 ${
          comingSoon ? "bg-neutral-200" : "bg-teal-50 group-hover:bg-teal-100"
        }`}
      >
        <Icon
          className={`h-6 w-6 md:h-7 md:w-7 ${comingSoon ? "text-neutral-400" : "text-teal-600"}`}
          strokeWidth={1.75}
        />
      </div>

      {/* Title */}
      <h3 className="text-xs md:text-sm font-bold text-neutral-900 leading-tight">
        {title}
      </h3>
      <p className="text-[11px] text-neutral-500 mt-0.5">{titleMl}</p>

      {comingSoon && (
        <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-neutral-200 rounded text-[10px] font-semibold text-neutral-500">
          SOON
        </div>
      )}
    </button>
  );
};
