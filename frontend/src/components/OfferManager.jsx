import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMyOffers, createOffer, deleteOffer } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export default function OfferManager() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  
  const [newOffer, setNewOffer] = useState({
    title: '',
    description: '',
    code: '',
    discountType: 'flat',
    discountValue: '',
    minOrderValue: '',
    expiryDate: ''
  });

  useEffect(() => {
    loadOffers();
  }, []);

  async function loadOffers() {
    try {
      const data = await getMyOffers();
      setOffers(data);
    } catch (err) {
      addToast('Failed to load your offers', 'error');
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createOffer(newOffer);
      addToast('Offer created successfully! 🏷️');
      setShowAdd(false);
      setNewOffer({ title: '', description: '', code: '', discountType: 'flat', discountValue: '', minOrderValue: '', expiryDate: '' });
      loadOffers();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this offer?')) return;
    try {
      await deleteOffer(id);
      addToast('Offer deleted');
      loadOffers();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-gray-900">Manage Offers</h2>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="bg-pink-500 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-soft hover:bg-pink-600 transition-all"
        >
          {showAdd ? 'Close' : 'Create New Offer'}
        </button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.form 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-soft overflow-hidden space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Offer Title" value={newOffer.title} onChange={v => setNewOffer({...newOffer, title: v})} placeholder="e.g. Summer Artisan Fest" />
              <Input label="Coupon Code" value={newOffer.code} onChange={v => setNewOffer({...newOffer, code: v.toUpperCase()})} placeholder="e.g. ARTISAN20" />
              <div className="md:col-span-2">
                <Input label="Description" value={newOffer.description} onChange={v => setNewOffer({...newOffer, description: v})} placeholder="Briefly describe the offer..." />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block ml-1">Discount Type</label>
                <select 
                  value={newOffer.discountType}
                  onChange={e => setNewOffer({...newOffer, discountType: e.target.value})}
                  className="w-full bg-gray-50 border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:bg-white outline-none"
                >
                  <option value="flat">Flat Amount (₹)</option>
                  <option value="percentage">Percentage (%)</option>
                </select>
              </div>
              <Input label="Discount Value" type="number" value={newOffer.discountValue} onChange={v => setNewOffer({...newOffer, discountValue: v})} placeholder="Value" />
              <Input label="Min Order Value" type="number" value={newOffer.minOrderValue} onChange={v => setNewOffer({...newOffer, minOrderValue: v})} placeholder="Min Order" />
              <Input label="Expiry Date" type="date" value={newOffer.expiryDate} onChange={v => setNewOffer({...newOffer, expiryDate: v})} />
            </div>
            <button type="submit" className="w-full bg-gray-900 text-white py-5 rounded-2xl text-lg font-black hover:bg-pink-600 transition-all shadow-elevated">
              Launch Offer 🚀
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {loading ? (
          <div className="animate-pulse space-y-4">
             {[1, 2].map(i => <div key={i} className="h-24 bg-gray-100 rounded-3xl" />)}
          </div>
        ) : offers.length === 0 ? (
          <p className="text-center py-10 text-gray-400 font-medium">You haven't created any offers yet.</p>
        ) : (
          offers.map(offer => (
            <div key={offer._id} className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center justify-between group shadow-sm hover:shadow-soft transition-all">
               <div>
                  <div className="flex items-center gap-3 mb-1">
                     <span className="text-lg font-black text-gray-900">{offer.code}</span>
                     <span className="text-[10px] font-black bg-pink-50 text-pink-500 px-2 py-0.5 rounded-md">
                        {offer.discountType === 'percentage' ? `${offer.discountValue}%` : `₹${offer.discountValue}`} OFF
                     </span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">{offer.title} • Expires {new Date(offer.expiryDate).toLocaleDateString()}</p>
               </div>
               <button 
                onClick={() => handleDelete(offer._id)}
                className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
               >
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                 </svg>
               </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const Input = ({ label, value, onChange, type = 'text', placeholder }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">{label}</label>
    <input 
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-gray-50 border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-pink-500/10 focus:border-pink-200 transition-all outline-none"
    />
  </div>
);
