import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Home, Package, Compass, MessageSquare, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export default function BottomNav({ onOpenCart }) {
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useAuth();
  const { cartCount } = useCart();
  const [animateCart, setAnimateCart] = useState(false);
  const [pulseBadge, setPulseBadge] = useState(false);
  const previousCartCount = useRef(cartCount);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const prevCount = previousCartCount.current;
    if (cartCount > prevCount) {
      setAnimateCart(true);
      setPulseBadge(true);
      const timeout = window.setTimeout(() => {
        setAnimateCart(false);
        setPulseBadge(false);
      }, 700);
      previousCartCount.current = cartCount;
      return () => window.clearTimeout(timeout);
    }
    previousCartCount.current = cartCount;
  }, [cartCount]);

  const hideOnPaths = ['/product/', '/messages', '/checkout', '/cart'];
  const shouldHide = hideOnPaths.some(p => location.pathname.startsWith(p));
  
  if (shouldHide) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[60] bg-white border-t border-gray-100 pb-safe">
      <div className="flex items-center justify-around px-2 py-2">
        <NavButton 
          icon={<Home className="w-6 h-6" />} 
          label="Home"
          active={isActive('/')} 
          onClick={() => navigate('/')} 
        />
        <NavButton 
          icon={<Package className="w-6 h-6" />} 
          label="Products"
          active={isActive('/products')} 
          onClick={() => navigate('/products')} 
        />
        <NavButton 
          icon={<Compass className="w-6 h-6" />} 
          label="Discover Makers"
          active={isActive('/discover-makers')} 
          onClick={() => navigate('/discover-makers')} 
        />
        <NavButton 
          icon={<MessageSquare className="w-6 h-6" />} 
          label="Messages"
          active={isActive('/messages')} 
          onClick={() => navigate(user ? '/messages' : '/')} 
        />
        <NavButton 
          icon={<User className="w-6 h-6" />} 
          label="Profile"
          active={isActive('/profile')} 
          onClick={() => navigate(user ? '/profile' : '/')} 
        />
      </div>
    </div>
  );
}

const NavButton = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-16 h-12 gap-1 transition-all ${
      active ? 'text-pink-500' : 'text-gray-400 hover:text-gray-900'
    }`}
  >
    {icon}
    <span className="text-[10px] font-bold">{label}</span>
  </button>
);
