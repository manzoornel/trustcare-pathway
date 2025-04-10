
import React from 'react';
import EHRLoginButton from '../EHRLoginButton';
import EHRDataSyncButton from '../EHRDataSyncButton';

type LoginSectionProps = {
  ehrPatientId: string | null;
  onLoginSuccess: (patientId: string) => void;
  onSyncComplete: () => void;
};

const LoginSection: React.FC<LoginSectionProps> = ({
  ehrPatientId,
  onLoginSuccess,
  onSyncComplete
}) => {
  if (!ehrPatientId) {
    return (
      <div>
        <p className="text-sm text-gray-500 mb-4">
          Connect to the hospital's Electronic Health Record system to access your complete medical history.
        </p>
        <EHRLoginButton onLoginSuccess={onLoginSuccess} />
      </div>
    );
  }
  
  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">
        Synchronize your data to get the latest updates from the hospital's records.
      </p>
      <EHRDataSyncButton 
        ehrPatientId={ehrPatientId} 
        onSyncComplete={onSyncComplete} 
      />
    </div>
  );
};

export default LoginSection;
