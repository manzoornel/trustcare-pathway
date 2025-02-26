
import { Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    {
      name: 'Facebook',
      href: 'https://facebook.com/docuncle',
      icon: Facebook,
      color: 'text-blue-600'
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com/docuncle',
      icon: Instagram,
      color: 'text-pink-600'
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/company/docuncle',
      icon: Linkedin,
      color: 'text-blue-700'
    },
    {
      name: 'Youtube',
      href: 'https://youtube.com/docuncle',
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
          
          <p className="text-gray-500 text-sm text-center">
            © {new Date().getFullYear()} Doctor Uncle Family Clinic. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
