import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { io } from 'socket.io-client';
import api from '../api'; // Use centralized axios instance
import { 
  Send, User as UserIcon, ArrowLeft, MoreVertical, 
  Smile, Paperclip, CheckCheck, Loader2, MessageSquare, ChevronDown
} from 'lucide-react';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'https://artisan-connect-backend-db2z.onrender.com';

export default function MessagingPage() {
  const { userId } = useParams(); // target user id
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const currentUserId = user?._id || user?.id;
  
  const [socket, setSocket] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loadingConv, setLoadingConv] = useState(true);
  const [loadingMsg, setLoadingMsg] = useState(false);
  const [targetUser, setTargetUser] = useState(null);
  
  const scrollRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const prevMessagesLength = useRef(0);
  const wasNearBottom = useRef(true);
  
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Determine who we are chatting with
  const activeUser = targetUser || conversations.find(c => (c.user._id === userId || c.user.id === userId))?.user || null;

  // Initialize Socket.io
  useEffect(() => {
    if (!user) return;

    // Prevent self-messaging
    if (userId && userId === currentUserId) {
      navigate('/messages', { replace: true });
      return;
    }
    
    const newSocket = io(SOCKET_URL, {
      withCredentials: true
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('join', currentUserId);
    });

    newSocket.on('messageError', ({ error }) => {
      console.warn('[MessagingPage] Socket error:', error);
    });

    newSocket.on('receiveMessage', (message) => {
      console.log("Received message from socket:", message);
      // If message belongs to active chat, append it
      setMessages(prev => {
        // Only append if it's not already in the list (prevent duplicates)
        if (prev.find(m => m._id === message._id)) return prev;
        
        // If it's for the current chat
        if (
          (message.senderId === currentUserId && message.receiverId === userId) ||
          (message.senderId === userId && message.receiverId === currentUserId)
        ) {
          return [...prev, message];
        }
        return prev;
      });

      // Update conversations list with the latest message
      setConversations(prev => {
        const otherId = message.senderId === currentUserId ? message.receiverId : message.senderId;
        const existing = prev.find(c => c.user._id === otherId);
        
        if (existing) {
          const updated = prev.filter(c => c.user._id !== otherId);
          return [{
            ...existing,
            lastMessage: message,
            unreadCount: (message.senderId !== currentUserId && otherId !== userId) ? existing.unreadCount + 1 : existing.unreadCount
          }, ...updated];
        }
        // If new conversation, we need to refetch to get user details
        fetchConversations();
        return prev;
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user, userId]);

  // Fetch Conversations
  const fetchConversations = async () => {
    try {
      console.log("[fetchConversations] Fetching...");
      const res = await api.get('/api/messages/conversations');
      console.log("[fetchConversations] Received:", res);
      setConversations(res || []);
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      setLoadingConv(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  // Fetch target user if not in conversations
  useEffect(() => {
    const fetchTargetUser = async () => {
      if (!userId) return;
      const inList = conversations.find(c => (c.user._id === userId || c.user.id === userId));
      if (inList) {
        setTargetUser(null);
        return;
      }

      console.log(`[fetchTargetUser] Fetching details for ${userId}...`);
      try {
        const res = await api.get(`/api/users/${userId}`);
        console.log("[fetchTargetUser] Received:", res);
        setTargetUser(res);
      } catch (err) {
        console.error('Error fetching target user:', err);
      }
    };

    fetchTargetUser();
  }, [userId, conversations]);

  // Fetch Messages for active chat
  useEffect(() => {
    const fetchMessages = async () => {
      if (!userId) return;
      setLoadingMsg(true);
      console.log(`[fetchMessages] Loading history for ${userId}...`);
      try {
        const res = await api.get(`/api/messages/${userId}`);
        console.log(`[fetchMessages] Found ${res.length} messages`);
        setMessages(res || []);
        
        // Trigger a conversation fetch if we get messages for a new user
        const inList = conversations.find(c => (c.user._id === userId || c.user.id === userId));
        if (!inList && res.length > 0) {
          console.log("[fetchMessages] New conversation detected, refetching list...");
          fetchConversations();
        }
      } catch (err) {
        console.error('Error fetching messages:', err);
      } finally {
        setLoadingMsg(false);
      }
    };

    fetchMessages();
  }, [userId]);

  // WhatsApp-like Auto Scroll Logic
  const scrollToBottom = (behavior = 'smooth') => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior });
    }
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    // User is near bottom if within 150px
    const nearBottom = scrollHeight - scrollTop - clientHeight < 150;
    wasNearBottom.current = nearBottom;
    
    if (nearBottom && showScrollButton) {
      setShowScrollButton(false);
      setUnreadCount(0);
    }
  };

  useLayoutEffect(() => {
    if (!scrollContainerRef.current) return;
    
    const isNewMessage = messages.length > prevMessagesLength.current;
    
    if (prevMessagesLength.current === 0 && messages.length > 0) {
      // First load or pagination load
      scrollToBottom('auto');
    } 
    else if (isNewMessage) {
      const lastMsg = messages[messages.length - 1];
      const isMine = lastMsg?.senderId === currentUserId;
      
      if (wasNearBottom.current || isMine) {
         scrollToBottom('smooth');
      } else {
         setShowScrollButton(true);
         setUnreadCount(prev => prev + (messages.length - prevMessagesLength.current));
      }
    }
    
    prevMessagesLength.current = messages.length;
  }, [messages, currentUserId]);

  // Reset scroll states when changing chat
  useEffect(() => {
    prevMessagesLength.current = 0;
    wasNearBottom.current = true;
    setShowScrollButton(false);
    setUnreadCount(0);
  }, [userId]);

  // Auto-fill context and handle routing
  useEffect(() => {
    if (userId && location.state) {
      if (location.state.productName) {
        setInputText(prev => prev || `Hi, I want to customize this product: ${location.state.productName}`);
      } else if (location.state.isProfileContext) {
        setInputText(prev => prev || "Hi, I saw your work and want to discuss customization.");
      }
    } else if (userId) {
      setInputText('');
    }
  }, [userId, location.state]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const text = inputText.trim();
    if (!text || !userId) return;

    // Frontend self-message guard
    if (userId === currentUserId) {
      console.warn('[MessagingPage] Attempted self-message — blocked');
      return;
    }

    const tempId = Date.now().toString();
    const optimisticMessage = {
      _id: tempId,
      id: tempId,
      senderId: currentUserId,
      receiverId: userId,
      text: text,
      createdAt: new Date().toISOString(),
      sending: true
    };

    // Optimistic Update
    setMessages(prev => [...prev, optimisticMessage]);
    setInputText('');

    try {
      console.log("[Frontend] Token:", localStorage.getItem('token'));
      console.log("[Frontend] Sending message to", userId, ":", text);

      // 1. Save to DB via HTTP (More reliable for persistence confirmation)
      const sentMessage = await api.post('/api/messages/send', {
        receiverId: userId,
        message: text, // Use 'message' field as requested
        text: text     // Keep 'text' for backward compatibility
      });

      // 2. Remove optimistic and add real message
      setMessages(prev => prev.map(m => m._id === tempId ? sentMessage : m));

      // 3. Emit via socket for real-time delivery to the other user
      if (socket && socket.connected) {
        socket.emit('sendMessage', sentMessage);
      }

      // 4. Update conversations list
      updateConversationsWithNewMessage(sentMessage);

    } catch (err) {
      console.error('[Frontend] Failed to send message:', err);
      // Remove optimistic message on failure
      setMessages(prev => prev.filter(m => m._id !== tempId));
      setInputText(text); // Restore text
      alert(`Error: ${err.message || 'Failed to send message'}`);
    }
  };

  const updateConversationsWithNewMessage = (message) => {
    setConversations(prev => {
      const otherId = message.senderId === currentUserId ? message.receiverId : message.senderId;
      const existingIdx = prev.findIndex(c => (c.user._id === otherId || c.user.id === otherId));
      
      if (existingIdx !== -1) {
        const updated = [...prev];
        const conv = { ...updated[existingIdx] };
        conv.lastMessage = message;
        // Move to top
        updated.splice(existingIdx, 1);
        return [conv, ...updated];
      } else {
        // If it's a new conversation, we'll need to refetch to get user info properly
        fetchConversations();
        return prev;
      }
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const activeChats = conversations.filter(c => c.lastMessage);
  const otherUsers = conversations.filter(c => !c.lastMessage);

  const renderUserCard = (c) => (
    <div 
      key={c.user._id || c.user.id}
      onClick={() => navigate(`/messages/${c.user._id || c.user.id}`)}
      className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${
        userId === (c.user._id || c.user.id) ? 'bg-gray-900 text-white shadow-xl shadow-gray-900/10' : 'hover:bg-gray-50 text-gray-900'
      }`}
    >
      <div className="relative">
        <div className="w-12 h-12 rounded-2xl bg-gray-100 overflow-hidden shrink-0 border border-white/10 flex items-center justify-center">
          {c.user.photoURL ? (
            <img src={c.user.photoURL} alt="" className="w-full h-full object-cover" />
          ) : (
            <UserIcon className={`w-6 h-6 ${userId === (c.user._id || c.user.id) ? 'text-white/50' : 'text-gray-400'}`} />
          )}
        </div>
        {/* Optional Online Badge */}
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <h3 className={`font-bold truncate ${userId === (c.user._id || c.user.id) ? 'text-white' : 'text-gray-900'}`}>
            {c.user.displayName}
          </h3>
          <span className={`text-[10px] font-bold uppercase tracking-wider shrink-0 ml-2 ${userId === (c.user._id || c.user.id) ? 'text-white/60' : 'text-gray-400'}`}>
            {formatTime(c.lastMessage?.createdAt)}
          </span>
        </div>
        <p className={`text-sm truncate pr-2 ${userId === (c.user._id || c.user.id) ? 'text-white/70' : 'text-gray-500 font-medium'}`}>
          {c.lastMessage?.text || 'Start a conversation'}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafafa] pt-8 pb-12 px-4 md:px-8 flex justify-center">
      <div className="w-full max-w-6xl min-h-[85vh] bg-white rounded-[32px] shadow-2xl shadow-gray-200/50 flex overflow-y-auto border border-gray-100">
        
        {/* Left Panel - Conversations List */}
        <div className={`w-full md:w-[380px] flex flex-col border-r border-gray-100 bg-white ${userId ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h1 className="text-2xl font-black tracking-tight text-gray-900">Messages</h1>
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
              <MoreVertical className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-1">
            {loadingConv ? (
              <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-pink-500" /></div>
            ) : (
              <>
                {/* Active Conversations */}
                {activeChats.length === 0 ? (
                  <div className="text-center p-8 text-gray-400">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p className="font-semibold text-sm">No conversations yet</p>
                  </div>
                ) : (
                  activeChats.map(renderUserCard)
                )}

                {/* Other Users */}
                {otherUsers.length > 0 && (
                  <div className="mt-6">
                    <div className="px-4 py-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Other Users</div>
                    {otherUsers.map(renderUserCard)}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right Panel - Active Chat */}
        <div className={`flex-1 flex flex-col bg-[#fdfdfd] relative ${!userId ? 'hidden md:flex' : 'flex'}`}>
          {!userId ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-24 h-24 bg-pink-50 rounded-[40px] flex items-center justify-center mb-6 shadow-sm border border-pink-100">
                <MessageSquare className="w-10 h-10 text-pink-500" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Your Messages</h2>
              <p className="text-gray-500 font-medium max-w-sm">Select a conversation from the left panel or start a new chat with an artisan.</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="h-[88px] px-6 md:px-8 flex items-center justify-between border-b border-gray-100 bg-white/80 backdrop-blur-xl absolute top-0 left-0 right-0 z-10">
                <div className="flex items-center gap-5">
                  <button onClick={() => navigate('/messages')} className="md:hidden p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all">
                    <ArrowLeft className="w-5 h-5 text-gray-900" />
                  </button>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 overflow-hidden border border-gray-100 flex items-center justify-center">
                      {activeUser?.photoURL ? (
                        <img src={activeUser.photoURL} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon className="w-6 h-6 text-gray-300" />
                      )}
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Chatting with Artisan</p>
                      <h2 className="text-lg font-black text-gray-900 leading-none">{activeUser?.displayName || 'Loading...'}</h2>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                        <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Online</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all text-gray-400">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div 
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto px-6 md:px-8 pt-32 pb-8 space-y-6 no-scrollbar relative"
                style={{ overscrollBehaviorY: 'contain' }}
              >
                
                {/* Context Banner */}
                {location.state?.productName && (
                  <div className="bg-pink-50 border border-pink-100 p-4 rounded-2xl flex items-center gap-4 mb-6 shadow-sm">
                     {location.state.productImage && (
                       <img src={location.state.productImage} alt="" className="w-12 h-12 rounded-xl object-cover border border-pink-200/50" />
                     )}
                     <div>
                       <p className="text-[10px] font-black text-pink-500 uppercase tracking-widest mb-0.5">Custom Order Request</p>
                       <p className="font-bold text-gray-900 text-sm">Regarding: {location.state.productName}</p>
                     </div>
                  </div>
                )}

                {loadingMsg ? (
                  <div className="flex justify-center h-full items-center"><Loader2 className="w-8 h-8 animate-spin text-pink-500" /></div>
                ) : messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-20 h-20 bg-gray-50 rounded-[32px] flex items-center justify-center border border-gray-100 text-gray-400">
                       <Smile className="w-8 h-8" />
                    </div>
                    <p className="text-gray-400 font-bold text-sm">Start the conversation</p>
                  </div>
                ) : (
                  messages.map((msg, i) => {
                    const isMine = msg.senderId === currentUserId;
                    return (
                      <motion.div 
                        key={msg._id || i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[75%] md:max-w-[65%] p-5 rounded-[28px] shadow-sm relative group ${
                          isMine 
                            ? 'bg-gray-900 text-white rounded-br-md shadow-gray-900/10' 
                            : 'bg-white border border-gray-100 text-gray-900 rounded-bl-md shadow-gray-200/20'
                        }`}>
                          <p className="font-semibold leading-relaxed text-[15px]">{msg.text}</p>
                          <div className={`flex items-center justify-end gap-1.5 mt-2 ${isMine ? 'opacity-50' : 'opacity-40 text-gray-500'}`}>
                            <span className="text-[9px] font-black uppercase tracking-wider">
                              {formatTime(msg.createdAt)}
                            </span>
                            {isMine && <CheckCheck className="w-[14px] h-[14px]" />}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
                <div ref={scrollRef} className="h-1" />
              </div>

              {/* New Message Floating Indicator */}
              <AnimatePresence>
                {showScrollButton && (
                  <motion.button
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    onClick={() => scrollToBottom('smooth')}
                    className="absolute bottom-28 right-6 md:right-10 z-20 bg-white border border-gray-200 text-gray-900 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-full px-4 py-2.5 text-sm font-black flex items-center gap-3 hover:bg-gray-50 active:scale-95 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                      <span>New Messages</span>
                    </div>
                    {unreadCount > 0 && (
                      <span className="bg-pink-500 text-white rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 text-[10px]">
                        {unreadCount}
                      </span>
                    )}
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Chat Input */}
              <div className="p-4 md:p-6 bg-white border-t border-gray-100 relative z-30">
                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                  <button type="button" className="w-12 h-12 flex items-center justify-center shrink-0 bg-gray-50 rounded-2xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <input 
                    type="text" 
                    placeholder="Message..." 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="flex-1 bg-gray-50 rounded-2xl h-14 px-6 font-semibold text-gray-900 outline-none border-2 border-transparent focus:bg-white focus:border-gray-200 transition-all placeholder:text-gray-400"
                  />
                  <button 
                    type="submit" 
                    disabled={!inputText.trim()}
                    className="w-14 h-14 flex items-center justify-center shrink-0 bg-pink-500 text-white rounded-2xl shadow-xl shadow-pink-500/20 hover:bg-pink-600 transition-all active:scale-95 disabled:opacity-30 disabled:hover:bg-pink-500 disabled:active:scale-100 disabled:shadow-none"
                  >
                    <Send className="w-5 h-5 ml-1" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
