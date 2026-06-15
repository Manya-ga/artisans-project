import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getOffers } from '../api';
import { useToast } from '../contexts/ToastContext';

export default function OffersPage() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    async function loadOffers() {
      try {
        const data = await getOffers();
        setOffers(data);
      } catch (err) {
        addToast('Failed to load offers', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadOffers();
  }, []);

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    addToast(`Code ${code} copied! ✂️`);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 md:py-12 px-4 animate-fade-in">
      <div className="mb-8 md:mb-16 text-center">
        <h1 className="text-2xl sm:text-4xl md:text-6xl font-black text-gray-900 tracking-tight">Artisan Deals</h1>
        <p className="text-gray-500 mt-2 md:mt-4 font-medium text-sm md:text-lg">Exclusive discounts directly from our master craftspeople.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-gray-100 rounded-[40px] animate-pulse" />
          ))}
        </div>
      ) : offers.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-gray-100">
           <span className="text-6xl block mb-4">🏷️</span>
           <h3 className="text-xl font-black text-gray-900">No active offers right now</h3>
           <p className="text-gray-400 font-medium mt-2">Check back soon for new artisan drops!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {offers.map((offer) => (
            <motion.div 
              key={offer._id}
              whileHover={{ y: -5 }}
              className="bg-white border-2 border-gray-50 p-5 sm:p-8 rounded-[28px] sm:rounded-[40px] shadow-soft hover:border-pink-200 transition-all flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-pink-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="bg-pink-50 text-pink-500 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg">
                    {offer.discountType === 'percentage' ? `${offer.discountValue}% OFF` : `₹${offer.discountValue} OFF`}
                  </span>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Exp: {new Date(offer.expiryDate).toLocaleDateString()}
                  </span>
                </div>
                
                <h3 className="text-2xl font-black text-gray-900 mb-2">{offer.title}</h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">{offer.description}</p>
                
                {offer.minOrderValue > 0 && (
                   <p className="text-[10px] font-black text-gray-400 uppercase mt-4">Min order: ₹{offer.minOrderValue}</p>
                )}
              </div>

              <div className="mt-10 flex items-center gap-2">
                <div className="flex-1 bg-gray-50 border-2 border-dashed border-gray-200 py-3 px-4 rounded-2xl text-center">
                   <span className="text-sm font-black text-gray-900 tracking-widest uppercase">{offer.code}</span>
                </div>
                <button 
                  onClick={() => copyToClipboard(offer.code)}
                  className="bg-gray-900 text-white p-3.5 rounded-2xl hover:bg-pink-600 transition-all active:scale-90"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10" />
                  </svg>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
