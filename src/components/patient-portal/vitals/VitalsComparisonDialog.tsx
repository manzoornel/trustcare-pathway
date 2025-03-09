
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { VitalType, VitalTypeInfo, getVitalsByType, vitalTypes, getVitalTypeInfo } from "./mockData";
import VitalChart from "./VitalChart";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";

interface VitalsComparisonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const VitalsComparisonDialog: React.FC<VitalsComparisonDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const [compareMode, setCompareMode] = useState<"sameType" | "multiType">("sameType");
  const [selectedType1, setSelectedType1] = useState<VitalType>("blood_pressure");
  const [selectedType2, setSelectedType2] = useState<VitalType>("heart_rate");
  
  // Get data based on selection
  const vitalTypeInfo1 = getVitalTypeInfo(selectedType1);
  const vitalTypeInfo2 = getVitalTypeInfo(selectedType2);
  const records1 = getVitalsByType(selectedType1);
  const records2 = getVitalsByType(selectedType2);
  
  // Prepare data for the charts
  const getSingleTypeData = () => {
    const dates = [...new Set(records1.map(r => r.date))].sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );
    
    return dates.map(date => {
      const record = records1.find(r => r.date === date);
      return {
        date: new Date(date).toLocaleDateString(),
        value: record ? record.value : null,
        status: record ? record.status : null
      };
    });
  };
  
  const getMultiTypeData = () => {
    // Get all unique dates from both data sets
    const allDates = [...new Set([
      ...records1.map(r => r.date),
      ...records2.map(r => r.date)
    ])].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    
    // Create a combined dataset
    return allDates.map(date => {
      const record1 = records1.find(r => r.date === date);
      const record2 = records2.find(r => r.date === date);
      
      return {
        date: new Date(date).toLocaleDateString(),
        [vitalTypeInfo1.label]: record1 ? record1.value : null,
        [vitalTypeInfo2.label]: record2 ? record2.value : null,
      };
    });
  };
  
  const renderSingleTypeComparison = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-end gap-4">
          <div className="space-y-2 flex-1">
            <Label htmlFor="vitalType">Vital Sign</Label>
            <Select value={selectedType1} onValueChange={(value) => setSelectedType1(value as VitalType)}>
              <SelectTrigger id="vitalType">
                <SelectValue placeholder="Select vital type" />
              </SelectTrigger>
              <SelectContent>
                {vitalTypes.map((type) => (
                  <SelectItem key={type.type} value={type.type}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 h-[400px]">
          <VitalChart records={records1} vitalType={vitalTypeInfo1} />
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          <p>Normal range: {vitalTypeInfo1.normalRange} {vitalTypeInfo1.unit}</p>
          <p>{vitalTypeInfo1.description}</p>
        </div>
      </div>
    );
  };
  
  const renderMultiTypeComparison = () => {
    const data = getMultiTypeData();
    
    // Get line colors
    const getLineColor = (index: number) => {
      const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];
      return colors[index % colors.length];
    };
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="vitalType1">First Vital Sign</Label>
            <Select value={selectedType1} onValueChange={(value) => setSelectedType1(value as VitalType)}>
              <SelectTrigger id="vitalType1">
                <SelectValue placeholder="Select vital type" />
              </SelectTrigger>
              <SelectContent>
                {vitalTypes.map((type) => (
                  <SelectItem key={type.type} value={type.type}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="vitalType2">Second Vital Sign</Label>
            <Select value={selectedType2} onValueChange={(value) => setSelectedType2(value as VitalType)}>
              <SelectTrigger id="vitalType2">
                <SelectValue placeholder="Select vital type" />
              </SelectTrigger>
              <SelectContent>
                {vitalTypes.map((type) => (
                  <SelectItem key={type.type} value={type.type}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 h-[400px]">
          <h3 className="text-lg font-medium mb-4">
            Comparing {vitalTypeInfo1.label} & {vitalTypeInfo2.label}
          </h3>
          
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={data} margin={{ top: 5, right: 30, bottom: 5, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" orientation="left" stroke={getLineColor(0)} />
              <YAxis yAxisId="right" orientation="right" stroke={getLineColor(1)} />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey={vitalTypeInfo1.label}
                stroke={getLineColor(0)}
                strokeWidth={2}
                name={`${vitalTypeInfo1.label} (${vitalTypeInfo1.unit})`}
                connectNulls
                dot={{ stroke: getLineColor(0), strokeWidth: 2, r: 4, fill: '#fff' }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey={vitalTypeInfo2.label}
                stroke={getLineColor(1)}
                strokeWidth={2}
                name={`${vitalTypeInfo2.label} (${vitalTypeInfo2.unit})`}
                connectNulls
                dot={{ stroke: getLineColor(1), strokeWidth: 2, r: 4, fill: '#fff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Compare Vital Signs</DialogTitle>
          <DialogDescription>
            Compare your vital signs over time to track your health progress
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={compareMode} onValueChange={(value) => setCompareMode(value as "sameType" | "multiType")}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="sameType">Single Vital Type</TabsTrigger>
            <TabsTrigger value="multiType">Multiple Vital Types</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sameType" className="mt-0">
            {renderSingleTypeComparison()}
          </TabsContent>
          
          <TabsContent value="multiType" className="mt-0">
            {renderMultiTypeComparison()}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default VitalsComparisonDialog;
