import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProducts } from '../api';
import ProductCard from '../components/ProductCard.jsx';
import StoryRail from '../components/StoryRail.jsx';
import { Filter, ChevronRight, Sparkles, ChevronLeft } from 'lucide-react';

export default function HomePage({ query }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const productsSectionRef = useRef(null);

  useEffect(() => {
    const updateProductsPerPage = () => {
      if (window.innerWidth < 768) setProductsPerPage(6);
      else if (window.innerWidth < 1280) setProductsPerPage(8);
      else setProductsPerPage(12);
    };

    updateProductsPerPage();
    window.addEventListener('resize', updateProductsPerPage);
    return () => window.removeEventListener('resize', updateProductsPerPage);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, query]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await getProducts({
          page: currentPage,
          limit: productsPerPage,
          category: activeCategory === 'All' ? 'All' : activeCategory,
          search: query,
        });

        setProducts(res.products || []);
        setTotalPages(res.totalPages || 1);
        setTotalProducts(res.totalProducts || 0);
      } catch (err) {
        console.error('Home load failed:', err);
        setProducts([]);
        setTotalPages(1);
        setTotalProducts(0);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [activeCategory, currentPage, productsPerPage, query]);

  const categories = ['All', 'Madhubani Painting', 'Handloom Textiles', 'Blue Pottery', 'Terracotta Art', 'Wood Carving', 'Hand Embroidery', 'Bamboo Crafts', 'Metalwork'];

  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const pages = [1];
    if (currentPage > 3) pages.push('...');

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let page = start; page <= end; page += 1) {
      pages.push(page);
    }

    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);

    return pages;
  }, [currentPage, totalPages]);

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages) return;

    setCurrentPage(nextPage);
    setTimeout(() => {
      productsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  return (
    <div className="space-y-6 md:space-y-12 pb-20">
      {/* Story Section */}
      <section className="bg-white rounded-[32px] md:rounded-[48px] py-3 md:py-6 px-2 md:px-4 shadow-sm border border-gray-50">
         <div className="flex items-center gap-2 md:gap-3 mb-2 px-2 md:px-4">
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-pink-500" />
            <h2 className="text-[10px] md:text-sm font-black uppercase tracking-widest text-gray-400">Artisan Stories</h2>
         </div>
         <StoryRail />
      </section>

      {/* Hero Design */}
      <section className="relative h-[320px] sm:h-[450px] md:h-[500px] rounded-[32px] sm:rounded-[60px] overflow-hidden bg-gray-900 group">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1620733723572-11c53f73a2ad?w=2000" 
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
          alt="Artisan Banner" 
        />
        <div className="relative z-20 h-full flex flex-col justify-center px-6 sm:px-10 md:px-20 space-y-4 sm:space-y-8 max-w-4xl">
           <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-2 sm:space-y-4">
              <span className="bg-amber-600 text-white text-[10px] font-black uppercase px-4 py-2 rounded-full tracking-widest shadow-lg">Small Batch Production</span>
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-white leading-tight tracking-tighter">
                Authentic <span className="text-amber-500 italic">Indian</span><br />Handcrafts.
              </h1>
              <p className="text-xs sm:text-base md:text-xl text-gray-300 font-medium max-w-lg">Discover unique, handmade masterpieces crafted with care by traditional Indian artisans.</p>
           </motion.div>
           <div className="flex gap-4">
              <button className="bg-white text-gray-900 font-black px-6 sm:px-10 py-3.5 sm:py-5 rounded-2xl sm:rounded-3xl hover:bg-pink-50 transition-all flex items-center gap-3 text-sm sm:text-lg">
                Explore Market <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
           </div>
        </div>
      </section>

      {/* Category Filter */}
      <nav className="sticky top-[60px] md:top-[80px] z-30 bg-white/80 backdrop-blur-xl py-2 sm:py-6 border-b border-gray-50 -mx-4 sm:-mx-6 px-4 sm:px-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto gap-2">
          <div className="flex gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
            {(categories || []).map(cat => (
              <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-4 sm:px-8 py-2 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black transition-all ${
                  activeCategory === cat ? 'bg-gray-900 text-white shadow-xl' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <button className="hidden sm:flex items-center gap-2 text-gray-400 hover:text-gray-900 font-black text-sm px-6 py-3 border-2 border-gray-50 rounded-2xl shrink-0">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>
      </nav>

      {/* Products Grid */}
      <section className="space-y-8" ref={productsSectionRef}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
           <div>
             <h2 className="text-3xl font-black text-gray-900 tracking-tight">Handpicked Artifacts</h2>
             <p className="text-sm text-gray-400 font-semibold">Showing {products.length} of {totalProducts} handcrafted items</p>
           </div>
           <span className="text-sm font-bold text-gray-400">Page {currentPage} of {totalPages}</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-gray-50 rounded-[32px] md:rounded-[48px] animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-10">
              <AnimatePresence mode="popLayout">
                {(products || []).map(product => (
                  <ProductCard key={product?._id || product?.id || Math.random()} product={product} />
                ))}
              </AnimatePresence>
            </div>

            {(!products || products.length === 0) && (
              <div className="py-20 text-center">
                <p className="text-gray-400 font-bold">No products found matching your criteria.</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="rounded-[36px] border border-gray-100 bg-gradient-to-r from-white via-pink-50/50 to-white p-4 shadow-[0_20px_60px_-25px_rgba(244,114,182,0.45)] md:p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-gradient-to-r from-pink-500 to-rose-400 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-white shadow-lg shadow-pink-500/20">Browse</span>
                    <p className="text-sm font-semibold text-gray-500">Page <span className="text-gray-900">{currentPage}</span> of <span className="text-gray-900">{totalPages}</span></p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white/90 px-4 py-3 text-sm font-bold text-gray-700 shadow-sm transition-all hover:border-pink-200 hover:bg-pink-50 hover:text-pink-600 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </button>

                    {pageNumbers.map((page, index) => (
                      <button
                        key={`${page}-${index}`}
                        type="button"
                        onClick={() => typeof page === 'number' && handlePageChange(page)}
                        disabled={page === '...'}
                        className={`h-11 min-w-[2.75rem] rounded-2xl border px-3 text-sm font-black transition-all ${
                          page === currentPage
                            ? 'border-pink-500 bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-lg shadow-pink-500/20'
                            : 'border-gray-200 bg-white/95 text-gray-600 hover:border-pink-200 hover:bg-pink-50 hover:text-pink-600'
                        } ${page === '...' ? 'cursor-default border-transparent bg-transparent text-gray-400 shadow-none hover:bg-transparent hover:text-gray-400' : ''}`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white/90 px-4 py-3 text-sm font-bold text-gray-700 shadow-sm transition-all hover:border-pink-200 hover:bg-pink-50 hover:text-pink-600 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
