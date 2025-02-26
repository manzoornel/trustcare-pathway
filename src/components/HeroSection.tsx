import { Calendar } from 'lucide-react';
const HeroSection = () => {
  return <div className="min-h-screen flex items-center bg-gradient-to-b from-secondary to-white pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
              Your Trusted Healthcare Partner
            </h1>
            <p className="text-lg text-gray-600 max-w-xl">
              Experience compassionate care and medical excellence at Doctor Uncle Family Clinic. 
              We're committed to your health and well-being.
            </p>
            <div className="space-x-4">
              <a href="#appointments" className="inline-flex items-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors duration-200">
                <Calendar className="w-5 h-5 mr-2" />
                Book Appointment
              </a>
              <a href="#services" className="inline-flex items-center px-6 py-3 bg-white text-primary font-semibold rounded-lg border-2 border-primary hover:bg-primary/10 transition-colors duration-200">
                Our Services
              </a>
            </div>
          </div>
          <div className="relative animate-fade-up" style={{
          animationDelay: '200ms'
        }}>
            <div className="aspect-w-16 aspect-h-9 rounded-2xl overflow-hidden shadow-2xl">
              <img alt="Doctor consulting with patient" className="object-cover w-full h-full rounded-2xl" src="/lovable-uploads/d18bbc61-0f35-4480-9b29-cf9dd88e75d3.png" />
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default HeroSection;