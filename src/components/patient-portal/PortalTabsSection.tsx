import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Pill,
  ClipboardList,
  Calendar,
  MessageSquare,
  Activity,
} from "lucide-react";
import LabReportsTab from "./LabReportsTab";
import MedicationsTab from "./MedicationsTab";
import MedicalSummaryTab from "./MedicalSummaryTab";
import AppointmentsTab from "./AppointmentsTab";
import AIChatInterface from "@/components/AIChatInterface";
import VitalsReportsTab from "./vitals/VitalsReportsTab";

type PortalTabsSectionProps = {
  activeTab: string;
  setActiveTab: (value: string) => void;
  openPatientInfoEdit?: () => void;
};

const PortalTabsSection = ({
  activeTab,
  setActiveTab,
  openPatientInfoEdit,
}: PortalTabsSectionProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-3 md:grid-cols-6 h-auto gap-1.5 bg-neutral-100 p-1.5 mb-6 rounded-xl">
        <TabsTrigger
          value="labReports"
          className="flex flex-col md:flex-row items-center gap-1 md:gap-2 py-2.5 px-1 rounded-lg text-neutral-600 data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow-sm"
        >
          <FileText className="h-4 w-4 shrink-0" />
          <span className="text-[11px] md:text-sm leading-tight">Lab Reports</span>
        </TabsTrigger>
        <TabsTrigger
          value="medications"
          className="flex flex-col md:flex-row items-center gap-1 md:gap-2 py-2.5 px-1 rounded-lg text-neutral-600 data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow-sm"
        >
          <Pill className="h-4 w-4 shrink-0" />
          <span className="text-[11px] md:text-sm leading-tight">Medications</span>
        </TabsTrigger>
        <TabsTrigger
          value="vitalsReports"
          className="flex flex-col md:flex-row items-center gap-1 md:gap-2 py-2.5 px-1 rounded-lg text-neutral-600 data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow-sm"
        >
          <Activity className="h-4 w-4 shrink-0" />
          <span className="text-[11px] md:text-sm leading-tight">Vitals</span>
        </TabsTrigger>
        <TabsTrigger
          value="medicalSummary"
          className="flex flex-col md:flex-row items-center gap-1 md:gap-2 py-2.5 px-1 rounded-lg text-neutral-600 data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow-sm"
        >
          <ClipboardList className="h-4 w-4 shrink-0" />
          <span className="text-[11px] md:text-sm leading-tight text-center">Medical Summary</span>
        </TabsTrigger>
        <TabsTrigger
          value="appointments"
          className="flex flex-col md:flex-row items-center gap-1 md:gap-2 py-2.5 px-1 rounded-lg text-neutral-600 data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow-sm"
        >
          <Calendar className="h-4 w-4 shrink-0" />
          <span className="text-[11px] md:text-sm leading-tight">Appointments</span>
        </TabsTrigger>
        <TabsTrigger
          disabled={true}
          value="aiChat"
          className="flex flex-col md:flex-row items-center gap-1 md:gap-2 py-2.5 px-1 rounded-lg text-neutral-400 data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow-sm"
        >
          <MessageSquare className="h-4 w-4 shrink-0" />
          <span className="text-[11px] md:text-sm leading-tight">AI Chat</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="labReports" className="space-y-4">
        <LabReportsTab openPatientInfoEdit={openPatientInfoEdit} />
      </TabsContent>

      <TabsContent value="medications" className="space-y-4">
        <MedicationsTab />
      </TabsContent>

      <TabsContent value="vitalsReports" className="space-y-4">
        <VitalsReportsTab />
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
