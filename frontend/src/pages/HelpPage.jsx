import React from 'react';

export default function HelpPage() {
  const faqs = [
    { q: 'How do I track my order?', a: 'You can track your order using the Track Order page with your order ID.' },
    { q: 'What is your return policy?', a: 'We offer a 7-day easy return policy for all handcrafted items.' },
    { q: 'Are the products authentic?', a: 'Yes, every product is direct from certified master artisans.' },
  ];

  return (
    <div className="max-w-4xl mx-auto py-6 md:py-12 px-4 md:px-6 animate-fade-in">
      <h1 className="text-2xl md:text-4xl font-black text-gray-900 mb-6 md:mb-8">Help Center</h1>
      <div className="space-y-4 md:space-y-6">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white p-5 sm:p-8 rounded-[24px] sm:rounded-[32px] border border-gray-100 shadow-soft">
            <h3 className="text-base sm:text-xl font-black text-gray-900 mb-2">Q: {faq.q}</h3>
            <p className="text-gray-500 font-medium text-sm sm:text-base">A: {faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
