
import React from "react";
import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { doctors } from "@/components/doctors/DoctorData";
import AppointmentForm from "@/components/appointments/AppointmentForm";

const Appointments = () => {
  return (
    <>
      <Helmet>
        <title>Book an Appointment | Doctor Uncle Family Clinic</title>
        <meta
          name="description"
          content="Schedule your appointment with our experienced doctors at Doctor Uncle Family Clinic. Choose your preferred time and specialist."
        />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-center mb-8">Book an Appointment</h1>
            <AppointmentForm doctors={doctors} />
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Appointments;
