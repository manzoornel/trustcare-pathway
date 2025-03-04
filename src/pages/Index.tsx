
import React from 'react';
import HeroSection from '@/components/HeroSection';
import ServicePreview from '@/components/ServicePreview';
import Testimonials from '@/components/Testimonials';
import CallToAction from '@/components/CallToAction';
import { DoctorProfiles } from '@/components/doctors';
import CasualtyServiceBanner from '@/components/CasualtyServiceBanner';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <ServicePreview />
      <CasualtyServiceBanner />
      <DoctorProfiles />
      <Testimonials />
      <CallToAction />
    </div>
  );
};

export default Index;
