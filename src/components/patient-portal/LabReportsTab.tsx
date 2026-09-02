import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/contexts/auth";
import SearchAndFilter from "./lab-reports/SearchAndFilter";
import LabReportsTable from "./lab-reports/LabReportsTable";
import ReportViewDialog from "./lab-reports/ReportViewDialog";
import ReportComparisonDialog from "./lab-reports/ReportComparisonDialog";
import { AlertCircle, Edit, HeartPulse, Droplet, TestTube2, Waves, Filter, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LAB_CATEGORIES, testMatchesCategory, LabCategory } from "./lab-reports/labCategories";

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  lipid: HeartPulse,
  sugar: Droplet,
  thyroid: Waves,
  renal: Filter,
  liver: Shield,
  cbc: TestTube2,
};

type LabReportsTabProps = {
  openPatientInfoEdit?: () => void;
};

const LabReportsTab: React.FC<LabReportsTabProps> = ({
  openPatientInfoEdit,
}) => {
  const { auth } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewingReport, setViewingReport] = useState<any | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [selectedReports, setSelectedReports] = useState<any[]>([]);
  const [selectedReportsids, setSelectedReportsids] = useState<any[]>([]);

  const [showCompareDialog, setShowCompareDialog] = useState(false);
  const [activeCategory, setActiveCategory] = useState<LabCategory | null>(null);
  const [labReports, setLabReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(true);

  const fetchLabReports = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      const response = await axios.post(
        "https://druncle.grandissolutions.in/patientApp/fetchLabReports",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response, "called");

      const { data } = response.data;

      if (data != null) {
        const formattedData = data.map((report: any, index: number) => ({
          id: `${index}`,
          visitId: report.visit_id,
          doctor: report.doctor_name,
          date: report.visit_date,
          pdfUrl: report.lab_reports?.fullPath || "",
          type: report.type || "General",
          // Align with API response structure for comparison dialog
          result: report.lab_reports?.result || [],
        }));

        // Sort the formatted data by date in descending order (newest first)
        const sortedData = formattedData.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateB.getTime() - dateA.getTime();
        });

        setLabReports(sortedData);
      }
    } catch (error: any) {
      console.error("Error fetching lab reports:", error);
      setError(error.message || "Failed to load lab reports");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const emailVerified = localStorage.getItem("is_email_verified");
    setIsEmailVerified(emailVerified === "1" || emailVerified === "true");
  }, []);

  useEffect(() => {
    if (isEmailVerified) {
      fetchLabReports();
    }
  }, [auth.userId, isEmailVerified]);

  const filteredReports = labReports
    .filter(
      (report) =>
        report.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.date.includes(searchTerm)
    )
    .sort((a, b) => {
      // Sort by date in descending order (newest first)
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });

  const handleViewReport = (report: any) => {
    setViewingReport(report);
  };

  const handleCloseDialog = () => {
    setViewingReport(null);
  };

  const handleToggleCompare = () => {
    setIsComparing(!isComparing);
    setSelectedReports([]);
  };
  const handleReportSelect = (report: any) => {
    const isSelected = selectedReportsids.includes(report.visitId);
    if (isSelected) {
      // Deselect
      setSelectedReportsids((prev) =>
        prev.filter((id) => id !== report.visitId)
      );
      setSelectedReports((prev) =>
        prev.filter((r) => r.visitId !== report.visitId)
      );
    } else {
      // Select
      setSelectedReportsids((prev) => [...prev, report.visitId]);
      setSelectedReports((prev) => [...prev, report]);
    }
  };

  const handleCompare = () => {
    if (selectedReports.length < 2) return;
    setActiveCategory(null);
    setShowCompareDialog(true);
  };

  // Which quick-compare panels actually have data for this patient — no
  // point showing "Blood Sugar" if it was never tested.
  const availableCategories = LAB_CATEGORIES.filter((category) =>
    labReports.some((report) =>
      (report.result || []).some((r: any) =>
        testMatchesCategory(r.detail_description, category)
      )
    )
  );

  const handleQuickCompare = (category: LabCategory) => {
    const matchingReports = labReports.filter((report) =>
      (report.result || []).some((r: any) =>
        testMatchesCategory(r.detail_description, category)
      )
    );
    setActiveCategory(category);
    setSelectedReports(matchingReports);
    setShowCompareDialog(true);
  };

  return (
    <div className="relative">
      {!isEmailVerified && (
        <div className="absolute inset-0 bg-white bg-opacity-80 z-10 flex flex-col items-center justify-center text-center p-6 rounded-md">
          <h2 className="text-xl font-semibold mb-2 text-red-600">
            Email Not Verified
          </h2>
          <p className="text-gray-700 mb-4">
            Please verify your email to access lab reports.
          </p>
          <Button
            onClick={() => {
              openPatientInfoEdit && openPatientInfoEdit();
              window.scrollTo(250, 250);
            }}
          >
            Verify email
          </Button>
        </div>
      )}

      <div
        className={`${
          !isEmailVerified ? "blur-sm pointer-events-none select-none" : ""
        }`}
      >
        {/* Mobile-friendly heading */}
        <div className="md:hidden mb-6">
          <h2 className="text-xl font-semibold mb-2">Lab Reports</h2>
          <p className="text-sm text-gray-600">
            View and compare your medical test results
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>
              {error}
              <div className="mt-2">
                <Button size="sm" variant="secondary" onClick={fetchLabReports}>
                  Retry
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {availableCategories.length > 0 && (
          <div className="mb-5 p-4 md:p-5 rounded-2xl border border-neutral-200 bg-white">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">
              Quick Compare / പെട്ടെന്ന് താരതമ്യം ചെയ്യുക
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {availableCategories.map((category) => {
                const Icon = CATEGORY_ICONS[category.id] ?? TestTube2;
                return (
                  <button
                    key={category.id}
                    onClick={() => handleQuickCompare(category)}
                    className="group flex flex-col items-center text-center gap-2 p-4 rounded-xl border border-neutral-200 bg-white hover:border-teal-300 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all"
                  >
                    <div className="flex items-center justify-center h-11 w-11 rounded-xl bg-teal-50 group-hover:bg-teal-100">
                      <Icon className="h-5 w-5 text-teal-600" />
                    </div>
                    <span className="text-xs md:text-sm font-semibold text-neutral-900 leading-tight">
                      {category.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="p-4 md:p-5 rounded-2xl border border-neutral-200 bg-white">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">
            All Reports / എല്ലാ റിപ്പോർട്ടുകളും
          </p>
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
            isLoading={isLoading}
            onToggleSelectAll={(selectAll) => {
              if (selectAll) {
                // Select all currently visible filtered reports
                const newIds = filteredReports.map((r) => r.visitId);
                setSelectedReportsids((prev) =>
                  Array.from(new Set([...prev, ...newIds]))
                );
                // Add full report objects, avoid duplicates by visitId
                setSelectedReports((prev) => {
                  const existingById = new Map(
                    prev.map((r: any) => [r.visitId, r])
                  );
                  filteredReports.forEach((r) => existingById.set(r.visitId, r));
                  return Array.from(existingById.values());
                });
              } else {
                // Deselect all currently visible filtered reports
                const visibleIds = new Set(filteredReports.map((r) => r.visitId));
                setSelectedReportsids((prev) =>
                  prev.filter((id) => !visibleIds.has(id))
                );
                setSelectedReports((prev) =>
                  prev.filter((r) => !visibleIds.has(r.visitId))
                );
              }
            }}
          />
        </div>

        <ReportViewDialog
          report={viewingReport}
          open={!!viewingReport}
          onOpenChange={handleCloseDialog}
        />

        <ReportComparisonDialog
          selectedReports={selectedReports}
          reports={labReports}
          open={showCompareDialog}
          onOpenChange={setShowCompareDialog}
          categoryKeywords={activeCategory?.keywords}
          categoryLabel={activeCategory?.label}
        />
      </div>
    </div>
  );
};

export default LabReportsTab;
