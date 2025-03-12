
import { useState } from 'react';
import { Menu, X, LogIn, UserRound } from 'lucide-react';
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
    name: 'Our Doctors',
    href: '/doctors',
    icon: UserRound
  }, {
    name: 'AI Chat',
    href: '/ai-chat'
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
  
  const isDemoAccount = auth.userId?.startsWith('demo-');
  
  return <nav className="fixed w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/ae63c3bf-5d6c-4576-8d59-1311ca468c30.png" 
                alt="Doctor Uncle" 
                className="h-12 w-auto" 
              />
              <span className="ml-2 text-xl font-bold text-primary">Doctor Uncle</span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map(item => <Link key={item.name} to={item.href} className={`${isActive(item.href) ? "text-primary font-semibold" : "text-gray-600 hover:text-primary"} transition-colors duration-200 font-display`}>
                {item.icon && <item.icon className="inline-block mr-1 h-4 w-4" />} {item.name}
              </Link>)}
              
            {auth.isAuthenticated ? (
              <Link to="/patient-portal" className="flex items-center gap-1">
                <span className="text-primary font-semibold transition-colors duration-200 font-display">
                  Patient Portal
                </span>
                {isDemoAccount && (
                  <span className="text-xs px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded">Demo</span>
                )}
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
                {item.icon && <item.icon className="inline-block mr-1 h-4 w-4" />} {item.name}
              </Link>)}
              
            {auth.isAuthenticated ? (
              <Link to="/patient-portal" className="flex items-center gap-1 px-3 py-2" onClick={() => setIsOpen(false)}>
                <span className="text-base font-medium text-primary font-display">
                  Patient Portal
                </span>
                {isDemoAccount && (
                  <span className="text-xs px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded">Demo</span>
                )}
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
