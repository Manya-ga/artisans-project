import React from 'react';
import { Mail, MapPin, Phone, ShoppingBag, Globe, Share2, MessageCircle, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-10 md:pt-20 pb-10 mb-16 md:mb-0">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12 mb-8 md:mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white shadow-lg">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <span className="text-xl font-black tracking-tighter text-gray-900">
                Artisan<span className="text-pink-500">Connect</span>
              </span>
            </div>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">
              Empowering local artisans by connecting their unique handcrafted treasures with conscious buyers worldwide.
            </p>
            <div className="flex gap-4">
              <SocialLink icon={<Globe />} />
              <SocialLink icon={<Share2 />} />
              <SocialLink icon={<MessageCircle />} />
              <SocialLink icon={<Send />} />
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-6">
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-gray-900">Shop Marketplace</h4>
            <ul className="space-y-4">
              <FooterLink to="/discovery?category=Home Decor">Home Decor</FooterLink>
              <FooterLink to="/discovery?category=Jewelry">Artisan Jewelry</FooterLink>
              <FooterLink to="/discovery?category=Pottery">Traditional Pottery</FooterLink>
              <FooterLink to="/discovery?category=Art & Paintings">Fine Art</FooterLink>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-gray-900">Get Help</h4>
            <ul className="space-y-4">
              <FooterLink to="/help">Track Your Order</FooterLink>
              <FooterLink to="/help">Shipping Policy</FooterLink>
              <FooterLink to="/help">Returns & Refunds</FooterLink>
              <FooterLink to="/contact">Contact Support</FooterLink>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-gray-900">Connect With Us</h4>
            <div className="space-y-4">
              <ContactItem icon={<MapPin className="w-4 h-4" />} text="Bangalore, Karnataka, India" />
              <ContactItem icon={<Mail className="w-4 h-4" />} text="hello@artisanconnect.in" />
              <ContactItem icon={<Phone className="w-4 h-4" />} text="+91 80 4567 8900" />
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs font-bold text-gray-400">
            © 2024 Artisan Connect. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link to="/help" className="text-xs font-bold text-gray-400 hover:text-gray-900">Privacy Policy</Link>
            <Link to="/help" className="text-xs font-bold text-gray-400 hover:text-gray-900">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

const SocialLink = ({ icon }) => (
  <button className="w-10 h-10 bg-gray-50 text-gray-400 hover:bg-pink-50 hover:text-pink-500 rounded-xl flex items-center justify-center transition-all">
    {React.cloneElement(icon, { size: 18 })}
  </button>
);

const FooterLink = ({ to, children }) => (
  <li>
    <Link to={to} className="text-sm font-medium text-gray-500 hover:text-pink-500 transition-colors">
      {children}
    </Link>
  </li>
);

const ContactItem = ({ icon, text }) => (
  <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
    <div className="text-pink-500">{icon}</div>
    {text}
  </div>
);
