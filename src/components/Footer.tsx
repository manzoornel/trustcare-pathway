
import { Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    {
      name: 'Facebook',
      href: 'https://m.facebook.com/Drunclefamilyclinic/',
      icon: Facebook,
      color: 'text-blue-600'
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/doctor_uncle_?igsh=MWNtYjhzNWg1dHZqdA%3D%3D&utm_source=qr',
      icon: Instagram,
      color: 'text-pink-600'
    },
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/company/dr-uncle/',
      icon: Linkedin,
      color: 'text-blue-700'
    },
    {
      name: 'Youtube',
      href: 'https://youtube.com/@doctoruncle6549?si=9uh_nDGiRAgLzOjk',
      icon: Youtube,
      color: 'text-red-600'
    }
  ];

  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center space-y-6">
          <img 
            src="/lovable-uploads/0876b966-5589-452f-b412-caa4a9700d33.png" 
            alt="Doctor Uncle Family Clinic" 
            className="h-12"
          />
          
          <div className="flex space-x-6">
            {socialLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${item.color} hover:opacity-75 transition-opacity`}
                aria-label={item.name}
              >
                <item.icon className="w-6 h-6" />
              </a>
            ))}
          </div>
          
          <div className="text-center">
            <p className="text-gray-700 font-semibold mb-3">Doctor Uncle - The Complete Family Clinic</p>
            
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="p-3 border border-gray-100 rounded-lg">
                <p className="font-medium text-gray-800 mb-1">Vakkad Branch (Near Malayalam University):</p>
                <p className="text-gray-500">Phone: 9961 588 880</p>
                <a 
                  href="https://maps.app.goo.gl/APyMEnBeAxSfB5bX8" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline mt-1 inline-block"
                >
                  View on Google Maps
                </a>
              </div>
              
              <div className="p-3 border border-gray-100 rounded-lg">
                <p className="font-medium text-gray-800 mb-1">Unniyal Branch (Unniyal Junction, Tanur Road):</p>
                <p className="text-gray-500">Phone: 8089 771 640 | 8089 771 641</p>
                <a 
                  href="https://maps.app.goo.gl/GqAqenygrwV5vo3cA" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline mt-1 inline-block"
                >
                  View on Google Maps
                </a>
              </div>
            </div>
            
            <p className="text-gray-500 text-sm mt-3">Email: contact@doctoruncle.in</p>
          </div>
          
          <p className="text-gray-500 text-sm text-center">
            © {new Date().getFullYear()} Doctor Uncle Family Clinic. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
