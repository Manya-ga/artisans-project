import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts, getArtisans } from '../api';
import ProductCard from '../components/ProductCard.jsx';
import ArtisanCard from '../components/ArtisanCard.jsx';
import StoryRail from '../components/StoryRail.jsx';
import { ChevronRight, Sparkles, Star, TrendingUp, Clock, Grid } from 'lucide-react';

export default function HomePage({ query }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [prodRes, artRes] = await Promise.all([
          getProducts({ page: 1, limit: 12, search: query }),
          getArtisans({ page: 1, limit: 4, sort: 'rating' })
        ]);
        setProducts(prodRes.products || []);
        setArtisans(artRes.artisans || []);
      } catch (err) {
        console.error('Home load failed:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [query]);

  return (
    <div className="space-y-12 md:space-y-16 pb-20">
      
      {/* 1. Featured Makers (Stories) */}
      <section className="bg-white rounded-[32px] md:rounded-[48px] py-4 md:py-6 px-2 md:px-4 shadow-sm border border-gray-50">
         <div className="flex items-center gap-2 md:gap-3 mb-4 px-2 md:px-4">
            <Sparkles className="w-5 h-5 text-pink-500" />
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-900">Featured Makers</h2>
         </div>
         <StoryRail />
      </section>

      {/* Hero Banner */}
      <section className="relative h-[320px] sm:h-[450px] md:h-[500px] rounded-[32px] sm:rounded-[60px] overflow-hidden bg-gray-900 group shadow-xl">
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
              <button onClick={() => navigate('/products')} className="bg-white text-gray-900 font-black px-6 sm:px-10 py-3.5 sm:py-5 rounded-2xl sm:rounded-3xl hover:bg-pink-50 transition-all flex items-center gap-3 text-sm sm:text-lg">
                Explore Market <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
           </div>
        </div>
      </section>

      {/* 2. Trending Products */}
      <section className="space-y-6">
        <div className="flex items-end justify-between px-2">
           <div className="flex items-center gap-3">
             <div className="p-3 bg-orange-100 rounded-2xl text-orange-500"><TrendingUp className="w-6 h-6" /></div>
             <div>
               <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Trending Products</h2>
               <p className="text-sm text-gray-400 font-semibold">Most loved items this week</p>
             </div>
           </div>
           <button onClick={() => navigate('/products')} className="hidden sm:flex items-center gap-1 text-sm font-bold text-pink-500 hover:text-pink-600">View All <ChevronRight className="w-4 h-4"/></button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
           {loading ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="aspect-[3/4] bg-gray-50 rounded-[32px] animate-pulse" />)
           : products.slice(0, 4).map(p => <ProductCard key={p.id || p._id} product={p} />)}
        </div>
      </section>

      {/* 3. Recently Added Products */}
      <section className="space-y-6">
        <div className="flex items-end justify-between px-2">
           <div className="flex items-center gap-3">
             <div className="p-3 bg-blue-100 rounded-2xl text-blue-500"><Clock className="w-6 h-6" /></div>
             <div>
               <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Recently Added</h2>
               <p className="text-sm text-gray-400 font-semibold">Fresh creations from the kilns and looms</p>
             </div>
           </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
           {loading ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="aspect-[3/4] bg-gray-50 rounded-[32px] animate-pulse" />)
           : products.slice(4, 8).map(p => <ProductCard key={p.id || p._id} product={p} />)}
        </div>
      </section>

      {/* 4. Top Rated Artisans */}
      <section className="space-y-6 bg-gray-900 rounded-[40px] md:rounded-[60px] p-6 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 blur-[100px] rounded-full" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
           <div className="flex items-center gap-4">
             <div className="p-4 bg-white/10 rounded-2xl text-amber-400 backdrop-blur-md"><Star className="w-8 h-8 fill-current" /></div>
             <div>
               <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Top Rated Makers</h2>
               <p className="text-gray-400 font-medium">Consistently delivering perfection</p>
             </div>
           </div>
           <button onClick={() => navigate('/discover-makers')} className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-2xl transition-all flex items-center gap-2 w-fit">
             View Directory <ChevronRight className="w-4 h-4" />
           </button>
        </div>

        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
           {loading ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-40 bg-white/5 rounded-[32px] animate-pulse" />)
           : artisans.map(a => <ArtisanCard key={a.id || a._id} artisan={a} onClick={() => navigate(`/artisan/${a.id || a._id}`)} />)}
        </div>
      </section>

      {/* 5. Handpicked Collections */}
      <section className="space-y-6 pt-6">
        <div className="flex items-end justify-between px-2">
           <div className="flex items-center gap-3">
             <div className="p-3 bg-purple-100 rounded-2xl text-purple-500"><Grid className="w-6 h-6" /></div>
             <div>
               <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Handpicked Collections</h2>
               <p className="text-sm text-gray-400 font-semibold">Curated specifically for you</p>
             </div>
           </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div onClick={() => navigate('/products?category=Wood Craft')} className="relative h-[250px] md:h-[300px] rounded-[32px] overflow-hidden group cursor-pointer shadow-sm border border-gray-100">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent z-10" />
            <img src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Wood Craft" />
            <div className="absolute bottom-6 left-6 z-20">
               <h3 className="text-2xl font-black text-white">Heritage Woodcraft</h3>
               <p className="text-gray-300 text-sm font-medium">Timeless carved artifacts</p>
            </div>
          </div>
          <div onClick={() => navigate('/products?category=Textiles')} className="relative h-[250px] md:h-[300px] rounded-[32px] overflow-hidden group cursor-pointer shadow-sm border border-gray-100">
            <div className="absolute inset-0 bg-gradient-to-t from-pink-900/90 via-gray-900/20 to-transparent z-10" />
            <img src="https://images.unsplash.com/photo-1605814597473-b3c9735d4ba2?w=800" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Textiles" />
            <div className="absolute bottom-6 left-6 z-20">
               <h3 className="text-2xl font-black text-white">Vibrant Handlooms</h3>
               <p className="text-pink-200 text-sm font-medium">Woven with tradition</p>
            </div>
          </div>
        </div>
      </section>

      <div className="flex justify-center pt-8">
         <button onClick={() => navigate('/products')} className="px-8 py-4 bg-gray-900 text-white font-black rounded-full hover:bg-gray-800 hover:scale-105 transition-all shadow-xl flex items-center gap-2">
           Browse Entire Market <ChevronRight className="w-5 h-5" />
         </button>
      </div>

    </div>
  );
}
