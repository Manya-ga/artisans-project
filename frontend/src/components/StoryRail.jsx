import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { getStories, deleteStory as apiDeleteStory } from '../api';
import { 
  Plus, X, 
  User as UserIcon, Trash2, 
  MessageCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import ArtisanAvatar from './ArtisanAvatar';
import StoryUploadModal from './StoryUploadModal';
import { CATEGORY_IMAGES } from '../config/imageMappings';

const PLACEHOLDER_ARTISANS = [
  { id: 'p1', userName: 'Meera', location: 'Jaipur', userProfileImage: CATEGORY_IMAGES['Pottery'], media: [{ url: CATEGORY_IMAGES['Pottery'], type: 'image' }] },
  { id: 'p2', userName: 'Ravi', location: 'Sanganer', userProfileImage: CATEGORY_IMAGES['Handloom'], media: [{ url: CATEGORY_IMAGES['Handloom'], type: 'image' }] },
  { id: 'p3', userName: 'Asha', location: 'Kutch', userProfileImage: CATEGORY_IMAGES['Jewelry'], media: [{ url: CATEGORY_IMAGES['Jewelry'], type: 'image' }] },
  { id: 'p4', userName: 'Kavya', location: 'Mysore', userProfileImage: CATEGORY_IMAGES['Woodwork'], media: [{ url: CATEGORY_IMAGES['Woodwork'], type: 'image' }] },
  { id: 'p5', userName: 'Suresh', location: 'Saharanpur', userProfileImage: CATEGORY_IMAGES['Woodwork'], media: [{ url: CATEGORY_IMAGES['Woodwork'], type: 'image' }] },
  { id: 'p6', userName: 'Fatima', location: 'Lucknow', userProfileImage: CATEGORY_IMAGES['Textiles'], media: [{ url: CATEGORY_IMAGES['Textiles'], type: 'image' }] },
  { id: 'p7', userName: 'Ramesh', location: 'Channapatna', userProfileImage: CATEGORY_IMAGES['Woodwork'], media: [{ url: CATEGORY_IMAGES['Woodwork'], type: 'image' }] },
  { id: 'p8', userName: 'Anjali', location: 'Pushkar', userProfileImage: CATEGORY_IMAGES['Paintings'], media: [{ url: CATEGORY_IMAGES['Paintings'], type: 'image' }] },
  { id: 'p9', userName: 'Vikram', location: 'Madhubani', userProfileImage: CATEGORY_IMAGES['Paintings'], media: [{ url: CATEGORY_IMAGES['Paintings'], type: 'image' }] },
];

export default function StoryRail() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const scrollRef = useRef(null);
  
  const [stories, setStories] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [viewedIds, setViewedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const fetchStories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getStories();
      const currentUserId = user?._id || user?.id;

      const userMap = new Map();
      (data || []).forEach(s => {
        if (!s.userId) return;
        if (!userMap.has(s.userId)) {
          userMap.set(s.userId, s);
        }
      });

      const uniqueStories = Array.from(userMap.values());

      const sorted = uniqueStories.sort((a, b) => {
        const isA = currentUserId && a.userId === currentUserId.toString();
        const isB = currentUserId && b.userId === currentUserId.toString();
        if (isA) return -1;
        if (isB) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      
      if (sorted.length < 8) {
        const needed = 8 - sorted.length;
        const placeholders = PLACEHOLDER_ARTISANS.slice(0, needed).map(p => ({
          ...p,
          isPlaceholder: true,
          createdAt: new Date().toISOString()
        }));
        setStories([...sorted, ...placeholders]);
      } else {
        setStories(sorted);
      }
    } catch (e) {
      setStories(PLACEHOLDER_ARTISANS.slice(0, 8));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this story?')) return;
    try {
      await apiDeleteStory(id);
      addToast('Story deleted', 'success');
      setActiveIndex(-1);
      fetchStories();
    } catch (err) {
      addToast('Delete failed', 'error');
    }
  };

  const activeStory = activeIndex >= 0 ? stories[activeIndex] : null;

  const nextStory = useCallback(() => {
    if (!activeStory) return;
    if (activeMediaIndex < activeStory.media.length - 1) {
      setActiveMediaIndex(prev => prev + 1);
    } else if (activeIndex < stories.length - 1) {
      setActiveIndex(prev => prev + 1);
      setActiveMediaIndex(0);
    } else {
      setActiveIndex(-1);
    }
  }, [activeIndex, activeMediaIndex, activeStory, stories.length]);

  const prevStory = useCallback(() => {
    if (!activeStory) return;
    if (activeMediaIndex > 0) {
      setActiveMediaIndex(prev => prev - 1);
    } else if (activeIndex > 0) {
      setActiveIndex(prev => prev - 1);
      setActiveMediaIndex(stories[activeIndex - 1].media.length - 1);
    }
  }, [activeIndex, activeMediaIndex, activeStory, stories]);

  const handleStoryClick = (index) => {
    setActiveIndex(index);
    setActiveMediaIndex(0);
    setViewedIds(prev => new Set([...prev, stories[index]?.id]));
  };

  // How many placeholder circles to show to fill the rail
  const placeholderCount = Math.max(0, 9 - stories.length);

  return (
    <div className="relative w-full overflow-hidden">
      <div 
        ref={scrollRef}
        className={`flex gap-4 overflow-x-auto no-scrollbar py-1 px-1 items-start scroll-smooth w-full ${stories.length <= 3 ? 'justify-center' : 'justify-start'}`} 
        style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* ADD STORY */}
        <div className="flex flex-col items-center gap-1.5 shrink-0">
          <button 
            onClick={() => user ? setShowUploadModal(true) : addToast('Login to share', 'info')}
            className="group outline-none"
          >
            <div className="w-[62px] h-[62px] md:w-[68px] md:h-[68px] rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 p-[2px] shadow-sm group-hover:scale-110 group-active:scale-95 transition-transform flex-shrink-0 relative overflow-hidden">
              <div className="w-full h-full bg-white rounded-full p-0.5 relative overflow-hidden border-2 border-white">
                <ArtisanAvatar name={user?.displayName || user?.name} isArtisan={true} className="w-full h-full rounded-full text-lg" />
              </div>
              <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full w-5 h-5 border-2 border-white flex items-center justify-center">
                <Plus className="w-3 h-3" strokeWidth={3} />
              </div>
            </div>
          </button>
          <span className="text-[11px] font-semibold text-gray-500 tracking-tight">Your Story</span>
        </div>

        {/* LOADING SKELETONS */}
        {loading && stories.length === 0 && Array.from({ length: 8 }).map((_, i) => (
          <div key={`skel-${i}`} className="flex flex-col items-center gap-1.5 shrink-0">
            <div className="w-[62px] h-[62px] md:w-[68px] md:h-[68px] rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 animate-pulse" />
            <div className="h-3 w-10 bg-gray-100 rounded-full animate-pulse" />
          </div>
        ))}

        {/* REAL STORIES */}
        {stories.map((story, index) => {
          const isMine = user && story.userId?.toString() === (user._id || user.id)?.toString();
          const isViewed = viewedIds.has(story.id);
          
          return (
            <div key={story.id} className="flex flex-col items-center gap-1.5 shrink-0 group relative cursor-pointer" onClick={() => handleStoryClick(index)}>
              <div 
                className={`w-[62px] h-[62px] md:w-[68px] md:h-[68px] rounded-full p-[2px] ${isViewed ? 'bg-gray-300' : 'bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500'} group-hover:scale-110 transition-transform duration-200 shrink-0`}
              >
                <div className="w-full h-full rounded-full border-2 border-white overflow-hidden bg-gray-50">
                  <img src={story.userProfileImage || story.media?.[0]?.url} className="w-full h-full object-cover" alt="" loading="lazy" />
                </div>
              </div>
              <div className="flex flex-col items-center mt-0.5">
                <span className="text-[11px] font-semibold tracking-tight truncate max-w-[68px] text-gray-800">
                  {isMine ? 'Your Story' : (story.userName?.split(' ')[0] || 'Artisan')}
                </span>
                <span className="text-[9px] text-gray-400 font-medium truncate max-w-[68px] leading-none mt-0.5 flex items-center gap-0.5">
                  <span className="w-1 h-1 rounded-full bg-pink-500 inline-block"></span> {story.location || 'India'}
                </span>
              </div>
              {isMine && !story.isPlaceholder && (
                <button onClick={(e) => handleDelete(story.id, e)} className="absolute -top-1 -right-1 bg-white p-1 rounded-full shadow-md text-gray-400 hover:text-red-500 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all border border-gray-100 z-10">
                  <Trash2 className="w-2.5 h-2.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* VIEWER */}
      <AnimatePresence>
        {activeStory && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[5000] bg-black flex items-center justify-center overflow-hidden">
            <div className="relative w-full max-w-[500px] h-full flex flex-col">
              {/* MEDIA */}
              {activeStory.media[activeMediaIndex]?.type === 'video' ? (
                <video src={activeStory.media[activeMediaIndex].url} autoPlay playsInline muted onEnded={nextStory} className="w-full h-full object-cover" />
              ) : (
                <img src={activeStory.media[activeMediaIndex]?.url} className="w-full h-full object-cover" alt="" />
              )}
              
              {/* OVERLAY */}
              <div className="absolute top-0 inset-x-0 p-6 sm:p-8 space-y-6 sm:space-y-8 bg-gradient-to-b from-black/80 to-transparent z-50">
                <div className="flex gap-1.5">
                  {activeStory.media.map((_, i) => (
                    <div key={i} className="flex-1 h-[2px] bg-white/30 rounded-full overflow-hidden">
                      {i === activeMediaIndex ? (
                        <motion.div key={activeMediaIndex} initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: activeStory.media[activeMediaIndex]?.type === 'video' ? 15 : 6, ease: 'linear' }} onAnimationComplete={nextStory} className="h-full bg-white" />
                      ) : i < activeMediaIndex ? <div className="w-full h-full bg-white" /> : null}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div onClick={() => { setActiveIndex(-1); navigate(`/profile/${activeStory.userId}`); }} className="flex items-center gap-3 cursor-pointer">
                    <div className="w-10 h-10 rounded-full border-2 border-white/20 overflow-hidden bg-gray-900">
                       <img src={activeStory.userProfileImage} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div>
                      <p className="text-white font-black text-sm">
                        {(user && activeStory.userId?.toString() === (user._id || user.id)?.toString()) ? 'Your Story' : activeStory.userName}
                      </p>
                      {activeStory.title && <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">{activeStory.title}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setActiveIndex(-1); navigate(`/messages/${activeStory.userId}`); }} className="text-white bg-white/10 hover:bg-white/20 rounded-full p-2.5 transition-colors"><MessageCircle className="w-5 h-5" /></button>
                    <button onClick={() => setActiveIndex(-1)} className="text-white bg-white/10 hover:bg-white/20 rounded-full p-2.5 transition-colors"><X className="w-5 h-5" /></button>
                  </div>
                </div>
              </div>

              {/* NAV */}
              <div className="absolute inset-0 flex z-40">
                <div className="flex-1" onClick={prevStory} />
                <div className="flex-1" onClick={nextStory} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* UPLOAD MODAL */}
      <StoryUploadModal 
        open={showUploadModal} 
        onClose={() => setShowUploadModal(false)} 
        onUploaded={() => {
          fetchStories();
          addToast('Story shared! ✨', 'success');
        }}
      />
    </div>
  );
}
