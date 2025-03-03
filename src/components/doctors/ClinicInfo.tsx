
import { MapPin, Phone, Clock } from 'lucide-react';
import { ClinicInformation } from './types';

interface ClinicInfoProps {
  clinicInfo: ClinicInformation;
}

const ClinicInfo = ({ clinicInfo }: ClinicInfoProps) => {
  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
      <h4 className="font-semibold mb-2">Clinic Availability & Appointments</h4>
      <div className="space-y-2">
        <div className="flex items-start">
          <MapPin className="h-5 w-5 text-primary flex-shrink-0 mr-2 mt-0.5" />
          <span className="text-gray-700">{clinicInfo.location}</span>
        </div>
        {clinicInfo.timing && (
          <div className="flex items-start">
            <Clock className="h-5 w-5 text-primary flex-shrink-0 mr-2 mt-0.5" />
            <span className="text-gray-700">Consultation Timing: {clinicInfo.timing}</span>
          </div>
        )}
        <div className="flex items-start">
          <Phone className="h-5 w-5 text-primary flex-shrink-0 mr-2 mt-0.5" />
          <span className="text-gray-700">For Bookings & Inquiries: {clinicInfo.contact}</span>
        </div>
      </div>
    </div>
  );
};

export default ClinicInfo;
