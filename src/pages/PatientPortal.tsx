
import React from 'react';
import { useAuth } from '@/contexts/auth';
import PatientInfoCard from '@/components/patient-portal/PatientInfoCard';
import PortalTabsSection from '@/components/patient-portal/PortalTabsSection';
import RewardsCard from '@/components/patient-portal/RewardsCard';
import EHRConnectionPanel from '@/components/patient-portal/EHRConnectionPanel';

const PatientPortal: React.FC = () => {
  const { auth } = useAuth();

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center md:text-left">
        Welcome to Your Patient Portal{auth.name ? `, ${auth.name}` : ''}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-6">
          <PatientInfoCard />
          <RewardsCard />
          <EHRConnectionPanel />
        </div>

        <div className="md:col-span-2">
          <PortalTabsSection />
        </div>
      </div>
    </div>
  );
};

export default PatientPortal;
