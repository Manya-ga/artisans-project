import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Home, Compass, ShoppingBag, User, Heart } from 'lucide-react';
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

  return (
    <div className="md:hidden fixed bottom-6 left-4 right-4 z-[60]">
      <div className="bg-white/80 backdrop-blur-2xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.1)] rounded-[32px] p-2 flex items-center justify-around">
        <NavButton 
          icon={<Home className="w-5 h-5" />} 
          active={isActive('/')} 
          onClick={() => navigate('/')} 
        />
        <NavButton 
          icon={<Compass className="w-5 h-5" />} 
          active={isActive('/explore-artisans')} 
          onClick={() => navigate('/explore-artisans')} 
        />
        
        {/* Central Cart Button */}
        <button 
          onClick={onOpenCart}
          data-cart-icon
          className={`relative -mt-12 w-14 h-14 bg-gray-900 text-white rounded-full flex items-center justify-center shadow-2xl border-4 border-[#fafafa] active:scale-90 transition-transform ${animateCart ? 'cart-bounce' : ''}`}
        >
          <ShoppingBag className="w-6 h-6" />
          {cartCount > 0 && (
            <span data-cart-badge className={`absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white ${pulseBadge ? 'badge-pulse' : ''}`}>
              {cartCount}
            </span>
          )}
        </button>

        <NavButton 
          icon={<Heart className="w-5 h-5" />} 
          active={isActive('/wishlist')} 
          onClick={() => navigate(user ? '/wishlist' : '/')} 
        />
        <NavButton 
          icon={<User className="w-5 h-5" />} 
          active={isActive('/profile')} 
          onClick={() => navigate(user ? '/profile' : '/')} 
        />
      </div>
    </div>
  );
}

const NavButton = ({ icon, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`p-4 rounded-2xl transition-all duration-300 ${
      active ? 'bg-pink-50 text-pink-500 scale-110 shadow-inner shadow-pink-500/10' : 'text-gray-400'
    }`}
  >
    {icon}
  </button>
);
