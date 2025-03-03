
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, Download, FileText, LineChart, MoreHorizontal } from "lucide-react";

// Mock data for lab reports
const mockLabReports = [
  {
    id: "1",
    date: "2023-11-15",
    type: "Blood Test",
    doctor: "Dr. Sharma",
    status: "Completed",
    results: [
      { parameter: "Hemoglobin", value: 14.2, unit: "g/dL", normalRange: "13.5-17.5" },
      { parameter: "WBC", value: 6.8, unit: "10^3/µL", normalRange: "4.5-11.0" },
      { parameter: "RBC", value: 5.1, unit: "10^6/µL", normalRange: "4.5-5.9" },
      { parameter: "Platelets", value: 250, unit: "10^3/µL", normalRange: "150-450" },
      { parameter: "Glucose", value: 88, unit: "mg/dL", normalRange: "70-100" },
    ],
  },
  {
    id: "2",
    date: "2023-09-03",
    type: "Blood Test",
    doctor: "Dr. Patel",
    status: "Completed",
    results: [
      { parameter: "Hemoglobin", value: 13.8, unit: "g/dL", normalRange: "13.5-17.5" },
      { parameter: "WBC", value: 7.2, unit: "10^3/µL", normalRange: "4.5-11.0" },
      { parameter: "RBC", value: 4.9, unit: "10^6/µL", normalRange: "4.5-5.9" },
      { parameter: "Platelets", value: 230, unit: "10^3/µL", normalRange: "150-450" },
      { parameter: "Glucose", value: 95, unit: "mg/dL", normalRange: "70-100" },
    ],
  },
  {
    id: "3",
    date: "2023-06-22",
    type: "Lipid Panel",
    doctor: "Dr. Sharma",
    status: "Completed",
    results: [
      { parameter: "Total Cholesterol", value: 185, unit: "mg/dL", normalRange: "<200" },
      { parameter: "HDL", value: 55, unit: "mg/dL", normalRange: ">40" },
      { parameter: "LDL", value: 110, unit: "mg/dL", normalRange: "<130" },
      { parameter: "Triglycerides", value: 100, unit: "mg/dL", normalRange: "<150" },
    ],
  },
  {
    id: "4",
    date: "2023-02-10",
    type: "Blood Test",
    doctor: "Dr. Kumar",
    status: "Completed",
    results: [
      { parameter: "Hemoglobin", value: 13.5, unit: "g/dL", normalRange: "13.5-17.5" },
      { parameter: "WBC", value: 8.1, unit: "10^3/µL", normalRange: "4.5-11.0" },
      { parameter: "RBC", value: 4.7, unit: "10^6/µL", normalRange: "4.5-5.9" },
      { parameter: "Platelets", value: 210, unit: "10^3/µL", normalRange: "150-450" },
      { parameter: "Glucose", value: 98, unit: "mg/dL", normalRange: "70-100" },
    ],
  },
];

// Helper function to determine if a value is within normal range
const isWithinRange = (value: number, range: string): boolean => {
  // Handle ranges with a single boundary like "<200" or ">40"
  if (range.startsWith("<")) {
    const upperLimit = parseFloat(range.substring(1));
    return value < upperLimit;
  }
  if (range.startsWith(">")) {
    const lowerLimit = parseFloat(range.substring(1));
    return value > lowerLimit;
  }

  // Handle ranges with both lower and upper bounds like "13.5-17.5"
  const [lowerStr, upperStr] = range.split("-");
  const lower = parseFloat(lowerStr);
  const upper = parseFloat(upperStr);
  return value >= lower && value <= upper;
};

// Helper function to get the percentage change between two values
const getPercentageChange = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

const LabReportsTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewingReport, setViewingReport] = useState<any>(null);
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

  // Get reports by ID
  const getReportById = (id: string) => {
    return mockLabReports.find((report) => report.id === id);
  };

  // Get selected reports
  const getSelectedReports = () => {
    return selectedReports.map((id) => getReportById(id)).filter(Boolean);
  };

  // Group reports by type
  const groupedReports = selectedReports.reduce((acc: any, reportId: string) => {
    const report = getReportById(reportId);
    if (!report) return acc;
    
    if (!acc[report.type]) {
      acc[report.type] = [];
    }
    acc[report.type].push(report);
    return acc;
  }, {});

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="w-full md:w-1/3">
          <Input
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={isComparing ? "default" : "outline"}
            onClick={handleToggleCompare}
            className="whitespace-nowrap"
          >
            {isComparing ? "Cancel Compare" : "Compare Reports"}
          </Button>
          {isComparing && (
            <Button
              onClick={handleCompare}
              disabled={selectedReports.length < 2}
              className="whitespace-nowrap"
            >
              <LineChart className="h-4 w-4 mr-2" />
              Compare Selected ({selectedReports.length})
            </Button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {isComparing && <TableHead className="w-12"></TableHead>}
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Ordered By</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isComparing ? 6 : 5} className="text-center py-8">
                  No lab reports found.
                </TableCell>
              </TableRow>
            ) : (
              filteredReports.map((report) => (
                <TableRow key={report.id}>
                  {isComparing && (
                    <TableCell>
                      <Checkbox
                        checked={selectedReports.includes(report.id)}
                        onCheckedChange={() => handleReportSelect(report.id)}
                      />
                    </TableCell>
                  )}
                  <TableCell>{report.date}</TableCell>
                  <TableCell>{report.type}</TableCell>
                  <TableCell>{report.doctor}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        report.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {report.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleViewReport(report)}>
                          <FileText className="h-4 w-4 mr-2" />
                          View Report
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Single Report View Dialog */}
      <Dialog open={viewingReport !== null} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Lab Report Details</DialogTitle>
            <DialogDescription>
              {viewingReport?.type} - {viewingReport?.date}
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[60vh]">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Date</p>
                <p>{viewingReport?.date}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Ordered By</p>
                <p>{viewingReport?.doctor}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Type</p>
                <p>{viewingReport?.type}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <p>{viewingReport?.status}</p>
              </div>
            </div>

            <h3 className="font-medium text-lg mb-3">Results</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parameter</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Normal Range</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {viewingReport?.results.map((result: any, index: number) => {
                  const isNormal = isWithinRange(result.value, result.normalRange);
                  return (
                    <TableRow key={index}>
                      <TableCell>{result.parameter}</TableCell>
                      <TableCell>
                        {result.value} {result.unit}
                      </TableCell>
                      <TableCell>{result.normalRange}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            isNormal
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {isNormal ? "Normal" : "Abnormal"}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reports Comparison Dialog */}
      <Dialog open={showCompareDialog} onOpenChange={setShowCompareDialog}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Report Comparison</DialogTitle>
            <DialogDescription>
              Comparing {selectedReports.length} reports
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[70vh]">
            {Object.keys(groupedReports).map((reportType) => (
              <Card key={reportType} className="mb-6">
                <CardHeader>
                  <CardTitle>{reportType}</CardTitle>
                  <CardDescription>
                    Comparing {groupedReports[reportType].length} reports from{" "}
                    {groupedReports[reportType][0].date} to{" "}
                    {
                      groupedReports[reportType][
                        groupedReports[reportType].length - 1
                      ].date
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Parameter</TableHead>
                        {groupedReports[reportType]
                          .sort(
                            (a: any, b: any) =>
                              new Date(b.date).getTime() - new Date(a.date).getTime()
                          )
                          .map((report: any) => (
                            <TableHead key={report.id}>
                              {report.date}
                            </TableHead>
                          ))}
                        <TableHead>Change</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {groupedReports[reportType][0].results.map(
                        (result: any, paramIndex: number) => {
                          // Get all values for this parameter
                          const sortedReports = [...groupedReports[reportType]].sort(
                            (a: any, b: any) =>
                              new Date(b.date).getTime() - new Date(a.date).getTime()
                          );
                          
                          const parameterValues = sortedReports.map(
                            (report: any) => report.results[paramIndex]
                          );
                          
                          // Calculate change between most recent and previous result
                          const percentChange = parameterValues.length > 1 
                            ? getPercentageChange(
                                Number(parameterValues[0].value), 
                                Number(parameterValues[1].value)
                              )
                            : 0;
                          
                          return (
                            <TableRow key={paramIndex}>
                              <TableCell>{result.parameter}</TableCell>
                              {parameterValues.map((paramResult: any, i: number) => {
                                const isNormal = isWithinRange(
                                  Number(paramResult.value),
                                  paramResult.normalRange
                                );
                                return (
                                  <TableCell key={i}>
                                    <div className="flex items-center">
                                      <span
                                        className={
                                          isNormal
                                            ? "text-gray-900"
                                            : "text-red-600 font-medium"
                                        }
                                      >
                                        {paramResult.value}
                                      </span>
                                      <span className="text-gray-500 ml-1">
                                        {paramResult.unit}
                                      </span>
                                    </div>
                                  </TableCell>
                                );
                              })}
                              <TableCell>
                                {parameterValues.length > 1 && (
                                  <div
                                    className={`flex items-center ${
                                      percentChange > 0
                                        ? "text-green-600"
                                        : percentChange < 0
                                          ? "text-red-600"
                                          : "text-gray-500"
                                    }`}
                                  >
                                    {percentChange > 0 ? "+" : ""}
                                    {percentChange.toFixed(1)}%
                                  </div>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        }
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LabReportsTab;
