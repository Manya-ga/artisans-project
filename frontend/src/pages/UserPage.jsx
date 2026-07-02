import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import OfferManager from '../components/OfferManager.jsx';
import { User, Package, Gift, Settings, LogOut, ExternalLink, ChevronRight, ShoppingBag } from 'lucide-react';
import ArtisanAvatar from '../components/ArtisanAvatar';
import PageHeader from '../components/PageHeader';
import { getFallbackProductImage } from '../config/imageMappings';

export default function UserPage() {
  const navigate = useNavigate();
  const { user, authLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  if (authLoading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-pink-100 border-t-pink-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null; // Should be handled by protected route

  const orders = [
    { id: '#AC-8821', date: '24 Apr, 2024', status: 'In Transit', total: '₹2,499', items: 1, image: getFallbackProductImage('Pottery') },
    { id: '#AC-8790', date: '12 Apr, 2024', status: 'Delivered', total: '₹8,200', items: 3, image: getFallbackProductImage('Textiles') },
  ];

  return (
    <div className="max-w-6xl mx-auto py-4 sm:py-8 animate-fade-in space-y-10">
      <PageHeader title="My Account" showBack />
      {/* Profile Header */}
      <div className="bg-white p-6 md:p-12 rounded-[32px] md:rounded-[48px] shadow-soft border border-gray-100 flex flex-col md:flex-row items-center gap-6 md:gap-10 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-pink-50 rounded-full blur-[100px] opacity-40 -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative group shrink-0">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-[32px] md:rounded-[40px] bg-gradient-to-tr from-pink-500 to-indigo-600 p-1 shadow-xl group-hover:rotate-3 transition-transform duration-500">
            <div className="w-full h-full rounded-[30px] md:rounded-[38px] bg-white flex items-center justify-center text-3xl md:text-4xl font-black text-gray-900 overflow-hidden">
              <ArtisanAvatar 
                name={user.displayName} 
                photoURL={user.photoURL} 
                isArtisan={user.role !== 'buyer'} 
                className="w-full h-full"
              />
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-2xl shadow-lg border border-gray-50">
            <User className="w-5 h-5 text-pink-500" />
          </div>
        </div>

        <div className="flex-1 text-center md:text-left space-y-3 md:space-y-4 w-full">
          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
              <h1 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight">{user.displayName}</h1>
              <span className="bg-green-50 text-green-600 text-[10px] font-black uppercase px-3 py-1 rounded-full border border-green-100">PRO MEMBER</span>
            </div>
            <p className="text-sm md:text-lg text-gray-500 font-medium">{user.email}</p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
             <StatItem label="Orders" value="12" />
             <StatItem label="Wishlist" value="48" />
             <StatItem label="Spent" value="₹14,200" />
          </div>
        </div>

        <button 
          onClick={() => { logout(); navigate('/'); }}
          className="p-4 md:p-5 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-[20px] md:rounded-[24px] transition-all group shrink-0"
        >
          <LogOut className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-10 items-start">
        {/* Mobile: Horizontal Tab Strip | Desktop: Sidebar */}
        <div className="lg:col-span-1">
          {/* Mobile horizontal tabs */}
          <div className="flex lg:hidden overflow-x-auto no-scrollbar gap-2 pb-1">
            <MobileTab active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} label="Profile" />
            <MobileTab active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} label="Orders" />
            <MobileTab active={activeTab === 'my-offers'} onClick={() => setActiveTab('my-offers')} label="Coupons" />
            <MobileTab active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} label="Settings" />
            <MobileTab active={false} onClick={() => navigate('/my-products')} label="Seller Dashboard" />
          </div>
          {/* Desktop sidebar */}
          <div className="hidden lg:block bg-white p-4 rounded-[32px] border border-gray-100 shadow-sm space-y-2">
            <SideTab active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={<User />} label="My Profile" />
            <SideTab active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} icon={<Package />} label="Order History" />
            <SideTab active={activeTab === 'my-offers'} onClick={() => setActiveTab('my-offers')} icon={<Gift />} label="My Coupons" />
            <SideTab active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings />} label="Preferences" />
            
            <div className="h-px bg-gray-50 my-4 mx-4" />
            
            <button 
              onClick={() => navigate('/my-products')}
              className="w-full flex items-center justify-between p-4 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 rounded-2xl transition-all font-bold text-sm"
            >
              <span className="flex items-center gap-3"><ShoppingBag className="w-5 h-5" /> Seller Dashboard</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 min-h-[500px]">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DetailCard label="Display Name" value={user.displayName || '—'} />
                  <DetailCard label="Account Email" value={user.email} />
                  <DetailCard label="Member Since" value="January 2024" />
                  <DetailCard label="Account Level" value="Premium Artisan" />
                </div>
                <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
                  <div className="absolute right-0 top-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                    <ShoppingBag className="w-40 h-40" />
                  </div>
                  <h3 className="text-2xl font-black mb-4">Start Selling Today</h3>
                  <p className="text-indigo-200 mb-8 max-w-md font-medium">Turn your passion into a business. Join our artisan community and reach thousands of buyers worldwide.</p>
                  <button onClick={() => navigate('/my-products')} className="bg-white text-indigo-900 px-8 py-4 rounded-2xl font-black hover:bg-pink-50 transition-all flex items-center gap-3">
                    Go to Dashboard <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div key="orders" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white p-4 md:p-6 rounded-[24px] md:rounded-[32px] border border-gray-100 shadow-sm hover:border-pink-200 transition-all flex items-center gap-4 md:gap-6 group">
                     <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl overflow-hidden bg-gray-50 shrink-0">
                        <img src={order.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 md:gap-3 mb-1 flex-wrap">
                           <h4 className="text-sm md:text-base font-black text-gray-900">{order.id}</h4>
                           <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${
                             order.status === 'Delivered' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                           }`}>
                             {order.status}
                           </span>
                        </div>
                        <p className="text-xs text-gray-400 font-bold">{order.date} • {order.items} Items</p>
                     </div>
                     <div className="text-right shrink-0">
                        <p className="text-base md:text-lg font-black text-gray-900">{order.total}</p>
                        <button className="text-[10px] font-black text-pink-500 uppercase tracking-widest mt-2 hover:underline">Track</button>
                     </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'my-offers' && (
              <motion.div key="my-offers" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                 <OfferManager />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

const StatItem = ({ label, value }) => (
  <div className="bg-white/50 backdrop-blur-sm border border-white/80 px-5 py-3 rounded-2xl">
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-lg font-black text-gray-900">{value}</p>
  </div>
);

const SideTab = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick} 
    className={`w-full flex items-center gap-4 p-4 rounded-2xl text-sm font-bold transition-all ${
      active ? 'bg-gray-900 text-white shadow-xl' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'
    }`}
  >
    {React.cloneElement(icon, { className: 'w-5 h-5' })}
    {label}
  </button>
);

const MobileTab = ({ active, onClick, label }) => (
  <button
    onClick={onClick}
    className={`shrink-0 px-4 py-2.5 rounded-2xl text-sm font-black transition-all whitespace-nowrap ${
      active ? 'bg-gray-900 text-white shadow-lg' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-900'
    }`}
  >
    {label}
  </button>
);

const DetailCard = ({ label, value }) => (
  <div className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm">
     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{label}</p>
     <p className="text-base font-bold text-gray-900">{value}</p>
  </div>
);
