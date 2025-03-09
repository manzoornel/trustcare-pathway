
import React from "react";
import { VitalRecord, VitalTypeInfo, getStatusColorClass } from "./mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface VitalsTableProps {
  records: VitalRecord[];
  vitalType: VitalTypeInfo;
}

const VitalsTable: React.FC<VitalsTableProps> = ({ records, vitalType }) => {
  // Sort records by date (newest first)
  const sortedRecords = [...records].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
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
          {sortedRecords.length > 0 ? (
            sortedRecords.map((record) => (
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
    </div>
  );
};

export default VitalsTable;
