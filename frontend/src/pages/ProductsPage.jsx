import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid.jsx';
import { getProducts, getProductCategories } from '../api.js';
import { CategorySkeleton, ProductSkeleton } from '../components/Skeleton.jsx';
import { Search, ChevronLeft, ChevronRight, Filter, ArrowUpDown } from 'lucide-react';

export default function ProductsPage({ query = '' }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || 'All';
  const pageParam = Number(searchParams.get('page')) || 1;

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  
  // Pagination and loading states
  const currentPage = pageParam;
  const [productsPerPage, setProductsPerPage] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);

  const gridRef = useRef(null);

  // 1. Fetch unique categories once on mount
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await getProductCategories();
        const unique = (res.categories || []).filter(Boolean);
        setCategories(['All', ...unique]);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    const setLimitByViewport = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setProductsPerPage(6);
      } else if (width < 1280) {
        setProductsPerPage(8);
      } else {
        setProductsPerPage(12);
      }
    };

    setLimitByViewport();
    window.addEventListener('resize', setLimitByViewport);
    return () => window.removeEventListener('resize', setLimitByViewport);
  }, []);

  const updateSearchParams = useCallback((updates) => {
    const nextParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        nextParams.delete(key);
      } else {
        nextParams.set(key, String(value));
      }
    });
    setSearchParams(nextParams);
  }, [searchParams, setSearchParams]);

  // 2. Keep pagination in the URL and reset to first page when filters or query change.
  useEffect(() => {
    if (currentPage !== 1) {
      updateSearchParams({ page: 1 });
    }
  }, [selectedCategory, query, updateSearchParams]);

  // 3. Load paginated products
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await getProducts({
          page: currentPage,
          limit: productsPerPage,
          category: selectedCategory,
          search: query
        });

        if (res.currentPage && res.currentPage !== currentPage) {
          updateSearchParams({ page: res.currentPage });
          return;
        }

        setProducts(res.products || []);
        setTotalPages(res.totalPages || 1);
        setTotalProducts(res.totalProducts || 0);
      } catch (e) {
        console.error('Products load failed', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [currentPage, selectedCategory, query, productsPerPage]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    updateSearchParams({ page: pageNumber });
    if (gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Pagination buttons logic helper
  const pageNumbers = useMemo(() => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 4) {
        pages.push('...');
      }
      const start = Math.max(2, currentPage - 2);
      const end = Math.min(totalPages - 1, currentPage + 2);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 3) {
        pages.push('...');
      }
      pages.push(totalPages);
    }
    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="animate-fade-in space-y-6 md:space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
        <div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Products</h1>
          <p className="text-gray-500 mt-1 md:mt-2 font-medium text-sm md:text-base">Discover authentic items handcrafted by master makers.</p>
        </div>
        
        {/* Placeholder for Sorting/Filtering Desktop Actions */}
        <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm shrink-0">
           <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-700 hover:text-pink-500 transition-colors">
              <Filter className="w-4 h-4" /> Filters
           </button>
           <div className="w-px bg-gray-100 my-2 mx-1" />
           <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-700 hover:text-pink-500 transition-colors">
              <ArrowUpDown className="w-4 h-4" /> Sort
           </button>
        </div>
      </div>

      {/* Categories Horizontal Scroll */}
      <div className="flex overflow-x-auto no-scrollbar gap-3 pb-2">
        {loading && categories.length <= 1 ? (
          Array.from({ length: 6 }).map((_, i) => <CategorySkeleton key={i} />)
        ) : (
          categories.map((cat) => (
            <button
              key={cat}
              onClick={() => updateSearchParams({ category: cat, page: 1 })}
              className={`px-6 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all border ${
                selectedCategory === cat 
                ? 'bg-pink-500 border-pink-500 text-white shadow-lg shadow-pink-500/20 scale-105' 
                : 'bg-white border-gray-100 text-gray-600 hover:border-pink-200 hover:text-pink-500'
              }`}
            >
              {cat}
            </button>
          ))
        )}
      </div>

      {/* Main Grid Content */}
      <div className="min-h-[400px]" ref={gridRef}>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : (
          products.length > 0 ? (
            <div className="space-y-12">
              <ProductGrid products={products} />
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 pt-6">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="px-4 py-3 rounded-2xl border border-gray-100 bg-white text-gray-600 hover:border-pink-200 hover:text-pink-500 transition-all disabled:opacity-30 disabled:hover:border-gray-100 disabled:hover:text-gray-600 disabled:cursor-not-allowed"
                  >
                    <span className="hidden sm:inline">Previous</span>
                    <ChevronLeft className="w-5 h-5 inline sm:ml-2" />
                  </button>

                  {pageNumbers.map((p, idx) => (
                    <button
                      key={idx}
                      disabled={p === '...'}
                      onClick={() => p !== '...' && handlePageChange(p)}
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl font-bold transition-all border flex items-center justify-center text-sm ${
                        p === '...' 
                        ? 'border-transparent text-gray-400 cursor-default' 
                        : currentPage === p
                          ? 'bg-pink-500 border-pink-500 text-white shadow-lg shadow-pink-500/20 scale-105'
                          : 'bg-white border-gray-100 text-gray-600 hover:border-pink-200 hover:text-pink-500'
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="px-4 py-3 rounded-2xl border border-gray-100 bg-white text-gray-600 hover:border-pink-200 hover:text-pink-500 transition-all disabled:opacity-30 disabled:hover:border-gray-100 disabled:hover:text-gray-600 disabled:cursor-not-allowed"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-5 h-5 inline sm:ml-2" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="card-premium p-20 text-center flex flex-col items-center">
              <Search className="w-12 h-12 text-gray-200 mb-4" />
              <p className="text-lg font-bold text-gray-900">No products found</p>
              <p className="text-gray-500">Try adjusting your search or filters</p>
              <button onClick={() => updateSearchParams({ category: 'All', page: 1 })} className="mt-6 text-pink-500 font-bold hover:underline">Clear Filters</button>
            </div>
          )
        )}
      </div>
    </div>
  );
}
