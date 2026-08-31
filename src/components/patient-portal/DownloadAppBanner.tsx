import React from "react";
import { Download, Share, PlusSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePwaInstall } from "@/hooks/usePwaInstall";
import doctorUncleLogo from "@/assets/doctor-uncle-logo.jpg";

export const DownloadAppBanner: React.FC = () => {
  const { canPromptInstall, isIosShareInstall, installed, promptInstall } =
    usePwaInstall();

  if (installed || (!canPromptInstall && !isIosShareInstall)) return null;

  return (
    <div className="mb-6 rounded-2xl bg-gradient-to-r from-teal-600 to-teal-500 p-4 md:p-5 flex items-center gap-4 text-white">
      <img
        src={doctorUncleLogo}
        alt="Doctor Uncle"
        className="h-14 w-14 rounded-xl object-cover bg-white shrink-0 hidden sm:block"
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-sm md:text-base">
          Download Your Patient App
        </h3>
        <p className="text-xs md:text-sm text-teal-50">
          നിങ്ങളുടെ പേഷ്യന്റ് ആപ്പ് ഡൗൺലോഡ് ചെയ്യുക &middot; faster access from your home screen, no app store needed
        </p>
        {isIosShareInstall && !canPromptInstall && (
          <p className="text-xs text-teal-50 mt-1.5 flex items-center gap-1 flex-wrap">
            Tap <Share className="h-3.5 w-3.5 inline" /> Share, then{" "}
            <PlusSquare className="h-3.5 w-3.5 inline" /> "Add to Home Screen"
          </p>
        )}
      </div>
      {canPromptInstall && (
        <Button
          onClick={promptInstall}
          className="bg-white text-teal-700 hover:bg-teal-50 shrink-0"
          size="sm"
        >
          <Download className="h-4 w-4 mr-1.5" />
          Install
        </Button>
      )}
    </div>
  );
};

export default DownloadAppBanner;
