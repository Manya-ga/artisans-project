import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useCart } from '../contexts/CartContext.jsx';
import { useSocial } from '../contexts/SocialContext.jsx';
import { getMyProducts, getArtisan, getUserStories, updateProfile as updateProfileApi } from '../api';
import {
  Camera, Edit3, LogOut, Plus, X, ShoppingBag,
  Users, Package, MapPin, Heart, MessageCircle,
  Check, Loader2, Upload, Star
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext.jsx';
import ProductCard from '../components/ProductCard.jsx';
import AddProductModal from '../components/AddProductModal.jsx';
import StoryUploadModal from '../components/StoryUploadModal.jsx';

// ── Initials Avatar (no fake stock photos) ──────────────────────────────────
function Avatar({ name, photoURL, size = 128, className = '' }) {
  const [imgError, setImgError] = useState(false);
  const initials = (name || '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const palettes = [
    'from-pink-400 to-rose-500',
    'from-violet-400 to-purple-600',
    'from-blue-400 to-indigo-600',
    'from-emerald-400 to-teal-600',
    'from-amber-400 to-orange-500',
    'from-cyan-400 to-sky-600',
  ];
  const gradient = palettes[(name || '').charCodeAt(0) % palettes.length];
  const fontSize = Math.max(16, size * 0.34);

  if (photoURL && !imgError) {
    return (
      <img
        src={photoURL}
        alt={name}
        className={`w-full h-full object-cover ${className}`}
        onError={() => setImgError(true)}
      />
    );
  }
  return (
    <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center ${className}`}>
      <span className="text-white font-black select-none" style={{ fontSize }}>{initials}</span>
    </div>
  );
}

// ── Stat Pill ─────────────────────────────────────────────────────────────────
function StatPill({ icon: Icon, value, label, color = 'text-pink-500' }) {
  return (
    <div className="flex flex-col items-center gap-0.5 sm:gap-1">
      <span className="text-lg sm:text-2xl font-black text-gray-900">{value}</span>
      <span className="text-[9px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
        <Icon className={`w-3 h-3 ${color}`} />{label}
      </span>
    </div>
  );
}

// ── Edit Profile Modal ────────────────────────────────────────────────────────
function EditProfileModal({ user, onClose, onSaved }) {
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState(user?.photoURL || null);
  const [previewError, setPreviewError] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setPreview(URL.createObjectURL(file));
    setPreviewError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!displayName.trim()) return;
    setSaving(true);
    try {
      const data = await updateProfileApi({
        displayName: displayName.trim(),
        bio: bio.trim(),
        avatar: avatarFile
      });
      onSaved(data.user || data);
    } catch (err) {
      console.error('[EditModal] Save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[700] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-gray-50 flex items-center justify-between">
          <h2 className="text-xl font-black text-gray-900">Edit Profile</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <div className="w-24 h-24 rounded-[24px] overflow-hidden border-4 border-white shadow-xl">
                {preview && !previewError ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={() => setPreviewError(true)}
                  />
                ) : (
                  <Avatar name={displayName} photoURL={null} size={96} />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-9 h-9 bg-pink-500 text-white rounded-2xl flex items-center justify-center shadow-lg hover:bg-pink-600 transition-all"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <p className="text-xs text-gray-400 font-medium">
              {avatarFile ? `📎 ${avatarFile.name}` : 'Tap camera to upload photo'}
            </p>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest block">Display Name</label>
            <input
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              required
              className="w-full bg-gray-50 rounded-2xl px-5 py-4 font-semibold text-gray-900 outline-none border-2 border-transparent focus:bg-white focus:border-pink-300 transition-all"
              placeholder="Your name"
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest block">Bio</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={3}
              className="w-full bg-gray-50 rounded-2xl px-5 py-4 font-medium text-gray-700 outline-none border-2 border-transparent focus:bg-white focus:border-pink-300 transition-all resize-none"
              placeholder="Tell buyers about your craft..."
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving || !displayName.trim()}
            className="w-full bg-gray-900 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-pink-600 transition-all shadow-xl disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ── Main Profile Page ─────────────────────────────────────────────────────────
export default function Profile({ id: propId }) {
  const { id: paramId } = useParams();
  const id = propId || paramId;
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();
  const { wishlist } = useCart();
  const { toggleFollow, getSocialStats } = useSocial();
  const { addToast } = useToast();

  const isOwnProfile = !id || id === user?._id || id === user?.id;
  const viewedId = isOwnProfile ? (user?._id || user?.id) : id;

  const [profileData, setProfileData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStoryUpload, setShowStoryUpload] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [userStory, setUserStory] = useState(null);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  const { followersCount, isFollowing } = getSocialStats(viewedId);

  useEffect(() => {
    loadData();
  }, [id, user?._id]);

  async function loadData() {
    setLoading(true);
    try {
      if (isOwnProfile) {
        const myProds = await getMyProducts();
        setProducts(myProds || []);
        setProfileData({
          displayName: user?.displayName || '',
          bio: user?.bio || '',
          photoURL: user?.photoURL || null,
          role: user?.role || 'buyer',
        });
      } else {
        const artisan = await getArtisan(id);
        setProfileData({
          displayName: artisan.displayName || artisan.name || '',
          bio: artisan.bio || '',
          photoURL: artisan.photoURL || artisan.image || null,
          role: artisan.role || 'artisan',
        });
        setProducts(artisan.products || []);
      }
      
      const story = await getUserStories(viewedId);
      setUserStory(story);
    } catch (err) {
      console.error('[Profile] Failed to load:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleSavedProfile = async (updatedUser) => {
    if (updateProfile && updatedUser) {
      setProfileData(prev => ({
        ...prev,
        displayName: updatedUser.displayName,
        bio: updatedUser.bio || '',
        photoURL: updatedUser.photoURL || null,
        role: updatedUser.role || prev.role,
      }));
      // Sync to context too
      await updateProfile({ displayName: updatedUser.displayName, bio: updatedUser.bio || '' });
    }
    setShowEdit(false);
    addToast('Profile updated!', 'success');
  };

  const handleFollow = async () => {
    if (!user) { addToast('Please log in to follow artisans', 'info'); return; }
    setFollowLoading(true);
    try {
      const result = await toggleFollow(id);
      addToast(result?.isFollowing ? 'Following artisan ✨' : 'Unfollowed', 'success');
    } catch {
      addToast('Could not update follow', 'error');
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-pink-500 animate-spin" />
      </div>
    );
  }

  const isArtisan = profileData?.role === 'artisan' || products.length > 0;

  return (
    <>
      <div className="max-w-5xl mx-auto py-10 px-4 space-y-8">

        {/* ── SECTION 1: PROFILE HEADER ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden"
        >
          {/* Banner */}
          <div className="h-28 bg-gradient-to-r from-gray-900 via-gray-800 to-indigo-900 relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(236,72,153,0.3),_transparent_60%)]" />
          </div>

          <div className="px-4 sm:px-8 pb-6 sm:pb-8">
            {/* Avatar row */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-14 mb-6 gap-4">
              <div 
                className={`relative group ${userStory?.media?.length > 0 ? 'cursor-pointer' : ''}`}
                onClick={() => {
                  if (userStory?.media?.length > 0) {
                    setShowStoryViewer(true);
                    setActiveMediaIndex(0);
                  }
                }}
              >
                <div className={`w-28 h-28 rounded-[24px] overflow-hidden ${
                  userStory?.media?.length > 0 
                    ? 'p-1 rounded-[28px] bg-gradient-to-tr from-pink-500 to-indigo-500 hover:scale-105 transition-transform' 
                    : 'border-4 border-white shadow-xl bg-gray-100'
                }`}>
                  <div className={userStory?.media?.length > 0 ? 'w-full h-full rounded-[24px] border-2 border-white overflow-hidden bg-white' : 'w-full h-full'}>
                    <Avatar name={profileData?.displayName} photoURL={profileData?.photoURL} size={112} />
                  </div>
                </div>
                {isOwnProfile && (
                  <button
                    onClick={() => setShowEdit(true)}
                    className="absolute -bottom-1 -right-1 w-9 h-9 bg-pink-500 text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-pink-600 transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2.5 pt-0 sm:pt-16">
                {isOwnProfile ? (
                  <>
                    <button
                      onClick={() => setShowEdit(true)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 text-gray-700 text-sm font-black rounded-2xl hover:bg-gray-100 transition-all border border-gray-100"
                    >
                      <Edit3 className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={() => setShowStoryUpload(true)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-black rounded-2xl hover:bg-pink-600 transition-all shadow-sm"
                    >
                      <Plus className="w-4 h-4" /> Post Story
                    </button>
                    <button
                      onClick={() => { logout(); navigate('/'); }}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 text-gray-500 text-sm font-black rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleFollow}
                      disabled={followLoading}
                      className={`flex items-center gap-2 px-6 py-2.5 text-sm font-black rounded-2xl transition-all shadow-sm ${
                        isFollowing
                          ? 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500'
                          : 'bg-pink-500 text-white hover:bg-pink-600 shadow-pink-200'
                      }`}
                    >
                      {followLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Users className="w-4 h-4" />}
                      {isFollowing ? 'Unfollow' : 'Follow'}
                    </button>
                    <button
                      onClick={() => navigate(`/messages/${id}`, { state: { isProfileContext: true } })}
                      className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white text-sm font-black rounded-2xl hover:bg-black transition-all"
                    >
                      <MessageCircle className="w-4 h-4" /> Message
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Name + badge */}
            <div className="space-y-1 mb-5">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-black text-gray-900">{profileData?.displayName || 'Artisan'}</h1>
                {isArtisan && (
                  <span className="px-3 py-1 bg-pink-50 text-pink-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-pink-100">
                    Artisan Seller
                  </span>
                )}
              </div>
              {profileData?.bio && (
                <p className="text-gray-500 font-medium text-sm leading-relaxed max-w-lg">
                  {profileData.bio}
                </p>
              )}
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-4 sm:gap-8 pt-4 border-t border-gray-50 overflow-x-auto no-scrollbar">
              <StatPill icon={Package} value={products.length} label="Products" color="text-indigo-500" />
              <div className="w-px h-8 bg-gray-100" />
              <StatPill icon={Users} value={followersCount} label="Followers" color="text-pink-500" />
              {isOwnProfile && (
                <>
                  <div className="w-px h-8 bg-gray-100" />
                  <StatPill icon={Heart} value={wishlist?.length || 0} label="Wishlist" color="text-red-400" />
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── SECTION 2: PRODUCTS ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-5"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-gray-900">
                {isOwnProfile ? 'My Products' : `${profileData?.displayName?.split(' ')[0]}'s Products`}
              </h2>
              <p className="text-sm text-gray-400 font-medium mt-0.5">{products.length} item{products.length !== 1 ? 's' : ''} listed</p>
            </div>
            {isOwnProfile && (
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-black rounded-2xl hover:bg-pink-600 transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" /> Add Product
              </button>
            )}
          </div>

          {products.length === 0 ? (
            <div className="bg-white rounded-[24px] border-2 border-dashed border-gray-100 py-20 flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-[20px] flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-gray-200" />
              </div>
              <div>
                <p className="font-black text-gray-400 uppercase tracking-widest text-sm">No products yet</p>
                {isOwnProfile && (
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="mt-4 px-6 py-2.5 bg-pink-500 text-white text-sm font-black rounded-2xl hover:bg-pink-600 transition-all"
                  >
                    Upload Your First Product
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {products.map(p => (
                <ProductCard
                  key={p._id || p.id}
                  product={p}
                  isOwner={isOwnProfile}
                  onProductDeleted={loadData}
                />
              ))}
            </div>
          )}
        </motion.div>

      </div>

      {/* ── MODALS ─────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showEdit && (
          <EditProfileModal
            user={{ displayName: profileData?.displayName, bio: profileData?.bio, photoURL: profileData?.photoURL }}
            onClose={() => setShowEdit(false)}
            onSaved={handleSavedProfile}
          />
        )}
      </AnimatePresence>

      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => { setShowAddModal(false); loadData(); }}
        />
      )}

      <StoryUploadModal
        open={showStoryUpload}
        onClose={() => setShowStoryUpload(false)}
        onUploaded={() => {
          setShowStoryUpload(false);
          loadData();
          addToast('Story shared! ✨', 'success');
        }}
      />

      {/* STORY VIEWER */}
      <AnimatePresence>
        {showStoryViewer && userStory && userStory.media && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[5000] bg-black flex items-center justify-center overflow-hidden touch-none"
          >
            <div className="absolute inset-0 bg-slate-950" />
            <div className="relative w-full max-w-[500px] h-full flex flex-col bg-black">
              {/* STORY MEDIA */}
              {userStory.media[activeMediaIndex]?.type === 'video' ? (
                <video 
                  src={userStory.media[activeMediaIndex].url} 
                  autoPlay 
                  playsInline 
                  muted
                  onEnded={() => {
                    if (activeMediaIndex < userStory.media.length - 1) setActiveMediaIndex(prev => prev + 1);
                    else setShowStoryViewer(false);
                  }}
                  className="w-full h-full object-cover" 
                />
              ) : (
                <img src={userStory.media[activeMediaIndex]?.url} className="w-full h-full object-cover" alt="" />
              )}
              
              {/* OVERLAY CONTROLS */}
              <div className="absolute top-0 inset-x-0 p-4 sm:p-8 space-y-4 sm:space-y-8 bg-gradient-to-b from-black/80 to-transparent z-50">
                {/* PROGRESS BARS */}
                <div className="flex gap-2">
                  {userStory.media.map((_, i) => (
                    <div key={i} className="flex-1 h-[2px] bg-white/30 rounded-full overflow-hidden">
                      {i === activeMediaIndex ? (
                        <motion.div 
                          key={activeMediaIndex}
                          initial={{ width: 0 }} animate={{ width: '100%' }} 
                          transition={{ duration: userStory.media[activeMediaIndex]?.type === 'video' ? 15 : 6, ease: 'linear' }} 
                          onAnimationComplete={() => {
                            if (activeMediaIndex < userStory.media.length - 1) setActiveMediaIndex(prev => prev + 1);
                            else setShowStoryViewer(false);
                          }} 
                          className="h-full bg-white shadow-[0_0_10px_white]" 
                        />
                      ) : i < activeMediaIndex ? <div className="w-full h-full bg-white" /> : null}
                    </div>
                  ))}
                </div>

                {/* HEADER */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-2 border-white/20 overflow-hidden bg-gray-900">
                       <Avatar name={profileData?.displayName} photoURL={profileData?.photoURL} size={48} />
                    </div>
                    <div>
                      <p className="text-white font-black text-sm">{profileData?.displayName}</p>
                      {userStory.title && <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">{userStory.title}</p>}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {!isOwnProfile && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowStoryViewer(false);
                          navigate(`/messages/${viewedId}`);
                        }}
                        className="text-white hover:text-pink-400 transition-colors p-2 flex items-center gap-2 bg-white/10 rounded-full px-4 text-xs font-black"
                      >
                        <MessageCircle className="w-4 h-4" /> Message
                      </button>
                    )}
                    <button 
                      onClick={(e) => { e.stopPropagation(); setShowStoryViewer(false); }} 
                      className="text-white/60 hover:text-white transition-colors p-2"
                    >
                      <X className="w-8 h-8" />
                    </button>
                  </div>
                </div>
              </div>

              {/* TAP-TO-NAVIGATE */}
              <div className="absolute inset-0 flex z-40">
                <div className="flex-1 cursor-pointer" onClick={(e) => {
                  e.stopPropagation();
                  if (activeMediaIndex > 0) setActiveMediaIndex(prev => prev - 1);
                }} />
                <div className="flex-1 cursor-pointer" onClick={(e) => {
                  e.stopPropagation();
                  if (activeMediaIndex < userStory.media.length - 1) setActiveMediaIndex(prev => prev + 1);
                  else setShowStoryViewer(false);
                }} />
              </div>

              {/* FOOTER */}
              {userStory.bio && (
                <div className="absolute bottom-8 sm:bottom-16 inset-x-0 flex flex-col items-center gap-8 px-6 sm:px-10 z-50 pointer-events-none">
                   <p className="text-white text-lg font-medium italic drop-shadow-2xl text-center leading-relaxed">"{userStory.bio}"</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
