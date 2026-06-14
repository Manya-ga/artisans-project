import React, { useState } from 'react';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');

  return (
    <div className="max-w-2xl mx-auto py-20 px-6 text-center animate-fade-in">
      <div className="w-24 h-24 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-8 shadow-inner">
        📦
      </div>
      <h1 className="text-3xl font-black text-gray-900 mb-4">Track Your Order</h1>
      <p className="text-gray-500 font-medium mb-10">Enter your order ID to see the real-time status of your artisan treasures.</p>
      
      <div className="flex flex-col gap-4">
        <input 
          type="text" 
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="e.g. #AC-12345"
          className="w-full bg-white border-gray-100 rounded-3xl px-8 py-5 text-lg font-bold shadow-soft outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-200 transition-all text-center"
        />
        <button className="bg-gray-900 text-white py-5 rounded-3xl text-lg font-black hover:bg-blue-600 transition-all shadow-elevated active:scale-95">
          TRACK NOW
        </button>
      </div>
    </div>
  );
}
