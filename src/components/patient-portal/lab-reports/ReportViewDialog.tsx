const ReportViewDialog: React.FC<{
  report: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ report, open, onOpenChange }) => {
  if (!report) return null;

  const fullPdfUrl = report.pdfUrl.replace(
    "/var/www/html/mirrors/Dr_Mirror/public",
    "https://clinictrial.grandissolutions.in/patientApp/"
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
    <div className={`fixed inset-0 bg-black/50 ${open ? "block" : "hidden"}`}>
      <div className="bg-white rounded-lg w-11/12 max-w-4xl mx-auto mt-3 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Report from {report.date}</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={downloadPdf}
              className="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Download
            </button>
            <button
              onClick={() => onOpenChange(false)}
              className="px-3 py-1.5 rounded bg-gray-600 text-white hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
        <iframe
          src={fullPdfUrl}
          width="100%"
          height="600px"
          title="Medical Report"
        />
      </div>
    </div>
  );
};

export default ReportViewDialog;
