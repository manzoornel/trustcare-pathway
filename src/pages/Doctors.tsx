
import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DoctorProfiles from "@/components/doctors/DoctorProfiles";
import { useTheme } from "@/contexts/ThemeContext";

const Doctors = () => {
  const { theme } = useTheme();

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Our Doctors - Doctor Uncle Family Clinic</title>
        <meta
          name="description"
          content="Meet our experienced medical team at Doctor Uncle Family Clinic. Our physicians are committed to providing compassionate, high-quality healthcare for your entire family."
        />
      </Helmet>

      <Navbar />
      <main>
        <div className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Medical Team</h1>
              <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                Meet the experienced physicians behind Doctor Uncle Family Clinic, committed to providing you and your family with the best care.
              </p>
            </div>
          </div>
        </div>
        <DoctorProfiles featuredOnly={false} />
      </main>
      <Footer />
    </>
  );
};

export default Doctors;
