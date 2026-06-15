import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, ShoppingBag, Clock } from 'lucide-react';

export default function StoryViewer({ stories = [], activeIndex = -1, onClose, onNext, onPrev, onViewProfile }) {
  const activeStory = activeIndex >= 0 ? stories[activeIndex] : null;

  return (
    <AnimatePresence>
      {activeStory && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-2 sm:p-6 md:p-10">
          {/* Backdrop with blur */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-md" 
            onClick={onClose} 
          />
          
          {/* Modal Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: 10 }} 
            className="relative w-full max-w-[450px] bg-white rounded-[28px] sm:rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[95dvh] sm:max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 sm:p-6 flex items-center justify-between border-b border-gray-50 bg-white/80 backdrop-blur-sm z-10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-pink-50 overflow-hidden border border-pink-100">
                  <img src={activeStory.mediaUrl} className="w-full h-full object-cover" alt="" />
                </div>
                <div>
                  <p className="font-black text-sm text-gray-900 tracking-tight">{activeStory.name}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> {activeStory.time || '2h ago'}
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="p-3 bg-gray-50 text-gray-400 hover:text-red-500 rounded-2xl transition-all active:scale-90"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Media Section */}
            <div className="relative aspect-[4/5] bg-gray-50 flex items-center justify-center overflow-hidden">
              {activeStory.mediaUrl ? (
                <img src={activeStory.mediaUrl} className="w-full h-full object-cover" alt="" />
              ) : (
                <div className="text-center p-10">
                  <ShoppingBag className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 font-bold">No story available</p>
                </div>
              )}
              
              {/* Navigation inside card */}
              <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                <button 
                  onClick={onPrev}
                  className={`p-3 bg-white/90 backdrop-blur-md rounded-2xl text-gray-900 shadow-xl pointer-events-auto transition-all active:scale-90 ${activeIndex === 0 ? 'opacity-0' : 'opacity-100'}`}
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={onNext}
                  className="p-3 bg-white/90 backdrop-blur-md rounded-2xl text-gray-900 shadow-xl pointer-events-auto transition-all active:scale-90"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Progress Indicator */}
              <div className="absolute bottom-6 inset-x-8 flex gap-1.5 z-10">
                {stories.map((_, i) => (
                  <div key={i} className="flex-1 h-[3px] bg-white/30 rounded-full overflow-hidden">
                    {i === activeIndex ? (
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: '100%' }} 
                        transition={{ duration: 7, ease: 'linear' }} 
                        onAnimationComplete={onNext}
                        className="h-full bg-white shadow-[0_0_10px_white]"
                      />
                    ) : i < activeIndex ? (
                      <div className="w-full h-full bg-white" />
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Info / Action */}
            <div className="p-5 sm:p-8 space-y-4 sm:space-y-6 shrink-0">
              <p className="text-gray-600 text-base font-medium leading-relaxed italic line-clamp-2">
                "{activeStory.bio}"
              </p>
              <button 
                onClick={() => {
                  const id = activeStory.userId || activeStory._id;
                  onClose();
                  if (onViewProfile && id) onViewProfile(id);
                }}
                className="w-full bg-gray-900 text-white font-black py-5 rounded-3xl flex items-center justify-center gap-3 hover:bg-pink-600 transition-all shadow-xl shadow-gray-900/10 active:scale-95"
              >
                Visit Artisan Studio
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
