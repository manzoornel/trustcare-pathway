
import React, { useState, useEffect } from "react";
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { LabReport } from "./lab-reports/mockData";
import SearchAndFilter from "./lab-reports/SearchAndFilter";
import LabReportsTable from "./lab-reports/LabReportsTable";
import ReportViewDialog from "./lab-reports/ReportViewDialog";
import ReportComparisonDialog from "./lab-reports/ReportComparisonDialog";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import EHRDataSyncButton from "./EHRDataSyncButton";

const LabReportsTab: React.FC = () => {
  const { auth } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewingReport, setViewingReport] = useState<LabReport | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [showCompareDialog, setShowCompareDialog] = useState(false);
  const [labReports, setLabReports] = useState<LabReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch lab reports from Supabase
  useEffect(() => {
    async function fetchLabReports() {
      try {
        setIsLoading(true);
        setError(null);
        
        if (!auth.userId) {
          throw new Error("User not authenticated");
        }
        
        const { data, error } = await supabase
          .from('lab_reports')
          .select('*')
          .eq('patient_id', auth.userId);
          
        if (error) {
          throw error;
        }
        
        console.log('Lab reports fetched:', data);
        
        // Convert the data to LabReport format
        const formattedData: LabReport[] = data.map((report: any) => ({
          id: report.id,
          ehrReferenceId: report.ehr_reference_id,
          date: report.date,
          type: report.type,
          doctor: report.doctor,
          status: report.status,
          results: report.results || []
        }));
        
        setLabReports(formattedData);
      } catch (error: any) {
        console.error('Error fetching lab reports:', error);
        setError(error.message || "Failed to load lab reports");
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchLabReports();
  }, [auth.userId]);

  // Filter reports based on search term
  const filteredReports = labReports.filter(
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

  const handleSyncComplete = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('lab_reports')
        .select('*')
        .eq('patient_id', auth.userId);
        
      if (error) {
        throw error;
      }
      
      // Convert the data to LabReport format
      const formattedData: LabReport[] = data.map((report: any) => ({
        id: report.id,
        ehrReferenceId: report.ehr_reference_id,
        date: report.date,
        type: report.type,
        doctor: report.doctor,
        status: report.status,
        results: report.results || []
      }));
      
      setLabReports(formattedData);
    } catch (error: any) {
      console.error('Error refreshing lab reports:', error);
      setError(error.message || "Failed to refresh lab reports");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {labReports.length === 0 && !isLoading && !error && (
        <Alert variant="default" className="mb-4">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>
            No lab reports found. If you've recently connected your EHR account, try syncing your data.
            <div className="mt-2">
              <EHRDataSyncButton 
                ehrPatientId={auth.hospitalId} 
                onSyncComplete={handleSyncComplete}
              />
            </div>
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>
            {error}
            <div className="mt-2">
              <Button size="sm" variant="secondary" onClick={handleSyncComplete}>
                Retry
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

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
        reports={labReports}
        open={showCompareDialog}
        onOpenChange={setShowCompareDialog}
      />
    </div>
  );
};

export default LabReportsTab;
