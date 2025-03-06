
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import HeroSection from "@/components/HeroSection";
import ServicePreview from "@/components/ServicePreview";
import Testimonials from "@/components/Testimonials";
import BlogPreview from "@/components/BlogPreview";
import CallToAction from "@/components/CallToAction";
import FestivalDecorations from "@/components/FestivalDecorations";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTheme } from "@/contexts/ThemeContext";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import AIChatWidget from "@/components/AIChatWidget";
import HomeCareServices from "@/components/HomeCareServices";
import CasualtyServiceBanner from "@/components/CasualtyServiceBanner";
import DoctorProfiles from "@/components/doctors/DoctorProfiles";
import PatientReviews from "@/components/PatientReviews";

const Index = () => {
  const { theme } = useTheme();

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Doctor Uncle - The Complete Family Clinic</title>
        <meta
          name="description"
          content="Experience compassionate care and medical excellence at Doctor Uncle Family Clinic. We're committed to your health and well-being."
        />
      </Helmet>

      <Navbar />
      <main>
        <FestivalDecorations />
        <HeroSection />
        <CasualtyServiceBanner />
        <ServicePreview />
        <HomeCareServices />
        <DoctorProfiles />
        <PatientReviews />
        <Testimonials />
        <BlogPreview />
        <CallToAction />
      </main>
      <Footer />
      <ThemeSwitcher />
      <AIChatWidget />
    </>
  );
};

export default Index;
