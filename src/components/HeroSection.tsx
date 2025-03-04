import { Calendar, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const HeroSection = () => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [isSmiling, setIsSmiling] = useState(false);
  const { auth } = useAuth();

  useEffect(() => {
    // Blinking animation - every 3 seconds
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 300);
    }, 3000);

    // Smiling animation - every 5 seconds
    const smileInterval = setInterval(() => {
      setIsSmiling(true);
      setTimeout(() => setIsSmiling(false), 1500);
    }, 5000);

    return () => {
      clearInterval(blinkInterval);
      clearInterval(smileInterval);
    };
  }, []);

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
            <div className="flex flex-wrap gap-4">
              <Link to="/appointments" className="inline-flex items-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors duration-200">
                <Calendar className="w-5 h-5 mr-2 animate-[pulse_2s_ease-in-out_infinite]" />
                Book Appointment
              </Link>
              
              {auth.isAuthenticated ? <Link to="/patient-portal" className="inline-flex items-center px-6 py-3 bg-white text-primary font-semibold rounded-lg border-2 border-primary hover:bg-primary/10 transition-colors duration-200">
                  Patient Portal
                </Link> : <Link to="/login" className="inline-flex items-center px-6 py-3 bg-white text-primary font-semibold rounded-lg border-2 border-primary hover:bg-primary/10 transition-colors duration-200">
                  <LogIn className="w-5 h-5 mr-2" />
                  Patient Login
                </Link>}
              
              <Link to="/services" className="inline-flex items-center px-6 py-3 bg-transparent text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:bg-gray-100 transition-colors duration-200">
                Our Services
              </Link>
            </div>
          </div>
          <div className="relative animate-fade-up" style={{
          animationDelay: '200ms'
        }}>
            <div className="aspect-w-16 aspect-h-9 rounded-2xl overflow-hidden shadow-2xl">
              <div className="relative w-full h-full">
                <img 
                  alt="Doctor consulting with patient" 
                  src="/lovable-uploads/d18bbc61-0f35-4480-9b29-cf9dd88e75d3.png" 
                  className="w-full h-full object-cover" 
                />
                {isBlinking && <div className="absolute inset-0 bg-white opacity-10 animate-pulse" />}
                {isSmiling && <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-20 h-5 bg-primary opacity-20 rounded-full animate-pulse" />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};

export default HeroSection;
