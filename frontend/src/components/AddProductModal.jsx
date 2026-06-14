import { useState, useRef, useEffect } from 'react';
import { createProduct } from '../api.js';

export default function AddProductModal({ onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const modalRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    stock: '1',
    category: 'General',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Cleanup preview URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // Prevent multiple clicks

    setError(null);
    if (!formData.title || !formData.price) {
      setError('Title and price are required.');
      return;
    }
    
    setLoading(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('stock', formData.stock);
      data.append('category', formData.category);
      if (imageFile) {
        data.append('images', imageFile);
      }
      
      await createProduct(data);
      onSuccess();
    } catch (err) {
      setError(err?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex justify-center items-start bg-black/60 backdrop-blur-sm p-4 md:p-10 animate-fade-in overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative max-h-none overflow-visible animate-slide-up"
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Add New Product</h2>
            <p className="text-xs text-gray-500 mt-0.5">List your masterpiece on the marketplace</p>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-400 transition-colors"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[85vh] overflow-y-auto custom-scrollbar">
          {error && <div className="text-red-600 text-sm p-3 bg-red-50 border border-red-100 rounded-2xl">{error}</div>}
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Product Title *</label>
              <input 
                type="text" name="title" value={formData.title} onChange={handleChange} required
                placeholder="e.g. Hand-painted Ceramic Vase"
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Description</label>
              <textarea 
                name="description" value={formData.description} onChange={handleChange} rows="3"
                placeholder="Tell the story behind this piece..."
                className="input-field resize-none"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Price (₹) *</label>
                <input 
                  type="number" name="price" value={formData.price} onChange={handleChange} required min="0" step="1"
                  placeholder="0"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Category</label>
                <select 
                  name="category" value={formData.category} onChange={handleChange}
                  className="input-field appearance-none bg-no-repeat bg-[right_1rem_center]"
                >
                  <option value="General">General</option>
                  <option value="Pottery">Pottery</option>
                  <option value="Jewelry">Jewelry</option>
                  <option value="Woodwork">Woodwork</option>
                  <option value="Textiles">Textiles</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Product Image</label>
              <div className="relative group">
                <input 
                  type="file" accept="image/*" onChange={handleImageChange}
                  className="hidden" id="product-image-upload"
                />
                <label 
                  htmlFor="product-image-upload"
                  className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-200 rounded-3xl cursor-pointer hover:border-pink-300 hover:bg-pink-50/30 transition-all overflow-hidden"
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-pink-50 text-pink-500 rounded-2xl flex items-center justify-center mb-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-gray-600">Click to upload image</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                    </div>
                  )}
                </label>
                {imagePreview && (
                  <button 
                    type="button"
                    onClick={(e) => { e.preventDefault(); setImageFile(null); setImagePreview(null); }}
                    className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm text-gray-500 hover:text-red-500"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <div className="pt-2">
            <button 
              type="submit" disabled={loading}
              className="w-full btn-primary py-4 relative overflow-hidden"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Uploading...
                </div>
              ) : 'Publish Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
