
import Navbar from "@/components/Navbar";
import { Helmet } from "react-helmet";

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Doctor Uncle Family Clinic – Quality Healthcare with a Personal Touch</title>
        <meta
          name="description"
          content="Learn about Doctor Uncle Family Clinic's mission, vision, and expert team. We provide quality, affordable healthcare for families across India."
        />
      </Helmet>
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-20 px-4 max-w-7xl mx-auto">
          <div className="py-12">
            <h1 className="text-4xl font-bold mb-8">Who We Are</h1>
            <p className="text-lg text-gray-600 mb-8">
              At Doctor Uncle Family Clinic, we believe in trust, transparency, and quality healthcare. 
              Founded by Dr. Manzoor Nellancheri, our mission is to provide accessible, affordable, 
              and high-quality healthcare for families across India.
            </p>
            
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-8">
              To make gold-standard healthcare available to every household through innovative 
              technology and compassionate care.
            </p>

            <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
            <p className="text-lg text-gray-600 mb-8">
              To establish 1,000 AI-enabled clinics across India, revolutionizing healthcare with 
              advanced medical services, EHR integration, and AI-driven patient care.
            </p>

            <h2 className="text-3xl font-bold mb-6">Meet Our Founder – Dr. Manzoor Nellancheri</h2>
            <p className="text-lg text-gray-600 mb-8">
              Dr. Manzoor Nellancheri is a doctorpreneur dedicated to transforming healthcare with 
              AI technology and business strategies for doctors. With over 10 years of experience, 
              he has pioneered a unique family clinic model that ensures the highest patient satisfaction.
            </p>

            <div className="mt-8">
              <a 
                href="/contact" 
                className="inline-flex items-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors duration-200"
              >
                Want to join our mission? Contact us today!
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
