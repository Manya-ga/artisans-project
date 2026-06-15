import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchAds } from '../api';
import { ChevronRight } from 'lucide-react';

export default function AdCarousel() {
  const [ads, setAds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAds() {
      try {
        const data = await fetchAds();
        setAds(data.filter(ad => ad.type === 'banner'));
      } catch (err) {
        console.error('Failed to load ads', err);
      } finally {
        setLoading(false);
      }
    }
    loadAds();
  }, []);

  useEffect(() => {
    if (ads.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [ads.length]);

  if (loading || ads.length === 0) return null;

  return (
    <div className="relative w-full h-44 sm:h-56 md:h-80 rounded-[28px] sm:rounded-[40px] overflow-hidden mb-6 md:mb-12 shadow-soft group">
      <AnimatePresence mode="wait">
        <motion.div
          key={ads[currentIndex]._id || currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img 
            src={ads[currentIndex].imageUrl} 
            alt={ads[currentIndex].title}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-center px-6 md:px-16">
            <span className="text-pink-500 font-black text-[10px] uppercase tracking-[0.3em] mb-2 md:mb-4 bg-white/10 backdrop-blur-md w-fit px-3 py-1 rounded-full">
              Exclusive Deal
            </span>
            <h2 className="text-xl sm:text-3xl md:text-5xl font-black text-white mb-2 md:mb-4 leading-tight max-w-xl">
              {ads[currentIndex].title}
            </h2>
            <p className="text-white/70 text-xs sm:text-base md:text-xl max-w-lg font-medium leading-relaxed hidden sm:block">
              {ads[currentIndex].description}
            </p>
            {ads[currentIndex].link && (
              <button className="mt-4 md:mt-8 bg-white text-gray-900 font-black py-2.5 md:py-4 px-6 md:px-10 rounded-xl md:rounded-2xl w-fit hover:bg-pink-50 transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center gap-2 md:gap-3 text-sm md:text-base">
                Explore Now <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Dots */}
      {ads.length > 1 && (
        <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3">
          {ads.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 md:h-2 rounded-full transition-all duration-500 ${i === currentIndex ? 'bg-pink-500 w-8 md:w-10' : 'bg-white/30 w-1.5 md:w-2 hover:bg-white/50'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
