
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
  selectedReports: string[];
  onReportSelect: (reportId: string) => void;
  onViewReport: (report: LabReport) => void;
  isLoading?: boolean;
}

const LabReportsTable: React.FC<LabReportsTableProps> = ({
  reports,
  isComparing,
  selectedReports,
  onReportSelect,
  onViewReport,
  isLoading = false
}) => {
  return (
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
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={isComparing ? 6 : 5} className="text-center py-8">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
                <div className="mt-2 text-sm text-gray-500">Loading lab reports...</div>
              </TableCell>
            </TableRow>
          ) : reports.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isComparing ? 6 : 5} className="text-center py-8">
                No lab reports found.
              </TableCell>
            </TableRow>
          ) : (
            reports.map((report) => (
              <TableRow key={report.id}>
                {isComparing && (
                  <TableCell>
                    <Checkbox
                      checked={selectedReports.includes(report.id)}
                      onCheckedChange={() => onReportSelect(report.id)}
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
                      <DropdownMenuItem onClick={() => onViewReport(report)}>
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
  );
};

export default LabReportsTable;
