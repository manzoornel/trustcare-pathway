import React, { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import { instance } from "../../../axios";
import { useNavigate } from "react-router-dom";
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
import { Activity, Heart, Thermometer } from "lucide-react";
import VitalsComparisonDialog from "./VitalsComparisonDialog";

interface Vital {
  name: string;
  vital_value: string;
  time_taken: string;
  remark_id: number;
  max_value?: string;
  min_value?: string;
  vital_status?: string;
}

type VitalsData = {
  [timestamp: string]: Vital[];
};

type PivotedVitals = {
  [vitalName: string]: {
    [timestamp: string]: string; // vital_value
  };
};

// Vital type configurations
const vitalTypeConfigs = {
  "Blood Pressure": {
    icon: Activity,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    normalRange: "90/60 - 120/80 mmHg",
  },
  "Heart Rate": {
    icon: Heart,
    color: "text-red-600",
    bgColor: "bg-red-50",
    normalRange: "60 - 100 bpm",
  },
  Temperature: {
    icon: Thermometer,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    normalRange: "36.1 - 37.2 °C",
  },
  "Respiratory Rate": {
    icon: Activity,
    color: "text-green-600",
    bgColor: "bg-green-50",
    normalRange: "12 - 20 bpm",
  },
  "Oxygen Saturation": {
    icon: Activity,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    normalRange: "95 - 100 %",
  },
  "Blood Glucose": {
    icon: Activity,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    normalRange: "80 - 130 mg/dL",
  },
  Weight: {
    icon: Activity,
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    normalRange: "Varies",
  },
};

const VitalsReportsTab: React.FC = () => {
  const [data, setData] = useState<VitalsData>({});
  const [currentVisit, setCurrentVisit] = useState("");
  const [loading, setLoading] = useState(false);
  const [showComparisonDialog, setShowComparisonDialog] = useState(false);
  const [selectedVitalType, setSelectedVitalType] = useState<string | null>(
    null
  );
  const navigate = useNavigate();

  useEffect(() => {
    fetchVitals();
  }, [currentVisit]);

  const fetchVitals = async () => {
    setLoading(true);
    try {
      const { data } = await instance.post(
        "fetchPatientVitals",
        {},
        {
          params: { visit_id: currentVisit },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (data.code === 1) {
        setData(data.data || {});
      } else if (
        data.code === 0 &&
        (data.status === "Invalid token payload." ||
          data.status === "Wrong token")
      ) {
        toast.error("Invalid token. Please log in again.");
        localStorage.clear();
        setData({});
        navigate("/login", { replace: true });
      } else {
        console.error("Error Fetching vitals:", data.status);
        setData({});
      }
    } catch (error) {
      console.error("Error Fetching vitals:", error);
    } finally {
      setLoading(false);
    }
  };

  const pivotVitals = (rawData: VitalsData): PivotedVitals => {
    const result: PivotedVitals = {};
    Object.entries(rawData).forEach(([timestamp, vitals]) => {
      vitals.forEach((vital) => {
        if (!result[vital.name]) result[vital.name] = {};
        result[vital.name][timestamp] = vital.vital_value;
      });
    });
    return result;
  };

  const pivotedData = pivotVitals(data);
  const allDates = Object.keys(data).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  // Get available vital types with data
  const availableVitalTypes = useMemo(() => {
    return Object.keys(pivotedData).filter((vitalName) => {
      const values = pivotedData[vitalName];
      return Object.values(values).some(
        (value) => value !== null && !isNaN(Number(value)) && value !== ""
      );
    });
  }, [pivotedData]);

  // Set default selected vital type
  useEffect(() => {
    if (availableVitalTypes.length > 0 && !selectedVitalType) {
      setSelectedVitalType(availableVitalTypes[0]);
    }
  }, [availableVitalTypes, selectedVitalType]);

  // Get data for selected vital type
  const selectedVitalData = useMemo(() => {
    if (!selectedVitalType) return [];

    return allDates
      .map((date) => ({
        date: new Date(date).toLocaleDateString(),
        value: pivotedData[selectedVitalType]?.[date] || null,
        originalDate: date,
      }))
      .filter((item) => item.value !== null && !isNaN(Number(item.value)))
      .sort(
        (a, b) =>
          new Date(b.originalDate).getTime() -
          new Date(a.originalDate).getTime()
      );
  }, [selectedVitalType, pivotedData, allDates]);

  // Check if value is within normal range
  const isWithinRange = (value: number, vitalName: string): boolean => {
    const config = vitalTypeConfigs[vitalName as keyof typeof vitalTypeConfigs];
    if (!config || config.normalRange === "Varies") return true;

    const normalRange = config.normalRange;

    if (normalRange.includes("/")) {
      // Blood pressure format: "90/60 - 120/80 mmHg"
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
      // Simple range format: "60 - 100 bpm"
      const [min, max] = normalRange.split(" - ").map(Number);
      return value >= min && value <= max;
    }

    return true;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
        <span className="ml-3 text-gray-600">Loading vitals...</span>
      </div>
    );
  }

  if (Object.keys(pivotedData).length === 0) {
    return <div className="p-4 text-center text-gray-500">No vitals found</div>;
  }

  return (
    <div className="h-[600px] flex flex-col overflow-hidden border rounded-lg">
      {/* Mobile-friendly heading */}
      <div className="md:hidden flex-shrink-0 p-4 border-b bg-gray-50">
        <h2 className="text-xl font-semibold mb-2">Vital Signs</h2>
        <p className="text-sm text-gray-600">
          Monitor your health metrics over time
        </p>
      </div>

      {/* Vital Type Selection Buttons - Fixed at top */}
      <div className="flex-shrink-0 p-4 border-b bg-white">
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
          {availableVitalTypes.map((vitalName) => {
            const config = vitalTypeConfigs[
              vitalName as keyof typeof vitalTypeConfigs
            ] || {
              icon: Activity,
              color: "text-gray-600",
              bgColor: "bg-gray-50",
              normalRange: "N/A",
            };
            const IconComponent = config.icon;

            return (
              <Button
                key={vitalName}
                variant={
                  selectedVitalType === vitalName ? "default" : "outline"
                }
                size="sm"
                onClick={() => setSelectedVitalType(vitalName)}
                className="text-sm flex items-center gap-2 flex-shrink-0"
              >
                <IconComponent className={`h-4 w-4 ${config.color}`} />
                {vitalName}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Fixed Height Content Area */}
      <div className="flex-1 overflow-hidden">
        {/* Selected Vital Data */}
        {selectedVitalType && (
          <div className="h-full flex flex-col">
            {/* Card Header - Fixed */}
            <div className="flex-shrink-0 p-4 border-b bg-white">
              <div className="flex items-center gap-2 mb-1">
                {(() => {
                  const config = vitalTypeConfigs[
                    selectedVitalType as keyof typeof vitalTypeConfigs
                  ] || {
                    icon: Activity,
                    color: "text-gray-600",
                    bgColor: "bg-gray-50",
                    normalRange: "N/A",
                  };
                  const IconComponent = config.icon;
                  return (
                    <>
                      <IconComponent className={`h-5 w-5 ${config.color}`} />
                      <h3 className="text-lg font-semibold">
                        {selectedVitalType}
                      </h3>
                    </>
                  );
                })()}
              </div>
              <p className="text-sm text-gray-600">
                Normal Range:{" "}
                {vitalTypeConfigs[
                  selectedVitalType as keyof typeof vitalTypeConfigs
                ]?.normalRange || "N/A"}
              </p>
            </div>

            {/* Scrollable Table Area */}
            <div className="flex-1 overflow-hidden">
              {selectedVitalData.length > 0 ? (
                <div className="h-full overflow-y-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-white z-10 border-b">
                      <TableRow>
                        <TableHead className="bg-gray-50 font-semibold">
                          Date
                        </TableHead>
                        <TableHead className="bg-gray-50 font-semibold">
                          Value
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedVitalData.map((item, index) => {
                        const value = Number(item.value);
                        const normal = isWithinRange(value, selectedVitalType);

                        return (
                          <TableRow key={index} className="hover:bg-gray-50">
                            <TableCell className="font-medium">
                              {item.date}
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
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <p className="text-lg font-medium mb-2">
                      No data available
                    </p>
                    <p className="text-sm">
                      No valid {selectedVitalType.toLowerCase()} records found
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Comparison Dialog */}
      <VitalsComparisonDialog
        open={showComparisonDialog}
        onOpenChange={setShowComparisonDialog}
      />
    </div>
  );
};

export default VitalsReportsTab;
