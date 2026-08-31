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
import { MoreHorizontal, FileText, Download, ChevronRight } from "lucide-react";
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
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
      {/* Horizontal scroll container for mobile */}
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="bg-neutral-50 hover:bg-neutral-50">
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
              <TableHead className="text-neutral-500 font-semibold">Date</TableHead>
              <TableHead className="text-neutral-500 font-semibold">Type</TableHead>
              <TableHead className="text-neutral-500 font-semibold">Ordered By</TableHead>
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
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600"></div>
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
                  <TableRow
                    key={report.id}
                    className={!isComparing ? "cursor-pointer hover:bg-teal-50/60" : undefined}
                    onClick={
                      !isComparing ? () => onViewReport(report) : undefined
                    }
                  >
                    {isComparing && (
                      <TableCell>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => onReportSelect(report)}
                        />
                      </TableCell>
                    )}
                    <TableCell className="whitespace-nowrap font-medium">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center justify-center h-7 w-7 rounded-lg bg-teal-50 shrink-0">
                          <FileText className="h-3.5 w-3.5 text-teal-600" />
                        </span>
                        {report.date}
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-neutral-600">
                      {report.type}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-neutral-600">
                      {report.doctor}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      {isComparing ? (
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
                      ) : (
                        <ChevronRight className="h-4 w-4 text-neutral-300" />
                      )}
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
