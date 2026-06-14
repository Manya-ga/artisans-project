import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { getStories, createStory, followArtisan } from '../api';

const SocialContext = createContext(null);

export function SocialProvider({ children }) {
  const { user } = useAuth();
  
  // Follows State
  const [socialData, setSocialData] = useState(() => {
    try {
      const saved = localStorage.getItem('artisan_social_v4');
      return saved ? JSON.parse(saved) : {};
    } catch (e) { return {}; }
  });

  // Stories State
  const [stories, setStories] = useState(() => {
    try {
      const saved = localStorage.getItem('artisan_stories_v5');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  // Messages State
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('artisan_messages_v4');
      return saved ? JSON.parse(saved) : {};
    } catch (e) { return {}; }
  });

  useEffect(() => {
    localStorage.setItem('artisan_social_v4', JSON.stringify(socialData || {}));
    localStorage.setItem('artisan_stories_v5', JSON.stringify(stories || []));
    localStorage.setItem('artisan_messages_v4', JSON.stringify(messages || {}));
  }, [socialData, stories, messages]);

  // Real-time viewer tracking
  const addView = (storyId) => {
    if (!user?._id || !storyId) return;
    setStories(prev => (prev || []).map(s => {
      if (s.id === storyId || s._id === storyId) {
        const viewers = s.viewers || [];
        if (!viewers.some(v => v._id === user._id)) {
          return { ...s, viewers: [...viewers, { _id: user._id, displayName: user.displayName, photoURL: user.photoURL }] };
        }
      }
      return s;
    }));
  };

  const deleteStory = (storyId) => {
    setStories(prev => (prev || []).filter(s => (s.id || s._id) !== storyId));
  };

  const addNewStory = (storyData) => {
    setStories(prev => [storyData, ...(prev || [])]);
  };

  const toggleFollow = async (targetId) => {
    if (!user || !targetId || user?._id === targetId) return;
    try {
      const result = await followArtisan(targetId);
      // We update socialData locally to keep the UI snappy
      setSocialData(prev => {
        const safePrev = prev || {};
        const newSocial = { ...safePrev };
        if (!newSocial[user._id]) newSocial[user._id] = { followers: [], following: [] };
        if (!newSocial[targetId]) newSocial[targetId] = { followers: [], following: [] };
        
        if (result.isFollowing) {
          if (!newSocial[user._id].following.includes(targetId)) newSocial[user._id].following.push(targetId);
          if (!newSocial[targetId].followers.includes(user._id)) newSocial[targetId].followers.push(user._id);
        } else {
          newSocial[user._id].following = newSocial[user._id].following.filter(id => id !== targetId);
          newSocial[targetId].followers = newSocial[targetId].followers.filter(id => id !== user._id);
        }
        return newSocial;
      });
      return result;
    } catch (err) {
      console.error('Follow failed:', err);
      throw err;
    }
  };

  const getSocialStats = (userId) => {
    if (!userId) return { followersCount: 0, followingCount: 0, isFollowing: false };
    const data = (socialData || {})[userId] || { followers: [], following: [] };
    return {
      followersCount: (data.followers || []).length,
      followingCount: (data.following || []).length,
      isFollowing: user?._id ? (data.followers || []).includes(user._id) : false
    };
  };

  const sendMessage = (targetId, text) => {
    if (!user?._id || !targetId || !text?.trim()) return;
    const chatId = [user._id, targetId].sort().join('_');
    const newMessage = { id: Date.now(), senderId: user._id, text: text.trim(), timestamp: new Date().toISOString() };
    setMessages(prev => ({ ...prev, [chatId]: [...(prev[chatId] || []), newMessage] }));
  };

  const value = useMemo(() => ({
    toggleFollow, getSocialStats, sendMessage, 
    stories: stories || [], addView, deleteStory, addNewStory,
    messages: messages || {}
  }), [socialData, stories, messages, user?._id]);

  return <SocialContext.Provider value={value}>{children}</SocialContext.Provider>;
}

export const useSocial = () => {
  const context = useContext(SocialContext);
  if (!context) throw new Error('useSocial must be used within SocialProvider');
  return context;
};
