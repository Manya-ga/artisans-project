import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import ArtisanAvatar from '../components/ArtisanAvatar';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import api from '../api';
import { deleteConversation as apiDeleteConversation } from '../api';
import {
  Send, User as UserIcon, ArrowLeft, MoreVertical,
  Paperclip, CheckCheck, Loader2, MessageSquare, ChevronDown, Trash2, X
} from 'lucide-react';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'https://artisan-connect-backend-db2z.onrender.com';

export default function MessagingPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { addToast } = useToast();
  const currentUserId = user?._id || user?.id;

  const [socket, setSocket] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loadingConv, setLoadingConv] = useState(true);
  const [loadingMsg, setLoadingMsg] = useState(false);
  const [targetUser, setTargetUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deletingConv, setDeletingConv] = useState(false);

  const scrollRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const prevMessagesLength = useRef(0);
  const wasNearBottom = useRef(true);
  const menuRef = useRef(null);

  const [showScrollButton, setShowScrollButton] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const activeUser =
    targetUser ||
    conversations.find(c => c && c.user && (c.user._id === userId || c.user.id === userId))?.user ||
    null;

  const activeConversationId = conversations.find(
    c => c && c.user && (c.user._id === userId || c.user.id === userId)
  )?.conversationId || null;

  // ── Close menu on outside click ──────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Socket.io setup ──────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    if (userId && userId === currentUserId) {
      navigate('/messages', { replace: true });
      return;
    }

    const token = localStorage.getItem('token');
    const newSocket = io(SOCKET_URL, { 
      withCredentials: true,
      auth: { token }
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('join', currentUserId);
    });

    newSocket.on('messageError', ({ error }) => {
      console.warn('[MessagingPage] Socket error:', error);
    });

    newSocket.on('receiveMessage', (message) => {
      console.log('[Socket] Received message:', message);
      setMessages(prev => {
        if (prev.find(m => m._id === message._id)) return prev;
        if (
          (message.senderId === currentUserId && message.receiverId === userId) ||
          (message.senderId === userId && message.receiverId === currentUserId)
        ) {
          return [...prev, message];
        }
        return prev;
      });

      setConversations(prev => {
        const otherId = message.senderId === currentUserId ? message.receiverId : message.senderId;
        const existing = prev.find(c => c && c.user && (c.user._id === otherId || c.user.id === otherId));
        if (existing) {
          const updated = prev.filter(c => c && c.user && (c.user._id !== otherId && c.user.id !== otherId));
          return [{
            ...existing,
            lastMessage: message,
            unreadCount: (message.senderId !== currentUserId && otherId !== userId)
              ? existing.unreadCount + 1
              : existing.unreadCount
          }, ...updated];
        }
        fetchConversations();
        return prev;
      });
    });

    return () => newSocket.disconnect();
  }, [user, userId]);

  // ── Fetch Conversations (loads from DB — persists across logout/login) ───────
  const fetchConversations = async () => {
    try {
      console.log('[fetchConversations] Loading from DB...');
      const res = await api.get('/api/messages/conversations');
      setConversations(res || []);
    } catch (err) {
      console.error('[fetchConversations] Error:', err);
    } finally {
      setLoadingConv(false);
    }
  };

  // Re-fetch whenever the authenticated user changes (handles login/logout cycle)
  useEffect(() => {
    if (user) {
      setLoadingConv(true);
      fetchConversations();
    } else {
      setConversations([]);
      setMessages([]);
      setLoadingConv(false);
    }
  }, [user]);

  // ── Fetch target user info if not yet in conversation list ───
  useEffect(() => {
    const fetchTargetUser = async () => {
      if (!userId) return;
      const inList = conversations.find(c => c && c.user && (c.user._id === userId || c.user.id === userId));
      if (inList) { setTargetUser(null); return; }

      try {
        const res = await api.get(`/api/users/${userId}`);
        setTargetUser(res);
      } catch (err) {
        console.error('[fetchTargetUser] Error:', err);
      }
    };
    fetchTargetUser();
  }, [userId, conversations]);

  // ── Fetch Messages for the active chat (from DB) ─────────────
  useEffect(() => {
    const fetchMessages = async () => {
      if (!userId) return;
      setLoadingMsg(true);
      prevMessagesLength.current = 0;
      try {
        const res = await api.get(`/api/messages/${userId}`);
        setMessages(res || []);

        const inList = conversations.find(c => c && c.user && (c.user._id === userId || c.user.id === userId));
        if (!inList && res && res.length > 0) {
          fetchConversations();
        }
      } catch (err) {
        console.error('[fetchMessages] Error:', err);
      } finally {
        setLoadingMsg(false);
      }
    };
    fetchMessages();
  }, [userId]);

  // ── Auto-scroll logic ─────────────────────────────────────────
  const scrollToBottom = (behavior = 'smooth') => {
    if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior });
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
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
      scrollToBottom('auto');
    } else if (isNewMessage) {
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

  // Reset scroll state when switching chats
  useEffect(() => {
    prevMessagesLength.current = 0;
    wasNearBottom.current = true;
    setShowScrollButton(false);
    setUnreadCount(0);
    setShowMenu(false);
    setDeleteConfirm(false);
  }, [userId]);

  // Auto-fill context message
  useEffect(() => {
    if (userId && location.state) {
      if (location.state.productName) {
        setInputText(prev => prev || `Hi, I want to customize this product: ${location.state.productName}`);
      } else if (location.state.isProfileContext) {
        setInputText(prev => prev || 'Hi, I saw your work and want to discuss customization.');
      }
    } else if (userId) {
      setInputText('');
    }
  }, [userId, location.state]);

  // ── Send Message ──────────────────────────────────────────────
  const handleSendMessage = async (e) => {
    e.preventDefault();
    const text = inputText.trim();
    if (!text || !userId) return;
    if (userId === currentUserId) return;

    const tempId = Date.now().toString();
    const optimisticMessage = {
      _id: tempId, id: tempId,
      senderId: currentUserId, receiverId: userId,
      text, content: text,
      createdAt: new Date().toISOString(),
      sending: true
    };

    setMessages(prev => [...prev, optimisticMessage]);
    setInputText('');

    try {
      const sentMessage = await api.post('/api/messages/send', {
        receiverId: userId,
        message: text,
        text
      });

      // Replace optimistic with real persisted message
      setMessages(prev => prev.map(m => m._id === tempId ? { ...sentMessage, text: sentMessage.text || sentMessage.content } : m));

      if (socket && socket.connected) {
        socket.emit('sendMessage', sentMessage);
      }

      updateConversationsWithNewMessage(sentMessage);
    } catch (err) {
      console.error('[handleSendMessage] Error:', err);
      setMessages(prev => prev.filter(m => m._id !== tempId));
      setInputText(text);
      addToast(`Error: ${err.message || 'Failed to send message'}`, 'error');
    }
  };

  const updateConversationsWithNewMessage = (message) => {
    setConversations(prev => {
      const otherId = message.senderId === currentUserId ? message.receiverId : message.senderId;
      const existingIdx = prev.findIndex(c => c && c.user && (c.user._id === otherId || c.user.id === otherId));
      if (existingIdx !== -1) {
        const updated = [...prev];
        const conv = { ...updated[existingIdx], lastMessage: message };
        updated.splice(existingIdx, 1);
        return [conv, ...updated];
      }
      fetchConversations();
      return prev;
    });
  };

  // ── Delete Conversation ───────────────────────────────────────
  const handleDeleteConversation = async () => {
    if (!activeConversationId) {
      // Conversation hasn't been created in DB yet (no messages sent) — just navigate away
      navigate('/messages');
      return;
    }

    setDeletingConv(true);
    try {
      await apiDeleteConversation(activeConversationId);
      // Remove from local state
      setConversations(prev =>
        prev.filter(c => c.conversationId !== activeConversationId)
      );
      setMessages([]);
      setDeleteConfirm(false);
      setShowMenu(false);
      navigate('/messages');
    } catch (err) {
      console.error('[deleteConversation] Error:', err);
      addToast('Failed to delete conversation. Please try again.', 'error');
    } finally {
      setDeletingConv(false);
    }
  };

  // ── Formatting ────────────────────────────────────────────────
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

  const getInitials = (name) => {
    if (!name) return 'U';
    const p = name.split(' ').filter(Boolean);
    if (p.length >= 2) return (p[0][0] + p[1][0]).toUpperCase();
    return p[0].substring(0, 2).toUpperCase();
  };

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
          <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 border border-white/10 flex items-center justify-center">
            <ArtisanAvatar 
              name={c.user.displayName || c.user.name} 
              photoURL={c.user.photoURL || c.user.image}
              isArtisan={c.user.role !== 'buyer'}
              className="w-full h-full text-lg"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1">
            <h3 className={`font-bold truncate ${userId === cid ? 'text-white' : 'text-gray-900'}`}>
              {c.user.displayName || c.user.name || 'Unknown Artisan'}
            </h3>
            <span className={`text-[10px] font-bold uppercase tracking-wider shrink-0 ml-2 ${userId === cid ? 'text-white/60' : 'text-gray-400'}`}>
              {formatTime(c.lastMessage?.createdAt)}
            </span>
          </div>
          <p className={`text-sm truncate pr-2 ${userId === cid ? 'text-white/70' : 'text-gray-500 font-medium'}`}>
            {c.lastMessage?.text || c.lastMessage?.content || 'Start a conversation'}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex justify-center bg-[#fafafa] md:pt-8 md:pb-12 md:px-8 h-full w-full">
      <div className="w-full h-full max-w-6xl bg-white md:rounded-[32px] md:shadow-2xl md:shadow-gray-200/50 flex overflow-hidden md:border md:border-gray-100 md:self-center md:max-h-full">

        {/* ── Left Panel — Conversations ── */}
        <div className={`w-full md:w-[380px] flex flex-col border-r border-gray-100 bg-white ${userId ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h1 className="text-2xl font-black tracking-tight text-gray-900">Messages</h1>
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
              <MoreVertical className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-1">
            {loadingConv ? (
              <div className="flex justify-center p-8">
                <Loader2 className="w-6 h-6 animate-spin text-pink-500" />
              </div>
            ) : (
              <>
                {activeChats.length === 0 ? (
                  <div className="text-center p-8 text-gray-400">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p className="font-semibold text-sm">No conversations yet</p>
                    <p className="text-xs mt-1 opacity-70">Start chatting with an artisan below</p>
                  </div>
                ) : (
                  activeChats.map(renderUserCard)
                )}

                {otherUsers.length > 0 && (
                  <div className="mt-6">
                    <div className="px-4 py-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                      Suggested Artisans
                    </div>
                    {otherUsers.map(renderUserCard)}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ── Right Panel — Active Chat ── */}
        <div className={`chat-page flex-1 flex flex-col bg-[#fdfdfd] relative ${!userId ? 'hidden md:flex' : 'flex'} w-full h-full overflow-hidden`}>
          {!userId ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-24 h-24 bg-pink-50 rounded-[40px] flex items-center justify-center mb-6 shadow-sm border border-pink-100">
                <MessageSquare className="w-10 h-10 text-pink-500" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Your Messages</h2>
              <p className="text-gray-500 font-medium max-w-sm">
                Select a conversation from the left panel or start a new chat with an artisan.
              </p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="chat-header sticky top-0 z-[100] h-16 md:h-20 px-3 md:px-6 flex items-center justify-between border-b border-gray-100 bg-white/95 backdrop-blur-md shrink-0 shadow-sm">
                <div className="flex items-center gap-3">
                  <button onClick={() => navigate('/messages')} className="md:hidden flex items-center gap-1 p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-all font-bold text-sm">
                    <ArrowLeft className="w-5 h-5" />
                    Back
                  </button>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden shrink-0 border border-gray-200 flex items-center justify-center">
                      <ArtisanAvatar 
                        name={activeUser?.displayName || activeUser?.name} 
                        photoURL={activeUser?.photoURL || activeUser?.image}
                        isArtisan={activeUser?.role !== 'buyer'}
                        className="w-full h-full text-lg md:text-xl"
                      />
                    </div>
                    <div className="flex flex-col">
                      <h2 className="text-base md:text-lg font-bold text-gray-900 leading-tight truncate max-w-[150px] sm:max-w-[200px]">
                        {activeUser?.displayName || activeUser?.name || 'Loading...'}
                      </h2>
                      <p className="text-xs font-semibold text-green-500">Online</p>
                    </div>
                  </div>
                </div>

                {/* Chat Options Menu */}
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setShowMenu(v => !v)}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-all"
                  >
                    <MoreVertical className="w-5 h-5 md:w-6 md:h-6" />
                  </button>

                  <AnimatePresence>
                    {showMenu && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: -8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: -8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-12 w-52 bg-white rounded-2xl shadow-2xl shadow-gray-200/60 border border-gray-100 overflow-hidden z-50"
                      >
                        <button
                          onClick={() => { setDeleteConfirm(true); setShowMenu(false); }}
                          className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Conversation
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Delete Confirmation Modal */}
              <AnimatePresence>
                {deleteConfirm && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm px-6"
                  >
                    <motion.div
                      initial={{ scale: 0.9, y: 20 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.9, y: 20 }}
                      className="bg-white rounded-3xl shadow-2xl p-6 max-w-sm w-full"
                    >
                      <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Trash2 className="w-7 h-7 text-red-500" />
                      </div>
                      <h3 className="text-xl font-black text-gray-900 text-center mb-2">Delete Conversation?</h3>
                      <p className="text-sm text-gray-500 text-center mb-6 leading-relaxed">
                        This will permanently delete all messages in this conversation. This action cannot be undone.
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setDeleteConfirm(false)}
                          disabled={deletingConv}
                          className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleDeleteConversation}
                          disabled={deletingConv}
                          className="flex-1 py-3 rounded-2xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {deletingConv ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Messages Area */}
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
                  <div className="flex justify-center h-full items-center">
                    <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
                  </div>
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
                    const msgText = msg.text || msg.content || '';
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
                          <p className="text-[15px] font-medium leading-snug">{msgText}</p>
                          <div className={`flex items-center justify-end gap-1 mt-1 ${isMine ? 'text-pink-100' : 'text-gray-400'}`}>
                            <span className="text-[10px] font-medium">{formatTime(msg.createdAt)}</span>
                            {isMine && <CheckCheck className="w-3.5 h-3.5" />}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
                <div ref={scrollRef} className="h-2" />
              </div>

              {/* Scroll-to-bottom button */}
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
