import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Home, LayoutGrid, ShoppingBag, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export default function BottomNav({ onOpenCart }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide BottomNav on product details, checkout, messages, and cart
  const hideOnPaths = ['/product/', '/messages', '/checkout', '/cart'];
  const shouldHide = hideOnPaths.some(p => location.pathname.startsWith(p));
  if (shouldHide) return null;

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
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[60] bg-white border-t border-gray-100 pb-safe">
      <div className="flex items-center justify-around px-2 py-2">
        <NavButton 
          icon={<Home className="w-6 h-6" />} 
          label="Home"
          active={isActive('/')} 
          onClick={() => navigate('/')} 
        />
        <NavButton 
          icon={<LayoutGrid className="w-6 h-6" />} 
          label="Categories"
          active={isActive('/explore-artisans')} 
          onClick={() => navigate('/explore-artisans')} 
        />
        
        <button 
          onClick={onOpenCart}
          data-cart-icon
          className={`relative flex flex-col items-center justify-center w-16 h-12 gap-1 transition-all ${animateCart ? 'cart-bounce text-pink-500' : 'text-gray-400 hover:text-gray-900'}`}
        >
          <div className="relative">
            <ShoppingBag className="w-6 h-6" />
            {cartCount > 0 && (
              <span data-cart-badge className={`absolute -top-1.5 -right-1.5 bg-pink-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white ${pulseBadge ? 'badge-pulse' : ''}`}>
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold">Cart</span>
        </button>

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
