import React from 'react';

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto py-6 md:py-12 px-4 md:px-6 animate-fade-in">
      <div className="bg-white p-6 sm:p-10 md:p-16 rounded-[32px] md:rounded-[48px] shadow-soft border border-gray-100 text-center space-y-6 md:space-y-8">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center text-2xl sm:text-3xl mx-auto shadow-inner">
          ✉️
        </div>
        <h1 className="text-2xl md:text-4xl font-black text-gray-900">Get in Touch</h1>
        <p className="text-gray-500 font-medium max-w-lg mx-auto">
          Whether you have a question about our artisans or need help with an order, our team is here for you.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-2xl mx-auto pt-8">
          <ContactInfo title="Email Us" value="hello@artisanconnect.com" emoji="📧" />
          <ContactInfo title="Call Us" value="+91 800-ARTISAN" emoji="📞" />
        </div>
      </div>
    </div>
  );
}

const ContactInfo = ({ title, value, emoji }) => (
  <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{title}</p>
    <div className="flex items-center gap-3">
      <span className="text-lg">{emoji}</span>
      <span className="text-sm font-black text-gray-900">{value}</span>
    </div>
  </div>
);
