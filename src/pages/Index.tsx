
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicePreview from "@/components/ServicePreview";
import Testimonials from "@/components/Testimonials";
import DoctorProfiles from "@/components/DoctorProfiles";
import BlogPreview from "@/components/BlogPreview";
import FAQ from "@/components/FAQ";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <ServicePreview />
      <Testimonials />
      <DoctorProfiles />
      <BlogPreview />
      <FAQ />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Index;
