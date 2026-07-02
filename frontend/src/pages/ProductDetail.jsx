import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import { getProductById } from '../api';
import { animateAddToCart } from '../utils/cartAnimation';
import { ArrowLeft, Star, ShieldCheck, Truck, RefreshCcw, Plus, Minus, ShoppingBag, Heart, MessageSquare } from 'lucide-react';
import { ProductSkeleton } from '../components/Skeleton';
import PageHeader from '../components/PageHeader';
import ArtisanAvatar from '../components/ArtisanAvatar';
import { getFallbackProductImage, getProductImage } from '../config/imageMappings';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { addToast } = useToast();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [detailImgLoaded, setDetailImgLoaded] = useState(false);
  const [detailImgError, setDetailImgError] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;
      setLoading(true);
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error('Failed to load product', err);
        addToast('Product not found', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id, addToast]);

  if (loading) return <div className="max-w-7xl mx-auto py-12 px-4"><ProductSkeleton /></div>;
  if (!product) return null;

  const inWishlist = isInWishlist(product.id || product._id);

  const handleAddToCart = async () => {
    if (!product) return;
    if (product.stock != null && qty > product.stock) {
      addToast('Requested quantity exceeds available stock', 'error');
      return;
    }
    await addToCart(product, qty);
    const imageNode = document.querySelector('.product-detail-image');
    if (imageNode) animateAddToCart(imageNode);
    addToast('Product Added to Cart Successfully');
  };

  const handleBuyNow = async () => {
    if (!product) return;
    if (product.stock != null && qty > product.stock) {
      addToast('Requested quantity exceeds available stock', 'error');
      return;
    }
    await addToCart(product, qty);
    const imageNode = document.querySelector('.product-detail-image');
    if (imageNode) animateAddToCart(imageNode);
    addToast('Product Added to Cart Successfully');
    navigate('/checkout');
  };

  const resolvedImage = getProductImage(product.image || product.images?.[0], product.category);

  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 pb-48 sm:pb-8">
      <PageHeader showBack />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-4">
        <div className="space-y-6">
          <div className="aspect-square rounded-[48px] overflow-hidden bg-gray-50 shadow-soft border border-gray-100 group relative flex items-center justify-center">
            {/* Skeleton while loading */}
            {!detailImgLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-amber-50 animate-pulse rounded-[48px]" />
            )}
            <img
              src={detailImgError ? getFallbackProductImage(product.category) : resolvedImage}
              className={`product-detail-image w-full h-full object-cover group-hover:scale-105 transition-all duration-1000 ${detailImgLoaded ? 'opacity-100' : 'opacity-0'}`}
              alt={product.title || 'Handcrafted product'}
              loading="eager"
              onLoad={() => setDetailImgLoaded(true)}
              onError={() => { setDetailImgError(true); setDetailImgLoaded(true); }}
            />
            <button 
              onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
              className={`absolute top-6 right-6 p-4 rounded-full backdrop-blur-md shadow-xl transition-all z-10 ${
                inWishlist ? 'bg-pink-500 text-white' : 'bg-white/90 text-gray-400 hover:text-pink-500'
              }`}
            >
              <Heart className={`w-6 h-6 ${inWishlist ? 'fill-current' : ''}`} />
            </button>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            {(product.images?.length > 0 ? product.images.slice(0, 4) : [product.image]).filter(Boolean).map((img, i) => (
              <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-gray-50 border-2 border-transparent hover:border-pink-200 cursor-pointer transition-all">
                <img src={img} className="w-full h-full object-cover opacity-60 hover:opacity-100" alt="" />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-500 bg-pink-50 px-3 py-1 rounded-md">
              {product.category || 'Handcrafted'}
            </span>
            <div className="h-1 w-1 bg-gray-300 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 bg-indigo-50 px-3 py-1 rounded-md">
              Limited Edition
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
            {product.title || product.name}
          </h1>

          <div className="flex items-center gap-6 mt-6 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-sm font-bold text-gray-900">4.9</span>
              <span className="text-sm font-medium text-gray-400">(124 Reviews)</span>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-wider">Quality Guaranteed</span>
            </div>
          </div>

          <div className="py-8 space-y-6">
            <div className="flex items-baseline gap-4">
              <span className="text-5xl font-black text-gray-900">₹{product.price}</span>
              <span className="text-xl text-gray-400 line-through font-bold">₹{Math.floor(product.price * 1.4)}</span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                40% Off
              </span>
            </div>

            <p className="text-gray-500 font-medium leading-relaxed text-lg max-w-xl">
              Each piece is meticulously handcrafted by <span className="text-gray-900 font-bold underline decoration-pink-300 underline-offset-4">{product.artisanName || 'our master artisan'}</span>. 
              Created using traditional sustainable techniques, this item represents the pinnacle of handcrafted excellence.
            </p>
          </div>

          {/* Artisan Information Block & Story Preview */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-gray-100 shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
               <div className="relative shrink-0 cursor-pointer" onClick={() => addToast('Story preview coming soon!', 'info')}>
                 <ArtisanAvatar name={product.artisanName} isArtisan={true} size="lg" />
                 {/* Story Indicator Ring */}
                 <div className="absolute -inset-1 rounded-full border-2 border-pink-500 border-dashed animate-[spin_10s_linear_infinite]" />
               </div>
               <div>
                  <h3 className="font-black text-gray-900 text-lg leading-tight">{product.artisanName || 'Artisan'}</h3>
                  <p className="text-gray-500 text-sm font-bold mt-0.5">{product.category || 'Craft'} • {product.artisanLocation || product.artisan_location || 'India'}</p>
                  <button onClick={() => navigate(`/profile/${product.userId}`)} className="text-pink-500 text-[11px] font-black uppercase tracking-widest mt-1.5 hover:underline flex items-center gap-1">
                    View Artisan Profile
                  </button>
               </div>
            </div>
            
            {product.userId && (
               <button 
                 onClick={() => navigate(`/messages/${product.userId}`, { state: { productName: product.title || product.name, productId: product._id || product.id, productImage: product.image || product.images?.[0] } })}
                 className="flex items-center justify-center gap-2 bg-pink-50 text-pink-600 px-5 py-3 rounded-2xl font-black hover:bg-pink-100 transition-colors w-full sm:w-auto"
               >
                 <MessageSquare className="w-5 h-5" /> Message Artisan
               </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-gray-100 p-4 pb-6 sm:static sm:bg-transparent sm:border-none sm:p-0 sm:pb-0 space-y-3 sm:space-y-6 mt-auto">
            <div className="flex items-center gap-3 sm:gap-6">
              <div className="flex items-center bg-gray-50 rounded-xl sm:rounded-2xl p-1 border border-gray-200">
                <button 
                  onClick={() => setQty(Math.max(1, qty - 1))} 
                  className="w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center font-bold text-gray-400 hover:text-pink-500 transition-colors"
                >
                  <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <span className="w-8 sm:w-12 text-center font-black text-lg sm:text-xl text-gray-900">{qty}</span>
                <button 
                  onClick={() => setQty(qty + 1)} 
                  className="w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center font-bold text-gray-400 hover:text-pink-500 transition-colors"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
              
              <button 
                onClick={handleAddToCart}
                className="flex-1 btn-primary py-3 sm:py-5 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 sm:gap-3 shadow-elevated text-sm sm:text-base font-black"
              >
                <ShoppingBag className="w-4 h-4 sm:w-6 sm:h-6" />
                Add to Cart
              </button>
            </div>

            <button 
              onClick={handleBuyNow}
              className="w-full bg-gray-900 text-white py-3 sm:py-5 rounded-xl sm:rounded-2xl text-sm sm:text-xl font-black hover:bg-black transition-all shadow-xl active:scale-95"
            >
              Buy it Now
            </button>
          </div>

          {/* Quick Features */}
          <div className="mt-6 sm:mt-12 grid grid-cols-3 gap-2 sm:gap-4">
            <div className="flex flex-col items-center gap-2 p-4 rounded-3xl bg-gray-50 border border-gray-100">
              <Truck className="w-5 h-5 text-gray-400" />
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">Fast Shipping</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-3xl bg-gray-50 border border-gray-100">
              <RefreshCcw className="w-5 h-5 text-gray-400" />
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">7-Day Return</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-3xl bg-gray-50 border border-gray-100">
              <ShieldCheck className="w-5 h-5 text-gray-400" />
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">Authentic</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
