import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Search, ShoppingBag, User as UserIcon, MapPin, Menu, X,
  Heart, MessageSquare, Compass, Home, Package
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import ArtisanAvatar from './ArtisanAvatar';

export default function TopNav({ query, onQueryChange, onOpenCart, location, onLocationClick, onProfileClick }) {
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const { user, logout } = useAuth();
  const { cartCount, wishlist } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [animateCart, setAnimateCart] = useState(false);
  const [pulseBadge, setPulseBadge] = useState(false);
  const previousCartCount = useRef(cartCount);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Close drawer on route change
  useEffect(() => { setMobileMenuOpen(false); }, [routerLocation.pathname]);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const mobileNavItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Package, label: 'Products', path: '/products' },
    { icon: Compass, label: 'Meet the Artisans', path: '/discover-makers' },
    { icon: MessageSquare, label: 'Messages', path: '/messages', authRequired: true },
    { icon: Heart, label: 'Wishlist', path: '/wishlist' },
    { icon: UserIcon, label: 'Profile', path: '/profile', authRequired: true },
  ];

  return (
    <>
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-xl shadow-sm py-2' : 'bg-[#fafafa] py-3 md:py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-pink-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-pink-500/20 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <span className="text-lg md:text-xl font-black tracking-tighter text-gray-900 hidden sm:block">
              Artisan<span className="text-pink-500">Connect</span>
            </span>
          </Link>

          {/* Search Bar — hidden on mobile */}
          <div className="flex-1 max-w-2xl relative group hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
            <input
              type="text"
              placeholder="Search unique handcrafted items..."
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              onFocus={() => navigate('/products')}
              className="w-full bg-gray-50/50 hover:bg-white focus:bg-white border-2 border-transparent rounded-full py-3 pl-12 pr-4 text-sm font-medium focus:ring-4 focus:ring-pink-500/10 focus:border-pink-100 outline-none transition-all shadow-sm"
            />
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={onLocationClick}
              className="hidden lg:flex items-center gap-2 text-gray-500 hover:text-pink-500 transition-colors px-3 py-2 rounded-xl hover:bg-pink-50"
            >
              <MapPin className="w-5 h-5" />
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-widest leading-none">Deliver to</p>
                <p className="text-xs font-bold text-gray-900 truncate max-w-[80px]">{location?.city || 'Bangalore'}</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/messages')}
              className="p-2.5 text-gray-500 hover:text-pink-500 hover:bg-pink-50 rounded-xl transition-all"
            >
              <MessageSquare className="w-5 h-5" />
            </button>

            <button
              onClick={() => navigate('/discover-makers')}
              className="p-2.5 text-gray-500 hover:text-pink-500 hover:bg-pink-50 rounded-xl transition-all"
            >
              <Compass className="w-5 h-5" />
            </button>

            <button
              onClick={() => navigate('/wishlist')}
              className="relative p-2.5 text-gray-500 hover:text-pink-500 hover:bg-pink-50 rounded-xl transition-all"
            >
              <Heart className={`w-5 h-5 ${wishlist?.length > 0 ? 'fill-pink-500 text-pink-500' : ''}`} />
            </button>

            <button
              onClick={onOpenCart}
              data-cart-icon
              className={`relative p-2.5 text-gray-500 hover:text-pink-500 hover:bg-pink-50 rounded-xl transition-all ${animateCart ? 'cart-bounce' : ''}`}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span data-cart-badge className={`absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm ${pulseBadge ? 'badge-pulse' : ''}`}>
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => { if (user) navigate('/profile'); else onProfileClick?.(); }}
              className="flex items-center gap-2 p-1.5 pr-4 bg-white border border-gray-100 rounded-2xl hover:shadow-md transition-all group"
            >
              <div className="w-8 h-8 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center text-gray-400 group-hover:bg-pink-50 group-hover:text-pink-500 transition-colors shrink-0">
                {user ? (
                  <ArtisanAvatar 
                    name={user.displayName} 
                    photoURL={user.photoURL} 
                    isArtisan={user.role !== 'buyer'} 
                    className="w-full h-full text-sm"
                  />
                ) : (
                  <UserIcon className="w-5 h-5" />
                )}
              </div>
              <span className="text-sm font-bold text-gray-700 hidden sm:block truncate max-w-[80px]">
                {user ? (user.displayName?.split(' ')[0] || 'Account') : 'Login'}
              </span>
            </button>
          </div>

          {/* Mobile Right — cart + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenCart}
              data-cart-icon
              className={`relative p-2.5 text-gray-500 hover:text-pink-500 rounded-xl transition-all ${animateCart ? 'cart-bounce' : ''}`}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span data-cart-badge className={`absolute -top-1 -right-1 bg-pink-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white ${pulseBadge ? 'badge-pulse' : ''}`}>
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(v => !v)}
              className="p-2.5 text-gray-700 hover:text-pink-500 hover:bg-pink-50 rounded-xl transition-all"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden px-4 pb-3 mt-2">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search handcrafted items..."
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              onFocus={() => navigate('/products')}
              className="w-full bg-gray-50/50 focus:bg-white border border-gray-100 rounded-full py-2.5 pl-10 pr-4 text-sm font-medium outline-none shadow-sm transition-all"
            />
          </div>
        </div>
      </nav>

      {/* ── Mobile Drawer ──────────────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[80] md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Drawer */}
          <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-2xl flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center">
                  {user ? (
                    <ArtisanAvatar 
                      name={user.displayName} 
                      photoURL={user.photoURL} 
                      isArtisan={user.role !== 'buyer'} 
                      className="w-full h-full text-base"
                    />
                  ) : (
                    <UserIcon className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div>
                  <p className="font-black text-gray-900 text-sm">{user?.displayName || 'Guest'}</p>
                  <p className="text-xs text-gray-400">{user?.email || 'Not logged in'}</p>
                </div>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              {mobileNavItems.map(item => {
                if (item.authRequired && !user) return null;
                const active = routerLocation.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                      active
                        ? 'bg-gray-900 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${active ? 'text-pink-400' : 'text-gray-400'}`} />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Footer Actions */}
            <div className="p-4 border-t border-gray-50 space-y-2">
              {user ? (
                <>
                  <button
                    onClick={() => navigate('/profile')}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all"
                  >
                    <UserIcon className="w-5 h-5 text-gray-400" /> My Profile
                  </button>
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); navigate('/'); }}
                    className="w-full px-4 py-3 rounded-2xl text-sm font-black text-red-500 hover:bg-red-50 transition-all"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { setMobileMenuOpen(false); onProfileClick?.(); }}
                  className="w-full bg-gray-900 text-white font-black py-3.5 rounded-2xl text-sm hover:bg-pink-600 transition-all"
                >
                  Sign In / Register
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
