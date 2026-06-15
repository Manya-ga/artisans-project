import { useNavigate } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid.jsx';
import { useCart } from '../contexts/CartContext.jsx';
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function WishlistPage() {
  const navigate = useNavigate();
  const { wishlist } = useCart();

  return (
    <div className="animate-fade-in space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 sm:p-3 bg-white border border-gray-100 rounded-2xl text-gray-500 hover:text-pink-500 hover:border-pink-100 transition-all shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-3xl font-black text-gray-900 tracking-tight">My Wishlist</h1>
            <p className="text-xs sm:text-sm font-medium text-gray-500">{wishlist.length} items saved</p>
          </div>
        </div>
        
        <button 
          onClick={() => navigate('/discovery')}
          className="flex items-center gap-2 bg-gray-900 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl font-bold hover:bg-pink-600 transition-all text-sm"
        >
          <ShoppingBag className="w-4 h-4" /> Continue Shopping
        </button>
      </div>

      {wishlist.length === 0 ? (
        <div className="card-premium p-10 sm:p-16 text-center flex flex-col items-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-pink-50 rounded-full flex items-center justify-center mb-4 sm:mb-6">
            <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-pink-200" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900">Your wishlist is empty</h2>
          <p className="text-gray-500 mt-2 max-w-sm text-sm sm:text-base">Save your favorite handcrafted items to find them easily later.</p>
          <button 
            onClick={() => navigate('/discovery')}
            className="mt-8 btn-primary px-8"
          >
            Explore Marketplace
          </button>
        </div>
      ) : (
        <ProductGrid products={wishlist} />
      )}
    </div>
  );
}
