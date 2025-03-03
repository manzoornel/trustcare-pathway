
import { useState } from 'react';
import { Menu, X, LogIn } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { auth } = useAuth();
  
  const menuItems = [{
    name: 'Home',
    href: '/'
  }, {
    name: 'About',
    href: '/about'
  }, {
    name: 'Services',
    href: '/services'
  }, {
    name: 'AI Chat',
    href: '/ai-chat'
  }, {
    name: 'Appointments',
    href: '/appointments'
  }, {
    name: 'Blog',
    href: '/blog'
  }, {
    name: 'Careers',
    href: '/careers'
  }, {
    name: 'Contact',
    href: '/contact'
  }];
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return <nav className="fixed w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img alt="Doctor Uncle Family Clinic" className="h-12 w-auto object-fill" src="/lovable-uploads/aecf0946-605c-425b-be2e-d2caff2dce4e.png" />
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map(item => <Link key={item.name} to={item.href} className={`${isActive(item.href) ? "text-primary font-semibold" : "text-gray-600 hover:text-primary"} transition-colors duration-200 font-display`}>
                {item.name}
              </Link>)}
              
            {auth.isAuthenticated ? (
              <Link to="/patient-portal" className="flex items-center text-primary font-semibold transition-colors duration-200 font-display">
                Patient Portal
              </Link>
            ) : (
              <Link to="/login" className="flex items-center gap-1 text-primary hover:text-primary/80 font-semibold transition-colors duration-200 font-display">
                <LogIn size={18} />
                Patient Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-primary focus:outline-none">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && <div className="md:hidden animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
            {menuItems.map(item => <Link key={item.name} to={item.href} className={`block px-3 py-2 text-base font-medium ${isActive(item.href) ? "text-primary" : "text-gray-600 hover:text-primary"} font-display`} onClick={() => setIsOpen(false)}>
                {item.name}
              </Link>)}
              
            {auth.isAuthenticated ? (
              <Link to="/patient-portal" className="block px-3 py-2 text-base font-medium text-primary font-display" onClick={() => setIsOpen(false)}>
                Patient Portal
              </Link>
            ) : (
              <Link to="/login" className="flex items-center gap-1 px-3 py-2 text-base font-medium text-primary font-display" onClick={() => setIsOpen(false)}>
                <LogIn size={18} />
                Patient Login
              </Link>
            )}
          </div>
        </div>}
    </nav>;
};

export default Navbar;
