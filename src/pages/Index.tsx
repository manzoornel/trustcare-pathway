
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import HeroSection from "@/components/HeroSection";
import ServicePreview from "@/components/ServicePreview";
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
        <title>Doctor Uncle Family Clinic | 24-Hour Clinic in Vakkad, Tirur &amp; Unniyal</title>
        <meta
          name="description"
          content="Family clinic near Tirur: Vakkad branch open 24 hours, Unniyal branch 7 AM–10 PM. General medicine, diabetes care, minor surgery, home visits, lab and pharmacy. Call 99615 88880."
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
