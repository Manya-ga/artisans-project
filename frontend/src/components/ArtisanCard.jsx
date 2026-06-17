import { Star, ChevronRight, Award, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

import ArtisanAvatar from './ArtisanAvatar';

export default function ArtisanCard({ artisan, onClick }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const currentUserId = user?._id || user?.id;
  const artisanId = artisan._id || artisan.id;
  const isSelf = currentUserId && artisanId?.toString() === currentUserId.toString();

  return (
    <div
      onClick={() => onClick ? onClick(artisan) : navigate(`/profile/${artisanId}`)}
      className="bg-white rounded-[32px] p-5 shadow-sm border border-gray-50 cursor-pointer hover:shadow-xl hover:shadow-pink-500/5 hover:-translate-y-1 transition-all duration-500 group"
    >
      <div className="flex items-center gap-3 sm:gap-4 w-full">
        {/* Avatar - Left */}
        <div className="relative shrink-0">
          <ArtisanAvatar 
            name={artisan.displayName || artisan.name} 
            isArtisan={true}
            className="w-20 h-20 rounded-full border-4 border-gray-50 shadow-sm transition-transform duration-500 group-hover:scale-105 text-xl" 
          />
          <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-lg shadow-sm border border-gray-50">
            <Award className="w-3.5 h-3.5 text-pink-500" />
          </div>
        </div>

        {/* Info - Middle */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-2">
             <h3 className="font-black text-gray-900 text-base md:text-lg truncate group-hover:text-pink-600 transition-colors">
               {artisan.displayName || artisan.name}
             </h3>
             <div className="flex items-center gap-1 shrink-0">
               <Star className="w-3 h-3 text-yellow-400 fill-current" />
               <span className="text-xs font-black text-gray-900">{artisan.rating || '4.8'}</span>
             </div>
          </div>
          
          <div className="mt-1 flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md">
              {artisan.category || 'Master Maker'}
            </span>
            {(artisan.location || artisan.artisanLocation || artisan.artisan_location) && (
              <span className="text-[9px] sm:text-[10px] font-bold text-gray-600 bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                📍 {artisan.location || artisan.artisanLocation || artisan.artisan_location}
              </span>
            )}
            {artisan.experience && (
              <span className="text-[9px] sm:text-[10px] font-bold text-gray-600 bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded-md">
                ⏳ {artisan.experience}
              </span>
            )}
            {isSelf && <span className="text-[9px] sm:text-[10px] font-black text-pink-500 uppercase tracking-widest bg-pink-50 px-2 py-0.5 rounded-md">You</span>}
          </div>
          
          <p className="text-[11px] sm:text-xs text-gray-500 font-medium mt-1.5 line-clamp-1 italic">
            "{artisan.bio || artisan.tagline || 'Crafting souls into artifacts.'}"
          </p>
        </div>

        {/* Chat Button - Right */}
        {!isSelf && (
          <div className="shrink-0 flex items-center justify-center pl-1 sm:pl-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/messages/${artisanId}`);
              }}
              className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center bg-gray-50 text-gray-400 hover:text-pink-500 hover:bg-pink-50 rounded-xl transition-all shrink-0"
            >
              <MessageCircle className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
