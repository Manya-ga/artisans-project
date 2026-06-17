import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts } from '../api';
import ProductCard from '../components/ProductCard.jsx';
import StoryRail from '../components/StoryRail.jsx';
import { Filter, ChevronRight, Sparkles } from 'lucide-react';

export default function HomePage({ query }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const productsSectionRef = useRef(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await getProducts({
          page: 1,
          limit: 8,
          category: activeCategory === 'All' ? 'All' : activeCategory,
          search: query,
        });

        setProducts(res.products || []);
      } catch (err) {
        console.error('Home load failed:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [activeCategory, query]);

  const categories = ['All', 'Wood Craft', 'Textiles', 'Pottery', 'Embroidery', 'Painting'];

  return (
    <div className="space-y-6 md:space-y-12 pb-20">
      {/* Story Section */}
      <section className="bg-white rounded-[32px] md:rounded-[48px] py-3 md:py-6 px-2 md:px-4 shadow-sm border border-gray-50">
         <div className="flex items-center gap-2 md:gap-3 mb-2 px-2 md:px-4">
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-pink-500" />
            <h2 className="text-[10px] md:text-sm font-black uppercase tracking-widest text-gray-400">Featured Artisans</h2>
         </div>
         <StoryRail />
      </section>

      {/* Hero Design */}
      <section className="relative h-[320px] sm:h-[450px] md:h-[500px] rounded-[32px] sm:rounded-[60px] overflow-hidden bg-gray-900 group">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1605814597473-b3c9735d4ba2?w=2000" 
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
              <button onClick={() => navigate('/discovery')} className="bg-white text-gray-900 font-black px-6 sm:px-10 py-3.5 sm:py-5 rounded-2xl sm:rounded-3xl hover:bg-pink-50 transition-all flex items-center gap-3 text-sm sm:text-lg">
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
             <p className="text-sm text-gray-400 font-semibold">Showing top {products.length} handcrafted items</p>
           </div>
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

            <div className="flex justify-center mt-12">
               <button onClick={() => navigate('/discovery')} className="px-8 py-4 bg-gray-900 text-white font-black rounded-full hover:bg-gray-800 hover:scale-105 transition-all shadow-xl flex items-center gap-2">
                 View All Products <ChevronRight className="w-5 h-5" />
               </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
