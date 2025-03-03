
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown, XCircle } from "lucide-react";

// Sample data for lab reports with additional test result values
const labReports = [
  { 
    id: 1, 
    name: "Complete Blood Count", 
    date: "2023-12-15", 
    status: "Completed", 
    doctor: "Dr. Sarah Johnson",
    results: [
      { parameter: "Hemoglobin", value: "14.2", unit: "g/dL", range: "13.0-17.0" },
      { parameter: "White Blood Cells", value: "7.5", unit: "10^3/µL", range: "4.5-11.0" },
      { parameter: "Platelets", value: "250", unit: "10^3/µL", range: "150-450" },
      { parameter: "Red Blood Cells", value: "5.2", unit: "10^6/µL", range: "4.5-5.9" }
    ]
  },
  { 
    id: 2, 
    name: "Lipid Profile", 
    date: "2023-11-20", 
    status: "Completed", 
    doctor: "Dr. Michael Chen",
    results: [
      { parameter: "Total Cholesterol", value: "185", unit: "mg/dL", range: "<200" },
      { parameter: "HDL Cholesterol", value: "55", unit: "mg/dL", range: ">40" },
      { parameter: "LDL Cholesterol", value: "110", unit: "mg/dL", range: "<130" },
      { parameter: "Triglycerides", value: "120", unit: "mg/dL", range: "<150" }
    ]
  },
  { 
    id: 3, 
    name: "Complete Blood Count", 
    date: "2023-10-05", 
    status: "Completed", 
    doctor: "Dr. Sarah Johnson",
    results: [
      { parameter: "Hemoglobin", value: "13.8", unit: "g/dL", range: "13.0-17.0" },
      { parameter: "White Blood Cells", value: "6.9", unit: "10^3/µL", range: "4.5-11.0" },
      { parameter: "Platelets", value: "230", unit: "10^3/µL", range: "150-450" },
      { parameter: "Red Blood Cells", value: "5.0", unit: "10^6/µL", range: "4.5-5.9" }
    ]
  },
];

