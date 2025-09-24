import { useEffect, useState } from "react";
import { doctors as initialDoctors } from "./DoctorData";
import DoctorCard from "./DoctorCard";
import { DoctorProfile } from "./types";
import { Link } from "react-router-dom";
import axios from "axios";

interface DoctorProfilesProps {
  featuredOnly?: boolean;
}

const DoctorProfiles = ({ featuredOnly = true }: DoctorProfilesProps) => {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLabReports = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await axios.post(
          "https://clinictrial.grandissolutions.in/patientApp/listDoctors"
        );

        const { data } = response.data;

        if (data != null) {
          setDoctors(data);
        }
      } catch (error: any) {
        console.error("Error fetching lab reports:", error);
        setError(error.message || "Failed to load doctor data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLabReports();
  }, []);

  // Convert API data to DoctorProfile format
  const doctorProfiles: DoctorProfile[] = doctors.map((doctor) => ({
    name: doctor.doctor_name,
    specialty: doctor.speciality,
    experience: doctor.experience,
    education: doctor.qualification,
    description: doctor.bio,
    image: doctor.doctor_profile_url,
    specializations: doctor.languages || [],
    highlights: doctor.availableDays || [],
    clinicInfo: {
      location: "Doctor Uncle Family Clinic",
      contact: "+1-234-567-8900",
    },
  }));

  // Prioritize Dr. Manzoor
  const sortedDoctors = [...doctorProfiles].sort((a, b) => {
    if (a.name.includes("Manzoor Nellancheri")) return -1;
    if (b.name.includes("Manzoor Nellancheri")) return 1;
    return 0;
  });

  const displayedDoctors = featuredOnly
    ? sortedDoctors.slice(0, 3)
    : sortedDoctors;

  // Skeleton loading card
  const LoadingCard = () => (
    <div className="animate-pulse rounded-lg shadow-md bg-white p-6 w-full max-w-sm">
      <div className="h-32 bg-gray-300 rounded mb-4"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
      <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
    </div>
  );

  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        {featuredOnly && (
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Medical Experts
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Meet the experienced physicians behind Doctor Uncle Family Clinic,
              committed to providing you with the best care.
            </p>
          </div>
        )}

        {error && <div className="text-center text-red-600 mb-8">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex justify-center">
                  <LoadingCard />
                </div>
              ))
            : displayedDoctors.map((doctor, index) => (
                <div key={index} className="flex justify-center">
                  <DoctorCard doctor={doctor} />
                </div>
              ))}
        </div>

        {featuredOnly && displayedDoctors.length > 0 && !isLoading && (
          <div className="text-center mt-16">
            <Link
              to="/doctors"
              className="inline-flex items-center px-6 py-3 bg-blue-600 border border-transparent rounded-md font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            >
              View All Doctors
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorProfiles;
