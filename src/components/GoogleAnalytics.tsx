
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Replace with your actual Google Analytics Measurement ID
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set' | 'consent',
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}

const GoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Add Google Analytics script to the document
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    
    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_MEASUREMENT_ID}', { 'send_page_view': false });
    `;
    
    document.head.appendChild(script1);
    document.head.appendChild(script2);

    return () => {
      // Clean up on component unmount
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, []);

  // Track page views when the route changes
  useEffect(() => {
    if (window.gtag) {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: location.pathname + location.search,
      });
      console.log('Tracking pageview:', location.pathname + location.search);
    }
  }, [location]);

  return null; // This component doesn't render anything
};

export default GoogleAnalytics;
