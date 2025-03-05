
import { Calendar, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

const HeroSection = () => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [isSmiling, setIsSmiling] = useState(false);
  const { auth } = useAuth();
  const { theme } = useTheme();

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

  // Theme-specific content
  const getThemeContent = () => {
    switch(theme) {
      case 'eid':
        return {
          title: "Eid Mubarak from Doctor Uncle",
          subtitle: "Experience compassionate care during this blessed season. We're open during Eid to serve our community.",
          bgClass: "bg-gradient-to-b from-[#24936E]/90 to-[#F8F0DD]"
        };
      case 'ramzan':
        return {
          title: "Ramzan Kareem from Doctor Uncle",
          subtitle: "Wishing you health and happiness during this holy month. We're offering extended clinic hours for your convenience.",
          bgClass: "bg-gradient-to-b from-[#3A6351]/90 to-[#F7F7F7]"
        };
      case 'onam':
        return {
          title: "Happy Onam from Doctor Uncle",
          subtitle: "Celebrating the harvest festival with special health packages for the entire family.",
          bgClass: "bg-gradient-to-b from-[#F97316]/90 to-[#FEF7CD]"
        };
      case 'deepavali':
        return {
          title: "Happy Deepavali from Doctor Uncle",
          subtitle: "May the festival of lights bring you good health and happiness. Book your post-festival health check-up today.",
          bgClass: "bg-gradient-to-b from-[#9B4DCA]/90 to-[#F1E5F9]"
        };
      case 'health':
        return {
          title: "World Health Day Specials",
          subtitle: "Join us in celebrating World Health Day with free health check-ups and consultations.",
          bgClass: "bg-gradient-to-b from-[#2196F3]/90 to-[#E3F2FD]"
        };
      case 'xmas':
        return {
          title: "Season's Greetings from Doctor Uncle",
          subtitle: "Wishing you health and happiness this festive season. Special holiday hours available.",
          bgClass: "bg-gradient-to-b from-[#D32F2F]/90 to-[#FFEBEE]"
        };
      default:
        return {
          title: "Your Trusted Healthcare Partner",
          subtitle: "Experience compassionate care and medical excellence at Doctor Uncle Family Clinic. We're committed to your health and well-being.",
          bgClass: "bg-gradient-to-b from-secondary to-white"
        };
    }
  };

  const themeContent = getThemeContent();

  return (
    <div className={`min-h-screen flex items-center ${themeContent.bgClass} pt-16 transition-all duration-500`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-up">
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight ${theme !== 'default' ? 'festival-text-gradient' : 'text-gray-900'}`}>
              {themeContent.title}
            </h1>
            <p className="text-lg text-gray-600 max-w-xl">
              {themeContent.subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/appointments" 
                className={`inline-flex items-center px-6 py-3 ${theme !== 'default' ? 'bg-festival-primary' : 'bg-primary'} text-white font-semibold rounded-lg hover:opacity-90 transition-colors duration-200`}
              >
                <Calendar className="w-5 h-5 mr-2 animate-[pulse_2s_ease-in-out_infinite]" />
                Book Appointment
              </Link>
              
              {auth.isAuthenticated ? (
                <Link 
                  to="/patient-portal" 
                  className={`inline-flex items-center px-6 py-3 bg-white ${theme !== 'default' ? 'text-festival-primary border-festival-primary hover:bg-festival-primary/10' : 'text-primary border-primary hover:bg-primary/10'} font-semibold rounded-lg border-2 transition-colors duration-200`}
                >
                  Patient Portal
                </Link>
              ) : (
                <Link 
                  to="/login" 
                  className={`inline-flex items-center px-6 py-3 bg-white ${theme !== 'default' ? 'text-festival-primary border-festival-primary hover:bg-festival-primary/10' : 'text-primary border-primary hover:bg-primary/10'} font-semibold rounded-lg border-2 transition-colors duration-200`}
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Patient Login
                </Link>
              )}
              
              <Link 
                to="/services" 
                className="inline-flex items-center px-6 py-3 bg-transparent text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:bg-gray-100 transition-colors duration-200"
              >
                Our Services
              </Link>
            </div>

            {/* Festival-specific callout */}
            {theme !== 'default' && (
              <div className={`p-4 rounded-lg bg-white/80 backdrop-blur-sm border ${theme !== 'default' ? 'border-festival-primary/30' : 'border-primary/30'} shadow-sm mt-6 animate-fade-in`}>
                <p className="text-sm font-medium text-gray-800">
                  {theme === 'eid' && "Special Eid consultation hours: 9AM-8PM during the festival week"}
                  {theme === 'ramzan' && "Ramzan Special: Extended evening hours from 8PM-11PM throughout the holy month"}
                  {theme === 'onam' && "Onam Special: 20% off on family health packages until September 30th"}
                  {theme === 'deepavali' && "Deepavali Special: Free post-festival detox consultation until November 15th"}
                  {theme === 'health' && "World Health Day: Free basic health check-ups on April 7th"}
                  {theme === 'xmas' && "Holiday Hours: Dec 24th: 9AM-1PM, Dec 25th: Closed, Dec 26th: 10AM-4PM"}
                </p>
              </div>
            )}
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
    </div>
  );
};

export default HeroSection;
