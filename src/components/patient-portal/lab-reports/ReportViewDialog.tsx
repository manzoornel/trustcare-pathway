
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LabReport } from "./mockData";
import { isWithinRange } from "./utils";

interface ReportViewDialogProps {
  report: LabReport | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ReportViewDialog: React.FC<ReportViewDialogProps> = ({
  report,
  open,
  onOpenChange,
}) => {
  if (!report) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Lab Report Details</DialogTitle>
          <DialogDescription>
            {report.type} - {report.date}
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Date</p>
              <p>{report.date}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Ordered By</p>
              <p>{report.doctor}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Type</p>
              <p>{report.type}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <p>{report.status}</p>
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
              {report.results.map((result, index) => {
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
  );
};

export default ReportViewDialog;
