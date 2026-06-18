import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function UniversalBackButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Hide on the home page or specific root paths
    if (location.pathname === '/' || location.pathname === '') {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed top-4 left-4 md:top-24 md:left-6 z-[70] transition-all duration-300 ${
        isScrolled ? 'opacity-50 hover:opacity-100' : 'opacity-100'
      }`}
    >
      <button
        onClick={() => {
          // Check if there is history to go back to. If not, go to home
          if (window.history.length > 2) {
            navigate(-1);
          } else {
            navigate('/');
          }
        }}
        className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-white/80 backdrop-blur-md rounded-full shadow-md border border-gray-100 hover:shadow-lg hover:scale-105 hover:bg-white text-gray-700 hover:text-pink-500 transition-all group"
        aria-label="Go Back"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
}
