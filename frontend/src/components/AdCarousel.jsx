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
    <div className="relative w-full h-56 md:h-80 rounded-[40px] overflow-hidden mb-12 shadow-soft group">
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
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-center px-10 md:px-16">
            <span className="text-pink-500 font-black text-[10px] uppercase tracking-[0.3em] mb-4 bg-white/10 backdrop-blur-md w-fit px-3 py-1 rounded-full">
              Exclusive Deal
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight max-w-xl">
              {ads[currentIndex].title}
            </h2>
            <p className="text-white/70 text-base md:text-xl max-w-lg font-medium leading-relaxed">
              {ads[currentIndex].description}
            </p>
            {ads[currentIndex].link && (
              <button className="mt-8 bg-white text-gray-900 font-black py-4 px-10 rounded-2xl w-fit hover:bg-pink-50 transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center gap-3">
                Explore Now <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Dots */}
      {ads.length > 1 && (
        <div className="absolute bottom-8 left-16 flex gap-3">
          {ads.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentIndex(i)}
              className={`h-2 rounded-full transition-all duration-500 ${i === currentIndex ? 'bg-pink-500 w-10' : 'bg-white/30 w-2 hover:bg-white/50'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
