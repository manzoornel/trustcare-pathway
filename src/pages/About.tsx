
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
              healthcare provider in the community, offering comprehensive medical services to patients of all ages.
            </p>
            
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-8">
              Our mission is to deliver compassionate, patient-centered healthcare that focuses on prevention, 
              education, and treatment. We strive to create a welcoming environment where every patient feels 
              valued and receives the highest standard of care.
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
        <Footer />
      </div>
    </>
  );
};

export default About;
