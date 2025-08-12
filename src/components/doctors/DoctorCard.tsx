import { User, Mail, Phone } from "lucide-react";
import { DoctorProfile } from "./types";
import { useNavigate } from "react-router-dom";

interface DoctorCardProps {
  doctor: DoctorProfile;
}

const DoctorCard = ({ doctor }: DoctorCardProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden w-full max-w-sm">
      {/* Doctor image and basic info */}
      <div className="flex flex-col items-center pt-8 pb-6 px-6 bg-gray-50">
        <div className="w-36 h-36 rounded-full overflow-hidden mb-5 bg-gray-200 border-4 border-white shadow-md">
          {doctor.image ? (
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-300" />
          )}
        </div>

        <h3 className="text-xl font-bold text-center mb-1">{doctor.name}</h3>
        {doctor.specialty && (
          <p className="text-gray-600 text-center text-sm">
            {doctor.specialty}
          </p>
        )}
      </div>

      {/* Doctor details */}
      <div className="p-6">
        {/* Experience */}
        {doctor.experience && (
          <div className="mb-4 bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Experience</p>
            <p className="font-medium">{doctor.experience}</p>
          </div>
        )}

        {/* Languages */}
        {doctor.specializations && doctor.specializations.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Languages</h4>
            <div className="flex flex-wrap gap-2">
              {doctor.specializations.map((spec, i) => (
                <span
                  key={i}
                  className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Availability */}
        {doctor.highlights && doctor.highlights.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Available On</h4>
            <div className="flex flex-wrap gap-2">
              {doctor.highlights.map((day, i) => (
                <span
                  key={i}
                  className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full"
                >
                  {day}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Contact buttons */}
        <div className="flex justify-center space-x-4 mt-6 mb-2">
          <button
            onClick={() => navigate("/patient-portal")}
            className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            <User className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate("/contact")}
            className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            <Mail className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate("/contact")}
            className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            <Phone className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
