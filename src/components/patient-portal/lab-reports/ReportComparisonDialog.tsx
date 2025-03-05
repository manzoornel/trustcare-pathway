
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LabReport } from "./mockData";
import { getPercentageChange, isWithinRange } from "./utils";

interface ReportComparisonDialogProps {
  selectedReports: string[];
  reports: LabReport[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ReportComparisonDialog: React.FC<ReportComparisonDialogProps> = ({
  selectedReports,
  reports,
  open,
  onOpenChange,
}) => {
  // Get reports by ID
  const getReportById = (id: string) => {
    return reports.find((report) => report.id === id);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
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
  );
};

export default ReportComparisonDialog;
