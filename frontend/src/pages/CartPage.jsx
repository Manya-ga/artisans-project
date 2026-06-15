import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft, Tag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import { getProducts } from '../api';
import ProductCard from '../components/ProductCard';

export default function CartPage() {
  const navigate = useNavigate();
  const { cartItems, updateCartItemQty, removeFromCart, totals, cartCount, applyCoupon } = useCart();
  const { addToast } = useToast();
  
  const [couponInput, setCouponInput] = useState('');
  const [recommended, setRecommended] = useState([]);
  const [loadingRecommended, setLoadingRecommended] = useState(true);

  useEffect(() => {
    async function loadRecommended() {
      try {
        const res = await getProducts({ limit: 4 });
        setRecommended(res.products || []);
      } catch (e) {
        console.error('Failed to load recommended products', e);
      } finally {
        setLoadingRecommended(false);
      }
    }
    loadRecommended();
  }, []);

  const handleApplyCoupon = () => {
    if (couponInput.trim()) {
      applyCoupon(couponInput.trim().toUpperCase());
      setCouponInput('');
      addToast('Coupon applied!', 'success');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-fade-in">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-gray-200" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8">Add some artisan crafts to get started!</p>
        <button 
          onClick={() => navigate('/discovery')}
          className="btn-primary px-8 py-4 rounded-2xl flex items-center gap-2"
        >
          Browse Marketplace <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-20 animate-fade-in">
      {/* 1. Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-500 hover:text-pink-500 transition-all shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Shopping Cart</h1>
          <p className="text-sm font-medium text-gray-500">{cartCount} items selected</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* 2. Cart Items */}
        <div className="bg-white rounded-[32px] p-4 sm:p-6 shadow-sm border border-gray-100 space-y-6">
          <AnimatePresence initial={false}>
            {cartItems.map((item, idx) => (
              <motion.div
                key={item.productId}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className={`flex gap-4 group ${idx !== cartItems.length - 1 ? 'pb-6 border-b border-gray-50' : ''}`}
              >
                <div className="w-24 h-28 sm:w-32 sm:h-32 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-sm shrink-0">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-sm sm:text-base font-bold text-gray-900 line-clamp-2 pr-4">{item.title}</h3>
                      <button 
                        onClick={async () => {
                          await removeFromCart(item.productId);
                          addToast('Item removed', 'success');
                        }}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors bg-gray-50 rounded-xl"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">by {item.artisanName}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <p className="font-black text-lg sm:text-xl text-gray-900">₹{item.price}</p>
                    
                    <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1 border border-gray-100">
                      <button 
                        onClick={() => {
                          if (item.qty > 1) updateCartItemQty(item.productId, item.qty - 1);
                          else removeFromCart(item.productId);
                        }}
                        className="p-2 hover:bg-white rounded-lg transition-all text-gray-500"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-black text-gray-900">
                        {item.qty}
                      </span>
                      <button 
                        onClick={() => updateCartItemQty(item.productId, item.qty + 1)}
                        className="p-2 hover:bg-white rounded-lg transition-all text-gray-500"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* 3. Coupon Section */}
        <div className="bg-white p-5 sm:p-6 rounded-[24px] sm:rounded-[32px] border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-gray-900 font-black">
            <Tag className="w-5 h-5 text-pink-500" /> Apply Coupon
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Enter promo code"
              className="flex-1 bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:border-pink-200 focus:bg-white transition-all"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
            />
            <button 
              onClick={handleApplyCoupon}
              disabled={!couponInput.trim()}
              className="bg-gray-900 disabled:bg-gray-200 text-white px-6 py-3.5 rounded-2xl text-sm font-black hover:bg-pink-600 transition-all shrink-0"
            >
              Apply
            </button>
          </div>
        </div>

        {/* 4. Price Breakdown */}
        <div className="bg-white p-5 sm:p-6 rounded-[24px] sm:rounded-[32px] border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-black text-gray-900 text-lg border-b border-gray-50 pb-4">Order Summary</h3>
          <div className="space-y-3 pt-2">
            <div className="flex justify-between text-sm sm:text-base font-bold text-gray-500">
              <span>Subtotal</span>
              <span className="text-gray-900">₹{totals.subtotal}</span>
            </div>
            {totals.discount > 0 && (
              <div className="flex justify-between text-sm sm:text-base font-bold text-green-600 bg-green-50/50 p-2 -mx-2 rounded-xl">
                <span>Coupon Discount</span>
                <span>-₹{totals.discount}</span>
              </div>
            )}
            <div className="flex justify-between text-sm sm:text-base font-bold text-gray-500">
              <span>Shipping Fee</span>
              <span className={totals.shipping === 0 ? 'text-green-600' : 'text-gray-900'}>
                {totals.shipping === 0 ? 'FREE' : `₹${totals.shipping}`}
              </span>
            </div>
            <div className="flex justify-between text-sm sm:text-base font-bold text-gray-500">
              <span>Taxes & Duties</span>
              <span className="text-gray-900">₹{totals.taxes}</span>
            </div>
            
            <div className="h-px bg-gray-100 my-4" />
            
            <div className="flex justify-between items-baseline pt-2">
              <span className="text-lg sm:text-xl font-black text-gray-900">Total Amount</span>
              <span className="text-2xl sm:text-3xl font-black text-pink-500">₹{totals.total}</span>
            </div>
          </div>
        </div>

        {/* Checkout & Continue Actions (Not Fixed/Sticky) */}
        <div className="space-y-3 pt-4">
          <button 
            onClick={() => navigate('/checkout')}
            className="w-full btn-primary py-4 sm:py-5 rounded-[24px] flex items-center justify-center gap-3 text-lg sm:text-xl font-black group shadow-elevated"
          >
            Proceed to Checkout
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full bg-white text-gray-900 border border-gray-200 py-4 sm:py-5 rounded-[24px] font-black hover:bg-gray-50 transition-all text-base sm:text-lg"
          >
            Continue Shopping
          </button>
        </div>

        {/* 5. Recommended Products */}
        {!loadingRecommended && recommended.length > 0 && (
          <div className="pt-10 space-y-6">
            <h3 className="text-xl font-black text-gray-900 px-2">You might also like</h3>
            <div className="grid grid-cols-2 gap-3 sm:gap-6">
              {recommended.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
