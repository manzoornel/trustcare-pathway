import { User, Mail, Phone, CheckCircle, Clock, MapPin, Ear, Stethoscope, Activity } from 'lucide-react';

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
    },
    {
      name: "Dr. Wazeem Kadengal",
      title: "MBBS, MD, FNNF",
      specialty: "Pediatrician & Neonatologist | Expert Child & Newborn Care",
      experience: "Extensive experience",
      education: "MBBS, MD, FNNF",
      description: "Dr. Wazeem Kadengal is a highly skilled pediatrician and neonatologist specializing in newborn care, child development, and pediatric emergencies. With extensive experience in treating infants, toddlers, and children, he is dedicated to ensuring healthy growth, proper nutrition, and disease prevention for every child.",
      image: "/lovable-uploads/10544f28-fe9f-4f04-9736-0fb61e5a3f17.png",
      specializations: [
        "Neonatal & Infant Care – Expert management of newborn health and early development",
        "Comprehensive Vaccination Plans – Protecting children against serious diseases",
        "Child Growth & Nutrition Counseling – Helping parents ensure balanced nutrition",
        "Treatment for Allergies & Respiratory Issues – Effective care for asthma, colds, and infections",
        "Emergency Pediatric Care – Immediate attention for childhood injuries and illnesses"
      ],
      highlights: [
        "Expert Pediatrician & Neonatologist – Specialized in child and newborn healthcare",
        "Newborn & Premature Baby Care – Advanced neonatal care for preterm infants",
        "Growth & Development Monitoring – Ensuring children reach milestones at the right age",
        "Vaccination & Immunization – Protecting children with timely vaccinations",
        "Compassionate & Patient-Friendly Approach – Making every child feel safe"
      ],
      clinicInfo: {
        location: "Doctor Uncle Family Clinic – Vakkad Branch",
        timing: "2:30 PM – 4:30 PM (Daily)",
        contact: "9961 588 880"
      }
    }
  ];

  const entDoctors = [
    {
      name: "Dr. Shahar Banu",
      title: "MBBS, MS (ENT)",
      specialty: "ENT Specialist & Surgeon",
      description: "Dr. Shahar Banu is a highly skilled ENT specialist and surgeon with expertise in diagnosing and treating disorders related to the ear, nose, throat, head, and neck. With extensive experience, she provides advanced care for sinus infections, hearing issues, voice disorders, tonsillitis, and more.",
      image: "/lovable-uploads/54ce09cc-73b7-4e3a-abdc-fedcc93cc51c.png",
      specializations: [
        "Hearing Loss & Ear Infections – Treatment for middle ear infections and tinnitus",
        "Nasal Disorders & Sinusitis – Advanced care for allergies, nasal polyps, and blocked sinuses",
        "Tonsillitis & Throat Infections – Effective treatments for sore throats and chronic tonsillitis",
        "Vertigo & Balance Disorders – Specialized care for dizziness and inner ear issues",
        "Head & Neck Surgery – Skilled surgical intervention for ENT-related conditions"
      ],
      clinicInfo: {
        location: "Doctor Uncle Family Clinic – Vakkad Branch",
        contact: "9961 588 880 | 04942 087 888"
      }
    },
    {
      name: "Dr. Vijay S",
      title: "MBBS, DLO, MS (ENT)",
      specialty: "Senior ENT Surgeon",
      description: "Dr. Vijay S is a renowned ENT surgeon specializing in ear, nose, and throat disorders, offering expert diagnosis and treatment for both adults and children. His approach combines advanced medical techniques with compassionate patient care to provide the best treatment outcomes.",
      image: "/lovable-uploads/1aff5afe-1070-44a1-8b38-24f7962a7840.png",
      specializations: [
        "Ear Surgery & Cochlear Implants – Advanced surgical solutions for hearing loss",
        "Sinus & Allergy Treatment – Comprehensive allergy testing and management",
        "Voice & Swallowing Disorders – Specialized care for vocal cord and swallowing problems",
        "Snoring & Sleep Apnea Treatment – Effective therapies to improve sleep health",
        "ENT Endoscopic Procedures – Minimally invasive treatments for nasal and throat conditions"
      ],
      clinicInfo: {
        location: "Doctor Uncle Family Clinic – Vakkad Branch",
        contact: "9961 588 880 | 04942 087 888"
      }
    },
    {
      name: "Dr. Mansheer Nellancheri",
      title: "MBBS, Dip ENT",
      specialty: "ENT Specialist & Surgeon",
      description: "Dr. Mansheer Nellancheri is a trusted ENT specialist with a focus on diagnosing and treating ear, nose, and throat conditions using the latest medical advancements. He provides comprehensive ENT care, ensuring accurate diagnoses and effective treatments for a wide range of conditions.",
      image: "/lovable-uploads/5b0045c2-3301-401d-9d16-faf9110a47bf.png",
      specializations: [
        "Pediatric ENT Care – Specialized treatments for ear infections, allergies, and speech disorders in children",
        "Nasal Blockage & Deviated Septum – Expert surgical and non-surgical treatments",
        "Chronic Ear & Throat Infections – Long-term management and prevention strategies",
        "Tinnitus & Hearing Issues – Advanced solutions for ringing in the ears and hearing loss",
        "ENT Surgeries & Procedures – Skilled surgical intervention for complex ENT conditions"
      ],
      clinicInfo: {
        location: "Doctor Uncle Family Clinic – Vakkad Branch",
        contact: "9961 588 880 | 04942 087 888"
      }
    }
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Our Medical Experts</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Meet the experienced physicians behind Doctor Uncle Family Clinic, committed to providing you with the best care.
          </p>
        </div>

        {/* Primary Care Doctors */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-gray-800 mb-8 text-center">Primary Care & Specialties</h3>
          <div className="grid grid-cols-1 gap-8">
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
                      <h4 className="text-xl font-semibold mb-3">About {doctor.name}</h4>
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
                      <h4 className="text-xl font-semibold mb-3">Why Choose {doctor.name}?</h4>
                      <ul className="space-y-2">
                        {doctor.highlights.map((highlight, i) => (
                          <li key={i} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mr-2 mt-0.5" />
                            <span className="text-gray-700">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {doctor.clinicInfo && (
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <h4 className="font-semibold mb-2">Clinic Availability & Appointments</h4>
                        <div className="space-y-2">
                          <div className="flex items-start">
                            <MapPin className="h-5 w-5 text-primary flex-shrink-0 mr-2 mt-0.5" />
                            <span className="text-gray-700">{doctor.clinicInfo.location}</span>
                          </div>
                          <div className="flex items-start">
                            <Clock className="h-5 w-5 text-primary flex-shrink-0 mr-2 mt-0.5" />
                            <span className="text-gray-700">Consultation Timing: {doctor.clinicInfo.timing}</span>
                          </div>
                          <div className="flex items-start">
                            <Phone className="h-5 w-5 text-primary flex-shrink-0 mr-2 mt-0.5" />
                            <span className="text-gray-700">For Bookings & Inquiries: {doctor.clinicInfo.contact}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {!doctor.clinicInfo && (
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
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ENT Specialists */}
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-8 text-center">Our ENT Specialists</h3>
          <div className="grid grid-cols-1 gap-8">
            {entDoctors.map((doctor, index) => (
              <div 
                key={`ent-${index}`} 
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
                        <Ear className="w-5 h-5" />
                      </button>
                      <button className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                        <Stethoscope className="w-5 h-5" />
                      </button>
                      <button className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                        <Activity className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="md:w-2/3">
                    <div className="mb-6">
                      <h4 className="text-xl font-semibold mb-3">About {doctor.name}</h4>
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
                    
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <h4 className="font-semibold mb-2">Clinic Availability & Appointments</h4>
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <MapPin className="h-5 w-5 text-primary flex-shrink-0 mr-2 mt-0.5" />
                          <span className="text-gray-700">{doctor.clinicInfo.location}</span>
                        </div>
                        <div className="flex items-start">
                          <Phone className="h-5 w-5 text-primary flex-shrink-0 mr-2 mt-0.5" />
                          <span className="text-gray-700">For Bookings & Inquiries: {doctor.clinicInfo.contact}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Doctor Uncle for ENT Care */}
        <div className="mt-12 bg-white p-8 rounded-xl shadow-md animate-fade-up">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Why Choose Doctor Uncle Family Clinic for ENT Care?</h3>
          <ul className="grid md:grid-cols-2 gap-4">
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mr-2 mt-0.5" />
              <span className="text-gray-700">Experienced ENT Specialists & Surgeons – Comprehensive diagnosis and treatment</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mr-2 mt-0.5" />
              <span className="text-gray-700">Advanced ENT Procedures & Surgeries – Using the latest medical technology</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mr-2 mt-0.5" />
              <span className="text-gray-700">Patient-Centered Approach – Personalized care for both children and adults</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mr-2 mt-0.5" />
              <span className="text-gray-700">State-of-the-Art Facilities – Equipped with modern ENT diagnostic tools</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mr-2 mt-0.5" />
              <span className="text-gray-700">Convenient Appointments – Easy scheduling and minimal wait times</span>
            </li>
          </ul>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center flex-wrap gap-4">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-primary mr-2" />
                <span className="font-medium">Vakkad Branch (Near Aneesha Theatre)</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-primary mr-2" />
                <span>9961 588 880 | 04942 087 888</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfiles;
