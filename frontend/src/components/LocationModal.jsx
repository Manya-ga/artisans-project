import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, Navigation } from 'lucide-react';

export default function LocationModal({ open, onClose, onSave, currentLocation }) {
  const [pincode, setPincode] = useState(currentLocation?.pincode || '');
  const [city, setCity] = useState(currentLocation?.city || '');

  const handleSave = () => {
    if (pincode && city) {
      onSave({ pincode, city });
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl p-10 overflow-hidden"
          >
            <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-gray-50 rounded-xl transition-colors">
              <X className="w-6 h-6 text-gray-300" />
            </button>

            <div className="text-center space-y-4 mb-10">
              <div className="w-20 h-20 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <MapPin className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Set Delivery Location</h2>
              <p className="text-gray-500 font-medium text-sm">See delivery dates and availability for your area.</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2.5">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Pincode</label>
                <div className="relative">
                  <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                  <input 
                    type="text" 
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="e.g., 560001"
                    className="w-full bg-gray-50 border-2 border-transparent rounded-2xl pl-12 pr-6 py-4 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-pink-500/5 focus:border-pink-200 transition-all outline-none"
                  />
                </div>
              </div>
              <div className="space-y-2.5">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">City</label>
                <input 
                  type="text" 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g., Bangalore"
                  className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-6 py-4 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-pink-500/5 focus:border-pink-200 transition-all outline-none"
                />
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-3">
              <button 
                onClick={handleSave} 
                className="w-full py-5 bg-gray-900 text-white font-black rounded-2xl shadow-xl hover:bg-pink-600 transition-all active:scale-95"
              >
                Confirm Location
              </button>
              <button 
                onClick={onClose} 
                className="w-full py-4 text-gray-400 font-bold hover:text-gray-900 transition-colors text-sm"
              >
                Use Current Location
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
