import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts, getArtisans } from '../api';
import ProductCard from '../components/ProductCard.jsx';
import ArtisanCard from '../components/ArtisanCard.jsx';
import StoryRail from '../components/StoryRail.jsx';
import Footer from '../components/Footer.jsx';
import { ChevronRight, Search, Star, Package, CheckCircle2, Quote, Sparkles, ArrowRight, ShieldCheck, Users, Palette, HeartHandshake, Award, Brush, Gem, Hammer, Scissors } from 'lucide-react';
import { HERO_BANNER, CATEGORY_IMAGES } from '../config/imageMappings.js';

const REVIEWS = [
  { name: 'Priya M.', location: 'Mumbai', text: 'The handcrafted vase I received is absolutely stunning. You can feel the love poured into the clay.', rating: 5, avatar: 'PM' },
  { name: 'Rahul S.', location: 'Delhi', text: 'Authentic Banarasi silk! Supporting these artisans directly makes the purchase even more special.', rating: 5, avatar: 'RS' },
  { name: 'Anita K.', location: 'Bangalore', text: 'The wooden toys from Channapatna are safe and vibrant. My kids absolutely love them.', rating: 5, avatar: 'AK' }
];



export default function HomePage({ query }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);

  const CATEGORIES = [
    { name: 'Pottery', image: CATEGORY_IMAGES['Pottery'], query: 'Pottery', count: '450+', icon: <Brush className="w-4 h-4" /> },
    { name: 'Handloom', image: CATEGORY_IMAGES['Textiles'], query: 'Textiles', count: '820+', icon: <Scissors className="w-4 h-4" /> },
    { name: 'Jewelry', image: CATEGORY_IMAGES['Jewelry'], query: 'Jewelry', count: '630+', icon: <Gem className="w-4 h-4" /> },
    { name: 'Woodwork', image: CATEGORY_IMAGES['Woodwork'], query: 'Wood Craft', count: '310+', icon: <Hammer className="w-4 h-4" /> },
    { name: 'Paintings', image: CATEGORY_IMAGES['Paintings'], query: 'Paintings', count: '540+', icon: <Palette className="w-4 h-4" /> },
    { name: 'Metal Crafts', image: CATEGORY_IMAGES['Metal Crafts'], query: 'Metal Crafts', count: '290+', icon: <Sparkles className="w-4 h-4" /> }
  ];

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [prodRes, artRes] = await Promise.all([
          getProducts({ page: 1, limit: 8, search: query }),
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="space-y-10 pb-20 bg-white">
      
      {/* ── 1. Artisan Stories ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8">
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Artisan Stories</h2>
          <button onClick={() => navigate('/discover-makers')} className="hidden sm:flex items-center gap-1 font-bold text-pink-500 hover:text-pink-600 text-sm">
            All Stories <ChevronRight className="w-4 h-4"/>
          </button>
        </div>
        <div className="relative">
          <StoryRail />
        </div>
      </section>

      {/* ── 2. Hero Section: Split Layout ──────────────────────────────────── */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative min-h-[540px] sm:min-h-[640px] rounded-[2.5rem] overflow-hidden bg-[#110a07] shadow-2xl flex flex-col lg:flex-row">
          
          {/* Left Side: Content */}
          <div className="relative z-10 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-14 w-full lg:w-[55%] lg:pr-8">
            {/* Decorative warm glow */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="space-y-6 relative z-10"
            >
              {/* Badge */}
              <span className="inline-flex items-center gap-2 bg-white/10 text-white backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border border-white/20 w-fit">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Authentic Indian Handicrafts
              </span>

              {/* Headline */}
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight">
                  Crafted by <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-pink-400">
                    Master Artisans
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-gray-200/90 font-medium max-w-lg leading-relaxed mt-2">
                  Discover unique handmade masterpieces — from Madhubani paintings to Channapatna toys — crafted with generations of tradition.
                </p>
              </div>

              {/* Search */}
              <form onSubmit={handleSearch} className="w-full max-w-lg relative mt-4">
                <input
                  type="text"
                  placeholder="Search for pottery, jewelry, handloom..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/95 backdrop-blur text-gray-900 rounded-full py-4 pl-6 pr-16 outline-none shadow-2xl font-semibold placeholder:text-gray-400 focus:ring-4 focus:ring-amber-400/30 transition-all text-sm sm:text-base"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 bottom-2 bg-gray-900 text-white px-5 rounded-full flex items-center gap-2 hover:bg-amber-600 transition-colors font-bold text-sm shadow-md"
                >
                  <Search className="w-4 h-4" /> Search
                </button>
              </form>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 pt-4">
                <button
                  onClick={() => navigate('/products')}
                  className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-black px-8 py-3.5 rounded-full shadow-lg shadow-amber-500/30 transition-all hover:scale-105 active:scale-95 text-sm"
                >
                  Shop Now <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/discover-makers')}
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white font-bold px-8 py-3.5 rounded-full border border-white/20 backdrop-blur transition-all text-sm"
                >
                  Meet Artisans
                </button>
              </div>

              {/* Trust signals */}
              <div className="flex flex-wrap gap-5 pt-4">
                <div className="flex items-center gap-2 text-white/80 text-xs font-bold tracking-wide">
                  <ShieldCheck className="w-4 h-4 text-green-400" /> Quality Guaranteed
                </div>
                <div className="flex items-center gap-2 text-white/80 text-xs font-bold tracking-wide">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" /> Directly from Maker
                </div>
                <div className="flex items-center gap-2 text-white/80 text-xs font-bold tracking-wide">
                  <Package className="w-4 h-4 text-amber-400" /> Free Returns
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Side: Image and Floating Cards */}
          <div className="relative w-full lg:w-[45%] min-h-[400px] lg:min-h-full">
            <img
              src={HERO_BANNER}
              alt="Indian artisan crafting a beautiful piece"
              loading="eager"
              onLoad={() => setHeroImageLoaded(true)}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${heroImageLoaded ? 'opacity-90' : 'opacity-0'}`}
            />
            
            {/* Blend Gradients */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#110a07] via-[#110a07]/50 to-transparent hidden lg:block" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#110a07] via-[#110a07]/50 to-transparent lg:hidden" />
            
            {/* Subtle dark overlay for premium feel */}
            <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />

            {/* Floating product preview cards */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-4 z-20">
              {[
                { img: CATEGORY_IMAGES['Pottery'], label: 'Blue Pottery', price: '₹1,200' },
                { img: CATEGORY_IMAGES['Woodwork'], label: 'Carved Wood Box', price: '₹2,800' },
                { img: CATEGORY_IMAGES['Jewelry'], label: 'Silver Necklace', price: '₹3,500' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.2, duration: 0.7, ease: 'easeOut' }}
                  onClick={() => navigate('/products')}
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-3 cursor-pointer hover:bg-white/20 hover:-translate-x-2 transition-all w-64 shadow-2xl"
                >
                  <img src={item.img} alt={item.label} className="w-16 h-16 rounded-xl object-cover shrink-0 shadow-md" />
                  <div>
                    <p className="text-white text-sm font-bold truncate">{item.label}</p>
                    <p className="text-amber-300 text-sm font-black mt-0.5">{item.price}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Categories Section ──────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Shop by Craft</h2>
            <p className="text-gray-500 font-medium mt-1">Explore India's finest traditions</p>
          </div>
          <button onClick={() => navigate('/products')} className="hidden sm:flex items-center gap-1 font-bold text-pink-500 hover:text-pink-600 text-sm">
            All Categories <ChevronRight className="w-4 h-4"/>
          </button>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * i }}
              onClick={() => navigate(`/products?category=${encodeURIComponent(cat.query)}`)}
              className="group cursor-pointer flex flex-col gap-3"
            >
              <div className="relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden bg-gray-100 shadow-sm group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col items-center justify-end h-full">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform shadow-lg border border-white/20">
                    {cat.icon}
                  </div>
                  <span className="font-black text-white text-lg tracking-wide text-center leading-tight drop-shadow-md">{cat.name}</span>
                  <span className="text-white/80 text-[10px] font-bold uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                    {cat.count} Products
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 4. Featured Products ───────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-amber-50/30 py-14 rounded-[3rem]">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Trending Masterpieces</h2>
            <p className="text-gray-500 font-medium mt-1">Handpicked genuine creations — no factory, all heart</p>
          </div>
          <button onClick={() => navigate('/products')} className="hidden sm:flex items-center gap-1 font-bold text-pink-500 hover:text-pink-600 text-sm">
            View All <ChevronRight className="w-4 h-4"/>
          </button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <div className="aspect-square bg-white rounded-3xl animate-pulse shadow-sm" />
                  <div className="h-4 bg-gray-100 rounded-full animate-pulse w-3/4" />
                  <div className="h-3 bg-gray-100 rounded-full animate-pulse w-1/2" />
                </div>
              ))
            : products.map(p => <ProductCard key={p.id || p._id} product={p} />)
          }
        </div>
        <div className="mt-8 flex justify-center sm:hidden">
          <button onClick={() => navigate('/products')} className="w-full bg-white border border-gray-200 py-3.5 rounded-2xl font-bold text-gray-900 flex justify-center items-center gap-2 shadow-sm hover:bg-gray-50 transition-colors">
            View All Products <ChevronRight className="w-4 h-4"/>
          </button>
        </div>
      </section>

      {/* ── 5. Top Artisans ────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Top Rated Artisans</h2>
            <p className="text-gray-500 font-medium mt-1">Meet the masters behind every piece</p>
          </div>
          <button onClick={() => navigate('/discover-makers')} className="hidden sm:flex items-center gap-1 font-bold text-pink-500 hover:text-pink-600 text-sm">
            Meet All Artisans <ChevronRight className="w-4 h-4"/>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-44 bg-gray-50 rounded-[2rem] animate-pulse" />)
            : artisans.map(a => (
                <ArtisanCard
                  key={a.id || a._id}
                  artisan={a}
                  onClick={() => navigate(`/artisan/${a.id || a._id}`)}
                />
              ))
          }
        </div>
        <div className="mt-8 flex justify-center sm:hidden">
          <button onClick={() => navigate('/discover-makers')} className="w-full bg-gray-900 text-white py-3.5 rounded-2xl font-bold flex justify-center items-center gap-2 shadow-md hover:bg-gray-800 transition-colors">
            Explore All Artisans <ChevronRight className="w-4 h-4"/>
          </button>
        </div>
      </section>

      {/* ── 6. Marketplace Statistics ──────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {[
            { label: 'Artisans', value: '2,400+', icon: <Users className="w-7 h-7 text-gray-700" strokeWidth={1.5} /> },
            { label: 'Products', value: '18,000+', icon: <Package className="w-7 h-7 text-gray-700" strokeWidth={1.5} /> },
            { label: 'Happy Buyers', value: '50,000+', icon: <HeartHandshake className="w-7 h-7 text-gray-700" strokeWidth={1.5} /> },
            { label: 'Avg Rating', value: '4.9/5', icon: <Star className="w-7 h-7 text-gray-700" strokeWidth={1.5} /> },
            { label: 'Years', value: '10+', icon: <Award className="w-7 h-7 text-gray-700" strokeWidth={1.5} /> },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="bg-white group hover:-translate-y-2 transition-all duration-500 border border-gray-100 rounded-[2rem] p-6 text-center shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] flex flex-col items-center justify-center gap-3 h-full"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 group-hover:from-pink-50 group-hover:to-amber-50 group-hover:scale-110 group-hover:-rotate-3 group-hover:shadow-md border border-gray-100 transition-all duration-500 flex items-center justify-center text-gray-700 group-hover:text-pink-600">
                {stat.icon}
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-black text-gray-900 tracking-tight">{stat.value}</div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 7. Customer Reviews ────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-br from-rose-50 to-pink-50 rounded-[3rem]">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Loved by 50,000+ Customers</h2>
          <p className="text-gray-500 font-medium mt-2">Real stories from real buyers across India</p>
          <div className="flex items-center justify-center gap-1 mt-4">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />)}
            <span className="text-gray-900 font-black text-sm ml-2">4.9 / 5 average</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {REVIEWS.map((review, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              className="bg-white p-6 rounded-3xl shadow-sm border border-pink-100/60 hover:shadow-md transition-shadow"
            >
              <Quote className="w-7 h-7 text-pink-200 mb-4" />
              <p className="text-gray-700 font-medium italic mb-6 leading-relaxed text-sm">"{review.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-amber-400 flex items-center justify-center text-white font-black text-xs shrink-0">
                  {review.avatar}
                </div>
                <div>
                  <span className="font-black text-gray-900 text-sm">{review.name}</span>
                  <p className="text-gray-400 text-xs font-medium">{review.location}</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 8. CTA Banner ─────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gray-900 px-8 py-16 text-center shadow-2xl">
          <div className="absolute inset-0 opacity-25">
            <img
              src={HERO_BANNER}
              alt="Indian handicrafts artisan workspace"
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-gray-900/60" />
          <div className="relative z-10 space-y-5 max-w-xl mx-auto">
            <p className="text-amber-400 font-black uppercase tracking-widest text-xs">Sell Your Craft</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">Share Your Art <br/>with the World</h2>
            <p className="text-gray-300 font-medium text-sm leading-relaxed">
              Join thousands of artisans already selling on Artisan Connect. No middleman. Keep more earnings.
            </p>
            <div className="flex flex-wrap gap-3 justify-center pt-2">
              <button
                onClick={() => navigate('/profile')}
                className="bg-amber-500 hover:bg-amber-400 text-white font-black px-8 py-3.5 rounded-2xl shadow-lg shadow-amber-500/30 transition-all hover:scale-105"
              >
                Start Selling Free →
              </button>
              <button
                onClick={() => navigate('/discover-makers')}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-8 py-3.5 rounded-2xl backdrop-blur transition-all"
              >
                Explore Artisans
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
