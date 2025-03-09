
import React, { useState } from "react";
import { VitalRecord, VitalTypeInfo, getStatusColorClass } from "./index";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VitalsTableProps {
  records: VitalRecord[];
  vitalType: VitalTypeInfo;
}

const VitalsTable: React.FC<VitalsTableProps> = ({ records, vitalType }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  
  // Sort records by date (newest first)
  const sortedRecords = [...records].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Calculate pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = sortedRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(sortedRecords.length / recordsPerPage);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format value based on type
  const formatValue = (value: number | string, type: string) => {
    if (typeof value === 'number') {
      return value.toFixed(1); // Show one decimal place for numbers
    }
    return value;
  };
  
  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Value ({vitalType.unit})</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Recorded By</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentRecords.length > 0 ? (
            currentRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{formatDate(record.date)}</TableCell>
                <TableCell className="font-medium">{formatValue(record.value, vitalType.type)}</TableCell>
                <TableCell>
                  <span className={`font-medium ${getStatusColorClass(record.status)}`}>
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell>{record.recordedBy}</TableCell>
                <TableCell>{record.notes || "-"}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                No {vitalType.label.toLowerCase()} records found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      {sortedRecords.length > recordsPerPage && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            Showing {indexOfFirstRecord + 1}-{Math.min(indexOfLastRecord, sortedRecords.length)} of {sortedRecords.length} records
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VitalsTable;
