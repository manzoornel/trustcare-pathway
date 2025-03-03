
import { User, Mail, Phone, CheckCircle } from 'lucide-react';

const DoctorProfiles = () => {
  const doctors = [
    {
      name: "Dr. Manzoor Nellancheri",
      title: "MBBS, CCEBDM (Diabetes), BCCPM (Pain & Palliative)",
      specialty: "Family Doctor | Diabetes & Palliative Care Specialist",
      experience: "10+ years",
      education: "MBBS, CCEBDM, BCCPM",
      description: "Dr. Manzoor is a highly experienced family physician and diabetes specialist dedicated to providing comprehensive, patient-centered healthcare. As the founder and chief physician at Doctor Uncle Family Clinic, he specializes in general medicine, diabetes management, chronic disease care, and palliative medicine.",
      image: "/lovable-uploads/2550a412-1e2b-48fc-8a38-2d3f782909b5.png",
      specializations: [
        "General Medicine – Diagnosis and treatment of acute and chronic illnesses",
        "Diabetes Care (CCEBDM) – Advanced diabetes management and preventive care",
        "Pain & Palliative Medicine (BCCPM) – Specialized care for pain relief",
        "Preventive Healthcare – Personalized health checkups and wellness",
        "Elderly & Home Care Services – Compassionate support for seniors"
      ],
      highlights: [
        "Trusted Family Doctor with over 10 years of experience",
        "Diabetes & Chronic Disease Expert",
        "Pain & Palliative Specialist",
        "Patient-Centered Approach",
        "Available at Doctor Uncle Family Clinic"
      ]
    }
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Our Medical Expert</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Meet the experienced physician behind Doctor Uncle Family Clinic, committed to providing you with the best care.
          </p>
        </div>

        {doctors.map((doctor, index) => (
          <div 
            key={index} 
            className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 animate-fade-up max-w-5xl mx-auto"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3 flex flex-col items-center">
                <div className="w-64 h-64 rounded-full overflow-hidden mb-6 bg-gray-200 border-4 border-primary/10">
                  <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-2xl font-bold text-center mb-1">{doctor.name}</h3>
                <p className="text-primary font-medium text-center mb-2">{doctor.title}</p>
                <p className="text-gray-600 text-center mb-4">{doctor.specialty}</p>
                <div className="flex space-x-4 mt-2">
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
              
              <div className="md:w-2/3">
                <div className="mb-6">
                  <h4 className="text-xl font-semibold mb-3">About Dr. Manzoor Nellancheri</h4>
                  <p className="text-gray-700 leading-relaxed">{doctor.description}</p>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-xl font-semibold mb-3">Expertise & Specializations</h4>
                  <ul className="space-y-2">
                    {doctor.specializations.map((spec, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mr-2 mt-0.5" />
                        <span className="text-gray-700">{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-xl font-semibold mb-3">Why Choose Dr. Manzoor Nellancheri?</h4>
                  <ul className="space-y-2">
                    {doctor.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mr-2 mt-0.5" />
                        <span className="text-gray-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <h4 className="font-semibold mb-2">Visit Doctor Uncle Family Clinic</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-800">Vakkad Branch (Near Aneesha Theatre):</p>
                      <p className="text-gray-600">Phone: 9961 588 880 | 04942 087 888</p>
                    </div>
                    
                    <div>
                      <p className="font-medium text-gray-800">Unniyal Branch (Jn), Tanur Road:</p>
                      <p className="text-gray-600">Phone: 8089 771 640 | 8089 771 641</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorProfiles;