const LabReportsTab = () => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonReports, setComparisonReports] = useState([]);
  const [showCompareDialog, setShowCompareDialog] = useState(false);

  const handleViewDetails = (report) => {
    setSelectedReport(report);
  };

  const handleCloseDetails = () => {
    setSelectedReport(null);
  };

  const toggleCompareMode = () => {
    if (isComparing) {
      // Exit compare mode
      setIsComparing(false);
      setComparisonReports([]);
    } else {
      // Enter compare mode
      setIsComparing(true);
    }
  };

  const toggleReportSelection = (report) => {
    if (!isComparing) return;

    const isAlreadySelected = comparisonReports.some(r => r.id === report.id);
    
    if (isAlreadySelected) {
      setComparisonReports(comparisonReports.filter(r => r.id !== report.id));
    } else {
      // Only allow comparing same type of reports
      if (comparisonReports.length === 0 || comparisonReports[0].name === report.name) {
        setComparisonReports([...comparisonReports, report]);
      }
    }
  };

  const handleCompare = () => {
    if (comparisonReports.length >= 2) {
      setShowCompareDialog(true);
    }
  };

  const isReportSelected = (report) => {
    return comparisonReports.some(r => r.id === report.id);
  };

  // Group reports by name for comparison
  const compareReports = () => {
    const sortedReports = [...comparisonReports].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Get all unique parameters from all reports
    const allParameters = new Set();
    sortedReports.forEach(report => {
      report.results.forEach(result => {
        allParameters.add(result.parameter);
      });
    });

    return {
      parameters: Array.from(allParameters),
      reports: sortedReports
    };
  };

  const comparisonData = comparisonReports.length >= 2 ? compareReports() : null;

  // Get trend direction for a parameter between reports
  const getTrendDirection = (parameter, index) => {
    if (index === 0) return null; // No trend for first report
    
    const currentReport = comparisonData.reports[index];
    const previousReport = comparisonData.reports[index - 1];
    
    const currentResult = currentReport.results.find(r => r.parameter === parameter);
    const previousResult = previousReport.results.find(r => r.parameter === parameter);
    
    if (!currentResult || !previousResult) return null;
    
    const current = parseFloat(currentResult.value);
    const previous = parseFloat(previousResult.value);
    
    if (isNaN(current) || isNaN(previous)) return null;
    
    if (current > previous) return "up";
    if (current < previous) return "down";
    return "same";
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Lab Reports</CardTitle>
            <CardDescription>
              View all your laboratory test results
            </CardDescription>
          </div>
          <Button 
            variant={isComparing ? "destructive" : "secondary"} 
            onClick={toggleCompareMode}
          >
            {isComparing ? "Cancel Comparison" : "Compare Reports"}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-3 border-b">Test Name</th>
                  <th className="text-left p-3 border-b">Date</th>
                  <th className="text-left p-3 border-b">Status</th>
                  <th className="text-left p-3 border-b">Doctor</th>
                  <th className="text-left p-3 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {labReports.map((report) => (
                  <tr 
                    key={report.id} 
                    className={`hover:bg-gray-50 ${isComparing && isReportSelected(report) ? 'bg-blue-50' : ''}`}
                    onClick={() => isComparing ? toggleReportSelection(report) : null}
                  >
                    <td className="p-3 border-b">{report.name}</td>
                    <td className="p-3 border-b">{report.date}</td>
                    <td className="p-3 border-b">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        {report.status}
                      </span>
                    </td>
                    <td className="p-3 border-b">{report.doctor}</td>
                    <td className="p-3 border-b">
                      {isComparing ? (
                        <Button
                          variant={isReportSelected(report) ? "default" : "outline"}
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleReportSelection(report);
                          }}
                        >
                          {isReportSelected(report) ? "Selected" : "Select"}
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          className="text-primary hover:underline text-sm"
                          onClick={() => handleViewDetails(report)}
                        >
                          View Details
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
        {isComparing && (
          <CardFooter className="flex justify-between">
            <div>
              <span className="text-sm text-gray-500">
                {comparisonReports.length} reports selected
              </span>
              {comparisonReports.length > 0 && comparisonReports.length < 2 && (
                <span className="text-sm text-amber-500 ml-2">
                  Select at least one more {comparisonReports[0]?.name} report to compare
                </span>
              )}
            </div>
            <Button
              disabled={comparisonReports.length < 2}
              onClick={handleCompare}
            >
              Compare Selected Reports
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* Lab Report Details Dialog */}
      {selectedReport && (
        <Dialog open={!!selectedReport} onOpenChange={handleCloseDetails}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedReport.name}</DialogTitle>
              <DialogDescription>
                Test Date: {selectedReport.date} | Doctor: {selectedReport.doctor}
              </DialogDescription>
            </DialogHeader>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Parameter</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Reference Range</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedReport.results.map((result, index) => (
                    <TableRow key={index}>
                      <TableCell>{result.parameter}</TableCell>
                      <TableCell>{result.value}</TableCell>
                      <TableCell>{result.unit}</TableCell>
                      <TableCell>{result.range}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Comparison Dialog */}
      {comparisonData && (
        <Dialog open={showCompareDialog} onOpenChange={setShowCompareDialog}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Comparing {comparisonData.reports[0].name} Reports</DialogTitle>
              <DialogDescription>
                Comparing {comparisonData.reports.length} reports from {comparisonData.reports[0].date} to {comparisonData.reports[comparisonData.reports.length - 1].date}
              </DialogDescription>
              <Button 
                variant="ghost" 
                className="absolute right-4 top-4"
                onClick={() => setShowCompareDialog(false)}
                size="icon"
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </DialogHeader>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Parameter</TableHead>
                    {comparisonData.reports.map((report, index) => (
                      <TableHead key={index}>{report.date}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comparisonData.parameters.map((parameter, paramIndex) => (
                    <TableRow key={paramIndex}>
                      <TableCell className="font-medium">{parameter}</TableCell>
                      {comparisonData.reports.map((report, reportIndex) => {
                        const result = report.results.find(r => r.parameter === parameter);
                        const trendDirection = getTrendDirection(parameter, reportIndex);
                        
                        return (
                          <TableCell key={reportIndex} className="relative">
                            {result?.value || 'N/A'} {result?.unit}
                            {trendDirection && (
                              <span className="ml-2">
                                {trendDirection === "up" && (
                                  <ArrowUpDown className="inline h-4 w-4 text-red-500 rotate-180" />
                                )}
                                {trendDirection === "down" && (
                                  <ArrowUpDown className="inline h-4 w-4 text-green-500 rotate-0" />
                                )}
                              </span>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default LabReportsTab;
