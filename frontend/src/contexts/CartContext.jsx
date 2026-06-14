import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { getCart, addCartItem, updateCartItem, removeCartItem, clearCart as apiClearCart, fetchWishlist, toggleWishlist as apiToggleWishlist } from '../api';

const CartContext = createContext(null);

const normalizeItem = (item) => ({
  productId: item.productId,
  title: item.title,
  price: Number(item.price || 0),
  image: item.image || item.imageUrl || '',
  artisanName: item.artisanName || 'Master Maker',
  qty: Number(item.qty || 0),
});

export function CartProvider({ children }) {
  const { user } = useAuth();
  
  // Cart State with Safe Local Persistence
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('artisan_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Cart parse failed:', e);
      return [];
    }
  });

  // Wishlist State with Safe Local Persistence
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('artisan_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Wishlist parse failed:', e);
      return [];
    }
  });

  const [loading, setLoading] = useState(false);
  const [activeCoupon, setActiveCoupon] = useState(null);

  // Sync with Backend with safety guards
  useEffect(() => {
    if (!user) return;
    
    async function syncData() {
      try {
        const [cartRes, wishlistRes] = await Promise.all([
          getCart(),
          fetchWishlist()
        ]);
        if (cartRes?.items) setCartItems(Array.isArray(cartRes.items) ? cartRes.items.map(normalizeItem) : []);
        if (wishlistRes) setWishlist(Array.isArray(wishlistRes) ? wishlistRes : []);
      } catch (err) {
        console.error('Data sync failed:', err);
      }
    }
    syncData();
  }, [user]);

  // Safe Persist to LocalStorage
  useEffect(() => {
    localStorage.setItem('artisan_cart', JSON.stringify(cartItems || []));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('artisan_wishlist', JSON.stringify(wishlist || []));
  }, [wishlist]);

  const addToCart = async (product, qty = 1) => {
    const productId = product?._id || product?.id;
    if (!productId) return;

    setCartItems(prev => {
      const safePrev = prev || [];
      const existing = safePrev.find(i => i.productId === productId);
      if (existing) {
        return safePrev.map(i => i.productId === productId ? { ...i, qty: (i.qty || 0) + qty } : i);
      }
      return [...safePrev, {
        productId,
        title: product?.title || product?.name,
        price: Number(product?.price || 0),
        image: product?.image || product?.imageUrl || product?.images?.[0] || '',
        artisanName: product?.artisanName || 'Master Maker',
        qty: Number(qty),
      }];
    });

    if (user) {
      try {
        const res = await addCartItem({ productId, qty });
        if (res?.items) {
          setCartItems(Array.isArray(res.items) ? res.items.map(normalizeItem) : []);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const updateCartItemQty = async (productId, qty) => {
    setCartItems(prev => {
      const safePrev = prev || [];
      const existing = safePrev.find(i => i.productId === productId);
      if (!existing) return safePrev;
      if (qty <= 0) {
        return safePrev.filter(i => i.productId !== productId);
      }
      return safePrev.map(i => i.productId === productId ? { ...i, qty: Number(qty) } : i);
    });

    if (user) {
      try {
        const res = await updateCartItem(productId, { qty: Math.max(0, Number(qty)) });
        if (res?.items) setCartItems(Array.isArray(res.items) ? res.items.map(normalizeItem) : []);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const removeFromCart = async (productId) => {
    setCartItems(prev => (prev || []).filter(i => i.productId !== productId));
    if (user) {
      try { await removeCartItem(productId); } catch (e) { console.error(e); }
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    if (user) {
      try { await apiClearCart(); } catch (e) { console.error(e); }
    }
  };

  const applyCoupon = (couponCode) => {
    const code = String(couponCode || '').trim().toUpperCase();
    if (code === 'ARTISAN20' && cartItems.length > 0) {
      setActiveCoupon(code);
    } else {
      setActiveCoupon(null);
    }
  };

  const toggleWishlist = async (product) => {
    const productId = product?._id || product?.id;
    if (!productId) return;

    const safeWishlist = wishlist || [];
    const exists = safeWishlist.some(i => (i?._id || i?.id) === productId);
    
    if (exists) {
      setWishlist(prev => (prev || []).filter(i => (i?._id || i?.id) !== productId));
    } else {
      setWishlist(prev => [...(prev || []), product]);
    }

    if (user) {
      try { await apiToggleWishlist(productId); } catch (e) { console.error(e); }
    }
  };

  const isInWishlist = (productId) => {
    return (wishlist || []).some(i => (i?._id || i?.id) === productId);
  };

  const totals = useMemo(() => {
    const subtotal = (cartItems || []).reduce((acc, i) => acc + (i.price || 0) * (i.qty || 0), 0);
    const discount = activeCoupon === 'ARTISAN20' ? Math.min(250, Math.round(subtotal * 0.2)) : 0;
    const shipping = subtotal > 1000 ? 0 : 150;
    const taxes = Math.round(subtotal * 0.18);
    return {
      subtotal,
      discount,
      shipping,
      taxes,
      total: subtotal + shipping + taxes - discount,
    };
  }, [cartItems, activeCoupon]);

  const cartCount = useMemo(() => (cartItems || []).reduce((acc, i) => acc + (i.qty || 0), 0), [cartItems]);

  const value = useMemo(() => ({
    cartItems: cartItems || [],
    wishlist: wishlist || [],
    loading,
    addToCart,
    removeFromCart,
    updateCartItemQty,
    clearCart,
    applyCoupon,
    toggleWishlist,
    isInWishlist,
    cartCount,
    totals,
  }), [cartItems, wishlist, loading, cartCount, totals, addToCart, removeFromCart, updateCartItemQty, clearCart, applyCoupon, toggleWishlist, isInWishlist]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
