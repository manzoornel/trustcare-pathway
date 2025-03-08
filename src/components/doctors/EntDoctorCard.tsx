
import React from 'react';
import { User, Mail, Phone, MapPin, Calendar, Clock, CheckCircle } from 'lucide-react';
import { DoctorProfile } from './types';

interface EntDoctorCardProps {
  doctor: DoctorProfile;
}

const EntDoctorCard = ({ doctor }: EntDoctorCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 p-6 flex flex-col items-center justify-center bg-gradient-to-b from-primary/5 to-primary/10">
          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-md mb-4">
            <img 
              src={doctor.image || "/placeholder.svg"} 
              alt={doctor.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-xl font-bold text-center">{doctor.name}</h3>
          <p className="text-primary font-medium text-center">{doctor.title}</p>
          <div className="mt-4 flex space-x-3">
            <button className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
              <Phone className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
              <Mail className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
              <Calendar className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="md:w-2/3 p-6">
          <h4 className="text-lg font-semibold mb-2">Specializations</h4>
          <div className="mb-4 flex flex-wrap gap-2">
            {doctor.specializations.map((spec, index) => (
              <span key={index} className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">
                {spec}
              </span>
            ))}
          </div>
          
          <div className="mb-4">
            <h4 className="text-lg font-semibold mb-2">About</h4>
            <p className="text-gray-600">{doctor.description}</p>
          </div>
          
          {doctor.highlights && doctor.highlights.length > 0 && (
            <div className="mb-4">
              <h4 className="text-lg font-semibold mb-2">Highlights</h4>
              <ul className="space-y-1">
                {doctor.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mr-2 mt-1" />
                    <span className="text-gray-600 text-sm">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center text-gray-500 text-sm">
              <MapPin className="h-4 w-4 mr-1" />
              <span>Available at all clinics</span>
            </div>
            <div className="flex items-center text-gray-500 text-sm">
              <Clock className="h-4 w-4 mr-1" />
              <span>{doctor.availableDays?.join(', ') || 'Weekdays'}</span>
            </div>
          </div>
          
          <a 
            href={`/doctor/${doctor.id}`}
            className="mt-4 block w-full text-center bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            View Full Profile
          </a>
        </div>
      </div>
    </div>
  );
};

export default EntDoctorCard;
