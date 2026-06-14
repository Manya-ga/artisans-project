import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star, Plus, Trash2, Edit3 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { deleteProduct } from '../api';
import { useToast } from '../contexts/ToastContext';
import { animateAddToCart } from '../utils/cartAnimation';

const ProductCard = React.forwardRef(({ product, isOwner, onProductDeleted }, ref) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [deleting, setDeleting] = useState(false);
  
  const id = product?._id || product?.id;
  const inWishlist = isInWishlist(id);

  const handleAddToCart = useCallback(async (e) => {
    e.stopPropagation();
    if (!product) return;
    const imageNode = e.currentTarget.closest('button')?.closest('.card-premium')?.querySelector('img');
    await addToCart(product, 1);
    if (imageNode) animateAddToCart(imageNode);
    addToast('Product Added to Cart Successfully');
  }, [addToCart, addToast, product]);

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    if (!product) return;
    toggleWishlist(product);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!id) return;
    if (!window.confirm('Are you sure you want to delete this masterpiece?')) return;
    
    setDeleting(true);
    try {
      await deleteProduct(id);
      addToast?.('Product removed from marketplace', 'success');
      onProductDeleted?.();
    } catch (err) {
      addToast?.(err.message || 'Failed to delete product', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const price = product?.price || 0;
  const formattedPrice = `₹${Number(price).toLocaleString()}`;

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => id && navigate(`/product/${id}`)}
      className={`group relative cursor-pointer ${deleting ? 'opacity-50 grayscale' : ''}`}
    >
      <div className="card-premium h-full flex flex-col overflow-hidden bg-white">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          {product?.image || product?.images?.[0] ? (
            <img
              src={product?.image || product?.images?.[0]}
              alt={product?.title || 'Product'}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          {/* Clean fallback — no fake photos */}
          <div
            className="w-full h-full items-center justify-center flex-col gap-2 bg-gradient-to-br from-gray-50 to-gray-100"
            style={{ display: (product?.image || product?.images?.[0]) ? 'none' : 'flex' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">No Image</span>
          </div>
          
          {/* Action Buttons */}
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
            {isOwner ? (
              <>
                <button 
                  onClick={(e) => { e.stopPropagation(); }}
                  className="p-2.5 rounded-full bg-white/90 backdrop-blur-md text-gray-400 hover:text-indigo-600 shadow-sm transition-all"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleDelete}
                  disabled={deleting}
                  className="p-2.5 rounded-full bg-white/90 backdrop-blur-md text-gray-400 hover:text-red-500 shadow-sm transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button 
                onClick={handleWishlistToggle}
                className={`p-2.5 rounded-full backdrop-blur-md transition-all duration-300 ${
                  inWishlist ? 'bg-pink-500 text-white shadow-lg scale-110' : 'bg-white/90 text-gray-400 hover:text-pink-500 hover:scale-110 shadow-sm'
                }`}
              >
                <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
              </button>
            )}
          </div>

          {/* Discount Badge */}
          {product?.discount && (
            <div className="absolute top-4 left-4 bg-gray-900 text-white text-[10px] font-black px-2.5 py-1.5 rounded-lg shadow-sm uppercase tracking-wider">
              {product.discount}% OFF
            </div>
          )}

          {/* Quick Add Overlay */}
          {!isOwner && (
            <div className="absolute inset-x-4 bottom-4 transition-all duration-300 transform lg:translate-y-4 lg:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 translate-y-0 opacity-100">
              <button 
                onClick={handleAddToCart}
                className="w-full bg-white text-gray-900 font-black py-3.5 rounded-2xl shadow-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm active:scale-95"
              >
                <Plus className="w-4 h-4" />
                Add to Cart
              </button>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-pink-500 bg-pink-50 px-2 py-0.5 sm:py-1 rounded-md">
              {product?.category || 'Handcrafted'}
            </span>
            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              {product?.rating || '4.8'}
            </div>
          </div>

          <h3 className="font-bold text-gray-900 text-sm md:text-base mb-1 line-clamp-1 group-hover:text-pink-600 transition-colors">
            {product?.title || product?.name}
          </h3>
          
          <p className="text-[10px] sm:text-xs text-gray-500 font-medium mb-3 line-clamp-1">by {product?.artisanName}</p>

          <div className="mt-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-gray-900">{formattedPrice}</span>
              {product?.oldPrice && (
                <span className="text-xs text-gray-400 line-through">₹{product.oldPrice}</span>
              )}
            </div>
            
            {!isOwner && (
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleAddToCart}
                  className="p-3 bg-pink-50 text-pink-600 rounded-xl hover:bg-pink-100 transition-colors shadow-sm active:scale-95 flex items-center justify-center shrink-0"
                  aria-label="Add to cart"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button 
                  onClick={async (e) => {
                    e.stopPropagation();
                    const imageNode = e.currentTarget.closest('.card-premium')?.querySelector('img');
                    await addToCart(product, 1);
                    if (imageNode) animateAddToCart(imageNode);
                    addToast('Product Added to Cart Successfully');
                    navigate('/checkout');
                  }}
                  className="flex-1 sm:flex-none p-3 bg-gray-900 text-white rounded-xl hover:bg-pink-600 transition-colors shadow-sm active:scale-95 flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 hidden sm:block" />
                  <span className="text-xs sm:text-sm font-black uppercase">Buy</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default React.memo(ProductCard);
