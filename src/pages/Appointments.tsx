
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { Helmet } from "react-helmet";
import { Calendar, Clock, User, CalendarClock, Phone } from "lucide-react";
import { doctors, entDoctors } from "@/components/doctors/DoctorData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Appointments = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    doctorId: "",
    doctorName: "",
    specialty: "",
    appointmentDate: "",
    appointmentTime: "",
    patientName: "",
    patientPhone: "",
    patientEmail: "",
    reason: ""
  });

  // Combine all doctors for selection
  const allDoctors = [...doctors, ...entDoctors];

  const handleDoctorSelect = (doctorId: string) => {
    const selectedDoctor = allDoctors.find((doctor, index) => 
      `${index}` === doctorId
    );
    
    if (selectedDoctor) {
      setFormData({
        ...formData,
        doctorId,
        doctorName: selectedDoctor.name,
        specialty: selectedDoctor.specialty
      });
    }
    
    setStep(2);
  };

  const handleDateSelect = (date: string) => {
    setFormData({
      ...formData,
      appointmentDate: date
    });
    setStep(3);
  };

  const handleTimeSelect = (time: string) => {
    setFormData({
      ...formData,
      appointmentTime: time
    });
    setStep(4);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.patientName || !formData.patientPhone) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Here you would typically send the data to your backend
    console.log("Appointment booked:", formData);
    
    // Show success message
    toast.success("Your appointment has been booked successfully!");
    
    // Reset form
    setFormData({
      doctorId: "",
      doctorName: "",
      specialty: "",
      appointmentDate: "",
      appointmentTime: "",
      patientName: "",
      patientPhone: "",
      patientEmail: "",
      reason: ""
    });
    
    setStep(1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Generate available dates (next 14 days excluding today)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      
      // Skip Sundays (assuming they're closed)
      if (date.getDay() !== 0) {
        dates.push({
          value: date.toISOString().split('T')[0],
          label: date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          })
        });
      }
    }
    
    return dates;
  };

  // Generate available time slots
  const getAvailableTimeSlots = () => {
    // Morning slots
    const morningSlots = ["9:00 AM", "10:00 AM", "11:00 AM"];
    
    // Afternoon slots
    const afternoonSlots = ["2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];
    
    return [...morningSlots, ...afternoonSlots];
  };

  return (
    <>
      <Helmet>
        <title>Online Doctor Appointments | Doctor Uncle Family Clinic</title>
        <meta
          name="description"
          content="Book doctor appointments online at Doctor Uncle Family Clinic. Secure, easy, and hassle-free healthcare booking system."
        />
      </Helmet>
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-20 px-4 max-w-7xl mx-auto">
          <div className="py-12">
            <h1 className="text-4xl font-bold mb-8">Book Your Doctor Appointment Online</h1>
            <p className="text-lg text-gray-600 mb-12">
              Skip the waiting lines! Our online appointment system lets you schedule a doctor 
              visit from the comfort of your home.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="p-6 bg-white rounded-xl shadow-md flex items-start space-x-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Select Doctor</h3>
                  <p className="text-gray-600">Choose your preferred doctor or department</p>
                </div>
              </div>
              
              <div className="p-6 bg-white rounded-xl shadow-md flex items-start space-x-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Pick Date</h3>
                  <p className="text-gray-600">Select your preferred appointment date</p>
                </div>
              </div>
              
              <div className="p-6 bg-white rounded-xl shadow-md flex items-start space-x-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Choose Time</h3>
                  <p className="text-gray-600">Pick an available time slot</p>
                </div>
              </div>
            </div>

            <Card className="max-w-3xl mx-auto mb-12">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6 border-b pb-4">
                  <h2 className="text-2xl font-bold">Book Appointment</h2>
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-gray-300'} mr-1`}></div>
                    <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-gray-300'} mr-1`}></div>
                    <div className={`w-3 h-3 rounded-full ${step >= 3 ? 'bg-primary' : 'bg-gray-300'} mr-1`}></div>
                    <div className={`w-3 h-3 rounded-full ${step >= 4 ? 'bg-primary' : 'bg-gray-300'}`}></div>
                  </div>
                </div>

                {step === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold mb-4">Select Doctor</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {allDoctors.map((doctor, index) => (
                        <div 
                          key={index}
                          className="border rounded-lg p-4 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                          onClick={() => handleDoctorSelect(`${index}`)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                              <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <h4 className="font-semibold">{doctor.name}</h4>
                              <p className="text-sm text-gray-600">{doctor.specialty.split('|')[0].trim()}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold">Select Date</h3>
                      <Button variant="outline" size="sm" onClick={() => setStep(1)}>
                        Back
                      </Button>
                    </div>
                    
                    <div className="mb-4 p-3 bg-primary/5 rounded-lg">
                      <p className="font-semibold">Selected Doctor:</p>
                      <p>{formData.doctorName}</p>
                      <p className="text-sm text-gray-600">{formData.specialty}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {getAvailableDates().map((date) => (
                        <div 
                          key={date.value}
                          className="border rounded-lg p-3 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                          onClick={() => handleDateSelect(date.value)}
                        >
                          <p className="font-semibold">{date.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold">Select Time</h3>
                      <Button variant="outline" size="sm" onClick={() => setStep(2)}>
                        Back
                      </Button>
                    </div>
                    
                    <div className="mb-4 p-3 bg-primary/5 rounded-lg">
                      <p className="font-semibold">Selected Doctor:</p>
                      <p>{formData.doctorName}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(formData.appointmentDate).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {getAvailableTimeSlots().map((time) => (
                        <div 
                          key={time}
                          className="border rounded-lg p-3 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                          onClick={() => handleTimeSelect(time)}
                        >
                          <p className="font-semibold">{time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold">Your Information</h3>
                      <Button variant="outline" size="sm" onClick={() => setStep(3)}>
                        Back
                      </Button>
                    </div>
                    
                    <div className="mb-4 p-3 bg-primary/5 rounded-lg">
                      <div className="flex items-center mb-2">
                        <User className="w-4 h-4 mr-2 text-primary" />
                        <p className="font-semibold">{formData.doctorName}</p>
                      </div>
                      <div className="flex items-center mb-2">
                        <Calendar className="w-4 h-4 mr-2 text-primary" />
                        <p>
                          {new Date(formData.appointmentDate).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-primary" />
                        <p>{formData.appointmentTime}</p>
                      </div>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <Label htmlFor="patientName">Full Name *</Label>
                            <Input 
                              id="patientName" 
                              name="patientName"
                              value={formData.patientName}
                              onChange={handleInputChange}
                              placeholder="Enter your full name" 
                              required 
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="patientPhone">Phone Number *</Label>
                            <Input 
                              id="patientPhone" 
                              name="patientPhone"
                              value={formData.patientPhone}
                              onChange={handleInputChange}
                              placeholder="Enter your phone number" 
                              required 
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="patientEmail">Email Address</Label>
                            <Input 
                              id="patientEmail" 
                              name="patientEmail"
                              value={formData.patientEmail}
                              onChange={handleInputChange}
                              type="email"
                              placeholder="Enter your email address" 
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="reason">Reason for Visit</Label>
                            <Input 
                              id="reason" 
                              name="reason"
                              value={formData.reason}
                              onChange={handleInputChange}
                              placeholder="Briefly describe your symptoms or reason for visit" 
                            />
                          </div>
                        </div>
                        
                        <div className="pt-4">
                          <Button type="submit" className="w-full">
                            <CalendarClock className="mr-2 h-4 w-4" />
                            Confirm Appointment
                          </Button>
                        </div>
                        
                        <div className="text-center text-sm text-gray-500 mt-4">
                          <p>Need help? Call us at <a href="tel:9961588880" className="text-primary font-semibold">9961 588 880</a></p>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="max-w-3xl mx-auto">
              <div className="bg-primary/5 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Need immediate assistance?</h3>
                <p className="mb-4">Contact our clinic directly:</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="tel:9961588880" 
                    className="inline-flex items-center px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors duration-200"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Call 9961 588 880
                  </a>
                  <a 
                    href="https://wa.me/919961588880" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Appointments;
