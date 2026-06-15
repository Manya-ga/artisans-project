import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Core Components
import TopNav from './components/TopNav.jsx';
import Footer from './components/Footer.jsx';
import BottomNav from './components/BottomNav.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import AuthModal from './components/AuthModal.jsx';
import CartPanel from './components/CartPanel.jsx';
import LocationModal from './components/LocationModal.jsx';

// Pages
import HomePage from './pages/HomePage.jsx';
import DiscoveryPage from './pages/DiscoveryPage.jsx';
import ArtisanProfile from './pages/ArtisanProfile.jsx';
import Profile from './pages/Profile.jsx';
import ProductDetailPage from './pages/ProductDetail.jsx';
import WishlistPage from './pages/WishlistPage.jsx';
import MyProductsPage from './pages/MyProducts.jsx';
import CheckoutPage from './pages/Checkout.jsx';
import OffersPage from './pages/OffersPage.jsx';
import HelpPage from './pages/HelpPage.jsx';
import TrackOrderPage from './pages/TrackOrderPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import MessagingPage from './pages/MessagingPage.jsx';
import ExplorePage from './pages/ExplorePage.jsx';


// Contexts
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { CartProvider } from './contexts/CartContext.jsx';
import { ToastProvider } from './contexts/ToastContext.jsx';
import { SocialProvider } from './contexts/SocialContext.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Routes that need zero padding / full-viewport layout
const FULL_SCREEN_ROUTES = ['/messages'];

function useIsFullScreen() {
  const { pathname } = useLocation();
  return FULL_SCREEN_ROUTES.some(r => pathname.startsWith(r));
}

function AppInner() {
  const { user, loading: authLoading } = useAuth();
  const [query, setQuery] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [locationOpen, setLocationOpen] = useState(false);
  const isFullScreen = useIsFullScreen();
  
  const [location, setLocation] = useState(() => {
    const saved = localStorage.getItem('artisan_location');
    return saved ? JSON.parse(saved) : { pincode: '560001', city: 'Bangalore' };
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-8 border-pink-100 border-t-pink-500 rounded-full animate-spin" />
          <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Authenticating Artisan Connect...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-container bg-[#fafafa] font-sans selection:bg-pink-100 selection:text-pink-900">
      <ScrollToTop />
      <TopNav
        query={query}
        onQueryChange={setQuery}
        onOpenCart={() => setCartOpen(true)}
        location={location}
        onLocationClick={() => setLocationOpen(true)}
        onProfileClick={() => {
          setAuthMode('login');
          setAuthOpen(true);
        }}
      />

      <main className={`content w-full ${
        isFullScreen
          ? 'p-0 overflow-hidden'
          : 'max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12'
      }`}>
        <Routes>
          <Route path="/" element={<HomePage query={query} />} />
          <Route path="/discovery" element={<DiscoveryPage query={query} />} />
          <Route path="/artisan/:id" element={<ArtisanProfile />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/explore-artisans" element={<ExplorePage />} />
          <Route path="/messages" element={user ? <MessagingPage /> : <Navigate to="/" />} />
          <Route path="/messages/:userId" element={user ? <MessagingPage /> : <Navigate to="/" />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/my-products" element={user ? <MyProductsPage /> : <Navigate to="/" />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/track" element={<TrackOrderPage />} />
          <Route path="/contact" element={<ContactPage />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {!isFullScreen && <Footer />}

      <CartPanel open={cartOpen} onClose={() => setCartOpen(false)} />
      
      <AuthModal
        open={authOpen}
        mode={authMode}
        onClose={() => setAuthOpen(false)}
        onChangeMode={(m) => setAuthMode(m)}
      />

      <LocationModal 
        open={locationOpen} 
        onClose={() => setLocationOpen(false)}
        currentLocation={location}
        onSave={(loc) => {
          setLocation(loc);
          localStorage.setItem('artisan_location', JSON.stringify(loc));
        }}
      />

      <BottomNav onOpenCart={() => setCartOpen(true)} />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <SocialProvider>
            <CartProvider>
              <AppInner />
            </CartProvider>
          </SocialProvider>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}
