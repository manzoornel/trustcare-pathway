
import Navbar from "@/components/Navbar";
import { Helmet } from "react-helmet";
import Footer from "@/components/Footer";

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
              At Doctor Uncle Family Clinic, we are a team of dedicated healthcare professionals committed to providing
              exceptional medical care with a personal touch. Founded in 2020, our clinic has quickly become a trusted
              healthcare provider in the community, offering comprehensive medical services to patients of all ages
              through our two convenient branch locations in Vakkad and Unniyal.
            </p>
            
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-8">
              Our mission is to deliver compassionate, patient-centered healthcare that focuses on prevention, 
              education, and treatment. We strive to create a welcoming environment where every patient feels 
              valued and receives the highest standard of care, regardless of which branch they visit.
            </p>

            <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
            <p className="text-lg text-gray-600 mb-8">
              We envision a future where healthcare is accessible to everyone, where technology enhances 
              the doctor-patient relationship, and where preventive care leads to healthier communities.
              Our goal is to expand our services while maintaining our commitment to personalized care.
            </p>

            <h2 className="text-3xl font-bold mb-6">Meet Our Founder – Dr. Manzoor Nellancheri</h2>
            <p className="text-lg text-gray-600 mb-8">
              Dr. Manzoor Nellancheri founded Doctor Uncle Family Clinic with the vision of transforming 
              traditional healthcare. With over 15 years of experience in family medicine, Dr. Nellancheri 
              combines clinical expertise with a passionate commitment to patient education and empowerment.
              Under his leadership, we've grown from a single clinic to two thriving branches serving the
              community with excellence.
            </p>

            <h2 className="text-3xl font-bold mb-6">Our Locations</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold mb-2">Vakkad Branch</h3>
                <p className="text-gray-600 mb-3">Located near Aneesha Theatre, our Vakkad branch offers a full range of family healthcare services in a modern facility.</p>
                <a 
                  href="https://maps.app.goo.gl/APyMEnBeAxSfB5bX8" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  View on Google Maps
                </a>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold mb-2">Unniyal Branch</h3>
                <p className="text-gray-600 mb-3">Our Unniyal branch, located at Unniyal Junction on Tanur Road, provides convenient access to quality healthcare for patients in the surrounding areas.</p>
                <a 
                  href="https://maps.app.goo.gl/GqAqenygrwV5vo3cA" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  View on Google Maps
                </a>
              </div>
            </div>

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
        <Footer />
      </div>
    </>
  );
};

export default About;
