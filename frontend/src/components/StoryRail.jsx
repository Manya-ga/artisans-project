import React, { useEffect, useState, useCallback } from 'react';
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
import StoryUploadModal from './StoryUploadModal';

export default function StoryRail() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  
  const [stories, setStories] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  const fetchStories = useCallback(async () => {
    try {
      const data = await getStories();
      const currentUserId = user?._id || user?.id;

      // Group stories by userId to prevent duplicates (though backend should handle it)
      const userMap = new Map();
      (data || []).forEach(s => {
        if (!s.userId) return;
        if (!userMap.has(s.userId)) {
          userMap.set(s.userId, s);
        }
      });

      const uniqueStories = Array.from(userMap.values());

      // Sort: Current user first, then by date
      const sorted = uniqueStories.sort((a, b) => {
        const isA = currentUserId && a.userId === currentUserId.toString();
        const isB = currentUserId && b.userId === currentUserId.toString();
        if (isA) return -1;
        if (isB) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      
      setStories(sorted);
    } catch (e) {
      setStories([]);
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

  return (
    <div className="relative">
      <div className="flex gap-8 overflow-x-auto no-scrollbar py-6 px-6 items-start">
        {/* ADD STORY */}
        <div className="flex flex-col items-center gap-4 shrink-0">
          <button 
            onClick={() => user ? setShowUploadModal(true) : addToast('Login to share', 'info')}
            className="w-20 h-20 rounded-[28px] border-2 border-dashed border-gray-200 bg-white flex items-center justify-center hover:border-pink-500 transition-all relative group"
          >
            {user?.photoURL ? (
              <img src={user.photoURL} className="w-full h-full object-cover rounded-[26px] p-1" alt="" />
            ) : (
              <UserIcon className="w-8 h-8 text-gray-200 group-hover:text-pink-500" />
            )}
            <div className="absolute -bottom-1 -right-1 bg-pink-500 text-white p-1.5 rounded-xl border-2 border-white">
              <Plus className="w-3 h-3" />
            </div>
          </button>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Share Story</span>
        </div>

        {/* LIST STORIES */}
        {stories.map((story, index) => {
          const isMine = user && story.userId?.toString() === (user._id || user.id)?.toString();
          return (
            <div key={story.id} className="flex flex-col items-center gap-4 shrink-0 group relative">
              <button 
                onClick={() => { setActiveIndex(index); setActiveMediaIndex(0); }}
                className={`w-20 h-20 rounded-[28px] p-1 ${isMine ? 'bg-gray-200' : 'bg-gradient-to-tr from-pink-500 to-indigo-500'} hover:scale-105 transition-transform`}
              >
                <div className="w-full h-full rounded-[24px] border-2 border-white overflow-hidden bg-gray-50">
                  <img src={story.media[0]?.url} className="w-full h-full object-cover" alt="" />
                </div>
              </button>
              <span className={`text-[10px] font-black uppercase tracking-widest truncate max-w-[80px] ${isMine ? 'text-pink-600' : 'text-gray-900'}`}>
                {isMine ? 'Your Story' : story.userName}
              </span>
              {isMine && (
                <button onClick={(e) => handleDelete(story.id, e)} className="absolute -top-1 -right-1 bg-white p-1.5 rounded-xl shadow-lg text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all border border-gray-100 z-10">
                  <Trash2 className="w-3 h-3" />
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
              <div className="absolute top-0 inset-x-0 p-8 space-y-8 bg-gradient-to-b from-black/80 to-transparent z-50">
                <div className="flex gap-2">
                  {activeStory.media.map((_, i) => (
                    <div key={i} className="flex-1 h-[2px] bg-white/30 rounded-full overflow-hidden">
                      {i === activeMediaIndex ? (
                        <motion.div key={activeMediaIndex} initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: activeStory.media[activeMediaIndex]?.type === 'video' ? 15 : 6, ease: 'linear' }} onAnimationComplete={nextStory} className="h-full bg-white" />
                      ) : i < activeMediaIndex ? <div className="w-full h-full bg-white" /> : null}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div onClick={() => { setActiveIndex(-1); navigate(`/profile/${activeStory.userId}`); }} className="flex items-center gap-4 cursor-pointer">
                    <div className="w-12 h-12 rounded-full border-2 border-white/20 overflow-hidden bg-gray-900">
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
                    <button onClick={() => { setActiveIndex(-1); navigate(`/messages/${activeStory.userId}`); }} className="text-white bg-white/10 rounded-full p-2"><MessageCircle className="w-5 h-5" /></button>
                    <button onClick={() => setActiveIndex(-1)} className="text-white bg-white/10 rounded-full p-2"><X className="w-5 h-5" /></button>
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
