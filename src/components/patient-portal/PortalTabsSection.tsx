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
import { LanguageToggle } from "@/components/common/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";
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
  const { t } = useLanguage();

  return (
    <div className="w-full">
      {/* Mobile-first header with language toggle */}
      <div className="flex justify-between items-center mb-6 px-4 md:px-0">
        <div>
          <h1 className="text-2xl font-bold">{t('patient.portal.title') || 'Patient Portal'}</h1>
          <p className="text-muted-foreground text-sm">{t('patient.portal.subtitle') || 'Manage your health records'}</p>
        </div>
        <LanguageToggle />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Mobile-first tab navigation */}
        <div className="w-full overflow-x-auto px-4 md:px-0">
          <TabsList className="grid grid-cols-6 min-w-[640px] md:min-w-0 mb-8 h-12">
            <TabsTrigger value="labReports" className="flex items-center gap-1 px-2 text-xs md:text-sm">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">{t('tab.lab.reports') || 'Lab Reports'}</span>
              <span className="sm:hidden">Lab</span>
            </TabsTrigger>
            <TabsTrigger value="medications" className="flex items-center gap-1 px-2 text-xs md:text-sm">
              <Pill className="h-4 w-4" />
              <span className="hidden sm:inline">{t('tab.medications') || 'Medications'}</span>
              <span className="sm:hidden">Meds</span>
            </TabsTrigger>
            <TabsTrigger value="vitalsReports" className="flex items-center gap-1 px-2 text-xs md:text-sm">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">{t('tab.vitals') || 'Vitals'}</span>
              <span className="sm:hidden">Vitals</span>
            </TabsTrigger>
            <TabsTrigger value="medicalSummary" className="flex items-center gap-1 px-2 text-xs md:text-sm">
              <ClipboardList className="h-4 w-4" />
              <span className="hidden sm:inline">{t('tab.summary') || 'Summary'}</span>
              <span className="sm:hidden">Summary</span>
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center gap-1 px-2 text-xs md:text-sm">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">{t('tab.appointments') || 'Appointments'}</span>
              <span className="sm:hidden">Appt</span>
            </TabsTrigger>
            <TabsTrigger disabled={true} value="aiChat" className="flex items-center gap-1 px-2 text-xs md:text-sm">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">{t('tab.chat') || 'AI Chat'}</span>
              <span className="sm:hidden">Chat</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="labReports" className="space-y-4 px-4 md:px-0">
          <LabReportsTab openPatientInfoEdit={openPatientInfoEdit} />
        </TabsContent>

        <TabsContent value="medications" className="space-y-4 px-4 md:px-0">
          <MedicationsTab />
        </TabsContent>

        <TabsContent value="vitalsReports" className="space-y-4 px-4 md:px-0">
          <VitalsReportsTab />
        </TabsContent>

        <TabsContent value="medicalSummary" className="space-y-4 px-4 md:px-0">
          <MedicalSummaryTab />
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4 px-4 md:px-0">
          <AppointmentsTab />
        </TabsContent>

        <TabsContent value="aiChat" className="space-y-4 px-4 md:px-0">
          <AIChatInterface />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PortalTabsSection;
