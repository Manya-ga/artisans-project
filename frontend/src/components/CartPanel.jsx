import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';

export default function CartPanel({ open, onClose }) {
  const navigate = useNavigate();
  const { cartItems, updateCartItemQty, removeFromCart, totals, cartCount, applyCoupon } = useCart();
  const { addToast } = useToast();
  const [couponInput, setCouponInput] = useState('');
  const [removeCandidate, setRemoveCandidate] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-stretch md:justify-end overflow-hidden">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      {/* Panel */}
      <motion.div
        initial={isMobile ? { y: '100%' } : { x: '100%' }}
        animate={isMobile ? { y: 0 } : { x: 0 }}
        exit={isMobile ? { y: '100%' } : { x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full max-w-md bg-white h-[90vh] md:h-full rounded-t-3xl md:rounded-none shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center text-pink-500">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900">Your Cart</h2>
              <p className="text-xs font-bold text-gray-400">{cartCount} Items</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-gray-200" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">Cart is empty</p>
                <p className="text-sm text-gray-500">Add some artisan crafts to get started!</p>
              </div>
              <button onClick={onClose} className="btn-primary mt-4">Browse Marketplace</button>
            </div>
          ) : (
            <AnimatePresence initial={false} mode="popLayout">
              {cartItems.map((item) => (
                <motion.div
                  key={item.productId}
                  layout
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0, marginTop: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex gap-4 group"
                >
                  <div className="w-20 h-24 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-sm shrink-0">
                    <img src={item.image} alt={item.title} loading="lazy" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{item.title}</h3>
                        <button 
                          onClick={() => setRemoveCandidate(item)}
                          className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors text-xs font-black p-2 -mr-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">by {item.artisanName}</p>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <p className="font-black text-gray-900">₹{item.price * item.qty}</p>
                      <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1 border border-gray-100">
                        <button 
                          onClick={() => item.qty > 1 ? updateCartItemQty(item.productId, item.qty - 1) : setRemoveCandidate(item)}
                          className="p-2 hover:bg-white rounded-lg transition-all"
                        >
                          <Minus className="w-4 h-4 text-gray-500" />
                        </button>
                        <motion.span
                          key={item.qty}
                          initial={{ scale: 0.9, opacity: 0.6 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.2 }}
                          className="w-8 text-center text-sm font-black text-gray-900"
                        >
                          {item.qty}
                        </motion.span>
                        <button 
                          onClick={() => updateCartItemQty(item.productId, item.qty + 1)}
                          className="p-2 hover:bg-white rounded-lg transition-all"
                        >
                          <Plus className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        <AnimatePresence>
          {removeCandidate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-gray-100"
              >
                <h3 className="text-xl font-black text-gray-900">Remove this item from your cart?</h3>
                <p className="text-sm text-gray-500 mt-3">This action will remove the selected item and update your totals instantly.</p>
                <div className="mt-6 flex items-center justify-end gap-3">
                  <button
                    onClick={() => setRemoveCandidate(null)}
                    className="rounded-2xl px-5 py-3 text-sm font-black text-gray-500 bg-gray-100 hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      await removeFromCart(removeCandidate.productId);
                      addToast('Item Removed Successfully', 'success');
                      setRemoveCandidate(null);
                    }}
                    className="rounded-2xl px-5 py-3 text-sm font-black text-white bg-pink-500 hover:bg-pink-600 transition-all"
                  >
                    Remove
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-8 border-t border-gray-100 space-y-6 bg-gray-50/50">
            {/* Coupon Section */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Apply Artisan Coupon</p>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="CODE123"
                  className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-pink-500/10 transition-all"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                />
                <button 
                  onClick={() => {
                    if (couponInput) {
                      applyCoupon(couponInput);
                      setCouponInput('');
                    }
                  }}
                  className="bg-gray-900 text-white px-4 py-2 rounded-xl text-xs font-black hover:bg-black transition-all"
                >
                  APPLY
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm font-bold text-gray-500">
                <span>Subtotal</span>
                <span className="text-gray-900">₹{totals.subtotal}</span>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-sm font-bold text-green-600">
                  <span>Discount</span>
                  <span>-₹{totals.discount}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-gray-500">
                <span>Delivery</span>
                <span className={totals.shipping === 0 ? 'text-green-600' : 'text-gray-900'}>
                  {totals.shipping === 0 ? 'FREE' : `₹${totals.shipping}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-gray-500">
                <span>Taxes</span>
                <span className="text-gray-900">₹{totals.taxes}</span>
              </div>
              <div className="h-px bg-gray-200 my-2" />
              <div className="flex justify-between items-baseline">
                <span className="text-lg font-black text-gray-900">Total</span>
                <span className="text-2xl font-black text-pink-500">₹{totals.total}</span>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                navigate('/');
              }}
              className="w-full bg-white text-gray-900 border border-gray-200 py-4 rounded-2xl font-black hover:bg-gray-50 transition-all"
            >
              Continue Shopping
            </button>
            <button 
              onClick={() => {
                onClose();
                navigate('/checkout');
              }}
              className="w-full btn-primary py-5 rounded-2xl flex items-center justify-center gap-3 text-lg font-black group shadow-elevated"
            >
              Checkout Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
