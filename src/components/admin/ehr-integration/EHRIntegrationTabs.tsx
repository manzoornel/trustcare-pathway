
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EHRGeneralSettings from './EHRGeneralSettings';
import EHRApiEndpoints from './EHRApiEndpoints';

const EHRIntegrationTabs = () => {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="mb-4">
        <TabsTrigger value="general">General Settings</TabsTrigger>
        <TabsTrigger value="api-endpoints">Available Endpoints</TabsTrigger>
      </TabsList>
      
      <TabsContent value="general" className="space-y-6">
        <EHRGeneralSettings />
      </TabsContent>
      
      <TabsContent value="api-endpoints" className="space-y-4">
        <EHRApiEndpoints />
      </TabsContent>
    </Tabs>
  );
};

export default EHRIntegrationTabs;
