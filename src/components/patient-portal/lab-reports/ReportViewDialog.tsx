const ReportViewDialog: React.FC<{
  report: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ report, open, onOpenChange }) => {
  if (!report) return null;

  const fullPdfUrl = report.pdfUrl.replace(
    "/var/www/html/mirrors/Dr_Mirror/public",
    "http://103.99.205.192:8008/mirrors/Dr_Mirror/public"
  );

  return (
    <div className={`fixed inset-0 bg-black/50 ${open ? "block" : "hidden"}`}>
      <div className="bg-white rounded-lg w-11/12 max-w-4xl mx-auto mt-3 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Report from {report.date}</h2>
          <button onClick={() => onOpenChange(false)}>Close</button>
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
