import React, { useState, useMemo, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import {
  VitalType,
  VitalTypeInfo,
  getVitalsByType,
  vitalTypes,
  getVitalTypeInfo,
} from "./index";

interface VitalsComparisonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const VitalsComparisonDialog: React.FC<VitalsComparisonDialogProps> = ({
  open,
  onOpenChange,
}) => {
  // Get all available vital types with data
  const availableVitalTypes = useMemo(() => {
    return vitalTypes.filter((vitalType) => {
      const records = getVitalsByType(vitalType.type);
      return records.length > 0;
    });
  }, []);

  // Single-parameter selection (one-by-one)
  const [selectedVitalType, setSelectedVitalType] = useState<VitalType | null>(
    null
  );

  useEffect(() => {
    if (availableVitalTypes.length > 0) {
      // Default to the first available vital type
      setSelectedVitalType((prev) => prev ?? availableVitalTypes[0].type);
    } else {
      setSelectedVitalType(null);
    }
  }, [availableVitalTypes]);

  // Get data for selected vital type
  const selectedVitalInfo = selectedVitalType
    ? getVitalTypeInfo(selectedVitalType)
    : null;
  const selectedRecords = selectedVitalType
    ? getVitalsByType(selectedVitalType)
    : [];

  // Filter records to only show valid values
  const validRecords = useMemo(() => {
    return selectedRecords
      .filter((record) => {
        const value = Number(record.value);
        return !isNaN(value) && value !== 0;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [selectedRecords]);

  // Check if value is within normal range
  const isWithinRange = (value: number, normalRange: string): boolean => {
    if (!normalRange || normalRange === "varies") return true;

    // Handle different range formats
    if (normalRange.includes("/")) {
      // Blood pressure format: "90/60 - 120/80"
      const [systolic, diastolic] = value.toString().split("/").map(Number);
      const [minRange, maxRange] = normalRange.split(" - ");
      const [minSystolic, minDiastolic] = minRange.split("/").map(Number);
      const [maxSystolic, maxDiastolic] = maxRange.split("/").map(Number);

      return (
        systolic >= minSystolic &&
        systolic <= maxSystolic &&
        diastolic >= minDiastolic &&
        diastolic <= maxDiastolic
      );
    } else if (normalRange.includes("-")) {
      // Simple range format: "60 - 100"
      const [min, max] = normalRange.split(" - ").map(Number);
      return value >= min && value <= max;
    }

    return true;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Vitals Comparison</DialogTitle>
          <DialogDescription>
            Compare your vital signs over time to track your health progress
          </DialogDescription>

          <div className="mt-3 flex flex-col gap-4">
            {/* Vital Type Selection Buttons */}
            <div className="flex flex-wrap gap-2">
              {availableVitalTypes.map((vitalType) => (
                <Button
                  key={vitalType.type}
                  variant={
                    selectedVitalType === vitalType.type ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedVitalType(vitalType.type)}
                  className="text-sm"
                >
                  {vitalType.label}
                </Button>
              ))}
            </div>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[70vh]">
          {selectedVitalType && selectedVitalInfo ? (
            <Card>
              <CardHeader>
                <CardTitle>Vital Sign Values</CardTitle>
                <CardDescription>
                  {selectedVitalInfo.label} - Normal Range:{" "}
                  {selectedVitalInfo.normalRange}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {validRecords.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {validRecords.map((record, index) => {
                        const value = Number(record.value);
                        const normal = isWithinRange(
                          value,
                          selectedVitalInfo.normalRange
                        );

                        return (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              {new Date(record.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <span
                                className={
                                  normal
                                    ? "text-gray-900"
                                    : "text-red-600 font-semibold"
                                }
                              >
                                {value}
                              </span>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No valid {selectedVitalInfo.label.toLowerCase()} records
                    found
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Select a vital sign to view comparison
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VitalsComparisonDialog;
