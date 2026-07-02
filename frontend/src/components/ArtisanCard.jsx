import { Star, ChevronRight, Award, MessageCircle, Package, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useState } from 'react';

import ArtisanAvatar from './ArtisanAvatar';

export default function ArtisanCard({ artisan, onClick }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [following, setFollowing] = useState(false);
  
  const currentUserId = user?._id || user?.id;
  const artisanId = artisan._id || artisan.id;
  const isSelf = currentUserId && artisanId?.toString() === currentUserId.toString();

  const handleFollow = (e) => {
    e.stopPropagation();
    if (!user) {
      addToast('Please login to follow artisans', 'info');
      return;
    }
    setFollowing(!following);
    addToast(following ? `Unfollowed ${artisan.displayName || artisan.name}` : `Following ${artisan.displayName || artisan.name}`, 'success');
  };

  return (
    <div
      onClick={() => onClick ? onClick(artisan) : navigate(`/profile/${artisanId}`)}
      className="bg-white rounded-[32px] p-5 shadow-sm border border-gray-50 cursor-pointer hover:shadow-xl hover:shadow-pink-500/5 hover:-translate-y-1 transition-all duration-500 group flex flex-col justify-between"
    >
      <div className="flex items-start justify-between w-full relative">
        <div className="flex items-center gap-3 sm:gap-4 flex-1">
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
              <div className="flex items-center gap-1 shrink-0 mt-0.5">
                 <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
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
            {artisan.productCount !== undefined && (
              <span className="text-[9px] sm:text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                <Package className="w-2.5 h-2.5" /> {artisan.productCount} Products
              </span>
            )}
            {isSelf && <span className="text-[9px] sm:text-[10px] font-black text-pink-500 uppercase tracking-widest bg-pink-50 px-2 py-0.5 rounded-md">You</span>}
          </div>
          
          <p className="text-[11px] sm:text-xs text-gray-500 font-medium mt-2 line-clamp-2 italic leading-relaxed">
            "{artisan.bio || artisan.tagline || 'Crafting souls into artifacts. Keeping traditions alive with every handcrafted piece.'}"
          </p>
        </div>
        </div>
        
        {/* Follow Button */}
        {!isSelf && (
          <button 
            onClick={handleFollow}
            className={`absolute top-0 right-0 p-2 rounded-xl transition-all shadow-sm border ${
              following ? 'bg-pink-50 border-pink-100 text-pink-500' : 'bg-white border-gray-100 text-gray-400 hover:text-pink-500 hover:border-pink-100 hover:bg-pink-50'
            }`}
            title={following ? 'Unfollow' : 'Follow'}
          >
            <UserPlus className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {/* Explicit Buttons Row */}
      <div className="mt-5 pt-4 border-t border-gray-50 flex items-center gap-3 w-full">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onClick) onClick(artisan);
            else navigate(`/profile/${artisanId}`);
          }}
          className="flex-1 px-4 py-2 bg-gray-50 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
        >
          View Profile
        </button>
        
        {!isSelf && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/messages/${artisanId}`);
            }}
            className="flex-1 px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-pink-600 transition-colors flex items-center justify-center gap-2 shadow-sm shadow-gray-900/10"
          >
            <MessageCircle className="w-4 h-4" /> Message Artisan
          </button>
        )}
      </div>
    </div>
  );
}
