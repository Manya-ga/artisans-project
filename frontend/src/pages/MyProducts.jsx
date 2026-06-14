import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { getMyProducts } from '../api.js';
import ProductGrid from '../components/ProductGrid.jsx';
import AddProductModal from '../components/AddProductModal.jsx';

export default function MyProductsPage({ onBack }) {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      setLoading(true);
      setError(null);

      try {
        const response = await getMyProducts();
        if (isMounted) {
          setProducts(response);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('[MyProducts] fetch failed', e);
        if (isMounted) {
          setError('Could not load your products. Please try again later.');
          setProducts([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadProducts();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleProductAdded = () => {
    setIsModalOpen(false);
    // Reload products after adding a new one
    async function reloadProducts() {
      setLoading(true);
      try {
        const response = await getMyProducts();
        setProducts(response);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    reloadProducts();
  };

  return (
    <div className="pt-2">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Products</h1>
          <p className="text-sm md:text-base text-gray-500 mt-1">Products you uploaded from your account.</p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="btn-primary px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl shadow-soft font-semibold"
          >
            + Add Product
          </button>
          <button
            type="button"
            onClick={onBack}
            className="btn-outline px-4 py-3"
          >
            Back
          </button>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl bg-white/90 border border-gray-100 p-8 text-center text-gray-500">
          Loading your products...
        </div>
      ) : error ? (
        <div className="rounded-2xl bg-yellow-50 border border-yellow-100 p-6 text-center text-yellow-900">
          {error}
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-2xl bg-white/90 border border-gray-100 p-8 text-center text-gray-500">
          You haven't uploaded any products yet.
        </div>
      ) : (
        <ProductGrid products={products} isOwner={true} onProductDeleted={handleProductAdded} />
      )}

      {isModalOpen && (
        <AddProductModal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={handleProductAdded} 
        />
      )}
    </div>
  );
}
