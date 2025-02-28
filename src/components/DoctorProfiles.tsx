
import { User, Mail, Phone } from 'lucide-react';

const DoctorProfiles = () => {
  const doctors = [
    {
      name: "Dr. John Smith",
      specialty: "General Medicine",
      experience: "15 years",
      education: "MD, Harvard Medical School",
      image: "/placeholder.svg"
    },
    {
      name: "Dr. Emily Johnson",
      specialty: "Endocrinology",
      experience: "12 years",
      education: "MD, Johns Hopkins University",
      image: "/placeholder.svg"
    },
    {
      name: "Dr. Michael Lee",
      specialty: "Pediatrics",
      experience: "10 years",
      education: "MD, Stanford University",
      image: "/placeholder.svg"
    }
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Meet Our Doctors</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Our team of experienced medical professionals is committed to providing you with the best care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {doctors.map((doctor, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden mb-4 bg-gray-200">
                  <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-semibold mb-1">{doctor.name}</h3>
                <p className="text-primary font-medium mb-2">{doctor.specialty}</p>
                <p className="text-gray-600 mb-1"><span className="font-medium">Experience:</span> {doctor.experience}</p>
                <p className="text-gray-600 mb-4"><span className="font-medium">Education:</span> {doctor.education}</p>
                <div className="flex space-x-4">
                  <button className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                    <User className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                    <Mail className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                    <Phone className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorProfiles;
