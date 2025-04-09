
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { useEHRConfig } from './ehr-integration/useEHRConfig';
import EHRIntegrationTabs from './ehr-integration/EHRIntegrationTabs';

const EHRIntegrationSettings = () => {
  const { isLoading } = useEHRConfig();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>EHR Integration Settings</CardTitle>
        <CardDescription>
          Configure connection to your Electronic Health Record system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <EHRIntegrationTabs />
      </CardContent>
    </Card>
  );
};

export default EHRIntegrationSettings;
