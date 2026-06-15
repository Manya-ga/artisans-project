import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
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
  const activeUser = targetUser || conversations.find(c => c && c.user && (c.user._id === userId || c.user.id === userId))?.user || null;

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
        const existing = prev.find(c => c && c.user && (c.user._id === otherId || c.user.id === otherId));
        
        if (existing) {
          const updated = prev.filter(c => c && c.user && (c.user._id !== otherId && c.user.id !== otherId));
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
      const inList = conversations.find(c => c && c.user && (c.user._id === userId || c.user.id === userId));
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
        const inList = conversations.find(c => c && c.user && (c.user._id === userId || c.user.id === userId));
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
      const existingIdx = prev.findIndex(c => c && c.user && (c.user._id === otherId || c.user.id === otherId));
      
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

  const renderUserCard = (c) => {
    if (!c || !c.user) return null;
    const cid = c.user._id || c.user.id;
    return (
    <div 
      key={cid}
      onClick={() => navigate(`/messages/${cid}`)}
      className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${
        userId === cid ? 'bg-gray-900 text-white shadow-xl shadow-gray-900/10' : 'hover:bg-gray-50 text-gray-900'
      }`}
    >
      <div className="relative">
        <div className="w-12 h-12 rounded-2xl bg-gray-100 overflow-hidden shrink-0 border border-white/10 flex items-center justify-center">
          {c.user.photoURL ? (
            <img src={c.user.photoURL} alt="" className="w-full h-full object-cover" />
          ) : (
            <UserIcon className={`w-6 h-6 ${userId === cid ? 'text-white/50' : 'text-gray-400'}`} />
          )}
        </div>
        {/* Optional Online Badge */}
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <h3 className={`font-bold truncate ${userId === cid ? 'text-white' : 'text-gray-900'}`}>
            {c.user.displayName || 'Unknown Artisan'}
          </h3>
          <span className={`text-[10px] font-bold uppercase tracking-wider shrink-0 ml-2 ${userId === cid ? 'text-white/60' : 'text-gray-400'}`}>
            {formatTime(c.lastMessage?.createdAt)}
          </span>
        </div>
        <p className={`text-sm truncate pr-2 ${userId === cid ? 'text-white/70' : 'text-gray-500 font-medium'}`}>
          {c.lastMessage?.text || 'Start a conversation'}
        </p>
      </div>
    </div>
    );
  };

  return (
    <div className="flex justify-center bg-[#fafafa] md:pt-8 md:pb-12 md:px-8 h-full w-full">
      <div className="w-full h-full max-w-6xl bg-white md:rounded-[32px] md:shadow-2xl md:shadow-gray-200/50 flex overflow-hidden md:border md:border-gray-100 md:self-center md:max-h-full">
        
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
        <div className={`chat-page flex-1 flex flex-col bg-[#fdfdfd] relative ${!userId ? 'hidden md:flex' : 'flex'} w-full h-full overflow-hidden`}>
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
              <div className="chat-header sticky top-0 z-[100] h-16 md:h-20 px-3 md:px-6 flex items-center justify-between border-b border-gray-100 bg-white/95 backdrop-blur-md shrink-0 shadow-sm">
                <div className="flex items-center gap-3">
                  <button onClick={() => navigate('/messages')} className="md:hidden p-2 -ml-1 text-gray-600 hover:bg-gray-100 rounded-full transition-all">
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                  <div className="flex items-center gap-3 cursor-pointer">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-100 overflow-hidden shrink-0 border border-gray-200 flex items-center justify-center">
                      {activeUser?.photoURL ? (
                        <img src={activeUser.photoURL} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <h2 className="text-base md:text-lg font-bold text-gray-900 leading-tight truncate max-w-[150px] sm:max-w-[200px]">
                        {activeUser?.displayName || 'Loading...'}
                      </h2>
                      <p className="text-xs font-semibold text-green-500">Online</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-all">
                    <MoreVertical className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div 
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="messages flex-1 overflow-y-auto px-3 md:px-6 py-4 space-y-2 md:space-y-4 bg-[#f8fafc] relative w-full"
                style={{ overscrollBehaviorY: 'contain', WebkitOverflowScrolling: 'touch' }}
              >
                
                {/* Context Banner */}
                {location.state?.productName && (
                  <div className="bg-white border border-gray-200 p-3 rounded-2xl flex items-center gap-3 mb-4 shadow-sm max-w-sm mx-auto">
                     {location.state.productImage && (
                       <img src={location.state.productImage} alt="" className="w-10 h-10 rounded-xl object-cover" />
                     )}
                     <div className="flex-1 min-w-0">
                       <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Inquiry About</p>
                       <p className="font-semibold text-gray-900 text-sm truncate">{location.state.productName}</p>
                     </div>
                  </div>
                )}

                {loadingMsg ? (
                  <div className="flex justify-center h-full items-center"><Loader2 className="w-8 h-8 animate-spin text-pink-500" /></div>
                ) : messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 text-gray-300">
                       <MessageSquare className="w-6 h-6" />
                    </div>
                    <p className="text-gray-400 font-medium text-sm">Say hello!</p>
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
                        <div className={`max-w-[80%] md:max-w-[70%] min-w-[80px] break-words whitespace-normal px-4 py-2.5 shadow-sm relative group ${
                          isMine 
                            ? 'bg-pink-500 text-white rounded-2xl rounded-tr-sm' 
                            : 'bg-white border border-gray-100 text-gray-900 rounded-2xl rounded-tl-sm'
                        }`}>
                          <p className="text-[15px] font-medium leading-snug">{msg.text}</p>
                          <div className={`flex items-center justify-end gap-1 mt-1 ${isMine ? 'text-pink-100' : 'text-gray-400'}`}>
                            <span className="text-[10px] font-medium">
                              {formatTime(msg.createdAt)}
                            </span>
                            {isMine && <CheckCheck className="w-3.5 h-3.5" />}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
                <div ref={scrollRef} className="h-2" />
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
              <div className="input-bar sticky bottom-0 z-[100] px-2 py-2 md:px-6 md:py-4 bg-[#f0f2f5] md:bg-white border-t border-gray-200 shrink-0 pb-safe">
                <form onSubmit={handleSendMessage} className="flex items-end gap-2 max-w-4xl mx-auto w-full">
                  <button 
                    type="button"
                    className="w-10 h-10 md:w-12 md:h-12 shrink-0 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-full transition-all mb-0.5"
                  >
                    <Paperclip className="w-6 h-6" />
                  </button>
                  <textarea 
                    placeholder="Message..." 
                    value={inputText}
                    onChange={(e) => {
                      setInputText(e.target.value);
                      e.target.style.height = 'auto';
                      e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (inputText.trim()) handleSendMessage(e);
                      }
                    }}
                    rows={1}
                    className="flex-1 bg-white rounded-3xl min-h-[40px] md:min-h-[48px] px-4 py-2.5 md:py-3 text-[15px] text-gray-900 border border-gray-300 outline-none resize-none no-scrollbar placeholder:text-gray-500 focus:border-pink-500 shadow-sm transition-colors"
                    style={{ overflowY: 'auto' }}
                  />
                  <button 
                    type="submit" 
                    disabled={!inputText.trim()}
                    className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center shrink-0 bg-pink-500 text-white rounded-full shadow-md hover:bg-pink-600 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 mb-0.5"
                  >
                    <Send className="w-5 h-5 ml-0.5" />
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
