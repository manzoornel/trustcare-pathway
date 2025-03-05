
import React, { useState } from "react";
import { mockLabReports, LabReport } from "./lab-reports/mockData";
import SearchAndFilter from "./lab-reports/SearchAndFilter";
import LabReportsTable from "./lab-reports/LabReportsTable";
import ReportViewDialog from "./lab-reports/ReportViewDialog";
import ReportComparisonDialog from "./lab-reports/ReportComparisonDialog";

const LabReportsTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewingReport, setViewingReport] = useState<LabReport | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [showCompareDialog, setShowCompareDialog] = useState(false);

  // Filter reports based on search term
  const filteredReports = mockLabReports.filter(
    (report) =>
      report.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.date.includes(searchTerm)
  );

  const handleViewReport = (report: LabReport) => {
    setViewingReport(report);
  };

  const handleCloseDialog = () => {
    setViewingReport(null);
  };

  const handleToggleCompare = () => {
    setIsComparing(!isComparing);
    setSelectedReports([]);
  };

  const handleReportSelect = (reportId: string) => {
    if (selectedReports.includes(reportId)) {
      setSelectedReports(selectedReports.filter((id) => id !== reportId));
    } else {
      setSelectedReports([...selectedReports, reportId]);
    }
  };

  const handleCompare = () => {
    if (selectedReports.length < 2) {
      return;
    }
    setShowCompareDialog(true);
  };

  return (
    <div>
      <SearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        isComparing={isComparing}
        onToggleCompare={handleToggleCompare}
        onCompare={handleCompare}
        selectedCount={selectedReports.length}
      />

      <LabReportsTable
        reports={filteredReports}
        isComparing={isComparing}
        selectedReports={selectedReports}
        onReportSelect={handleReportSelect}
        onViewReport={handleViewReport}
      />

      {/* Single Report View Dialog */}
      <ReportViewDialog
        report={viewingReport}
        open={viewingReport !== null}
        onOpenChange={handleCloseDialog}
      />

      {/* Reports Comparison Dialog */}
      <ReportComparisonDialog
        selectedReports={selectedReports}
        reports={mockLabReports}
        open={showCompareDialog}
        onOpenChange={setShowCompareDialog}
      />
    </div>
  );
};

export default LabReportsTab;
