// StoryUploadModal.jsx
// Upload a story image or video from device or URL to the backend story API.
import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext.jsx';
import { createStory } from '../api.js';

export default function StoryUploadModal({ open, onClose, onUploaded }) {
  const { user, token } = useAuth();
  const [title, setTitle] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [bio, setBio] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (!selectedFiles || selectedFiles.length === 0) {
      setPreviewUrl('');
      return undefined;
    }

    const url = URL.createObjectURL(selectedFiles[0]);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFiles]);

  const canUpload = useMemo(() => {
    return title.trim() && (selectedFiles.length > 0 || mediaUrl.trim());
  }, [title, selectedFiles, mediaUrl]);

  async function handleUpload() {
    if (!canUpload) {
      setError('Title and media are required.');
      return;
    }

    setBusy(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('bio', bio.trim());

      if (selectedFiles && selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          formData.append('media', file);
        }
      } else if (mediaUrl.trim()) {
        formData.append('mediaUrl', mediaUrl.trim());
      }

      // Removed token argument as api.createStory only takes one argument (the body/formData)
      // Axios instance handles credentials/cookies automatically
      await createStory(formData);
      onUploaded?.();
      onClose?.();
      setTitle('');
      setBio('');
      setMediaUrl('');
      setSelectedFiles([]);
    } catch (e) {
      setError(e?.message || 'Upload failed');
    } finally {
      setBusy(false);
    }
  }

  const isVideoPreview = selectedFiles[0]?.type?.startsWith('video/');

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[130] flex justify-center items-center overflow-y-auto p-4 md:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => onClose?.()}
        >
          <motion.div
            className="w-full max-w-[450px] bg-white rounded-[40px] shadow-2xl p-8 relative max-h-[90vh] overflow-y-auto custom-scrollbar"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Share Your Story</h2>
                <p className="text-sm font-medium text-gray-400 mt-1">Connect with your buyers through a glimpse into your craft.</p>
              </div>
              <button 
                type="button" 
                className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all active:scale-90" 
                onClick={() => onClose?.()}
              >
                <span className="text-xl leading-none">×</span>
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Story Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., A Day in the Studio"
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-pink-200 outline-none font-bold text-gray-900 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Media Content</label>
                <div 
                  className={`rounded-[32px] border-4 border-dashed transition-all duration-300 relative group overflow-hidden ${
                    previewUrl ? 'border-pink-100 bg-white' : 'border-gray-100 bg-gray-50 hover:border-pink-200'
                  }`}
                >
                  {previewUrl ? (
                    <div className="relative aspect-[4/5] w-full">
                      {isVideoPreview ? (
                        <video src={previewUrl} controls className="w-full h-full object-cover" />
                      ) : (
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      )}
                      <button 
                        type="button"
                        onClick={() => setSelectedFiles([])}
                        className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2 rounded-xl text-red-500 shadow-xl opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                      >
                         <span className="text-xs font-black">Change</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-8 flex flex-col items-center justify-center gap-4 cursor-pointer" onClick={() => document.getElementById('story-file-upload').click()}>
                      <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform text-3xl">
                        ☁️
                      </div>
                      <div className="text-center">
                        <p className="font-black text-gray-900 text-sm">Upload Photo or Video</p>
                        <p className="text-xs font-medium text-gray-400 mt-1">Tap to browse your device</p>
                      </div>
                    </div>
                  )}
                  <input
                    id="story-file-upload"
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setSelectedFiles(files);
                      setMediaUrl('');
                    }}
                    className="hidden"
                  />
                </div>
              </div>

              {!previewUrl && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Or Media URL</label>
                  <input
                    value={mediaUrl}
                    onChange={(e) => {
                      setMediaUrl(e.target.value);
                      if (e.target.value) setSelectedFiles([]);
                    }}
                    placeholder="https://..."
                    type="url"
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-pink-200 outline-none font-medium text-gray-900 transition-all"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Caption / Story Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share the inspiration behind this piece..."
                  rows={4}
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-pink-200 outline-none font-medium text-gray-700 transition-all resize-none"
                />
              </div>
            </div>

            {error && (
              <div className="mt-6 rounded-2xl bg-red-50 border border-red-100 px-5 py-4 text-sm text-red-600 font-bold flex items-center gap-3">
                <span className="text-base">⚠️</span> {error}
              </div>
            )}

            <div className="mt-10 grid gap-3">
              <button
                type="button"
                className={`w-full py-5 rounded-[24px] font-black text-lg transition-all shadow-xl shadow-pink-500/10 flex items-center justify-center gap-3 ${
                  canUpload 
                    ? 'bg-gray-900 text-white hover:bg-pink-600 active:scale-95' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                onClick={handleUpload}
                disabled={busy || !canUpload}
              >
                {busy ? (
                  <>
                    <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>✨ Share Now</>
                )}
              </button>
              <button 
                type="button" 
                className="w-full py-4 rounded-[24px] font-bold text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all" 
                onClick={() => onClose?.()}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
