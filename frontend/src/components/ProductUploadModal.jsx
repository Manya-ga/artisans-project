// ProductUploadModal.jsx
// Upload a new artisan product with multiple images.
import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext.jsx';
import { createProduct } from '../api.js';

export default function ProductUploadModal({ open, onClose, onUploaded }) {
  const { user, token } = useAuth();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Handmade');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    if (!files.length) {
      setPreviews([]);
      return undefined;
    }

    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  const canUpload = useMemo(() => {
    return title.trim() && Number(price) > 0 && files.length > 0;
  }, [title, price, files]);

  async function handleUpload() {
    if (!user) {
      setError('Please log in to upload products.');
      return;
    }
    if (!canUpload) {
      setError('Title, price, and at least one image are required.');
      return;
    }

    setBusy(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('price', price);
      formData.append('category', category.trim());
      formData.append('description', description.trim());
      formData.append('artisanName', user.displayName || user.email);
      files.slice(0, 5).forEach((file) => {
        formData.append('images', file);
      });

      await createProduct(formData);
      onUploaded?.();
      onClose?.();
      setTitle('');
      setPrice('');
      setCategory('Handmade');
      setDescription('');
      setFiles([]);
    } catch (e) {
      setError(e?.message || 'Upload failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[130] flex justify-center items-start overflow-y-auto p-4 md:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => onClose?.()}
        >
          <motion.div
            className="w-full max-w-2xl bg-white rounded-3xl shadow-soft p-5 md:p-7 relative max-h-none overflow-visible"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Add Product</h2>
                <p className="text-sm text-gray-500 mt-1">Upload up to 5 product images and list your artisan product.</p>
              </div>
              <button type="button" className="icon-btn" onClick={() => onClose?.()} aria-label="Close">
                ?
              </button>
            </div>

            <div className="mt-5 grid gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Product name"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
                <input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Price"
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>

              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Category"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Product description"
                rows={4}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Upload product images</label>
                <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setFiles(Array.from(e.target.files || []).slice(0, 5))}
                    className="w-full text-sm text-gray-700"
                  />
                  <p className="text-xs text-gray-400 mt-2">Choose up to 5 images from your device.</p>
                </div>
                <p className="text-xs text-gray-400">Up to 5 images, max 5MB each.</p>
              </div>

              {previews.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {previews.map((preview, index) => (
                    <div key={preview} className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
                      <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-36 object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <div className="mt-4 rounded-2xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                className="btn-primary px-6 py-3 flex-1"
                onClick={handleUpload}
                disabled={busy}
              >
                {busy ? 'Uploading...' : 'Upload product'}
              </button>
              <button
                type="button"
                className="btn-outline px-6 py-3 flex-1"
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
