import React from "react";
import DoctorCard from "./DoctorCard";
import { DoctorProfile } from "@/types";
import { doctors } from "./DoctorData";

interface DoctorProfilesProps {
  doctors: any[];
}

const DoctorProfiles: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {doctors.map((doctor) => {
        // Transform the doctor object to match the DoctorProfile type
        const doctorProfile = {
          ...doctor,
          title: doctor.specialty || 'Specialist',
          education: doctor.qualification || '',
          description: doctor.bio || '',
          specializations: [doctor.specialty || ''],
          highlights: []
        };
        
        return <DoctorCard key={doctor.id} doctor={doctorProfile} />;
      })}
    </div>
  );
};

export default DoctorProfiles;
