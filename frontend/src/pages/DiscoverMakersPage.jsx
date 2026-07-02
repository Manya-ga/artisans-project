import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Loader2, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getArtisans } from '../api';
import ArtisanCard from '../components/ArtisanCard';

export default function DiscoverMakersPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('search') || '';
  const pageParam = Number(searchParams.get('page')) || 1;
  const filterCraft = searchParams.get('category') || 'All';
  const filterLocation = searchParams.get('location') || 'All';
  const sortOption = searchParams.get('sort') || 'newest';

  const [artisans, setArtisans] = useState([]);
  const [search, setSearch] = useState(query);
  const [loading, setLoading] = useState(true);
  
  const [currentPage, setCurrentPage] = useState(pageParam);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const gridRef = useRef(null);

  const updateSearchParams = useCallback((updates) => {
    const nextParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '' || value === 'All') {
        nextParams.delete(key);
      } else {
        nextParams.set(key, String(value));
      }
    });
    setSearchParams(nextParams);
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (currentPage !== 1) {
      updateSearchParams({ page: 1 });
      setCurrentPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, filterCraft, filterLocation, sortOption]);

  useEffect(() => {
    const loadArtisans = async () => {
      setLoading(true);
      try {
        const res = await getArtisans({ 
          page: currentPage, 
          limit: 12, 
          search: query,
          category: filterCraft,
          location: filterLocation,
          sort: sortOption
        });
        if (res.page && Number(res.page) !== currentPage) {
          updateSearchParams({ page: res.page });
          setCurrentPage(Number(res.page));
          return;
        }
        setArtisans(res.artisans || []);
        setTotalPages(res.totalPages || 1);
        setHasNext(res.hasNext || false);
        setHasPrevious(res.hasPrevious || false);
      } catch (e) {
        console.error('[DiscoverMakersPage] Failed to load makers:', e);
        setArtisans([]);
      } finally {
        setLoading(false);
      }
    };
    loadArtisans();
  }, [currentPage, query, filterCraft, filterLocation, sortOption]);

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      updateSearchParams({ search: search, page: 1 });
      setCurrentPage(1);
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    updateSearchParams({ page: pageNumber });
    setCurrentPage(pageNumber);
    if (gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="animate-fade-in space-y-6 md:space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">Meet the Artisans</h1>
          <p className="text-gray-500 font-medium text-lg">Meet the traditional masters behind the craft</p>
        </div>

        <div className="relative w-full md:w-96 shrink-0">
          <Search className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
          <input
            type="text"
            placeholder="Search by name or craft (Press Enter)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full bg-white border-2 border-transparent rounded-full pl-10 md:pl-14 pr-4 md:pr-8 py-3 md:py-4 text-sm md:text-base font-bold outline-none focus:border-pink-500/10 transition-all shadow-sm placeholder:text-sm md:placeholder:text-base"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-bold text-gray-500 shrink-0">
          <Filter className="w-4 h-4" /> Filters:
        </div>
        <select 
          value={filterCraft} 
          onChange={(e) => updateSearchParams({ category: e.target.value, page: 1 })}
          className="bg-gray-50 border-none rounded-xl px-4 py-2 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-pink-500/20 cursor-pointer"
        >
          <option value="All">All Crafts</option>
          <option value="Wood Craft">Wood Craft</option>
          <option value="Textiles">Textiles</option>
          <option value="Pottery">Pottery</option>
          <option value="Jewelry">Jewelry</option>
        </select>
        
        <select 
          value={filterLocation} 
          onChange={(e) => updateSearchParams({ location: e.target.value, page: 1 })}
          className="bg-gray-50 border-none rounded-xl px-4 py-2 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-pink-500/20 cursor-pointer"
        >
          <option value="All">All Locations</option>
          <option value="Rajasthan">Rajasthan</option>
          <option value="Gujarat">Gujarat</option>
          <option value="Karnataka">Karnataka</option>
          <option value="Uttar Pradesh">Uttar Pradesh</option>
        </select>

        <div className="flex-1" />

        <select 
          value={sortOption} 
          onChange={(e) => updateSearchParams({ sort: e.target.value, page: 1 })}
          className="bg-gray-900 text-white border-none rounded-xl px-4 py-2 text-sm font-bold outline-none cursor-pointer"
        >
          <option value="newest">Newest Makers</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      <div ref={gridRef}>
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-pink-500 animate-spin" />
            <p className="text-gray-400 font-black">Loading makers...</p>
          </div>
        ) : artisans.length > 0 ? (
          <div className="space-y-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {artisans.map((artisan) => (
                <ArtisanCard 
                  key={artisan._id || artisan.id} 
                  artisan={artisan} 
                  onClick={() => navigate(`/artisan/${artisan._id || artisan.id}`)} 
                />
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 pt-6">
                <button
                  disabled={!hasPrevious}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="px-4 py-3 rounded-2xl border border-gray-100 bg-white text-gray-600 hover:border-pink-200 hover:text-pink-500 transition-all disabled:opacity-30 disabled:hover:border-gray-100 disabled:hover:text-gray-600 disabled:cursor-not-allowed"
                >
                  <span className="hidden sm:inline">Previous</span>
                  <ChevronLeft className="w-5 h-5 inline sm:ml-2" />
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }).map((_, idx) => {
                     // Show limited pagination
                     if (totalPages > 7) {
                       if (idx !== 0 && idx !== totalPages - 1 && Math.abs(idx + 1 - currentPage) > 1) {
                         if (idx === 1 || idx === totalPages - 2) return <span key={idx} className="px-2">...</span>;
                         return null;
                       }
                     }
                     return (
                      <button
                        key={idx + 1}
                        onClick={() => handlePageChange(idx + 1)}
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl font-bold transition-all border flex items-center justify-center text-sm ${
                          currentPage === idx + 1
                            ? 'bg-pink-500 border-pink-500 text-white shadow-lg shadow-pink-500/20 scale-105'
                            : 'bg-white border-gray-100 text-gray-600 hover:border-pink-200 hover:text-pink-500'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                <button
                  disabled={!hasNext}
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
          <div className="py-24 text-center bg-white rounded-[3rem] shadow-sm border border-gray-50 flex flex-col items-center justify-center space-y-6">
            <div className="w-24 h-24 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {query || filterCraft !== 'All' || filterLocation !== 'All' ? 'No Makers Found' : 'No artisans found yet.'}
            </h3>
            <p className="text-gray-500 font-medium max-w-md mx-auto">
              {query || filterCraft !== 'All' || filterLocation !== 'All' 
                ? 'We couldn\'t find any artisans matching your current filters. Try adjusting your search criteria.' 
                : 'Our marketplace is growing, but we don\'t have any artisans registered yet. Start your journey today!'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              {(query || filterCraft !== 'All' || filterLocation !== 'All') && (
                <button 
                  onClick={() => { 
                    setSearch(''); 
                    setSearchParams({}); 
                    setCurrentPage(1); 
                  }} 
                  className="bg-gray-100 text-gray-900 font-bold px-8 py-4 rounded-2xl hover:bg-gray-200 transition-colors"
                >
                  Clear All Filters
                </button>
              )}
              <button 
                onClick={() => navigate('/discover')} 
                className="bg-pink-500 text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-pink-500/20 hover:bg-pink-600 transition-colors"
              >
                Browse Products
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
