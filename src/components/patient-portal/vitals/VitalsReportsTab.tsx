import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import VitalsTypeSelector from "./VitalsTypeSelector";
import VitalChart from "./VitalChart";
import VitalsTable from "./VitalsTable";
import VitalsComparisonDialog from "./VitalsComparisonDialog";
import { VitalType, getVitalsByType, getVitalTypeInfo, vitalTypes } from "./index";

const VitalsReportsTab: React.FC = () => {
  const [selectedVitalType, setSelectedVitalType] = useState<VitalType>("blood_pressure");
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart");
  const [isComparing, setIsComparing] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  
  const vitalTypeInfo = getVitalTypeInfo(selectedVitalType);
  const vitalRecords = getVitalsByType(selectedVitalType);
  
  const handleCompare = () => {
    setCompareOpen(true);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl">Vitals Reports</CardTitle>
              <CardDescription>
                Track your vital signs and health measurements over time
              </CardDescription>
            </div>
            <Button onClick={handleCompare} variant="outline">
              Compare Vitals
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="md:col-span-3">
              <VitalsTypeSelector 
                vitalTypes={vitalTypes} 
                selectedType={selectedVitalType}
                onSelectType={setSelectedVitalType}
              />
            </div>
            <div className="md:col-span-1">
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "chart" | "table")} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="chart">Chart View</TabsTrigger>
                  <TabsTrigger value="table">Table View</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <TabsContent value="chart" className="mt-0">
              <div className="h-[400px]">
                <VitalChart records={vitalRecords} vitalType={vitalTypeInfo} />
              </div>
            </TabsContent>
            
            <TabsContent value="table" className="mt-0">
              <VitalsTable records={vitalRecords} vitalType={vitalTypeInfo} />
            </TabsContent>
          </div>
        </CardContent>
      </Card>
      
      <VitalsComparisonDialog 
        open={compareOpen} 
        onOpenChange={setCompareOpen}
      />
    </div>
  );
};

export default VitalsReportsTab;
