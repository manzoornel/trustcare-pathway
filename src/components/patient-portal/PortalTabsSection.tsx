
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Pill, ClipboardList, Calendar, MessageSquare } from "lucide-react";
import LabReportsTab from "./LabReportsTab";
import MedicationsTab from "./MedicationsTab";
import MedicalSummaryTab from "./MedicalSummaryTab";
import AppointmentsTab from "./AppointmentsTab";
import AIChatInterface from "@/components/AIChatInterface";

type PortalTabsSectionProps = {
  activeTab: string;
  setActiveTab: (value: string) => void;
};

const PortalTabsSection = ({ activeTab, setActiveTab }: PortalTabsSectionProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-5 mb-8">
        <TabsTrigger value="labReports" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Lab Reports</span>
        </TabsTrigger>
        <TabsTrigger value="medications" className="flex items-center gap-2">
          <Pill className="h-4 w-4" />
          <span className="hidden sm:inline">Medications</span>
        </TabsTrigger>
        <TabsTrigger value="medicalSummary" className="flex items-center gap-2">
          <ClipboardList className="h-4 w-4" />
          <span className="hidden sm:inline">Medical Summary</span>
        </TabsTrigger>
        <TabsTrigger value="appointments" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span className="hidden sm:inline">Appointments</span>
        </TabsTrigger>
        <TabsTrigger value="aiChat" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          <span className="hidden sm:inline">AI Chat</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="labReports" className="space-y-4">
        <LabReportsTab />
      </TabsContent>
      
      <TabsContent value="medications" className="space-y-4">
        <MedicationsTab />
      </TabsContent>
      
      <TabsContent value="medicalSummary" className="space-y-4">
        <MedicalSummaryTab />
      </TabsContent>
      
      <TabsContent value="appointments" className="space-y-4">
        <AppointmentsTab />
      </TabsContent>
      
      <TabsContent value="aiChat" className="space-y-4">
        <AIChatInterface />
      </TabsContent>
    </Tabs>
  );
};

export default PortalTabsSection;
