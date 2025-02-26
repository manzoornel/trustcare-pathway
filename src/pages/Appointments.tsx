
import Navbar from "@/components/Navbar";
import { Helmet } from "react-helmet";
import { Calendar, Clock, User } from "lucide-react";

const Appointments = () => {
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

            <div className="text-center">
              <button className="px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors duration-200">
                Book Appointment Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Appointments;
