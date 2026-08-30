import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink } from "lucide-react";

const ReportViewDialog: React.FC<{
  report: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ report, open, onOpenChange }) => {
  if (!report) return null;

  const fullPdfUrl = report.pdfUrl.replace(
    "/var/www/html/mirrors/Dr_Mirror/public",
    "https://druncle.grandissolutions.in/patientApp/"
  );

  const downloadPdf = async () => {
    try {
      const res = await fetch(fullPdfUrl, { mode: "cors" });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `lab-report-${report.visitId ?? ""}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      window.open(fullPdfUrl, "_blank", "noopener");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="flex-shrink-0 px-4 py-3 border-b">
          <div className="flex items-center justify-between gap-2 pr-8">
            <DialogTitle className="text-base sm:text-lg truncate">
              Report from {report.date}
            </DialogTitle>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(fullPdfUrl, "_blank", "noopener")}
                className="hidden sm:inline-flex"
              >
                <ExternalLink className="h-4 w-4 mr-1.5" />
                Open full size
              </Button>
              <Button size="sm" onClick={downloadPdf}>
                <Download className="h-4 w-4 mr-1.5" />
                Download
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Mobile-only full-size link, since a report PDF is very hard to read
            inside a small embedded frame on a phone */}
        <div className="sm:hidden px-4 py-2 border-b bg-neutral-50">
          <button
            onClick={() => window.open(fullPdfUrl, "_blank", "noopener")}
            className="text-sm text-cyan-700 font-medium underline underline-offset-2"
          >
            Having trouble reading this? Open it full-size instead →
          </button>
        </div>

        <div className="flex-1 min-h-0 bg-neutral-50">
          <iframe
            src={fullPdfUrl}
            className="w-full h-full border-0"
            title="Medical Report"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportViewDialog;
