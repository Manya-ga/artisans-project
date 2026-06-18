import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

// Core Components
import TopNav from './components/TopNav.jsx';
import Footer from './components/Footer.jsx';
import BottomNav from './components/BottomNav.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import AuthModal from './components/AuthModal.jsx';
import LocationModal from './components/LocationModal.jsx';
import UniversalBackButton from './components/UniversalBackButton.jsx';

// Pages
import HomePage from './pages/HomePage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
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
import DiscoverMakersPage from './pages/DiscoverMakersPage.jsx';
import CartPage from './pages/CartPage.jsx';

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
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [query, setQuery] = useState('');
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [locationOpen, setLocationOpen] = useState(false);
  const isFullScreen = useIsFullScreen();
  
  const [location, setLocation] = useState(() => {
    const saved = localStorage.getItem('artisan_location');
    return saved ? JSON.parse(saved) : { pincode: '560001', city: 'Bangalore' };
  });

  // Open the auth modal programmatically (used by ProtectedRoute)
  const requireAuth = useCallback(() => {
    setAuthMode('login');
    setAuthOpen(true);
  }, []);

  // ProtectedRoute: renders children if authenticated, otherwise opens auth modal and redirects
  function ProtectedRoute({ children }) {
    if (!user) {
      // Use effect-free pattern: open modal via a wrapper component
      return <ProtectedRouteRedirect onRequireAuth={requireAuth} />;
    }
    return children;
  }

  function ProtectedRouteRedirect({ onRequireAuth }) {
    useEffect(() => {
      onRequireAuth();
    }, [onRequireAuth]);
    return <Navigate to="/" replace />;
  }

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
    <div className={`bg-[#fafafa] font-sans selection:bg-pink-100 selection:text-pink-900 ${isFullScreen ? 'flex flex-col h-[100dvh] overflow-hidden' : 'main-container'}`}>
      <ScrollToTop />
      <div className={isFullScreen ? 'hidden md:block' : ''}>
        <TopNav
          query={query}
          onQueryChange={setQuery}
          onOpenCart={() => navigate('/cart')}
          location={location}
          onLocationClick={() => setLocationOpen(true)}
          onProfileClick={() => {
            setAuthMode('login');
            setAuthOpen(true);
          }}
        />
      </div>

      <UniversalBackButton />

      <main className={`content w-full flex-1 ${
        isFullScreen
          ? 'p-0 overflow-hidden flex flex-col h-full'
          : 'max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-24 md:py-12'
      }`}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage query={query} />} />
          <Route path="/products" element={<ProductsPage query={query} />} />
          <Route path="/artisan/:id" element={<ArtisanProfile />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/discover-makers" element={<DiscoverMakersPage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/track" element={<TrackOrderPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cart" element={<CartPage />} />

          {/* Protected routes — opens auth modal if not logged in */}
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><MessagingPage /></ProtectedRoute>} />
          <Route path="/messages/:userId" element={<ProtectedRoute><MessagingPage /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/my-products" element={<ProtectedRoute><MyProductsPage /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {!isFullScreen && <Footer />}

      
      
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

      <BottomNav onOpenCart={() => navigate('/cart')} />
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
