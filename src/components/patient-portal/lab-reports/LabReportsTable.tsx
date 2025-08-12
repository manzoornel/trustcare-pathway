import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal, FileText, Download } from "lucide-react";
import { LabReport } from "./mockData";

interface LabReportsTableProps {
  reports: LabReport[];
  isComparing: boolean;
  selectedReports: LabReport[];
  onReportSelect: (report: LabReport) => void;
  onViewReport: (report: LabReport) => void;
  isLoading?: boolean;
  onToggleSelectAll?: (selectAll: boolean) => void;
}

const LabReportsTable: React.FC<LabReportsTableProps> = ({
  reports,
  isComparing,
  selectedReports,
  onReportSelect,
  onViewReport,
  isLoading = false,
  onToggleSelectAll,
}) => {
  const visibleVisitIds = new Set(reports.map((r) => r.visitId));
  const selectedVisitIds = new Set(selectedReports.map((r) => r.visitId));
  const allVisibleSelected =
    reports.length > 0 && reports.every((r) => selectedVisitIds.has(r.visitId));
  const someVisibleSelected =
    !allVisibleSelected && reports.some((r) => selectedVisitIds.has(r.visitId));
  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      {/* Horizontal scroll container for mobile */}
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              {isComparing && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      allVisibleSelected
                        ? true
                        : someVisibleSelected
                        ? "indeterminate"
                        : false
                    }
                    onCheckedChange={(checked) =>
                      onToggleSelectAll && onToggleSelectAll(checked === true)
                    }
                    aria-label="Select all visible lab reports"
                  />
                </TableHead>
              )}
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Ordered By</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={isComparing ? 5 : 4}
                  className="text-center py-8"
                >
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    Loading lab reports...
                  </div>
                </TableCell>
              </TableRow>
            ) : reports.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={isComparing ? 5 : 4}
                  className="text-center py-8"
                >
                  No lab reports found.
                </TableCell>
              </TableRow>
            ) : (
              reports.map((report) => {
                const isSelected = selectedReports.some(
                  (r) => r.visitId === report.visitId
                );

                return (
                  <TableRow key={report.id}>
                    {isComparing && (
                      <TableCell>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => onReportSelect(report)}
                        />
                      </TableCell>
                    )}
                    <TableCell className="whitespace-nowrap">
                      {report.date}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {report.type}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {report.doctor}
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
                          <DropdownMenuItem
                            onClick={() => onViewReport(report)}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            View Report
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LabReportsTable;
