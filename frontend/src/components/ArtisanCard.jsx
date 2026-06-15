import { Star, ChevronRight, Award, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

function ArtisanAvatar({ name, photoURL }) {
  const [imgError, setImgError] = useState(false);
  const initials = (name || '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const colors = [
    'from-pink-400 to-rose-500',
    'from-violet-400 to-purple-500',
    'from-blue-400 to-indigo-500',
    'from-emerald-400 to-teal-500',
    'from-amber-400 to-orange-500',
    'from-cyan-400 to-sky-500',
  ];
  const gradient = colors[(name || '').charCodeAt(0) % colors.length];

  if (photoURL && !imgError) {
    return (
      <img
        src={photoURL}
        alt={name}
        className="w-20 h-20 rounded-[24px] object-cover border-4 border-gray-50 shadow-sm transition-transform duration-500 group-hover:scale-105"
        onError={() => setImgError(true)}
      />
    );
  }
  return (
    <div className={`w-20 h-20 rounded-[24px] bg-gradient-to-br ${gradient} flex items-center justify-center border-4 border-gray-50 shadow-sm transition-transform duration-500 group-hover:scale-105`}>
      <span className="text-white font-black text-xl select-none">{initials}</span>
    </div>
  );
}

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
          <ArtisanAvatar name={artisan.displayName || artisan.name} photoURL={artisan.photoURL || artisan.image} />
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
          
          <div className="mt-1 flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md">
              {artisan.category || 'Master Maker'}
            </span>
            {isSelf && <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest bg-pink-50 px-2 py-0.5 rounded-md">You</span>}
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
